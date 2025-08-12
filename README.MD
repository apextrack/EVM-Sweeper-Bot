EVM Sweeper Bot 🧹
<p align="center">
<img src="https://i.imgur.com/your-dynamic-bot-logo.png" alt="EVM Sweeper Bot" width="300"/>
</p>

📖 Deskripsi
EVM Sweeper Bot adalah alat CLI (Command Line Interface) yang dirancang untuk secara otomatis mengelola dan mentransfer aset kripto dari banyak dompet EVM (Ethereum Virtual Machine) ke satu alamat tujuan. Bot ini mendukung penyapuan (sweeping) native token (seperti ETH, BNB, MATIC), token ERC-20, dan NFT. Tampilan CLI yang dinamis, dengan kotak header yang berubah warna dan font pada setiap kali dijalankan, memberikan pengalaman visual yang unik.

✨ Fitur Utama
Sweeping Otomatis: Secara periodik memeriksa saldo dompet dan memindahkan semua aset ke alamat tujuan.

Dukungan Multi-Aset: Mampu menyapu native token, ERC-20, dan NFT.

Relayer Gas: Menggunakan dompet relayer terpisah untuk mendanai biaya gas dari dompet yang kosong.

Tampilan CLI Interaktif: Menampilkan header yang stylish dan dinamis dengan efek warna dan font yang bergulir.

Konfigurasi Mudah: Semua pengaturan penting dikelola melalui file config.json.

UI Berbasis Menu: Menyediakan antarmuka menu yang mudah digunakan untuk memilih jenis aset dan jaringan.

🚀 Instalasi
Prasyarat
Pastikan Anda telah menginstal Node.js (versi 16 atau lebih tinggi) dan npm di sistem Anda.

Bash

# Clone repositori
git clone https://github.com/google/evm-sweeper-bot.git
cd evm-sweeper-bot

# Instal dependensi
npm install ethers figlet inquirer
⚙️ Konfigurasi
Buat file config.json di direktori proyek Anda dengan format berikut:

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
▶️ Penggunaan
Jalankan bot dengan perintah berikut:

Bash

node index.js
Bot akan menampilkan menu interaktif untuk Anda pilih.

🤝 Kontribusi
Kontribusi dipersilakan! Jika Anda memiliki ide atau perbaikan, silakan buka issue atau kirimkan pull request.

📄 Lisensi
Proyek ini dilisensikan di bawah MIT License.

<br>

<br>

EVM Sweeper Bot 🧹
<p align="center">
<img src="https://i.imgur.com/your-dynamic-bot-logo.png" alt="EVM Sweeper Bot" width="300"/>
</p>

📖 Description
The EVM Sweeper Bot is a command-line interface (CLI) tool designed to automatically manage and transfer crypto assets from multiple EVM wallets to a single destination address. It supports sweeping native tokens (e.g., ETH, BNB, MATIC), ERC-20 tokens, and NFTs. The bot features a dynamic CLI display, with a header box that changes color and font with each launch for a unique visual experience.

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

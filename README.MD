# EVM Sweeper Bot 🧹

<p align="center">
  <img src="https://i.imgur.com/your-dynamic-bot-logo.png" alt="EVM Sweeper Bot" width="300"/>
</p>

---

## 📖 Deskripsi

EVM Sweeper Bot adalah alat CLI (Command Line Interface) yang dirancang untuk secara otomatis mengelola dan mentransfer aset kripto dari banyak dompet EVM (Ethereum Virtual Machine) ke satu alamat tujuan. Bot ini mendukung penyapuan (sweeping) native token (seperti ETH, BNB, MATIC), token ERC-20, dan NFT. Tampilan CLI yang dinamis, dengan kotak header yang berubah warna dan font setiap kali dijalankan, memberikan pengalaman visual yang unik.

---

## ✨ Fitur Utama

- **Sweeping Otomatis:** Secara periodik memeriksa saldo dompet dan memindahkan semua aset ke alamat tujuan.
- **Dukungan Multi-Aset:** Mampu menyapu native token, ERC-20, dan NFT.
- **Relayer Gas:** Menggunakan dompet relayer terpisah untuk mendanai biaya gas dari dompet yang kosong.
- **Tampilan CLI Interaktif:** Menampilkan header yang stylish dan dinamis dengan efek warna dan font yang bergulir.
- **Konfigurasi Mudah:** Semua pengaturan penting dikelola melalui file `config.json`.
- **UI Berbasis Menu:** Menyediakan antarmuka menu yang mudah digunakan untuk memilih jenis aset dan jaringan.

---

## 🚀 Instalasi

### Prasyarat

Pastikan Anda telah menginstal Node.js (versi 16 atau lebih tinggi) dan npm di sistem Anda.

```bash
# Clone repositori
git clone https://github.com/gb1-svg/EVM-Sweeper-Bot-.git
cd EVM-Sweeper-Bot-

# Instal dependensi
npm install ethers figlet inquirer
---


⚙️ Konfigurasi
Buat file config.json di direktori proyek Anda dengan format berikut:

```bash
{
  "PRIVATE_KEYS": [
    "0x...kunci_privat_dompet_1...",
    "0x...kunci_privat_dompet_2..."
  ],
  "RELAYER_PRIVATE_KEY": "0x...kunci_privat_relayer...",
  "TO_ADDRESS": "0x...alamat_tujuan_anda...",
  "CONTRACT_ADDRESSES": [
    "0x...alamat_kontrak_erc20_atau_nft_1..."
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
---

▶️ Penggunaan
Jalankan bot dengan perintah berikut:

---
```bash

node index.js
---

Bot akan menampilkan menu interaktif untuk Anda pilih.
---

🤝 Kontribusi
Kontribusi sangat kami harapkan! Jika Anda memiliki ide atau perbaikan, silakan buka issue atau kirimkan pull request.
---

📄 Lisensi
Proyek ini dilisensikan di bawah MIT License.

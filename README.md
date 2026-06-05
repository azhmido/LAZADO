# 🛒 LAZADO - E-Commerce Web App

**LAZADO** adalah sebuah proyek antarmuka aplikasi web *e-commerce* fiktif yang dikembangkan dari nol menggunakan teknologi web dasar. Proyek ini mendemonstrasikan kemampuan dalam membangun aplikasi yang interaktif dan dinamis melalui pengambilan data (*data fetching*) dari sumber eksternal tanpa bergantung pada *framework* atau *library* tambahan.

Proyek ini diselesaikan dalam tenggat waktu **10 hari**, dimulai sejak **27 Juli 2025 hingga 5 Agustus 2025**.

---

## 🚀 Fitur Utama

* **Integrasi API Langsung:** Menampilkan daftar produk secara dinamis dengan melakukan *fetch* secara *online* ke REST API eksternal (Fake Store API).
* **Kategori Produk:** Memisahkan tampilan produk berdasarkan kategori (Men's Clothing, Women's Clothing, Jewelery, Electronics).
* **Manajemen Keranjang Belanja (Cart):** Pengguna dapat menambahkan produk, mengubah kuantitas, dan menghapus item. Data keranjang disimpan secara persisten menggunakan `localStorage`.
* **Sistem Notifikasi Kustom:** Menggunakan *pop-up toast* untuk memberikan umpan balik kepada pengguna (misal: saat barang berhasil ditambahkan ke keranjang), menggantikan `alert()` bawaan browser.
* **Alur Pembayaran (Checkout) Terstruktur:** Menampilkan *modal/pop-up* yang mensimulasikan proses *checkout* multi-langkah (Detail Pengiriman -> Metode Pembayaran -> Konfirmasi).
* **Mode Gelap/Terang (Dark/Light Mode):** Fitur pergantian tema yang ramah pengguna dan preferensinya disimpan di dalam perangkat klien.
* **Pencarian Produk:** Fitur bilah pencarian responsif untuk menyaring produk berdasarkan nama.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun murni dengan teknologi fundamental web:

* **HTML5:** Sebagai kerangka struktur semantik aplikasi.
* **CSS Vanilla:** Untuk tata letak (termasuk *Flexbox/Grid*) dan *styling*, serta animasi UI (*toast notification*, *modal popup*, *dark mode*).
* **JavaScript Vanilla:** Menangani semua logika antarmuka, *DOM Manipulation*, manajemen *state* keranjang, dan pemanggilan `fetch` ke API eksternal.

> **Sumber Data API:** [Fake Store API](https://fakestoreapi.com/)

---

## 📅 Timeline Pengerjaan Proyek

Proyek ini merupakan tantangan pengembangan 10 hari dengan jadwal sebagai berikut:

* **Mulai Proyek:** 27 Juli 2025
* **Batas Waktu (*Deadline*):** 5 Agustus 2025
* **Fokus Pengerjaan:**
    * *Setup* struktur HTML & rancangan antarmuka (CSS).
    * Pengambilan data dari API & perenderan produk (JS).
    * Pengembangan logika *Cart* dan *Checkout* (JS & `localStorage`).
    * Penyempurnaan UI/UX (Notifikasi *Pop-up*, Tema Gelap, Navigasi).

---

## 📂 Struktur Folder Proyek

Secara garis besar, susunan direktori proyek ini adalah sebagai berikut:

```text
lazado-ecommerce/
│
├── index.html        # Halaman utama produk
├── men.html          # Halaman produk pria
├── women.html        # Halaman produk wanita
├── jewelery.html     # Halaman perhiasan
├── electronic.html   # Halaman elektronik
├── cart.html         # Halaman keranjang belanja & checkout
│
├── css/
│   └── style.css     # Kumpulan styling utama & animasi pop-up
│
├── js/
│   ├── product.js    # Logika fetch API semua produk
│   ├── men.js        # Fetch API kategori pria
│   ├── women.js      # Fetch API kategori wanita
│   ├── jewelery.js   # Fetch API kategori perhiasan
│   ├── electronic.js # Fetch API kategori elektronik
│   └── cart.js       # Logika localStorage, keranjang, dan pop-up checkout
│

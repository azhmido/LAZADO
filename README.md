# 🛒 LAZADO - E-Commerce Web App

**LAZADO** adalah sebuah proyek antarmuka aplikasi web *e-commerce* fiktif yang dikembangkan dari nol menggunakan teknologi web dasar. Proyek ini mendemonstrasikan kemampuan dalam membangun aplikasi yang interaktif dan dinamis melalui pengambilan data (*data fetching*) dari sumber eksternal tanpa bergantung pada *framework* atau *library* tambahan.

Proyek ini diselesaikan dalam tenggat waktu **10 hari**, dimulai sejak **27 Juli 2025 hingga 5 Agustus 2025**.

---

## 🚀 Fitur Utama

* **Integrasi API Langsung:** Menampilkan daftar produk secara dinamis dengan melakukan *fetch* secara *online* ke REST API eksternal (Fake Store API).
* **Kategori Produk:** Memisahkan tampilan produk berdasarkan kategori (Men's Clothing, Women's Clothing, Jewelery, Electronics).
* **Halaman Detail Produk:** Menampilkan informasi lengkap produk dengan breadcrumb navigasi, visual star rating, efek zoom gambar, *quantity selector*, dan rekomendasi produk terkait.
* **Filter & Sort:** Menyaring produk berdasarkan rentang harga dan mengurutkan berdasarkan harga, rating, atau nama.
* **Pencarian Produk:** Fitur bilah pencarian responsif untuk menyaring produk berdasarkan nama secara *real-time*.
* **Manajemen Keranjang Belanja (Cart):** Pengguna dapat menambahkan produk, mengubah kuantitas, dan menghapus item dengan konfirmasi. Data keranjang disimpan secara persisten menggunakan `localStorage`.
* **Alur Pembayaran (Checkout) Multi-Langkah:** Menampilkan *modal/pop-up* yang mensimulasikan proses *checkout* 3 langkah (Detail Pengiriman → Metode Pembayaran → Konfirmasi) dengan validasi nyata:
  * **Nomor Kartu Kredit** menggunakan algoritma **Luhn**
  * **Masa Berlaku (MM/YY)** dan **CVV** sesuai standar perbankan
  * **Nomor Telepon** minimal 10 digit
* **Invoice & Riwayat Pesanan:** Setiap pembayaran sukses menghasilkan invoice dengan nomor unik yang dapat di-*print*. Riwayat pesanan disimpan dan dapat dilihat kapan saja di halaman "Pesanan Saya".
* **Sistem Autentikasi:** Registrasi dan login pengguna sungguhan dengan penyimpanan sesi di `localStorage`. Halaman keranjang dan pesanan dilindungi (*redirect* ke login jika belum masuk).
* **Sistem Notifikasi Kustom:** Menggunakan *pop-up toast* untuk memberikan umpan balik kepada pengguna, menggantikan `alert()` bawaan browser.
* **Loading Skeleton & Overlay:** Menampilkan kerangka placeholder saat data produk dimuat, serta *loading overlay* dengan *spinner* saat memproses pembayaran.
* **Animasi Transisi Halaman:** Efek *fade-in* halus saat bernavigasi antar halaman.
* **Mode Gelap/Terang (Dark/Light Mode):** Fitur pergantian tema yang ramah pengguna dan preferensinya disimpan di dalam perangkat klien.
* **Tombol Scroll to Top:** Navigasi cepat ke puncak halaman.
* **Form Alert Interaktif:** Pesan error/sukses ditampilkan langsung di dalam form login dan registrasi dengan animasi *slide down*.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun murni dengan teknologi fundamental web:

* **HTML5:** Sebagai kerangka struktur semantik aplikasi.
* **CSS Vanilla:** Untuk tata letak (termasuk *Flexbox/Grid*) dan *styling*, serta animasi UI (*toast notification*, *modal popup*, *dark mode*, *page transition*).
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
├── index.html                         # Halaman utama produk
│
├── html/
│   ├── about.html                     # Halaman tentang
│   ├── cart.html                      # Halaman keranjang belanja & checkout
│   ├── electronic.html                # Halaman kategori elektronik
│   ├── jewelery.html                  # Halaman kategori perhiasan
│   ├── login.html                     # Halaman login
│   ├── men-clothing.html              # Halaman kategori pakaian pria
│   ├── order.html                     # Halaman riwayat pesanan
│   ├── product.html                   # Halaman detail produk
│   ├── regis.html                     # Halaman registrasi
│   └── women-clothing.html            # Halaman kategori pakaian wanita
│
├── css/
│   ├── style.css                      # Kumpulan styling utama & animasi
│   ├── login.css                      # Styling halaman login
│   └── regis.css                      # Styling halaman registrasi
│
├── javascript/
│   ├── shared/
│   │   └── cart-utils.js              # Utilitas bersama (cart, auth, notifikasi, filter, invoice, loading)
│   ├── cart.js                        # Logika keranjang, checkout multi-langkah
│   ├── electronic.js                  # Fetch & render kategori elektronik
│   ├── jewelery.js                    # Fetch & render kategori perhiasan
│   ├── men.js                         # Fetch & render kategori pakaian pria
│   ├── order.js                       # Logika riwayat pesanan
│   ├── product.js                     # Fetch API semua produk & detail produk
│   ├── script.js                      # Logika halaman utama
│   └── women.js                       # Fetch & render kategori pakaian wanita
│
├── assets/                            # Gambar dan aset statis
│
└── README.md                          # Dokumentasi proyek
```

---

## ✨ Fitur Unggulan

| Fitur | Keterangan |
|-------|-----------|
| **Multi-Step Checkout** | 3 langkah (pengiriman → pembayaran → konfirmasi) dengan validasi ketat |
| **Validasi Kartu Kredit (Luhn)** | Memvalidasi nomor kartu menggunakan algoritma Luhn |
| **Invoice + Print** | Invoice otomatis setelah pembayaran dengan tombol cetak |
| **Riwayat Pesanan** | Semua pesanan tersimpan dan dapat dilihat kapan saja |
| **Auth Real** | Registrasi, login, logout, dan proteksi halaman |
| **Filter & Sort** | Sortir harga/rating/nama + filter rentang harga |
| **Dark Mode** | Tema gelap/terang dengan preferensi tersimpan |
| **Skeleton Loading** | Placeholder animasi saat data dimuat |

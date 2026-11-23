# KAIEN ATELIER — Portofolio Artist & Panel Admin (Mini CMS)

Website portofolio halaman tunggal (*single-page*) bernuansa editorial, tenang, dan minimalis untuk artist pembuat Karakter Orisinal (OC), komikus, dan ilustrator komisi, dilengkapi dengan **Panel Admin (Mini CMS)** lengkap untuk memperbarui seluruh konten situs dari browser tanpa mengedit kode.

Dibangun dengan **Vite + React 19 + TypeScript + Tailwind CSS + Framer Motion**, didukung **Supabase** (Postgres, Auth, Storage), **TanStack Query**, **React Hook Form + Zod**, dan **Dnd Kit**.

---

## 1. Arsitektur & Struktur Direktori

```
ArtCommision/
├── public/
│   ├── assets/              # Aset ilustrasi grafis, sampul komik & avatar
│   └── robots.txt           # Disallow crawling untuk rute /admin/
├── src/
│   ├── admin/               # MODUL ADMIN PANEL (Mini CMS)
│   │   ├── components/      # Layout sidebar, header draf/publish, uploader, modal, toast
│   │   ├── context/         # AuthContext (Supabase Auth & simulasi offline)
│   │   └── pages/           # Halaman Admin (Dashboard, Karya, Komisi, Pesan, Media, dll.)
│   ├── components/          # Komponen publik (Navbar, Footer, Lightbox, SocialLinks)
│   ├── context/             # WebsiteDataContext (TanStack Query caching & fallback)
│   ├── data/                # Data snapshot awal (default fallback jika database offline)
│   ├── hooks/               # useScrollSpy, useCountUp
│   ├── lib/
│   │   └── supabase/        # Klien Supabase & fungsi kompresi gambar otomatis
│   ├── sections/            # Seksi website publik (Hero, Profile, Works, Commissions, Contact)
│   ├── services/            # Content service (CRUD, draf, revisi snapshot, ekspor/impor)
│   ├── types/               # Tipe data TypeScript bersama (Public & Admin)
│   ├── utils/               # Varian animasi Framer Motion
│   ├── App.tsx              # Router publik ("/") dan admin ("/admin/*")
│   └── index.css            # Desain token tema Tailwind & tekstur grain kertas
├── supabase/
│   ├── schema.sql           # Skema tabel database PostgreSQL lengkap
│   ├── policies.sql         # Row Level Security (RLS) policies
│   └── seed.sql             # Data awal dari konten artist yang sudah ada
├── .env.example             # Contoh variabel lingkungan Supabase & Formspree
└── tailwind.config.js       # Desain sistem palet warna & tipografi
```

---

## 2. Panduan Pengaturan Supabase

### Langkah 1: Buat Proyek Supabase
1. Kunjungi [supabase.com](https://supabase.com) dan masuk atau buat akun baru gratis.
2. Klik tombol **New project**, beri nama proyek (misal: `kaien-art-portfolio`), tentukan kata sandi database, dan pilih region terdekat (misal: *Singapore*).
3. Setelah proyek selesai dibuat, buka menu **Project Settings** (ikon gerigi di kiri bawah) &rarr; **API**.
4. Salin:
   - **Project URL**
   - **Project API Keys** &rarr; `anon` / `public` key

### Langkah 2: Konfigurasi Berkas `.env`
Duplikat berkas `.env.example` menjadi `.env` di folder proyek:
```bash
cp .env.example .env
```
Isi nilai URL dan Key yang telah disalin:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ARTIST_EMAIL=artist@example.com
```

### Langkah 3: Eksekusi Skema & Data Awal (Schema, Policies, Seed)
1. Di dashboard Supabase proyek Anda, buka menu **SQL Editor** di navigasi sebelah kiri.
2. Klik **New query**, lalu salin dan tempel seluruh isi berkas [`supabase/schema.sql`](file:///c:/Users/Muhammad.Fachri/Desktop/ArtCommision/supabase/schema.sql) &rarr; klik **Run**.
3. Buat query baru, salin dan tempel isi berkas [`supabase/policies.sql`](file:///c:/Users/Muhammad.Fachri/Desktop/ArtCommision/supabase/policies.sql) &rarr; klik **Run**.
4. Buat query baru, salin dan tempel isi berkas [`supabase/seed.sql`](file:///c:/Users/Muhammad.Fachri/Desktop/ArtCommision/supabase/seed.sql) &rarr; klik **Run**.
5. Buka menu **Storage** di Supabase, pastikan bucket `portfolio-media` telah terbentuk dan berstatus **Public bucket**.

### Langkah 4: Membuat Akun Admin Artist
Pendaftaran publik sengaja dinonaktifkan demi keamanan portofolio. Buat akun artist secara langsung melalui dashboard Supabase:
1. Buka menu **Authentication** &rarr; tab **Users**.
2. Klik tombol **Add user** &rarr; pilih **Create user**.
3. Masukkan email artist dan kata sandi yang kuat (misal: `artist@domain.com` dan kata sandi Anda).
4. Centang **Auto Confirm User?** agar akun langsung aktif tanpa perlu verifikasi email.

---

## 3. Menjalankan di Komputer Lokal (Local Development)

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server lokal
npm run dev
```

Buka peramban (browser):
- **Website Publik**: `http://localhost:5173/`
- **Panel Admin**: `http://localhost:5173/admin`
- **Mode Pratinjau Draf**: `http://localhost:5173/?preview=true`

> **Catatan Mode Offline (Tanpa Internet / Supabase):**
> Jika Anda belum mengisi `.env` dengan kredensial Supabase, aplikasi secara cerdas beralih ke **Mode Lokal (Standalone)** menggunakan *local storage*. Anda tetap dapat login ke `/admin` dengan memasukkan sembarang email dan kata sandi untuk mencoba seluruh fitur CMS secara instan!

---

## 4. Panduan Menjalankan Build Produksi

Untuk memverifikasi kompilasi TypeScript dan bundel produksi:
```bash
npm run build
```
Hasil kompilasi static files yang telah dioptimasi dan di-codesplit akan berada di folder `dist/`.

---

## 5. Panduan Publikasi ke Internet (Deployment)

### Opsi A: Vercel (Gratis & Direkomendasikan)
1. Unggah kode ke repositori GitHub pribadi Anda.
2. Masuk ke [vercel.com](https://vercel.com) &rarr; klik **Add New** &rarr; **Project**.
3. Impor repositori Anda.
4. Di bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = (URL Supabase Anda)
   - `VITE_SUPABASE_ANON_KEY` = (Anon key Supabase Anda)
   - `VITE_ARTIST_EMAIL` = (Email artist)
5. Klik **Deploy**.

> **Penting untuk Single-Page App (SPA) Routing:**
> Jika halaman `/admin` menghasilkan 404 saat di-refresh pada hosting statis, buat berkas `vercel.json` di root proyek:
> ```json
> {
>   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
> }
> ```

### Opsi B: Netlify (Gratis)
1. Impor repositori GitHub ke [netlify.com](https://netlify.com).
2. Tambahkan variabel lingkungan yang sama di **Site Configuration** &rarr; **Environment variables**.
3. Buat berkas `public/_redirects` berisi satu baris:
   ```
   /*    /index.html   200
   ```
4. Klik **Deploy site**.

---

## 6. Panduan untuk Artist (Cara Menggunakan Admin Panel)

Panel Admin dirancang sangat sederhana, bersih, dan menggunakan Bahasa Indonesia agar mudah dipahami oleh ilustrator:

### 6.1 Mengubah Kalimat Headline di Halaman Depan
1. Masuk ke menu **Intro (Hero)** di bilah navigasi kiri admin.
2. Anda akan melihat kolom **Headline Utama**, **Teks Eyebrow**, dan **Pengantar Singkat**.
3. Ubah teks sesuai keinginan Anda.
4. Klik tombol **Simpan Draf** untuk menyimpan sementara (hanya terlihat saat Anda mengklik *Pratinjau Draf*), atau klik tombol hitam **Publikasikan** agar langsung tampil ke pengunjung umum.

### 6.2 Mengganti Gambar Utama (Hero Artwork)
1. Masuk ke menu **Intro (Hero)**.
2. Tarik dan lepas berkas gambar baru (JPG, PNG, atau WEBP) ke kotak unggahan. Gambar akan dikompresi otomatis agar situs tetap terbuka kencang.
3. Anda dapat mengklik titik mana saja pada gambar pratinjau untuk mengatur **titik fokus (focal point)** agar pemotongan di layar ponsel/tablet tetap presisi.
4. Klik **Publikasikan**.

### 6.3 Menambah Karya Baru ke Galeri Portofolio
1. Buka menu **Karya & Galeri**.
2. Klik tombol **+ Tambah Karya Baru** di pojok kanan atas.
3. Unggah file gambar karya Anda.
4. Isi judul karya, pilih kategori (misal: *Original Characters* atau *Commissions*), isi tahun dan teknik (medium).
5. Klik **Simpan Karya**.
6. **Mengubah Urutan Karya:** Anda cukup menekan dan menggeser ikon pegangan (titik enam di sebelah kiri karya) ke atas atau ke bawah. Urutan akan tersimpan seketika.

### 6.4 Membuka atau Menutup Antrean Komisi (Open / Closed)
1. Buka menu **Komisi** (atau langsung melalui menu **Dashboard**).
2. Di bagian paling atas, centang kotak **Status Komisi** untuk membuka (Open), atau hilangkan centang untuk menutup (Closed).
3. Anda juga dapat mengubah angka kuota (misal: `3` slot tersedia dari `5` total slot).
4. Klik **Publikasikan**. Tombol "Request a Commission" di website publik akan otomatis aktif atau berubah menjadi tombol abu-abu *Slots Filled*.

### 6.5 Membaca dan Membalas Pesan Klien
1. Buka menu **Kotak Masuk**.
2. Klik pesan dari daftar untuk membaca brief karakter dan membuka tautan referensi visual klien.
3. Klik tombol **Balas** untuk langsung membuka aplikasi email Anda dengan subjek dan format balasan yang telah disiapkan secara otomatis.

### 6.6 Cadangan Data (Backup & Ekspor JSON)
1. Buka menu **Cadangan & Ekspor**.
2. Klik tombol **Unduh Berkas Cadangan (.JSON)**.
3. Seluruh karya, pengaturan komisi, profil, dan pesan Anda tersimpan dalam satu berkas aman di komputer Anda. Kapan saja ingin memulihkan, Anda cukup mengunggah kembali berkas tersebut pada kartu di sebelahnya.

---

## 7. Daftar Pustaka yang Dipasang dan Justifikasinya

| Pustaka | Alasan & Justifikasi Penggunaan |
| :--- | :--- |
| **`react-router-dom`** | Menyediakan perutean SPA yang mulus antara website publik (`/`) dan panel admin terlindungi (`/admin/*`). |
| **`@supabase/supabase-js`** | Klien resmi Supabase untuk otentikasi admin, operasi database PostgreSQL, dan penyimpanan bucket media. |
| **`@tanstack/react-query`** | Mengelola caching data website di memori browser, refetching otomatis saat fokus, dan sinkronisasi instan draf/publikasi. |
| **`react-hook-form` & `zod`** | Validasi formulir yang ringan, cepat, dan tanpa re-render berlebih untuk form input admin dan form kontak klien. |
| **`@dnd-kit/core` & `@dnd-kit/sortable`** | Pustaka drag-and-drop modern yang mulus dan mendukung aksesibilitas keyboard/touch untuk mengatur urutan karya, tier, add-on, dan tahapan alur kerja. |
| **`browser-image-compression`** | Mengompresi resolusi dan ukuran file gambar di sisi peramban klien sebelum diunggah ke storage agar menghemat kuota dan mempercepat *load time*. |
| **`framer-motion`** | Animasi entrance halus untuk seluruh seksi publik, modal pratinjau karya (lightbox), dan notifikasi toast admin. |
| **`lucide-react`** | Ikon SVG konsisten, ringan, dan tajam yang melengkapi tema desain editorial monokrom. |

---

## 8. Panduan Hosting Live di GitHub Pages

Proyek ini telah dikonfigurasi penuh dengan **GitHub Actions CI/CD** dan **Single Page Application (SPA) routing**.

### Langkah 1: Buat Repositori Baru di GitHub
1. Masuk ke akun Anda di [github.com](https://github.com).
2. Klik tombol **New** (atau ikon **+** di pojok kanan atas &rarr; **New repository**).
3. Beri nama repositori (misalnya `ArtCommision` atau `portfolio`).
4. Biarkan repositori disetel sebagai **Public**.
5. Jangan centang "Add a README file" atau ".gitignore" karena sudah tersedia di dalam proyek ini.
6. Klik **Create repository**.

### Langkah 2: Hubungkan dan Push Kode dari Terminal
Buka terminal / PowerShell di folder proyek ini (`c:\Users\Muhammad.Fachri\Desktop\ArtCommision`), lalu jalankan perintah berikut (ganti `<USERNAME>` dan `<NAMA-REPO>` sesuai akun Anda):

```bash
git remote add origin https://github.com/<USERNAME>/<NAMA-REPO>.git
git branch -M main
git push -u origin main
```

### Langkah 3: Aktifkan GitHub Pages melalui GitHub Actions
1. Di halaman repositori GitHub Anda, buka tab **Settings** &rarr; menu **Pages** di bilah sisi kiri.
2. Pada bagian **Build and deployment** &rarr; **Source**, pilih:
   👉 **GitHub Actions**
3. Buka tab **Actions** di bagian atas repositori. Anda akan melihat workflow **Deploy Portfolio to GitHub Pages** berjalan secara otomatis.
4. Tunggu sekitar 1-2 menit hingga proses build dan deployment selesai (ikon centang hijau).
5. Website Anda sekarang sudah live dan dapat diakses dari mana saja di:
   ```
   https://<USERNAME>.github.io/<NAMA-REPO>/
   ```
   *(Panel Admin dapat diakses di `https://<USERNAME>.github.io/<NAMA-REPO>/admin`)*


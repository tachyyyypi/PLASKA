# Plaska - Smart Task & Study Orchestrator

Aplikasi pengelolaan tugas sekolah dan jadwal belajar berbasis Bento Grid dengan alokasi waktu cerdas.

---

## 🚀 Cara Hosting di GitHub Pages

Aplikasi ini sudah dikonfigurasi secara otomatis agar bisa dihosting di **GitHub Pages** menggunakan **GitHub Actions**.

### 📋 Langkah-Langkah Publikasi di GitHub:

1. **Push Kode ke Repository GitHub:**
   Upload atau push seluruh repositori ini ke repository GitHub Anda (cabang `main` atau `master`).
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Plaska"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```

2. **Aktifkan GitHub Pages pada Setting Repositori:**
   - Buka halaman repository Anda di GitHub: `https://github.com/USERNAME/NAMA-REPO`
   - Klik tab **Settings** (Pengaturan).
   - Pada menu bagian kiri, klik **Pages**.
   - Pada bagian **Build and deployment** -> **Source**, pilih **GitHub Actions**.

3. **Proses Deploy Otomatis:**
   - Setelah memilih *GitHub Actions*, alur kerja `.github/workflows/deploy.yml` akan berjalan secara otomatis setiap kali Anda melakukan push kode.
   - Anda dapat melihat status deployment di tab **Actions** pada repository GitHub.
   - Setelah selesai (sekitar 1-2 menit), URL website GitHub Pages Anda akan muncul (contoh: `https://USERNAME.github.io/NAMA-REPO/`).

---

## 🛠️ Fitur Konfigurasi Static GitHub Pages

- **Relative Asset Base (`base: './'`)**: Jalur file JS & CSS disesuaikan secara relatif sehingga tetap dimuat dengan sempurna meskipun dihosting pada sub-path repositori.
- **Client-Side Local Persistence (`localStorage`)**: Data profil, jadwal sekolah, jam tidur, dan tugas disimpan secara otomatis di memori browser pengguna.
- **Browser-Based Local Decomposition**: Alokasi waktu dan perancangan langkah subtugas cerdas tetap berfungsi 100% di browser tanpa memerlukan server Express eksternal.
- **SPA Routing 404 Fallback (`public/404.html`)**: Mencegah error 404 pada GitHub Pages saat merefresh halaman.

---

## 💻 Menjalankan secara Lokal

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Mode Pengembang (Dev Mode):**
   ```bash
   npm run dev
   ```

3. **Build untuk Static GitHub Pages:**
   ```bash
   npm run build:gh-pages
   ```

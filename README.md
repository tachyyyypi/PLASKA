# Plaska - Smart Task & Study Orchestrator

**Plaska** adalah aplikasi web modern berbasis *Bento Grid* yang dirancang khusus untuk pelajar, mahasiswa, dan profesional muda untuk mengelola tugas, memecah tugas besar menjadi subtugas terstruktur (*task decomposition*), serta menjadwalkannya secara cerdas ke dalam kalender harian tanpa bentrok.

---

## ✨ Fitur Utama (Core Features)

1. **AI & Local Task Decomposition (Pecah Tugas Cerdas)**
   - Mengubah judul tugas dan deadline menjadi serangkaian langkah subtugas logis yang dilengkapi estimasi durasi waktu, alat/bahan, dan kriteria penyelesaian (*completion criteria*).
   - Dilengkapi fallback dekomposisi berbasis browser sehingga tetap berfungsi 100% secara instan bahkan pada mode hosting statis tanpa backend server.

2. **Unified Busy Window & Collision-Free Scheduler (Anti-Bentrok Global)**
   - Algoritma penjadwalan cerdas yang secara otomatis memperhitungkan seluruh jadwal sibuk pengguna secara terpadu (*Unified Busy Intervals*):
     - Jam Tidur Malam & Pagi (*Sleep Schedule*)
     - Jam Sekolah / Kuliah (*School Hours* pada hari aktif)
     - Rutinitas Kustom & Ibadah (*Custom Routine Activities & Prayers*)
     - Jadwal Dadakan / One-Time Events
     - Subtugas yang sudah dijadwalkan sebelumnya di kalender (*Existing Tasks Collision Detection*).
   - Mencegah penumpukan jadwal dan secara otomatis melompati rentang waktu sibuk.

3. **Bento Grid Dashboard & Interactive UI**
   - **Header & Greeting**: Ringkasan produktivitas harian dan sisa tugas kritis.
   - **Card Today Summary**: Progres penyelesaian tugas hari ini.
   - **Card Active Tasks & Focus Task**: Fokus pada tugas prioritas terdekat.
   - **Card Timeline**: Visualisasi timeline harian bergeser interaktif.
   - **Card Risk Overview**: Analisis tingkat risiko keterlambatan tugas.
   - **Card Next Session**: Pengingat sesi belajar berikutnya.

4. **Interactive Timer**
   - Dilengkapi modal timer interaktif untuk membantu eksekusi subtugas secara fokus dan terstruktur.

5. **Profile & Custom Constraints Management**
   - Pengaturan profil pengguna, jadwal sekolah, jam tidur, serta penambahan rutinitas harian & kegiatan dadakan dengan mudah.
import * as fs from 'fs';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType
} from 'docx';

async function buildDetailedDocumentation() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt
            color: '1E293B', // Slate 800
          },
          paragraph: {
            spacing: { line: 276, after: 120 }, // 1.15 line spacing, 6pt after
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          // ==========================================
          // COVER / HEADER TITLE
          // ==========================================
          new Paragraph({
            text: 'DOKUMENTASI TEKNIS & MANUAL ARSITEKTUR',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'PLASKA — Smart Task & Study Orchestrator',
                bold: true,
                size: 32, // 16pt
                color: '0F766E', // Teal 700
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Sistem Orkestrasi Tugas & Studi Berbasis AI Gemini, Algoritma Penjadwalan Bebas Bentrok, dan Dashboard Bento Grid',
                italic: true,
                size: 20,
                color: '64748B',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nama Aplikasi', bold: true })] })],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'PLASKA (Personalized Task Orchestration System)' })],
                    width: { size: 70, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Versi & Platform', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'v1.0.0 (Web SPA / Full-stack Hybrid Cloud)' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Mesin AI & Fallback', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Google Gemini 2.5/3.6 Flash API + Heuristic Local Engine' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Database & Sync', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Firebase Firestore & LocalStorage Client Sync' })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // ==========================================
          // BAB 1: PENDAHULUAN & LATAR BELAKANG
          // ==========================================
          new Paragraph({
            text: 'BAB 1: PENDAHULUAN & LATAR BELAKANG',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: '1.1 Permasalahan Manajemen Waktu Pelajar',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Siswa sekolah menengah dan mahasiswa sering kali menghadapi tantangan berat dalam mengelola tugas-tugas akademis yang menumpuk. Masalah utama yang sering muncul antara lain:'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Prokrastinasi akibat Tugas Terlalu Besar (Task Paralysis): ', bold: true }),
              new TextRun(
                'Ketika siswa diberikan tugas kompleks seperti "Makalah Biologi" atau "Laporan Praktikum", mereka bingung harus memulai dari mana karena tugas tidak dipecah menjadi langkah-langkah kecil.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Ketiadaan Estimasi Waktu Realistis (Planning Fallacy): ', bold: true }),
              new TextRun(
                'Siswa cenderung meremehkan waktu yang dibutuhkan untuk menyelesaikan tugas, sehingga pengerjaan sering tertunda hingga jam-jam terakhir sebelum deadline.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Penjadwalan Bentrok dengan Aktivitas Rutin: ', bold: true }),
              new TextRun(
                'Aplikasi To-Do List konvensional sering kali menjadwalkan tugas pada waktu yang sebenarnya tidak memungkinkan, seperti saat jam sekolah, jam tidur, atau jam les/kegiatan rutin.'
              ),
            ],
          }),

          new Paragraph({
            text: '1.2 Solusi Cerdas yang Ditawarkan PLASKA',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Plaska hadir sebagai Solusi Orchestrator Cerdas yang mengintegrasikan kecerdasan buatan (Artificial Intelligence) dengan algoritma matematis penjadwalan bebas bentrok. Plaska tidak sekadar mencatat tugas, melainkan:'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Memecah Tugas Otomatis (Decomposition): ', bold: true }),
              new TextRun('Menggunakan AI Gemini untuk memecah tugas besar menjadi 3-5 subtugas terukur lengkap dengan estimasi durasi.'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Memproteksi Waktu Istirahat & Sekolah: ', bold: true }),
              new TextRun('Menghormati jam tidur, jam sekolah, dan rutinitas pribadi pengguna sebagai interval terlarang (Forbidden Windows).'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Menata Jadwal Tanpa Bentrok (Collision-Free Scheduling): ', bold: true }),
              new TextRun('Menempatkan subtugas pada slot-slot kosong secara otomatis dan memberikan peringatan dini (High-Risk Alert) jika waktu tidak mencukupi.'),
            ],
          }),

          // ==========================================
          // BAB 2: ARSITEKTUR & TEKNOLOGI SISTEM
          // ==========================================
          new Paragraph({
            text: 'BAB 2: ARSITEKTUR & TEKNOLOGI SISTEM',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: '2.1 Arsitektur Aplikasi (Client-Server Hybrid)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Aplikasi Plaska dibangun dengan arsitektur Full-Stack Hybrid yang menggabungkan kecepatan Single Page Application (SPA) di sisi klien dengan keandalan Express.js backend server:'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Sisi Klien (Frontend SPA): ', bold: true }),
              new TextRun(
                'Dikembangkan menggunakan React 18, TypeScript, dan Tailwind CSS. Komponen UI disusun secara modular dalam bentuk Bento Grid yang responsif dan interaktif.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Sisi Server (Express & esbuild Bundle): ', bold: true }),
              new TextRun(
                'Menyediakan REST API endpoint (/api/decompose, /api/health) serta mengamankan pemanggilan Google Gemini API Key dari paparan publik browser.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Layer Keandalan (Hybrid Fallback): ', bold: true }),
              new TextRun(
                'Apabila aplikasi dijalankan dalam mode offline atau koneksi server terputus, algoritma dekomposisi lokal (Local Heuristic Engine) akan mengambil alih secara instan tanpa menghentikan pengalaman pengguna.'
              ),
            ],
          }),

          new Paragraph({
            text: '2.2 Ringkasan Spesifikasi Teknologi (Tech Stack)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Komponen', bold: true })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Teknologi', bold: true })] })], width: { size: 30, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fungsi Utama', bold: true })] })], width: { size: 45, type: WidthType.PERCENTAGE } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'UI Framework' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'React 18 + TypeScript' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Pengembangan UI deklaratif dan type-safe' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Styling & Design' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Tailwind CSS v4' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Desain Bento Grid, Dark Mode, & Responsif' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Animasi & Ikon' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Motion + Lucide Icons' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Transisi halus modal dan elemen interaktif' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'AI Engine' })] }),
                  new TableCell({ children: [new Paragraph({ text: '@google/genai SDK' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Dekomposisi tugas pintar dengan Gemini API' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Backend Server' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Express.js + Node.js' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Proxy API securely & static file server' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Database & Sync' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Firebase Firestore & LocalStorage' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Penyimpanan terenkripsi & sinkronisasi multi-device' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'CI/CD & Hosting' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'GitHub Actions & Pages' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Deployment otomatis dengan .nojekyll enabled' })] }),
                ],
              }),
            ],
          }),

          // ==========================================
          // BAB 3: ALUR KERJA SISTEM TERPERINCI (HOW IT WORKS)
          // ==========================================
          new Paragraph({
            text: 'BAB 3: ALUR KERJA SISTEM TERPERINCI (HOW IT WORKS)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            text: '3.1 Tahap 1: Pengumpulan Waktu Sibuk (Unified Busy Window Engine)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 150, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Sebelum sebuah tugas dapat dijadwalkan, sistem membentuk "Peta Waktu Sibuk" (Unified Busy Window Array). Waktu sibuk ini bersumber dari empat kategori utama:'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Jam Tidur Pengguna (Sleep Schedule): ', bold: true }),
              new TextRun(
                'Sistem secara default memproteksi rentang waktu malam (misal 22:00 hingga 05:30 pagi). Penjadwal dilarang keras menempatkan subtugas pada jam ini agar kesehatan pengguna tetap terjaga.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Jam Sekolah / Kuliah (School Schedule): ', bold: true }),
              new TextRun(
                'Interval jam belajar resmi di sekolah (misal Senin–Jumat pukul 07:00 hingga 15:00) dikunci otomatis sebagai waktu sibuk.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Rutinitas Harian (Routine Activities): ', bold: true }),
              new TextRun(
                'Aktivitas seperti les bimbel, jadwal ibadah, olahraga, atau les musik yang berulang dimasukkan ke dalam daftar busy windows.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Subtugas Terjadwal Eksisting (Existing Scheduled Subtasks): ', bold: true }),
              new TextRun(
                'Seluruh subtugas dari tugas-tugas lain yang sudah berhasil dialokasikan sebelumnya secara otomatis diperlakukan sebagai waktu sibuk bagi tugas baru.'
              ),
            ],
          }),

          new Paragraph({
            text: '3.2 Tahap 2: Dekomposisi Tugas Cerdas (Task Decomposition Engine)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Ketika pengguna mengeklik "Tambah Tugas" dan memasukkan informasi seperti nama tugas, mata pelajaran, serta deadline, sistem menjalankan proses dekomposisi:'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Proses Utama (Gemini AI API): ', bold: true }),
              new TextRun(
                'Sistem mengirim prompt terstruktur ke Google Gemini API. Gemini menganalisis konteks tugas dan mengembalikan JSON berisi 3 hingga 5 langkah subtugas logis, estimasi durasi pengerjaan dalam menit, kebutuhan bahan/alat, serta kriteria keberhasilan.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Proses Cadangan (Heuristic Local Engine): ', bold: true }),
              new TextRun(
                'Jika jaringan mengalami gangguan, API Key tidak dikonfigurasi, atau kuota terlampaui, fungsi `runLocalDecomposition()` di browser secara cerdas memecah tugas berdasarkan kata kunci (misal: "Praktikum", "Makalah", "Matematika", "Presentasi") menjadi urutan langkah standar dalam waktu kurang dari 10 milidetik.'
              ),
            ],
          }),

          new Paragraph({
            text: '3.3 Tahap 3: Algoritma Penjadwalan Bebas Bentrok (Collision-Free Greedy Scheduler)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Algoritma penjadwalan Plaska berjalan menggunakan pendekatan Greedy Allocation dengan proteksi tumpang tindih (Overlap Protection):'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Penyesuaian Personal Factor: ', bold: true }),
              new TextRun(
                'Durasi estimasi setiap subtugas dikalikan dengan Personal Factor pengguna (misal: jika Personal Factor = 1.2, maka subtugas 30 menit disesuaikan menjadi 36 menit sesuai kecepatan belajar pengguna).'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Pemindaian Waktu (Time Slot Scanning): ', bold: true }),
              new TextRun(
                'Algoritma mulai mencari slot dari waktu sekarang (currentTime). Algoritma memeriksa apakah interval [slotStart, slotStart + duration] bersinggungan dengan salah satu interval dalam Busy Windows.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Pergeseran Otomatis (Collision Skip): ', bold: true }),
              new TextRun(
                'Jika terjadi bentrok dengan busy window (misal jam tidur), algoritma langsung menggeser slotStart ke titik akhir busy window tersebut (busyWindow.end) dan mengulangi pemeriksaan hingga ditemukan slot kosong yang cukup.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Evaluasi Risiko Deadline (High Risk Alert): ', bold: true }),
              new TextRun(
                'Jika slot pengerjaan subtugas terakhir melampaui deadline tugas, sistem secara otomatis menandai tugas tersebut dengan status "HIGH RISK" dan memicu peringatan visual pada dashboard.'
              ),
            ],
          }),

          new Paragraph({
            text: '3.4 Tahap 4: Dashboard Bento Grid & Interactive Timer',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Hasil akhir dari proses penjadwalan disajikan secara intuitif pada dashboard Bento Grid:'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• CardFocusTask: ', bold: true }),
              new TextRun('Menampilkan subtugas terdekat yang siap dikerjakan saat ini lengkap dengan tombol "Mulai Fokus".'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• CardTodaySummary: ', bold: true }),
              new TextRun('Rangkuman total durasi belajar hari ini dan persentase penyelesaian tugas.'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• CardTimeline: ', bold: true }),
              new TextRun('Jadwal kronologis pengerjaan subtugas per hari secara runtut.'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• InteractiveTimerModal: ', bold: true }),
              new TextRun('Fitur stopwatch/countdown interaktif yang mencatat waktu pengerjaan nyata pengguna untuk memperbarui Personal Factor secara adaptif.'),
            ],
          }),

          // ==========================================
          // BAB 4: STUDI KASUS CONTOH PENGERJAAN
          // ==========================================
          new Paragraph({
            text: 'BAB 4: STUDI KASUS REAL-WORLD (EXAMPLE FLOW)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Skenario: ', bold: true }),
              new TextRun('Seorang siswa bernama Budi memasukkan tugas "Laporan Praktikum Fisika: Hukum Ohm" pada hari Senin pukul 16:00 dengan deadline Rabu pukul 23:59.'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Langkah 1 (Dekomposisi AI): ', bold: true }),
              new TextRun('Gemini AI memecah tugas menjadi 3 subtugas:\n'),
              new TextRun('  1. Analisis Data & Perhitungan Grafis (45 menit)\n'),
              new TextRun('  2. Penyusunan Pembahasan & Kesimpulan (60 menit)\n'),
              new TextRun('  3. Finalisasi & Layout Laporan (30 menit)'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Langkah 2 (Penguncian Waktu Sibuk): ', bold: true }),
              new TextRun('Budi memiliki jam tidur (22:00–05:30) dan jam sekolah (07:00–15:00).'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Langkah 3 (Eksekusi Penjadwalan): ', bold: true }),
              new TextRun('\n  • Subtugas 1 ditempatkan pada Senin pukul 16:15 – 17:00 (Slot Kosong Senin Sore).\n'),
              new TextRun('  • Subtugas 2 ditempatkan pada Senin pukul 19:30 – 20:30 (Malam hari sebelum jam tidur).\n'),
              new TextRun('  • Subtugas 3 melompati jam tidur dan jam sekolah Selasa, lalu ditempatkan pada Selasa pukul 15:30 – 16:00.'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Hasil Akhir: ', bold: true }),
              new TextRun('Seluruh subtugas selesai 1 hari sebelum deadline tanpa mengganggu jam tidur maupun jam sekolah Budi!'),
            ],
          }),

          // ==========================================
          // BAB 5: PANDUAN PENGEMBANG (DEVELOPER GUIDE)
          // ==========================================
          new Paragraph({
            text: 'BAB 5: PANDUAN PENGEMBANG & OPERASIONAL',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: '1. Menjalankan Development Server:\n', bold: true }),
              new TextRun('   `npm run dev` — Menjalankan backend server.ts & Vite dev server pada port 3000.\n\n'),
              new TextRun({ text: '2. Melakukan Build Produksi:\n', bold: true }),
              new TextRun('   `npm run build` — Mem-build bundle aset statis Vite dan mengompilasi server.ts menjadi dist/server.cjs via esbuild.\n\n'),
              new TextRun({ text: '3. Verifikasi & Deployment GitHub Pages:\n', bold: true }),
              new TextRun('   Workflow GitHub Actions (`.github/workflows/deploy.yml`) akan mem-build proyek dan mendeploy isi folder `dist/` ke GitHub Pages dengan perlindungan `.nojekyll` enabled.'),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('plaska_documentation.docx', buffer);
  fs.writeFileSync('HOW_IT_WORKS_PLASKA.docx', buffer);
  console.log('Detailed Docx files generated successfully!');
}

buildDetailedDocumentation();

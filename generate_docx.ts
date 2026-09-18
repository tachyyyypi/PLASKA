import * as fs from 'fs';
import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType } from 'docx';

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'DOKUMENTASI & DESKRIPSI MENDETAIL APLIKASI',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),
          new Paragraph({
            text: 'PLASKA: Smart Task & Study Orchestrator',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),

          // 1. Deskripsi Keseluruhan
          new Paragraph({
            text: '1. Deskripsi Keseluruhan (Overall Description)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Plaska adalah aplikasi web modern berbasis Bento Grid yang dirancang khusus untuk pelajar, mahasiswa, dan profesional muda untuk mengelola tugas, memecah tugas besar menjadi langkah-langkah subtugas terstruktur (task decomposition), serta menjadwalkannya secara cerdas ke dalam kalender harian tanpa bentrok. Dengan mengintegrasikan sistem pencegahan tabrakan jadwal global (Unified Busy Window), Plaska memastikan setiap subtugas tidak menimpa jam tidur, jam sekolah, waktu ibadah, rutinitas kustom, maupun tugas lain yang sudah terjadwal.'
              )
            ],
            spacing: { after: 200 }
          }),

          // 2. Latar Belakang & Masalah
          new Paragraph({
            text: '2. Latar Belakang & Permasalahan yang Diselesaikan',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                'Banyak pelajar dan mahasiswa sering mengalami kesulitan dalam mengelola tugas akademik yang menumpuk. Masalah utama yang sering dihadapi meliputi:\n' +
                '• Prokrastinasi akibat kebingungan memulai tugas besar (seperti menyusun makalah atau laporan praktikum).\n' +
                '• Kebutaan jadwal (Schedule Blindness), di mana tugas baru sering kali dijadwalkan menumpuk di jam yang sama dengan tugas sebelumnya.\n' +
                '• Tabrakan jadwal dengan kegiatan rutin harian, les tambahan, maupun waktu ibadah.\n' +
                'Plaska hadir untuk menyelesaikan permasalahan tersebut secara otomatis melalui sistem orkestrasi waktu cerdas berbasis algoritma collision-free.'
              )
            ],
            spacing: { after: 200 }
          }),

          // 3. Fitur Utama
          new Paragraph({
            text: '3. Fitur Utama & Keunggulan',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'A. AI & Local Task Decomposition\n', bold: true }),
              new TextRun(
                'Mengubah judul tugas dan deadline menjadi serangkaian langkah subtugas logis yang dilengkapi estimasi durasi waktu, alat/bahan yang dibutuhkan, serta kriteria penyelesaian (completion criteria). Dilengkapi fallback dekomposisi berbasis browser sehingga tetap berfungsi 100% secara instan.'
              )
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'B. Unified Busy Window & Collision-Free Scheduler\n', bold: true }),
              new TextRun(
                'Algoritma penjadwalan mutakhir yang menggabungkan seluruh rentang waktu sibuk pengguna (Jam Tidur, Jam Sekolah, Rutinitas/Ibadah, Kegiatan Dadakan, dan Subtugas Aktif Lainnya) ke dalam satu interval terpadu. Sistem secara otomatis melompati slot waktu sibuk untuk menghindari bentrok.'
              )
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'C. Bento Grid Dashboard\n', bold: true }),
              new TextRun(
                'Antarmuka visual modern yang terorganisir dalam tata letak bento grid responsif, mencakup ringkasan harian, fokus tugas terdekat, timeline interaktif, analisis risiko keterlambatan, dan pengingat sesi berikutnya.'
              )
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'D. Interactive Focus Timer\n', bold: true }),
              new TextRun(
                'Fitur timer terintegrasi untuk membantu pengguna mengeksekusi setiap subtugas secara fokus dengan metode manajemen waktu yang terstruktur.'
              )
            ],
            spacing: { after: 200 }
          }),

          // 4. Alur Penggunaan Fitur (Workflow)
          new Paragraph({
            text: '4. Alur Penggunaan Fitur (User Workflow)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Langkah 1: Konfigurasi Profil & Jadwal Rutin\n', bold: true }),
              new TextRun('Pengguna mengatur jam tidur, jam sekolah, serta menambahkan rutinitas harian seperti jadwal ibadah atau les tambahan pada menu profil.'),
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Langkah 2: Tambah Tugas Baru\n', bold: true }),
              new TextRun('Pengguna memasukkan nama tugas, mata pelajaran/kategori, deskripsi, dan tenggat waktu (deadline).'),
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Langkah 3: Proses Dekomposisi & Penjadwalan Otomatis\n', bold: true }),
              new TextRun('Sistem secara otomatis mendekomposisi tugas menjadi subtugas dan menempatkannya pada slot waktu kosong terdekat tanpa menabrak jam sibuk atau tugas lain.'),
            ],
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Langkah 4: Eksekusi & Pemantauan Progres\n', bold: true }),
              new TextRun('Pengguna mengeksekusi subtugas menggunakan timer interaktif, menandai selesai, dan memantau timeline harian pada bento grid.'),
            ],
            spacing: { after: 200 }
          }),

          // 5. Dampak Positif & Manfaat
          new Paragraph({
            text: '5. Dampak Positif & Manfaat (Benefits & Positive Impact)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun(
                '• Peningkatan Produktivitas: Mengurangi stres dan kebingungan dalam menghadapi tugas besar.\n' +
                '• Manajemen Waktu yang Efektif: Memastikan alokasi waktu belajar yang realistis dan seimbang dengan istirahat serta ibadah.\n' +
                '• Ketiadaan Tabrakan Jadwal: Memberikan ketenangan pikiran dengan eliminasi total terhadap bentrok jadwal.\n' +
                '• Aksesibilitas Tinggi: Dapat diakses kapan saja dan siap dihosting secara gratis melalui GitHub Pages.'
              )
            ],
            spacing: { after: 200 }
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('plaska_documentation.docx', buffer);
  console.log('Docx generated successfully!');
}

generateDocx();

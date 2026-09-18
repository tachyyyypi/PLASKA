import { DecompositionResult } from '../types';

function getLocalIsoDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getValidSlot(currentCandidate: Date, durationMinutes: number): Date {
  const searchPointer = Date.now() + (30 * 60 * 1000); // Now + 30 mins buffer
  
  const sleepStart = 22 * 60; // 22:00
  const sleepEnd = 5 * 60 + 30; // 05:30
  const schoolStart = 7 * 60; // 07:00
  const schoolEnd = 15 * 60; // 15:00

  for (let loop = 0; loop < 200; loop++) {
    if (currentCandidate.getTime() < searchPointer) {
      currentCandidate = new Date(Math.max(currentCandidate.getTime(), searchPointer));
      const m = currentCandidate.getMinutes();
      const rm = Math.ceil(m / 15) * 15;
      currentCandidate.setMinutes(rm, 0, 0);
      if (rm >= 60) {
        currentCandidate.setHours(currentCandidate.getHours() + 1, 0, 0, 0);
      }
      continue;
    }

    const totalMins = currentCandidate.getHours() * 60 + currentCandidate.getMinutes();
    const dayOfWeek = currentCandidate.getDay();
    const isSchoolDay = [1, 2, 3, 4, 5].includes(dayOfWeek);

    // Morning sleep check (00:00 - 05:30)
    if (totalMins < sleepEnd) {
      currentCandidate.setHours(5, 30, 0, 0);
      continue;
    }

    // School hours check (07:00 - 15:00 on weekdays)
    if (isSchoolDay && totalMins >= schoolStart && totalMins < schoolEnd) {
      currentCandidate.setHours(15, 30, 0, 0);
      continue;
    }

    // Night sleep check (>= 22:00)
    if (totalMins >= sleepStart || (totalMins + durationMinutes) > sleepStart) {
      currentCandidate.setDate(currentCandidate.getDate() + 1);
      const nextDay = currentCandidate.getDay();
      const nextIsSchool = [1, 2, 3, 4, 5].includes(nextDay);
      currentCandidate.setHours(nextIsSchool ? 15 : 9, nextIsSchool ? 30 : 0, 0, 0);
      continue;
    }

    if (currentCandidate.getTime() < searchPointer) {
      currentCandidate.setTime(searchPointer);
      continue;
    }

    break;
  }

  return currentCandidate;
}

function ensureSubtaskSchedule(subtasks: any[]): any[] {
  if (!subtasks || subtasks.length === 0) return subtasks;

  let currentCandidate = new Date(Date.now() + 30 * 60 * 1000);
  const m = currentCandidate.getMinutes();
  const rm = Math.ceil(m / 15) * 15;
  currentCandidate.setMinutes(rm, 0, 0);

  return subtasks.map((st) => {
    const duration = st.estimated_minutes || 30;

    currentCandidate = getValidSlot(currentCandidate, duration);

    const startHour = currentCandidate.getHours();
    const startMin = currentCandidate.getMinutes();
    const startStr = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    
    const slotStartMs = currentCandidate.getTime();
    const slotEndMs = slotStartMs + duration * 60 * 1000;
    const endDate = new Date(slotEndMs);

    const endHour = endDate.getHours();
    const endMin = endDate.getMinutes();
    const endStr = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    const allocDate = getLocalIsoDate(currentCandidate);

    currentCandidate = new Date(slotEndMs + 15 * 60 * 1000);

    return {
      ...st,
      allocation_date: allocDate,
      scheduled_date: allocDate,
      scheduled_start: startStr,
      scheduled_end: endStr,
    };
  });
}

export function runLocalDecomposition(
  taskName: string,
  subject: string,
  description: string,
  deadlineStr: string
): DecompositionResult {
  const nameLower = taskName.toLowerCase();
  const descLower = description.toLowerCase();
  const subjectLower = subject.toLowerCase();

  const isResearchOrPaper = 
    nameLower.includes('makalah') || 
    nameLower.includes('kti') || 
    nameLower.includes('penelitian') || 
    nameLower.includes('laporan ilmiah') ||
    descLower.includes('5 bab') ||
    descLower.includes('halaman');

  const isMathOrPhysicsProblem =
    nameLower.includes('latihan') ||
    nameLower.includes('soal') ||
    nameLower.includes('pr') ||
    nameLower.includes('tugas rumus') ||
    subjectLower.includes('matematika') ||
    subjectLower.includes('fisika') ||
    subjectLower.includes('kimia');

  const isLabReport =
    nameLower.includes('praktikum') ||
    nameLower.includes('percobaan') ||
    nameLower.includes('lab') ||
    descLower.includes('laporan praktikum');

  const isPresentation =
    nameLower.includes('presentasi') ||
    nameLower.includes('ppt') ||
    nameLower.includes('slide') ||
    nameLower.includes('powerpoint');

  let rawResult: DecompositionResult;

  if (isResearchOrPaper) {
    rawResult = {
      task_summary: `Penyusunan ${taskName} (${subject}) secara bertahap terstruktur`,
      requirements: [
        'Minimal sesuai jumlah bab/halaman instruksi',
        'Sumber literatur ilmiah & data pendukung valid',
        'Format penulisan akademik baku & daftar pustaka'
      ],
      tools_and_materials: [
        'Laptop / PC & Google Docs / MS Word',
        'Akses internet (Google Scholar & Jurnal)',
        'Buku teks pelajaran ' + subject,
        'Format sitasi & template dokumen'
      ],
      subtasks: [
        {
          id: 's1',
          name: 'Pengumpulan Sumber Referensi & Literatur',
          description: 'Mencari minimal 3-5 artikel jurnal atau data statistik pendukung topik.',
          estimated_minutes: 45,
          dependencies: [],
          completion_criteria: 'Terkumpul min. 3 referensi valid'
        },
        {
          id: 's2',
          name: 'Penyusunan Outline & Kerangka Bab',
          description: 'Menyusun kerangka pembahasan dari Bab 1 Pendahuluan hingga kesimpulan.',
          estimated_minutes: 35,
          dependencies: ['s1'],
          completion_criteria: 'Kerangka bab 1 sampai akhir disepakati'
        },
        {
          id: 's3',
          name: 'Penulisan Bab 1 Pendahuluan & Teori',
          description: 'Menguraikan latar belakang masalah, rumusan masalah, dan landasan teori.',
          estimated_minutes: 60,
          dependencies: ['s2'],
          completion_criteria: 'Draf bab 1 selesai'
        },
        {
          id: 's4',
          name: 'Penulisan Pembahasan Inti & Analisis Data',
          description: 'Mengembangkan inti argumentasi, data temuan, dan pembahasan komparatif.',
          estimated_minutes: 90,
          dependencies: ['s3'],
          completion_criteria: 'Draf isi pembahasan rampung dan runut'
        },
        {
          id: 's5',
          name: 'Penyusunan Penutup & Daftar Pustaka',
          description: 'Menuliskan kesimpulan, saran, serta format sitasi (APA / baku).',
          estimated_minutes: 30,
          dependencies: ['s4'],
          completion_criteria: 'Kesimpulan dan daftar pustaka lengkap'
        },
        {
          id: 's6',
          name: 'Proofreading, Formating & Ekspor PDF',
          description: 'Cek typo, kerapian margin, penomoran halaman, dan simpan file final.',
          estimated_minutes: 25,
          dependencies: ['s5'],
          completion_criteria: 'File dokumen final siap dikirim/cetak'
        }
      ]
    };
  } else if (isLabReport) {
    rawResult = {
      task_summary: `Laporan Praktikum ${subject}: ${taskName}`,
      requirements: [
        'Tercantum tujuan, alat bahan, langkah kerja',
        'Data pengamatan dan tabel hasil percobaan',
        'Analisis pertanyaan evaluasi & kesimpulan'
      ],
      tools_and_materials: [
        'Buku catatan praktikum / data mentah observasi',
        'Kertas laporan / form praktikum',
        'Penggaris & alat tulis',
        'Buku panduan praktikum ' + subject
      ],
      subtasks: [
        {
          id: 's1',
          name: 'Rekapitulasi Data & Tabel Pengamatan',
          description: 'Merapikan data mentah percobaan ke dalam tabel observasi yang jelas.',
          estimated_minutes: 30,
          dependencies: [],
          completion_criteria: 'Tabel data observasi terisi lengkap'
        },
        {
          id: 's2',
          name: 'Penulisan Langkah Kerja & Hasil Analisis',
          description: 'Menjelaskan variabel, reaksi/fenomena yang diamati, dan perhitungan data.',
          estimated_minutes: 45,
          dependencies: ['s1'],
          completion_criteria: 'Penjelasan fenomena dan perhitungan terverifikasi'
        },
        {
          id: 's3',
          name: 'Menjawab Soal Evaluasi & Pembahasan',
          description: 'Mengerjakan pertanyaan refleksi yang ada di lembar panduan modul.',
          estimated_minutes: 35,
          dependencies: ['s2'],
          completion_criteria: 'Seluruh pertanyaan evaluasi dijawab tuntas'
        },
        {
          id: 's4',
          name: 'Menyimpulkan & Finalisasi Laporan',
          description: 'Merangkum ketercapaian tujuan praktikum dan tanda tangan berkas.',
          estimated_minutes: 20,
          dependencies: ['s3'],
          completion_criteria: 'Laporan bersih dan siap kumpul'
        }
      ]
    };
  } else if (isPresentation) {
    rawResult = {
      task_summary: `Pembuatan Slide Presentasi ${subject}: ${taskName}`,
      requirements: [
        'Slide ringkas berbobot dengan visual pendukung',
        'Mencakup opening, poin inti, dan rangkuman',
        'Kesiapan catatan pembicara (speaker notes)'
      ],
      tools_and_materials: [
        'Canva / PowerPoint / Google Slides',
        'Materi rangkuman dari buku ' + subject,
        'Aset gambar/diagram penunjang'
      ],
      subtasks: [
        {
          id: 's1',
          name: 'Penyusunan Storyline & Poin Utama',
          description: 'Menyaring materi penting menjadi 8-12 slide kunci.',
          estimated_minutes: 30,
          dependencies: [],
          completion_criteria: 'Outline alur presentasi siap'
        },
        {
          id: 's2',
          name: 'Desain Layout Slide & Penataan Visual',
          description: 'Memasukkan teks ringkas, diagram ilustrasi, dan desain rapi.',
          estimated_minutes: 50,
          dependencies: ['s1'],
          completion_criteria: 'Draf slide visual selesai dibuat'
        },
        {
          id: 's3',
          name: 'Penyusunan Catatan Pembicara & Latihan Timing',
          description: 'Membuat pointer bicara dan simulasi bicara 5-7 menit.',
          estimated_minutes: 25,
          dependencies: ['s2'],
          completion_criteria: 'Simulasi lancar dan durasi pas'
        }
      ]
    };
  } else if (isMathOrPhysicsProblem) {
    rawResult = {
      task_summary: `Penyelesaian Latihan Soal ${subject}: ${taskName}`,
      requirements: [
        'Langkah pengerjaan ditulis runtut dengan rumus',
        'Pengecekan ulang ketelitian hitungan',
        'Kerapian buku tulis / kertas folio'
      ],
      tools_and_materials: [
        'Buku paket soal ' + subject,
        'Buku latihan / kertas folio bergaris',
        'Kalkulator scientific & alat tulis',
        'Lembar rumus ringkas'
      ],
      subtasks: [
        {
          id: 's1',
          name: 'Review Rumus & Identifikasi Tipe Soal',
          description: 'Membaca materi bab terkait dan mencatat formula dasar.',
          estimated_minutes: 25,
          dependencies: [],
          completion_criteria: 'Rumus utama teridentifikasi'
        },
        {
          id: 's2',
          name: 'Pengerjaan Sesi 1: Soal Tingkat Dasar - Menengah',
          description: 'Menyelesaikan nomor-nomor dasar dengan langkah matematis jelas.',
          estimated_minutes: 45,
          dependencies: ['s1'],
          completion_criteria: 'Separuh soal utama terjawab tuntas'
        },
        {
          id: 's3',
          name: 'Pengerjaan Sesi 2: Soal Analisis / HOTS',
          description: 'Menganalisis soal bertingkat atau studi kasus aplikasi rumus.',
          estimated_minutes: 40,
          dependencies: ['s2'],
          completion_criteria: 'Semua soal bertingkat selesai dikerjakan'
        },
        {
          id: 's4',
          name: 'Koreksi Ulang & Pengecekan Satuan Nilai',
          description: 'Memeriksa ketelitian tanda hitung, satuan SI, dan kerapian tulisan.',
          estimated_minutes: 20,
          dependencies: ['s3'],
          completion_criteria: 'Hasil hitung diverifikasi bebas kekeliruan'
        }
      ]
    };
  } else {
    rawResult = {
      task_summary: `Dekomposisi Terstruktur: ${taskName} (${subject})`,
      requirements: [
        'Memenuhi seluruh instruksi penugasan guru',
        'Pengerjaan bertahap sesuai alur berpikir logis',
        'Pemeriksaan akhir sebelum waktu pengumpulan'
      ],
      tools_and_materials: [
        'Buku teks pelajaran ' + subject,
        'Buku tulis / aplikasi pengolah dokumen',
        'Alat tulis & catatan pembelajaran'
      ],
      subtasks: [
        {
          id: 's1',
          name: 'Bedah Instruksi & Persiapan Bahan',
          description: 'Mempelajari detail tugas dan mengumpulkan materi yang diperlukan.',
          estimated_minutes: 25,
          dependencies: [],
          completion_criteria: 'Tujuan tugas dipahami dan bahan siap'
        },
        {
          id: 's2',
          name: 'Eksekusi Tahap 1: Draf Pengerjaan Awal',
          description: 'Mulai menulis atau mengerjakan inti penugasan.',
          estimated_minutes: 50,
          dependencies: ['s1'],
          completion_criteria: 'Draf pengerjaan 60% tercapai'
        },
        {
          id: 's3',
          name: 'Eksekusi Tahap 2: Penyelesaian Seluruh Poin',
          description: 'Melanjutkan hingga semua bagian tugas terpenuhi.',
          estimated_minutes: 45,
          dependencies: ['s2'],
          completion_criteria: 'Seluruh poin instruksi terselesaikan'
        },
        {
          id: 's4',
          name: 'Review Kualitas & Validasi Akhir',
          description: 'Membaca ulang, mengoreksi kekurangan, dan mempersiapkan pengiriman.',
          estimated_minutes: 20,
          dependencies: ['s3'],
          completion_criteria: 'Tugas rapi dan siap diserahkan'
        }
      ]
    };
  }

  return {
    ...rawResult,
    subtasks: ensureSubtaskSchedule(rawResult.subtasks),
  };
}

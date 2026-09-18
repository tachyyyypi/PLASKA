import { GoogleGenAI, Type } from '@google/genai';
import { DecompositionResult } from '../../src/types.js';

const MODELS_TO_TRY = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite'
];

function formatTime(hour: number, min: number): string {
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

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
    // Ensure candidate is at least searchPointer
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

    // Night sleep check (>= 22:00) or task exceeds sleep start (22:00)
    if (totalMins >= sleepStart || (totalMins + durationMinutes) > sleepStart) {
      currentCandidate.setDate(currentCandidate.getDate() + 1);
      const nextDay = currentCandidate.getDay();
      const nextIsSchool = [1, 2, 3, 4, 5].includes(nextDay);
      currentCandidate.setHours(nextIsSchool ? 15 : 9, nextIsSchool ? 30 : 0, 0, 0);
      continue;
    }

    // Double check timestamp against searchPointer
    if (currentCandidate.getTime() < searchPointer) {
      currentCandidate.setTime(searchPointer);
      continue;
    }

    break;
  }

  return currentCandidate;
}

function ensureMultiDaySpread(subtasks: any[], currentDateIso: string, deadline: string): any[] {
  if (!subtasks || subtasks.length === 0) return subtasks;

  let currentCandidate = new Date(Date.now() + 30 * 60 * 1000);
  const m = currentCandidate.getMinutes();
  const rm = Math.ceil(m / 15) * 15;
  currentCandidate.setMinutes(rm, 0, 0);

  return subtasks.map((st) => {
    const duration = st.estimated_minutes || 45;

    currentCandidate = getValidSlot(currentCandidate, duration);

    const startHour = currentCandidate.getHours();
    const startMin = currentCandidate.getMinutes();
    const startStr = formatTime(startHour, startMin);
    const allocatedDateStr = getLocalIsoDate(currentCandidate);

    const slotStartMs = currentCandidate.getTime();
    const slotEndMs = slotStartMs + duration * 60 * 1000;
    const endDate = new Date(slotEndMs);

    const endHour = endDate.getHours();
    const endMin = endDate.getMinutes();
    const endStr = formatTime(endHour, endMin);

    // Advance currentCandidate for next subtask: slotEnd + 15 minute break
    currentCandidate = new Date(slotEndMs + 15 * 60 * 1000);

    return {
      ...st,
      allocation_date: allocatedDateStr,
      scheduled_date: allocatedDateStr,
      scheduled_start: startStr,
      scheduled_end: endStr,
    };
  });
}

export async function decomposeTaskWithGemini(
  taskName: string,
  subject: string,
  description: string,
  deadline: string,
  reference?: string,
  userRoutines?: any[]
): Promise<DecompositionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY tidak dikonfigurasi pada server.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const now = new Date();
  const currentDateIso = getLocalIsoDate(now);
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentDatetimeStr = `${currentDateIso} ${currentHours}:${currentMinutes}`;

  const prompt = `Anda adalah "Plaska AI Task Orchestrator", sistem cerdas pendamping belajar siswa SMA di Indonesia.
Tugas Anda adalah menganalisis dan mendekomposisi tugas akademik sekolah menjadi langkah-langkah subtugas yang logis dan terstruktur.

INFORMASI TUGAS:
- Nama Tugas: ${taskName}
- Mata Pelajaran: ${subject}
- Batas Pengumpulan (Deadline): ${deadline}
- Instruksi Lengkap: ${description}
- ${reference ? `Catatan/Referensi Tambahan: ${reference}` : ''}

PEDOMAN DEKOMPOSISI SUBTUGAS:
1. ATURAN WAJIB MULTI-SUBTASK KOMPLEKS (MINIMAL 3 - 6 SUBTUGAS):
   Untuk tugas berukuran sedang hingga besar (seperti Makalah, KTI, Laporan Praktikum, Proyek, atau Tugas Besar), kamu WAJIB memecahnya menjadi minimal 3 hingga 6 subtugas yang mencakup alur lengkap secara runut (contoh: Riset & Pengumpulan Referensi -> Penyusunan Outline/Kerangka -> Penulisan Bab 1/Pendahuluan -> Penulisan Isi/Bab 2 -> Penulisan Penutup/Bab 3 -> Review, Formatting & Finalisasi). DILARANG KERAS hanya mengembalikan 1 subtugas tunggal!

2. ESTIMASI DURASI LOGIS:
   Berikan estimasi waktu realistis dalam menit (estimated_minutes) untuk setiap subtugas (contoh: 30, 45, 60, atau 90 menit).

3. JANGAN SERTAKAN WAKTU/TANGGAL ALOKASI:
   DILARANG mengembalikan tanggal (allocation_date) atau jam (scheduled_start / scheduled_end). Penjadwalan alokasi jam akan dihitung secara otomatis oleh Deterministic Scheduler Engine.

4. KONTRAK OUTPUT JSON:
   Kembalikan objek JSON dengan format:
   {
     "task_summary": "Ringkasan inti tugas dan sasaran akhir",
     "requirements": ["Poin kriteria 1", "Poin kriteria 2"],
     "tools_and_materials": ["Nama alat/bahan 1", "Nama alat/bahan 2"],
     "subtasks": [
       {
         "id": "s1",
         "name": "Nama langkah subtugas spesifik",
         "description": "Deskripsi singkat yang jelas dan actionable",
         "estimated_minutes": 45,
         "dependencies": [],
         "completion_criteria": "Kondisi terukur saat langkah ini selesai"
       }
     ]
   }`;

  let lastError: any = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah Task Orchestrator cerdas untuk siswa SMA. Selalu berikan respon murni dalam format JSON sesuai skema yang diminta.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              task_summary: { type: Type.STRING },
              requirements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              tools_and_materials: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              subtasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    estimated_minutes: { type: Type.INTEGER },
                    dependencies: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    completion_criteria: { type: Type.STRING },
                  },
                  required: ['id', 'name', 'description', 'estimated_minutes', 'completion_criteria'],
                },
              },
            },
            required: ['task_summary', 'requirements', 'tools_and_materials', 'subtasks'],
          },
        },
      });

      const responseText = response.text?.trim() || '';
      if (responseText) {
        const parsed: DecompositionResult = JSON.parse(responseText);
        if (parsed.subtasks && parsed.subtasks.length > 0) {
          parsed.subtasks = ensureMultiDaySpread(parsed.subtasks, currentDateIso, deadline);
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn(`[Gemini Rotation] Model ${modelName} gagal:`, err.message || err);
      lastError = err;
    }
  }

  // Graceful Fallback Decomposition if models experience 404 or high demand (503)
  console.warn('All Gemini models encountered errors. Using robust local fallback decomposition.');
  const rawFallbackSubtasks = [
    {
      id: 'sub_fb_1',
      name: `Riset & Pengumpulan Bahan: ${taskName}`,
      description: 'Kumpulkan sumber referensi dan pelajari instruksi tugas secara mendalam.',
      estimated_minutes: 30,
      dependencies: [],
      completion_criteria: 'Bahan referensi lengkap.',
      scheduled_start: '16:00',
      scheduled_end: '16:30',
    },
    {
      id: 'sub_fb_2',
      name: `Pengerjaan Utama: ${taskName}`,
      description: 'Susun dan kerjakan isi tugas secara terstruktur hingga tuntas.',
      estimated_minutes: 60,
      dependencies: ['sub_fb_1'],
      completion_criteria: 'Draf tugas selesai dikerjakan.',
      scheduled_start: '16:45',
      scheduled_end: '17:45',
    },
    {
      id: 'sub_fb_3',
      name: `Review & Finalisasi: ${taskName}`,
      description: 'Periksa kembali kesesuaian tugas sebelum dikumpulkan.',
      estimated_minutes: 30,
      dependencies: ['sub_fb_2'],
      completion_criteria: 'Tugas siap dikumpulkan.',
      scheduled_start: '19:00',
      scheduled_end: '19:30',
    },
  ];

  return {
    task_summary: `Analisis mandiri dan penyelesaian tugas: ${taskName}`,
    requirements: ['Perangkat belajar', 'Catatan referensi materi'],
    tools_and_materials: ['Buku catatan / perangkat digital'],
    subtasks: ensureMultiDaySpread(rawFallbackSubtasks, currentDateIso, deadline),
  };
}

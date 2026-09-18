# Plaska – AI Task Orchestrator: Sistem Arsitektur & Panduan Referensi Integrasi

Dokumen ini merupakan cetak biru (*blueprint*) dan panduan standar arsitektur untuk **Plaska – AI Task Orchestrator**, sebuah sistem manajemen dan dekomposisi tugas berbasis kecerdasan buatan (*Gemini API*) yang dirancang khusus untuk siswa SMA di Indonesia guna mengatur jadwal belajar secara cerdas tanpa mengorbankan waktu istirahat dan rutinitas harian.

---

## 1. Ikhtisar Sistem & Konsep Utama

### A. Pengantar Aplikasi Plaska
Plaska adalah aplikasi *AI Task Orchestrator* yang menjembatani tugas akademik siswa SMA yang seringkali menumpuk (seperti PR, makalah, persiapan ujian, dan praktikum) ke dalam bentuk subtugas kecil yang terdistribusi secara deterministik (*Deterministic Multi-Day Decomposition*) dari hari H-penugasan (H+0) hingga batas akhir (*deadline* H-1).

### B. Konsep Deterministic Multi-Day Decomposition
Alih-alih menumpuk semua pekerjaan pada satu malam sebelum tenggat waktu (*deadline*), Gemini AI bersama *Deterministic Scheduler* memecah tugas besar menjadi unit-unit subtugas berdurasi wajar (30 - 90 menit) yang disebar secara merata ke beberapa hari yang tersedia.

### C. Prinsip *Protection of User Routines* (Hard Constraints)
Sistem memprioritaskan perlindungan mutlak terhadap rutinitas penting siswa, antara lain:
- **Jam Sekolah**: Senin–Jumat pukul 07:00 s.d. 15:00 WIB (tidak boleh ada alokasi tugas akademik).
- **Waktu Tidur & Istirahat Malam**: Mulai pukul 22:00 s.d. 05:30 WIB (zona terlarang untuk tugas).
- **Kegiatan Rutin Personal**: Ekstrakurikuler, bimbingan belajar, dan ibadah harian.

### D. Konsep *Single Source of Truth* (SSOT)
Seluruh jadwal, status penyelesaian subtugas (*completed*), dan alokasi tanggal disimpan dalam struktur data terpusat di Firestore (dengan fallback lokal saat offline). Komponen UI bekerja sebagai *pure consumer* dari data terpusat ini untuk menghindari inkonsistensi status antar kartu (*CardFocusTask*, *CardTimeline*, *CardTodaySummary*).

---

## 2. Spesifikasi Teknis & Palet Warna (Design System)

### A. Tech Stack
- **Frontend Framework**: Vite, React 18+, TypeScript, Tailwind CSS v4.
- **Backend Service**: Express Server (`server.ts`) sebagai perantara aman (*proxy*) untuk **Google Gen AI SDK (`@google/genai`)** untuk melindungi *API Key*.
- **Database & Auth**: Firebase Firestore & Firebase Authentication (Google Sign-In / Email Password).
- **Icons & Motion**: `lucide-react` untuk ikonografi, `motion/react` untuk transisi antarmuka yang mulus.

### B. Palet Warna Utama (Design System)
Plaska mengusung tema *Dark Luxury / Calm Focus* dengan nuansa warna alam yang menenangkan:
* **Primary**: `#334B52` (*Deep Slate Teal*) — Digunakan untuk elemen navigasi utama, header, dan border fokus.
* **Secondary**: `#6FA5A0` (*Soft Seafoam*) — Digunakan untuk aksen progres, status aktif, dan tombol sekunder.
* **Accent**: `#E58B73` (*Coral Accent*) — Digunakan untuk indikator risiko tinggi, tombol aksi penting, dan *badge* tenggat waktu mendesak.
* **Background**: `#101718` (*Dark Charcoal*) — Warna latar belakang utama aplikasi yang ramah mata untuk sesi belajar malam hari.

### C. JSON Schema untuk Subtugas
Berikut adalah struktur data JSON standar yang dihasilkan oleh Gemini AI dan disimpan di Firestore:

\`\`\`json
{
  "id": "sub_9f8e7d6c5b4a",
  "name": "Menyusun Daftar Pustaka dan Bab 1 Makalah Sejarah",
  "description": "Mencari minimal 3 referensi buku teks kurikulum merdeka dan menuliskan pendahuluan.",
  "estimated_minutes": 60,
  "allocation_date": "2026-09-18",
  "scheduled_start": "16:00",
  "scheduled_end": "17:00",
  "completed": false,
  "isBuffer": false
}
\`\`\`

---

## 3. Logika Dekomposisi Gemini & Injeksi Rutinitas

### A. Injeksi `userRoutines` ke dalam System Prompt
Saat pengguna mengirimkan tugas baru melalui *AddTaskModal*, aplikasi menyertakan profil waktu siswa (`userRoutines`, `sleep_schedule`, `school_schedule`) langsung ke dalam *system prompt* Gemini. Hal ini memastikan AI memahami jam-jam sibuk siswa dan tidak mengalokasikan tugas di tengah jam sekolah atau waktu tidur.

### B. 4 Aturan Utama Alokasi Tugas
1. **Hard Constraints Protection**: Tidak boleh ada subtugas yang bertumpuk dengan jam sekolah (07:00–15:00) atau waktu tidur (22:00–05:30).
2. **Night Cut-Off Limit**: Alokasi waktu malam dibatasi maksimal hingga pukul 20:00 WIB untuk memberikan waktu relaksasi sebelum tidur.
3. **Strict Past-Time Guard**: Tanggal dan jam alokasi tidak boleh berada di masa lalu (*past time*) dibandingkan waktu saat ini.
4. **Validasi Jam Konsisten**: Menjamin `scheduled_start` selalu lebih awal daripada `scheduled_end` (mencegah jam terbalik).

### C. Snippet Post-Processing Safeguard (Sanitizer) JavaScript
Fungsi di bawah ini digunakan di backend/frontend untuk memvalidasi dan mengoreksi format jam serta mencegah jam terbalik secara otomatis sebelum disimpan ke Firestore:

\`\`\`typescript
export function sanitizeSubtasks(subtasks: any[]): Subtask[] {
  return subtasks.map((st, index) => {
    let start = st.scheduled_start || "16:00";
    let end = st.scheduled_end || "17:00";
    
    // Validasi format HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(start)) start = "16:00";
    if (!timeRegex.test(end)) end = "17:00";

    // Koreksi jika jam mulai >= jam selesai (Jam Terbalik)
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const startTotalMin = startH * 60 + startM;
    const endTotalMin = endH * 60 + endM;

    if (startTotalMin >= endTotalMin) {
      // Otomatis atur durasi default 60 menit dari jam mulai
      const newEndMin = startTotalMin + Math.max(st.estimated_minutes || 60, 30);
      const resH = Math.floor(newEndMin / 60) % 24;
      const resM = newEndMin % 60;
      end = `${String(resH).padStart(2, '0')}:${String(resM).padStart(2, '0')}`;
    }

    return {
      id: st.id || `sub_${Date.now()}_${index}`,
      name: st.name || `Subtugas ${index + 1}`,
      description: st.description || "",
      estimated_minutes: st.estimated_minutes || 60,
      allocation_date: st.allocation_date || new Date().toISOString().split('T')[0],
      scheduled_start: start,
      scheduled_end: end,
      completed: Boolean(st.completed),
      isBuffer: Boolean(st.isBuffer)
    };
  });
}
\`\`\`

---

## 4. Panduan Konfigurasi Firebase Auth & Environment

### A. Penanganan Error `auth/unauthorized-domain`
Ketika menguji aplikasi di lingkungan pratinjau (*preview URL*) atau domain kustom, Firebase Authentication sering menolak domain jika belum didaftarkan.
* **Solusi**: 
  1. Buka **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized domains**.
  2. Tambahkan domain preview aktif Anda (misalnya `ais-dev-*.run.app` atau domain custom Anda) ke dalam daftar domain yang diizinkan.

### B. Pemisahan Variabel `.env`
Untuk mencegah error `auth/api-key-not-valid` dan menjaga keamanan kunci rahasia, pastikan `.env` memisahkan kredensial klien dan server dengan benar:
\`\`\`env
# Kredensial Klien (Firebase Auth & Firestore)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=plaska-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=plaska-app

# Kredensial Server (Gemini API - WAJIB server-side only)
GEMINI_API_KEY=AIzaSy...
\`\`\`

---

## 5. Rekomendasi Arsitektur UI (*Pure Filter View*)

Dalam merancang antarmuka linimasa (*CardTimeline*) dan ringkasan harian (*CardTodaySummary*), dianjurkan menggunakan pola **Pure Filter View**:
1. **Pemisahan Logika Kalkulasi & Display**: Kalkulasi dekomposisi hari dan alokasi waktu hanya dilakukan sekali saat tugas baru dibuat melalui Gemini API atau *Scheduler* lokal.
2. **Filter Berbasis Tanggal**: Komponen UI Timeline menerima *array* master `subtasks` dan melakukan `filter(st => st.allocation_date === selectedDateString)` tanpa memicu perhitungan ulang jam atau mutasi state yang kompleks di level rendering.
3. **Keuntungan**: Mencegah bug *infinite re-renders*, memastikan sinkronisasi instan saat tombol centang (*checkbox*) subtugas diklik, dan membuat transisi antar tanggal menjadi sangat responsif (*instantaneous*).

---
*Dokumen ini dikelola secara terpusat sebagai standar teknis pengembangan ekosistem Plaska AI.*

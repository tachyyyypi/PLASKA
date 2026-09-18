import React from 'react';
import { AlertCircle, Cpu, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface AiErrorFallbackModalProps {
  isOpen: boolean;
  errorMessage: string;
  onClose: () => void;
  onChooseLocalDecomposition: () => void;
  onRetryAiGeneration: () => void;
  isRetrying: boolean;
}

export const AiErrorFallbackModal: React.FC<AiErrorFallbackModalProps> = ({
  isOpen,
  errorMessage,
  onClose,
  onChooseLocalDecomposition,
  onRetryAiGeneration,
  isRetrying,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle warning glow top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Koneksi AI Gemini Terkendala
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sistem mendeteksi kegagalan pada rotasi model Gemini API.
            </p>
          </div>
        </div>

        {/* Error message detail */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl mb-5 text-xs text-rose-300 font-mono overflow-x-auto">
          <span className="text-slate-400">Pesan Error:</span> {errorMessage || 'Koneksi ke Gemini API timeout atau kuota habis.'}
        </div>

        {/* User-Driven Choice Prompt */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-200 leading-relaxed">
            Gagal terhubung ke Gemini AI. Pilih metode dekomposisi yang ingin digunakan:
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Plaska mematuhi kontrol penuh pengguna (User-Driven Fallback). Anda dapat beralih ke mesin dekomposisi deterministik lokal atau mencoba request ulang ke AI.
          </p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Opsi 1: Gunakan Mode Dekomposisi Lokal */}
          <button
            id="btn-opt-local-decomposition"
            onClick={onChooseLocalDecomposition}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900 hover:from-indigo-900/40 hover:border-indigo-500/60 transition-all text-center group active:scale-95"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white mb-0.5">
              Gunakan Mode Dekomposisi Lokal
            </span>
            <span className="text-[10px] text-slate-400">
              Proses instan via engine deterministik kurikulum SMA
            </span>
          </button>

          {/* Opsi 2: Generate Ulang via AI */}
          <button
            id="btn-opt-retry-ai"
            onClick={onRetryAiGeneration}
            disabled={isRetrying}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 to-slate-900 hover:from-purple-900/40 hover:border-purple-500/60 transition-all text-center group active:scale-95 disabled:opacity-50"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-xs font-bold text-white mb-0.5">
              {isRetrying ? 'Mencoba Menghubungi AI...' : 'Generate Ulang via AI'}
            </span>
            <span className="text-[10px] text-slate-400">
              Kirim ulang request ke rotasi model Gemini API
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

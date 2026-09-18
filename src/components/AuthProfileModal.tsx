import React, { useState } from 'react';
import { User, ShieldCheck, X, Check, School, Mail, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onSaveProfile: (updatedProfile: Partial<UserProfile>) => void;
  backendMode: 'firebase' | 'local';
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  isOpen,
  userProfile,
  onClose,
  onSaveProfile,
  backendMode,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(userProfile.name || 'Siswa Plaska');
  const [email, setEmail] = useState(userProfile.email || 'siswa@plaska.sch.id');
  const [schoolName, setSchoolName] = useState(userProfile.school_name || 'SMAN 1 Plaska');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'Siswa Plaska',
      email: email.trim() || 'siswa@plaska.sch.id',
      school_name: schoolName.trim() || 'SMAN 1 Plaska',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 font-extrabold text-base shadow-lg shadow-teal-500/25">
            {name ? name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-slate-950" />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Profil Siswa Plaska
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Penyimpanan Lokal (Local Storage) Aktif</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Lengkap Siswa:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Siswa:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@sekolah.sch.id"
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Asal Sekolah (SMA / Sederajat):
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Contoh: SMAN 1 Jakarta"
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              id="btn-save-auth-profile"
              type="submit"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl shadow-md shadow-teal-500/20 flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


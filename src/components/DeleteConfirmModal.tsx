import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Task } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirmDelete: (taskId: string) => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirmDelete,
  isDeleting,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Hapus Tugas Akademik?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tindakan ini akan menghapus tugas beserta seluruh subtugasnya dari sistem.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl mb-5">
          <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">
            {task.subject}
          </div>
          <div className="text-sm font-semibold text-white">
            {task.task_name}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {task.subtasks.length} Subtugas terdaftar
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            id="btn-confirm-delete-action"
            type="button"
            onClick={() => {
              if (typeof onConfirmDelete === 'function') {
                onConfirmDelete(task.id);
              } else {
                console.warn('onConfirmDelete is not a function');
              }
            }}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Tugas'}
          </button>
        </div>
      </div>
    </div>
  );
};

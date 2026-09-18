import React from 'react';
import { Task } from '../types';
import { Calendar, Maximize2 } from 'lucide-react';

interface CardTodaySummaryProps {
  tasks: Task[];
  onExpand?: () => void;
}

export const CardTodaySummary: React.FC<CardTodaySummaryProps> = ({ tasks, onExpand }) => {
  const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED');
  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const totalTasksCount = tasks.length;

  const totalWorkloadMinutes = activeTasks.reduce((acc, t) => {
    return (
      acc +
      t.subtasks
        .filter((st) => !st.is_completed)
        .reduce((sum, st) => sum + (st.personalized_minutes || st.estimated_minutes || 30), 0)
    );
  }, 0);

  const hours = Math.floor(totalWorkloadMinutes / 60);
  const minutes = totalWorkloadMinutes % 60;
  const workloadFormatted = hours > 0 ? `${hours}j ${minutes}m` : `${minutes}m`;

  return (
    <div id="card-today-summary" className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-xl h-full relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white">Ringkasan Hari Ini</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-500/30">
            Workload Aktif
          </span>
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Perbesar / Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 my-2">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Total Tugas</div>
          <div className="text-lg font-extrabold text-white mt-0.5">{totalTasksCount}</div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Workload</div>
          <div className="text-base font-extrabold text-teal-300 mt-0.5">{workloadFormatted}</div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Selesai</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{completedTasksCount}</div>
        </div>
      </div>

      <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span>Sisa tugas belum selesai:</span>
        <strong className="text-white">{activeTasks.length} tugas</strong>
      </div>
    </div>
  );
};

import React from 'react';
import { Task, Subtask } from '../types';
import { Target, Play, Clock, CheckCircle2, AlertTriangle, Calendar, Maximize2 } from 'lucide-react';

interface CardFocusTaskProps {
  tasks: Task[];
  onStartInteractiveTimer: (task: Task, subtask: Subtask) => void;
  onExpand?: () => void;
}

export const CardFocusTask: React.FC<CardFocusTaskProps> = ({ tasks, onStartInteractiveTimer, onExpand }) => {
  const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED');
  
  const focusTask = activeTasks.find((t) => t.risk_status === 'CRITICAL') ||
                    activeTasks.find((t) => t.status === 'IN_PROGRESS') ||
                    activeTasks[0];

  if (!focusTask) {
    return (
      <div id="card-focus-task" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[220px] relative">
        {onExpand && (
          <button
            onClick={onExpand}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Perbesar / Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Semua Tugas Selesai!</h3>
        <p className="text-slate-400 text-sm mt-1">Tidak ada tugas aktif saat ini. Kerja bagus!</p>
      </div>
    );
  }

  const nextSubtask = focusTask.subtasks.find((st) => !st.is_completed) || focusTask.subtasks[0];
  const completedCount = focusTask.subtasks.filter((st) => st.is_completed).length;
  const totalSubtasks = focusTask.subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedCount / totalSubtasks) * 100) : 0;
  
  const remainingMinutes = focusTask.subtasks
    .filter((st) => !st.is_completed)
    .reduce((acc, st) => acc + (st.personalized_minutes || st.estimated_minutes || 30), 0);

  const deadlineDate = new Date(focusTask.deadline);
  const formattedDeadline = !isNaN(deadlineDate.getTime())
    ? deadlineDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : focusTask.deadline;

  return (
    <div id="card-focus-task" className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Top Header: Badge, Subject & Expand */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <Target className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
              Focus Task • Prioritas Utama
            </span>
            <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
              {focusTask.subject}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {focusTask.risk_status === 'CRITICAL' && (
              <span className="inline-flex items-center text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-400" />
                Kritis
              </span>
            )}
            {onExpand && (
              <button
                onClick={onExpand}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Perbesar / Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
          {focusTask.task_name}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 mb-4">
          {focusTask.description}
        </p>

        {nextSubtask && (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-wider text-teal-400 uppercase mb-0.5">
                Next Subtask saat ini
              </div>
              <div className="text-sm font-semibold text-white truncate">
                {nextSubtask.name}
              </div>
              <div className="text-xs text-slate-400 flex items-center space-x-2 mt-1">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-teal-400" />
                  {nextSubtask.personalized_minutes || nextSubtask.estimated_minutes || 30} menit
                </span>
                <span>•</span>
                <span className="truncate">{nextSubtask.completion_criteria}</span>
              </div>
            </div>

            <button
              onClick={() => onStartInteractiveTimer(focusTask, nextSubtask)}
              className="shrink-0 flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Kerjakan</span>
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <div className="flex items-center space-x-3">
            <span>Progress: <strong className="text-white font-semibold">{completedCount}/{totalSubtasks} Subtugas</strong></span>
            <span>•</span>
            <span>Estimasi Sisa: <strong className="text-teal-300 font-semibold">{remainingMinutes}m</strong></span>
          </div>
          <div className="flex items-center text-slate-400">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>Deadline: {formattedDeadline}</span>
          </div>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

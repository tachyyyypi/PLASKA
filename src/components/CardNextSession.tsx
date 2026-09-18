import React from 'react';
import { ScheduleBlock, Task, Subtask } from '../types';
import { Clock, Calendar, ArrowRight, Play, CheckCircle2, Maximize2 } from 'lucide-react';

interface CardNextSessionProps {
  scheduledBlocks: ScheduleBlock[];
  tasks: Task[];
  onStartInteractiveTimer: (task: Task, subtask: Subtask) => void;
  onExpand?: () => void;
}

export const CardNextSession: React.FC<CardNextSessionProps> = ({
  scheduledBlocks,
  tasks,
  onStartInteractiveTimer,
  onExpand,
}) => {
  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();

  const taskBlocks = scheduledBlocks.filter((b) => b.type === 'TASK' && !b.isCompleted);
  const nextBlock = taskBlocks.find((b) => b.endMinute > currentMinute) || taskBlocks[0];

  const matchedTask = nextBlock ? tasks.find((t) => t.id === nextBlock.taskId) : null;
  const matchedSubtask = matchedTask && nextBlock
    ? matchedTask.subtasks.find((st) => st.id === nextBlock.subtaskId) || matchedTask.subtasks[0]
    : null;

  return (
    <div id="card-next-session" className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-xl h-full relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white">Sesi Berikutnya ("Setelah ini ngapain?")</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-teal-300 bg-teal-500/15 px-2.5 py-0.5 rounded-full border border-teal-500/30">
            Timeline Otomatis
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

      {nextBlock && matchedTask && matchedSubtask ? (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 my-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                {nextBlock.startTimeFormatted} – {nextBlock.endTimeFormatted} ({nextBlock.durationMinutes}m)
              </span>
              <span className="text-xs text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded">
                {matchedTask.subject}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-white truncate">
              {matchedTask.task_name}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 truncate">
              Subtugas: <strong className="text-teal-300">{matchedSubtask.name}</strong>
            </p>
          </div>

          <button
            onClick={() => onStartInteractiveTimer(matchedTask, matchedSubtask)}
            className="shrink-0 flex items-center space-x-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Mulai Sesi</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 my-1 text-center">
          <p className="text-slate-400 text-sm">Tidak ada sesi tugas terjadwal berikutnya untuk hari ini.</p>
        </div>
      )}

      <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span>Alokasi waktu optimal berbasis AI</span>
        <span className="text-teal-400 font-medium">Plaska Engine</span>
      </div>
    </div>
  );
};

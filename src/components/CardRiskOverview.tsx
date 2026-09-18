import React, { useState } from 'react';
import { Task, RiskLevel } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, Maximize2 } from 'lucide-react';

interface CardRiskOverviewProps {
  tasks: Task[];
  onExpand?: () => void;
}

export const CardRiskOverview: React.FC<CardRiskOverviewProps> = ({ tasks, onExpand }) => {
  const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED');

  const safeTasks = activeTasks.filter((t) => t.risk_status === 'SAFE');
  const atRiskTasks = activeTasks.filter((t) => t.risk_status === 'AT_RISK');
  const criticalTasks = activeTasks.filter((t) => t.risk_status === 'CRITICAL' || t.risk_status === 'IMPOSSIBLE');

  const [hoveredCategory, setHoveredCategory] = useState<'safe' | 'atRisk' | 'critical' | null>(null);

  return (
    <div id="card-risk-overview" className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between shadow-xl h-full relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white">Risk Overview</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            Status Risiko
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

      <div className="grid grid-cols-3 gap-2 my-2 relative">
        {/* Safe */}
        <div
          onMouseEnter={() => setHoveredCategory('safe')}
          onMouseLeave={() => setHoveredCategory(null)}
          className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-center cursor-pointer transition-all hover:bg-emerald-900/40 relative"
        >
          <div className="text-[10px] font-semibold text-emerald-400 uppercase">Safe</div>
          <div className="text-lg font-extrabold text-emerald-300 mt-0.5">{safeTasks.length}</div>

          {hoveredCategory === 'safe' && (
            <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 w-56 bg-slate-950 border border-emerald-500/50 rounded-xl p-3 shadow-2xl z-50 text-left pointer-events-none">
              <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Daftar Tugas Aman (Safe):</div>
              {safeTasks.length === 0 ? (
                <div className="text-xs text-slate-400">Tidak ada tugas dalam kategori ini.</div>
              ) : (
                <ul className="space-y-1 text-xs text-slate-200">
                  {safeTasks.map((t) => (
                    <li key={t.id} className="truncate">
                      • <strong className="text-emerald-300">{t.subject}:</strong> {t.task_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* At Risk */}
        <div
          onMouseEnter={() => setHoveredCategory('atRisk')}
          onMouseLeave={() => setHoveredCategory(null)}
          className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-center cursor-pointer transition-all hover:bg-amber-900/40 relative"
        >
          <div className="text-[10px] font-semibold text-amber-400 uppercase">At Risk</div>
          <div className="text-lg font-extrabold text-amber-300 mt-0.5">{atRiskTasks.length}</div>

          {hoveredCategory === 'atRisk' && (
            <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 w-56 bg-slate-950 border border-amber-500/50 rounded-xl p-3 shadow-2xl z-50 text-left pointer-events-none">
              <div className="text-[10px] font-bold text-amber-400 uppercase mb-1">Daftar Tugas Berisiko (At Risk):</div>
              {atRiskTasks.length === 0 ? (
                <div className="text-xs text-slate-400">Tidak ada tugas dalam kategori ini.</div>
              ) : (
                <ul className="space-y-1 text-xs text-slate-200">
                  {atRiskTasks.map((t) => (
                    <li key={t.id} className="truncate">
                      • <strong className="text-amber-300">{t.subject}:</strong> {t.task_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Critical */}
        <div
          onMouseEnter={() => setHoveredCategory('critical')}
          onMouseLeave={() => setHoveredCategory(null)}
          className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3 text-center cursor-pointer transition-all hover:bg-rose-900/40 relative"
        >
          <div className="text-[10px] font-semibold text-rose-400 uppercase">Critical</div>
          <div className="text-lg font-extrabold text-rose-300 mt-0.5">{criticalTasks.length}</div>

          {hoveredCategory === 'critical' && (
            <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 w-56 bg-slate-950 border border-rose-500/50 rounded-xl p-3 shadow-2xl z-50 text-left pointer-events-none">
              <div className="text-[10px] font-bold text-rose-400 uppercase mb-1">Daftar Tugas Kritis (Critical):</div>
              {criticalTasks.length === 0 ? (
                <div className="text-xs text-slate-400">Tidak ada tugas dalam kategori ini.</div>
              ) : (
                <ul className="space-y-1 text-xs text-slate-200">
                  {criticalTasks.map((t) => (
                    <li key={t.id} className="truncate">
                      • <strong className="text-rose-300">{t.subject}:</strong> {t.task_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span>Indikator deadline & beban:</span>
        <strong className={criticalTasks.length > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
          {criticalTasks.length > 0 ? `${criticalTasks.length} tugas perlu perhatian` : 'Semua aman terkendali'}
        </strong>
      </div>
    </div>
  );
};


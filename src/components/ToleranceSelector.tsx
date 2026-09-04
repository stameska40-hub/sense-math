import React from 'react';
import { Sliders, ShieldCheck, Zap, Target } from 'lucide-react';

interface ToleranceSelectorProps {
  tolerance: number;
  onToleranceChange: (val: number) => void;
  compact?: boolean;
}

const PRESETS = [
  { label: 'Strict', value: 3, desc: 'Mastery (±3%)', icon: Target },
  { label: 'Accurate', value: 5, desc: 'Sharp (±5%)', icon: ShieldCheck },
  { label: 'QAMA Standard', value: 10, desc: 'Samson standard (±10%)', icon: Zap },
  { label: 'Relaxed', value: 20, desc: 'Casual (±20%)', icon: Sliders },
  { label: 'Novice', value: 30, desc: 'Beginner (±30%)', icon: Sliders },
];

export const ToleranceSelector: React.FC<ToleranceSelectorProps> = ({
  tolerance,
  onToleranceChange,
  compact = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Acceptance Tolerance
          </span>
        </div>
        <div className="flex items-baseline gap-1 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
          <span className="text-xs text-indigo-600 font-medium">±</span>
          <span className="text-sm font-bold text-indigo-700">{tolerance}%</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {PRESETS.map((p) => {
          const isSelected = tolerance === p.value;
          return (
            <button
              key={p.value}
              type="button"
              id={`preset-tolerance-${p.value}`}
              onClick={() => onToleranceChange(p.value)}
              className={`px-1.5 py-1.5 text-xs font-medium rounded-xl transition-all text-center flex flex-col items-center gap-0.5 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <span>{p.label.split(' ')[0]}</span>
              <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                ±{p.value}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Smooth slider */}
      {!compact && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Tight (1%)</span>
            <span>Custom: ±{tolerance}%</span>
            <span>Generous (50%)</span>
          </div>
          <input
            id="tolerance-slider"
            type="range"
            min="1"
            max="50"
            step="1"
            value={tolerance}
            onChange={(e) => onToleranceChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      )}
    </div>
  );
};

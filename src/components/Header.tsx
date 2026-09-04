import React from 'react';
import { AppMode } from '../types';
import { Volume2, VolumeX, History, HelpCircle, Calculator, Brain } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (m: AppMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenHowItWorks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  soundEnabled,
  onToggleSound,
  historyCount,
  onOpenHistory,
  onOpenHowItWorks,
}) => {
  return (
    <header className="space-y-4">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-slate-900 tracking-tight">SenseMath</h1>
          <p className="text-xs text-slate-500 font-normal">
            Estimate first. Calculate meaningfully.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* How it works info */}
          <button
            type="button"
            id="btn-how-it-works"
            onClick={onOpenHowItWorks}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white hover:border-slate-200 border border-transparent rounded-xl transition-all"
            title="How QAMA Works"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white hover:border-slate-200 border border-transparent rounded-xl transition-all"
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-slate-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* History button */}
          <button
            type="button"
            id="btn-open-history"
            onClick={onOpenHistory}
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-white hover:border-slate-200 border border-transparent rounded-xl transition-all"
            title="View History"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow-sm">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mode Navigation Bar */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/70 border border-slate-200/80 rounded-2xl">
        <button
          type="button"
          id="tab-mode-user-task"
          onClick={() => onModeChange('user-task')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
            mode === 'user-task'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className={`w-4 h-4 ${mode === 'user-task' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Mode 1: Enter Task</span>
        </button>

        <button
          type="button"
          id="tab-mode-simulator"
          onClick={() => onModeChange('simulator')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
            mode === 'simulator'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain className={`w-4 h-4 ${mode === 'simulator' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>Mode 2: Simulate Problem</span>
        </button>
      </div>
    </header>
  );
};

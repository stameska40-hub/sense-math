import React from 'react';
import { EstimationRecord } from '../types';
import { formatAnswer } from '../utils/mathEngine';
import { History, CheckCircle2, XCircle, Trash2, X } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: EstimationRecord[];
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const passedCount = records.filter((r) => r.isAccepted).length;
  const passRate = records.length > 0 ? Math.round((passedCount / records.length) * 100) : 0;
  const avgError =
    records.length > 0
      ? (records.reduce((acc, r) => acc + r.percentageError, 0) / records.length).toFixed(1)
      : '0';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-slate-800 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Estimation History</h3>
          </div>
          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats summary banner */}
        {records.length > 0 && (
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 shrink-0 text-center text-xs">
            <div>
              <div className="text-slate-400 text-[11px]">Recorded</div>
              <div className="font-bold text-slate-900 font-mono">{records.length}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Pass Rate</div>
              <div className="font-bold text-emerald-600 font-mono">{passRate}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Avg Error</div>
              <div className="font-bold text-indigo-600 font-mono">±{avgError}%</div>
            </div>
          </div>
        )}

        {/* List of records */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No calculations logged yet. Try an estimate!
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="font-mono font-semibold text-slate-900">
                    {rec.questionOrExpression}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Est: <strong className="text-slate-800 font-mono">{formatAnswer(rec.userEstimate)}</strong></span>
                    <span>•</span>
                    <span>Actual: <strong className="text-emerald-700 font-mono">{formatAnswer(rec.actualAnswer)}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {rec.isAccepted ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Pass
                      </span>
                    ) : (
                      <span className="text-rose-700 font-semibold flex items-center gap-0.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Miss
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {rec.percentageError}% error (±{rec.tolerancePercent}%)
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { EvaluationResult } from '../types';
import { formatAnswer } from '../utils/mathEngine';
import { CheckCircle2, XCircle, Target } from 'lucide-react';

interface ToleranceGaugeProps {
  evaluation: EvaluationResult;
}

export const ToleranceGauge: React.FC<ToleranceGaugeProps> = ({ evaluation }) => {
  const { actualAnswer, userEstimate, percentageError, isAccepted, minAllowed, maxAllowed, tolerancePercent } = evaluation;

  // Calculate position percentage on visual gauge
  // Let range span from actual * (1 - 2.5 * tol) to actual * (1 + 2.5 * tol)
  const spread = Math.abs(actualAnswer) * (tolerancePercent / 100) * 2.5 || 10;
  const viewMin = actualAnswer - spread;
  const viewMax = actualAnswer + spread;
  const totalSpan = viewMax - viewMin;

  const clamp = (val: number) => Math.min(Math.max((val - viewMin) / totalSpan, 0.02), 0.98) * 100;

  const exactPos = clamp(actualAnswer);
  const minPos = clamp(minAllowed);
  const maxPos = clamp(maxAllowed);
  const estimatePos = clamp(userEstimate);

  const diffSign = userEstimate >= actualAnswer ? '+' : '';
  const diffPctStr = `${diffSign}${((userEstimate - actualAnswer) / (actualAnswer || 1) * 100).toFixed(1)}%`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isAccepted ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Estimate Accepted!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-700 font-semibold text-sm">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Outside Allowed Tolerance</span>
            </div>
          )}
        </div>
        <div
          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
            isAccepted
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          Error: {diffPctStr} (Limit: ±{tolerancePercent}%)
        </div>
      </div>

      {/* Visual Number Line Gauge */}
      <div className="relative pt-6 pb-6 px-2">
        {/* Track */}
        <div className="h-2.5 w-full bg-slate-100 rounded-full relative overflow-hidden border border-slate-200/60">
          {/* Allowed green zone */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-100/90 border-x border-emerald-300"
            style={{
              left: `${Math.min(minPos, maxPos)}%`,
              width: `${Math.abs(maxPos - minPos)}%`,
            }}
          />
        </div>

        {/* Min allowed tick */}
        <div
          className="absolute top-1 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${minPos}%` }}
        >
          <div className="text-[10px] text-slate-400 font-mono">
            {formatAnswer(minAllowed)}
          </div>
          <div className="w-0.5 h-2 bg-slate-300 mt-0.5" />
        </div>

        {/* Max allowed tick */}
        <div
          className="absolute top-1 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${maxPos}%` }}
        >
          <div className="text-[10px] text-slate-400 font-mono">
            {formatAnswer(maxAllowed)}
          </div>
          <div className="w-0.5 h-2 bg-slate-300 mt-0.5" />
        </div>

        {/* Exact Target Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none"
          style={{ left: `${exactPos}%` }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 shadow-sm" />
        </div>

        {/* User Estimate Pin */}
        <div
          className="absolute bottom-0 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-500"
          style={{ left: `${estimatePos}%` }}
        >
          <div
            className={`px-2 py-0.5 rounded text-[11px] font-bold shadow-sm flex items-center gap-1 ${
              isAccepted
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                : 'bg-rose-600 text-white ring-2 ring-rose-200'
            }`}
          >
            <Target className="w-3 h-3" />
            <span>You: {formatAnswer(userEstimate)}</span>
          </div>
          <div
            className={`w-0.5 h-3 ${
              isAccepted ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
        </div>
      </div>

      {/* Numerical summary row */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
          <div className="text-slate-400 text-[11px]">Exact Result</div>
          <div className="text-slate-900 font-bold font-mono text-sm">
            {formatAnswer(actualAnswer)}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
          <div className="text-slate-400 text-[11px]">Your Estimate</div>
          <div className={`font-bold font-mono text-sm ${isAccepted ? 'text-emerald-700' : 'text-rose-600'}`}>
            {formatAnswer(userEstimate)}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
          <div className="text-slate-400 text-[11px]">Accuracy</div>
          <div className={`font-bold font-mono text-sm ${isAccepted ? 'text-indigo-700' : 'text-amber-700'}`}>
            {percentageError < 1 ? '🎯 99%+' : `${(100 - Math.min(percentageError, 100)).toFixed(1)}%`}
          </div>
        </div>
      </div>
    </div>
  );
};

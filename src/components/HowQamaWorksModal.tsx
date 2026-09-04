import React from 'react';
import { X, Lightbulb, Compass, Award, Target, CheckCircle2 } from 'lucide-react';

interface HowQamaWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowQamaWorksModal: React.FC<HowQamaWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 text-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">How QAMA Works</h3>
              <p className="text-xs text-slate-500">Quick Approximations, Meaningful Arithmetic</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Philosophy */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            Standard calculators give you the answer without thinking, creating “blind dependency” where people
            can type a typo (like <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">42.5 × 180 = 76500</code> instead of <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">7650</code>) without noticing
            that it makes zero sense.
          </p>
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-1.5">
            <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>The QAMA Rule</span>
            </div>
            <p className="text-indigo-900">
              QAMA requires you to enter a <strong>reasonable mental estimate</strong> before the calculator
              unlocks the exact answer. If your estimate is within the set <strong>Tolerance Level</strong>{' '}
              (e.g. ±10%), the calculator accepts it and reveals the true answer!
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Top 3 Mental Estimation Tricks:
            </div>
            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">1. Round to 1 Significant Digit:</strong>
                  <div className="text-slate-500 mt-0.5">
                    For <code>38.4 × 21.8</code>, think <code>40 × 20 = 800</code> (Exact is 837.12, only ~4.4% error!).
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">2. Friendly Multiples for Division:</strong>
                  <div className="text-slate-500 mt-0.5">
                    For <code>1350 ÷ 28</code>, round 28 to 30. Then <code>1350 ÷ 30 = 45</code>.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">3. Anchor Percentage Milestones:</strong>
                  <div className="text-slate-500 mt-0.5">
                    Need <code>35% of $180</code>? Find 10% ($18). 30% is $54, plus half of 10% ($9) = $63!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            Start Estimating
          </button>
        </div>
      </div>
    </div>
  );
};

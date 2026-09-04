import React from 'react';
import { Delete, CornerDownLeft, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface KeypadProps {
  onInput: (char: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onToggleSign: () => void;
  submitLabel?: string;
  isEstimateMode?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onClear,
  onBackspace,
  onSubmit,
  onToggleSign,
  submitLabel = '=',
  isEstimateMode = false,
}) => {
  const handlePress = (val: string) => {
    sounds.playKeypadClick();
    onInput(val);
  };

  const handleClear = () => {
    sounds.playKeypadClick();
    onClear();
  };

  const handleBackspace = () => {
    sounds.playKeypadClick();
    onBackspace();
  };

  const handleToggleSign = () => {
    sounds.playKeypadClick();
    onToggleSign();
  };

  const handleSubmit = () => {
    sounds.playKeypadClick();
    onSubmit();
  };

  return (
    <div className="grid grid-cols-4 gap-2 text-base select-none">
      {/* Function Row */}
      <button
        type="button"
        id="btn-clear"
        onClick={handleClear}
        className="h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold border border-rose-200/80 active:scale-95 transition-all shadow-2xs"
        title="Clear All (Escape)"
      >
        C
      </button>
      <button
        type="button"
        id="btn-sqrt"
        onClick={() => handlePress('√')}
        disabled={isEstimateMode}
        className={`h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 active:scale-95 transition-all ${
          isEstimateMode ? 'opacity-30 cursor-not-allowed' : ''
        }`}
        title="Square Root"
      >
        √
      </button>
      <button
        type="button"
        id="btn-power"
        onClick={() => handlePress('^')}
        disabled={isEstimateMode}
        className={`h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 active:scale-95 transition-all ${
          isEstimateMode ? 'opacity-30 cursor-not-allowed' : ''
        }`}
        title="Power / Exponent (^)"
      >
        xʸ
      </button>
      <button
        type="button"
        id="btn-backspace"
        onClick={handleBackspace}
        className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 active:scale-95 transition-all"
        title="Backspace"
      >
        <Delete className="w-5 h-5" />
      </button>

      {/* Row 2: 7, 8, 9, ÷ */}
      <button
        type="button"
        id="btn-num-7"
        onClick={() => handlePress('7')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        7
      </button>
      <button
        type="button"
        id="btn-num-8"
        onClick={() => handlePress('8')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        8
      </button>
      <button
        type="button"
        id="btn-num-9"
        onClick={() => handlePress('9')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        9
      </button>
      <button
        type="button"
        id="btn-divide"
        onClick={() => handlePress(' ÷ ')}
        disabled={isEstimateMode}
        className={`h-12 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xl border border-indigo-100 active:scale-95 transition-all ${
          isEstimateMode ? 'opacity-30 cursor-not-allowed' : ''
        }`}
      >
        ÷
      </button>

      {/* Row 3: 4, 5, 6, × */}
      <button
        type="button"
        id="btn-num-4"
        onClick={() => handlePress('4')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        4
      </button>
      <button
        type="button"
        id="btn-num-5"
        onClick={() => handlePress('5')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        5
      </button>
      <button
        type="button"
        id="btn-num-6"
        onClick={() => handlePress('6')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        6
      </button>
      <button
        type="button"
        id="btn-multiply"
        onClick={() => handlePress(' × ')}
        disabled={isEstimateMode}
        className={`h-12 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xl border border-indigo-100 active:scale-95 transition-all ${
          isEstimateMode ? 'opacity-30 cursor-not-allowed' : ''
        }`}
      >
        ×
      </button>

      {/* Row 4: 1, 2, 3, − */}
      <button
        type="button"
        id="btn-num-1"
        onClick={() => handlePress('1')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        1
      </button>
      <button
        type="button"
        id="btn-num-2"
        onClick={() => handlePress('2')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        2
      </button>
      <button
        type="button"
        id="btn-num-3"
        onClick={() => handlePress('3')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        3
      </button>
      <button
        type="button"
        id="btn-subtract"
        onClick={() => handlePress(' - ')}
        disabled={isEstimateMode}
        className={`h-12 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xl border border-indigo-100 active:scale-95 transition-all ${
          isEstimateMode ? 'opacity-30 cursor-not-allowed' : ''
        }`}
      >
        −
      </button>

      {/* Row 5: ±, 0, ., + */}
      <button
        type="button"
        id="btn-toggle-sign"
        onClick={handleToggleSign}
        className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 active:scale-95 transition-all"
        title="Toggle Positive / Negative"
      >
        ±
      </button>
      <button
        type="button"
        id="btn-num-0"
        onClick={() => handlePress('0')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        0
      </button>
      <button
        type="button"
        id="btn-decimal"
        onClick={() => handlePress('.')}
        className="h-12 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-lg border border-slate-200 active:scale-95 transition-all shadow-2xs"
      >
        .
      </button>
      <button
        type="button"
        id="btn-add"
        onClick={() => handlePress(' + ')}
        disabled={isEstimateMode}
        className={`h-12 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xl border border-indigo-100 active:scale-95 transition-all ${
          isEstimateMode ? 'opacity-30 cursor-not-allowed' : ''
        }`}
      >
        +
      </button>

      {/* Row 6: Parentheses / Percent / Primary Action */}
      {!isEstimateMode && (
        <>
          <button
            type="button"
            id="btn-paren-open"
            onClick={() => handlePress('(')}
            className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 active:scale-95 transition-all"
          >
            (
          </button>
          <button
            type="button"
            id="btn-paren-close"
            onClick={() => handlePress(')')}
            className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 active:scale-95 transition-all"
          >
            )
          </button>
        </>
      )}

      {/* Primary Action Button */}
      <button
        type="button"
        id="btn-submit-action"
        onClick={handleSubmit}
        className={`${
          isEstimateMode ? 'col-span-4 h-12' : 'col-span-2 h-12'
        } rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${
          isEstimateMode
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 text-base'
            : 'bg-slate-900 hover:bg-black text-white text-lg'
        }`}
      >
        {isEstimateMode ? (
          <>
            <CornerDownLeft className="w-5 h-5" />
            <span>Check Estimate</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="font-mono text-xl">{submitLabel}</span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
              (Estimate)
            </span>
          </>
        )}
      </button>
    </div>
  );
};

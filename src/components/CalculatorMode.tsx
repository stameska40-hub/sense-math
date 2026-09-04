import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { EvaluationResult, EstimationRecord } from '../types';
import { evaluateMathExpression, checkEstimate, formatAnswer } from '../utils/mathEngine';
import { sounds } from '../utils/soundEffects';
import { Keypad } from './Keypad';
import { ToleranceGauge } from './ToleranceGauge';
import { ToleranceSelector } from './ToleranceSelector';
import {
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Unlock,
  AlertCircle,
  ChevronLeft,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface CalculatorModeProps {
  tolerance: number;
  onToleranceChange: (val: number) => void;
  onRecordResult: (record: EstimationRecord) => void;
}

export const CalculatorMode: React.FC<CalculatorModeProps> = ({
  tolerance,
  onToleranceChange,
  onRecordResult,
}) => {
  const [expression, setExpression] = useState<string>('38.5 × 24.2');
  const [stage, setStage] = useState<'entering' | 'estimating' | 'evaluated'>('entering');
  const [actualAnswer, setActualAnswer] = useState<number | null>(null);
  const [estimateInput, setEstimateInput] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const estimateInputRef = useRef<HTMLInputElement>(null);

  // Trigger focus when entering estimate stage
  useEffect(() => {
    if (stage === 'estimating') {
      setTimeout(() => estimateInputRef.current?.focus(), 100);
    }
  }, [stage]);

  // Handle keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in generic form inputs outside
      if (e.target instanceof HTMLInputElement && e.target !== estimateInputRef.current) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (stage === 'entering') {
          handleRequestEstimate();
        } else if (stage === 'estimating') {
          handleCheckEstimate();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        handleClearAll();
        return;
      }

      // If in estimating stage, let the estimate input handle typing
      if (stage === 'estimating') return;

      // In entering stage:
      if (/^[0-9]$/.test(e.key)) {
        handleAppend(e.key);
      } else if (e.key === '+') {
        handleAppend(' + ');
      } else if (e.key === '-') {
        handleAppend(' - ');
      } else if (e.key === '*') {
        handleAppend(' × ');
      } else if (e.key === '/') {
        handleAppend(' ÷ ');
      } else if (e.key === '^') {
        handleAppend('^');
      } else if (e.key === '(' || e.key === ')') {
        handleAppend(e.key);
      } else if (e.key === '.') {
        handleAppend('.');
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, expression, estimateInput, tolerance]);

  const handleAppend = (token: string) => {
    setErrorMessage(null);
    setExpression((prev) => (prev === '0' && token !== '.' ? token : prev + token));
  };

  const handleBackspace = () => {
    setErrorMessage(null);
    setExpression((prev) => {
      if (prev.endsWith(' + ') || prev.endsWith(' - ') || prev.endsWith(' × ') || prev.endsWith(' ÷ ')) {
        return prev.slice(0, -3);
      }
      return prev.slice(0, -1) || '0';
    });
  };

  const handleClearAll = () => {
    setExpression('');
    setStage('entering');
    setActualAnswer(null);
    setEstimateInput('');
    setEvaluation(null);
    setErrorMessage(null);
    setShowHint(false);
    setAttempts(0);
  };

  const handleToggleSign = () => {
    if (stage === 'estimating') {
      setEstimateInput((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    } else {
      setExpression((prev) => {
        if (!prev) return '-';
        if (prev.startsWith('-')) return prev.slice(1);
        return '-' + prev;
      });
    }
  };

  // User hits "=" -> compute hidden answer and prompt for estimate
  const handleRequestEstimate = () => {
    if (!expression.trim()) {
      setErrorMessage('Please enter an expression first');
      return;
    }

    const res = evaluateMathExpression(expression);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid mathematical syntax');
      sounds.playFail();
      return;
    }

    setActualAnswer(res.result);
    setStage('estimating');
    setEstimateInput('');
    setErrorMessage(null);
    setAttempts(1);
  };

  // User submits their estimate
  const handleCheckEstimate = () => {
    if (actualAnswer === null) return;
    const estNum = parseFloat(estimateInput);

    if (isNaN(estNum)) {
      setErrorMessage('Please enter a valid numeric estimate');
      sounds.playFail();
      return;
    }

    const evalResult = checkEstimate(actualAnswer, estNum, tolerance, expression);
    setEvaluation(evalResult);
    setStage('evaluated');

    if (evalResult.isAccepted) {
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      sounds.playFail();
    }

    onRecordResult({
      id: 'rec_' + Date.now(),
      timestamp: Date.now(),
      mode: 'user-task',
      questionOrExpression: expression,
      actualAnswer,
      userEstimate: estNum,
      percentageError: evalResult.percentageError,
      isAccepted: evalResult.isAccepted,
      tolerancePercent: tolerance,
      attemptsCount: attempts,
    });
  };

  const handleTryEstimateAgain = () => {
    setAttempts((prev) => prev + 1);
    setStage('estimating');
    setEvaluation(null);
    setErrorMessage(null);
    setEstimateInput('');
  };

  const handleRevealAnswerAnyway = () => {
    if (actualAnswer === null || !evaluation) return;
    // Keep evaluation but show answer
    setStage('evaluated');
  };

  const handleUseAnswer = () => {
    if (actualAnswer !== null) {
      setExpression(formatAnswer(actualAnswer));
      setStage('entering');
      setActualAnswer(null);
      setEvaluation(null);
      setEstimateInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Formula & Screen Area */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        {/* Top Status Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                stage === 'entering'
                  ? 'bg-indigo-600 animate-pulse'
                  : stage === 'estimating'
                  ? 'bg-amber-500 animate-ping'
                  : evaluation?.isAccepted
                  ? 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider text-slate-700 text-[11px]">
              {stage === 'entering' && '1. Enter Task / Formula'}
              {stage === 'estimating' && '2. QAMA Estimation Prompt'}
              {stage === 'evaluated' && (evaluation?.isAccepted ? 'Answer Unlocked' : 'Estimation Missed')}
            </span>
          </div>

          <div className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200/80 font-medium">
            Tolerance: ±{tolerance}%
          </div>
        </div>

        {/* The Expression Screen */}
        <div className="min-h-[76px] flex flex-col justify-end text-right">
          <div className="font-mono text-2xl sm:text-3xl text-slate-900 font-semibold tracking-tight break-all">
            {expression || <span className="text-slate-300">0</span>}
          </div>

          {/* Actual Answer reveal or locked state */}
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              {stage === 'entering' && 'Press = or Estimate when ready'}
              {stage === 'estimating' && (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Exact answer locked until estimate is given
                </span>
              )}
              {stage === 'evaluated' && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  Exact Solution
                </span>
              )}
            </div>

            <div className="font-mono text-xl sm:text-2xl font-bold">
              {stage === 'evaluated' && actualAnswer !== null ? (
                <span className="text-emerald-600">{formatAnswer(actualAnswer)}</span>
              ) : stage === 'estimating' ? (
                <span className="text-amber-800 font-sans text-xs tracking-wide bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium animate-pulse">
                  🔒 Estimate Required
                </span>
              ) : (
                <span className="text-slate-300 text-base">?</span>
              )}
            </div>
          </div>
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* STAGE 2: ESTIMATION PROMPT (The Heart of QAMA) */}
      {stage === 'estimating' && (
        <div className="bg-white border-2 border-indigo-500/80 rounded-2xl p-5 shadow-lg shadow-indigo-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">What is your estimate?</h3>
                <p className="text-xs text-slate-500">
                  Approximate mentally within <span className="text-indigo-600 font-semibold">±{tolerance}%</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-edit-formula"
              onClick={() => setStage('entering')}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Edit task</span>
            </button>
          </div>

          {/* Big Estimate Input */}
          <div className="relative">
            <input
              ref={estimateInputRef}
              id="input-user-estimate"
              type="number"
              step="any"
              value={estimateInput}
              onChange={(e) => {
                setErrorMessage(null);
                setEstimateInput(e.target.value);
              }}
              placeholder="e.g. 800"
              className="w-full bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 focus:bg-white rounded-xl py-3 px-4 text-2xl font-mono text-center font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
              Press Enter
            </div>
          </div>

          {/* Mental Estimation Hint accordion */}
          {actualAnswer !== null && (
            <div>
              <button
                type="button"
                id="btn-toggle-hint"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5 py-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide estimation tip' : 'Need help estimating? Show mental math clue'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed">
                  {evaluateMathExpression(expression).result
                    ? checkEstimate(actualAnswer, 0, tolerance, expression).estimationTip
                    : 'Round terms to 1 significant digit, then multiply or divide.'}
                </div>
              )}
            </div>
          )}

          {/* Quick Submit Button */}
          <button
            type="button"
            id="btn-submit-estimate"
            onClick={handleCheckEstimate}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-xl shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Check Estimate (±{tolerance}%)</span>
          </button>
        </div>
      )}

      {/* STAGE 3: EVALUATION & GAUGE (When answer is tested) */}
      {stage === 'evaluated' && evaluation && (
        <div className="space-y-4">
          <ToleranceGauge evaluation={evaluation} />

          {/* Strategy Tip / Explanation */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
              <Lightbulb className="w-4 h-4" />
              <span>QAMA Estimation Insight</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{evaluation.estimationTip}</p>
          </div>

          {/* Evaluated Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {evaluation.isAccepted ? (
              <>
                <button
                  type="button"
                  id="btn-new-calc"
                  onClick={handleClearAll}
                  className="flex-1 h-11 bg-slate-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Next Calculation</span>
                </button>
                <button
                  type="button"
                  id="btn-use-answer"
                  onClick={handleUseAnswer}
                  className="px-4 h-11 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <span>Continue with Ans</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  id="btn-try-again"
                  onClick={handleTryEstimateAgain}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Estimating Again</span>
                </button>
                <button
                  type="button"
                  id="btn-reveal-anyway"
                  onClick={handleClearAll}
                  className="px-4 h-11 bg-white hover:bg-slate-50 text-slate-600 font-medium text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs transition-all"
                >
                  <span>New Problem</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Standard Interactive Keypad (Active during entering or fast numeric estimate) */}
      <div className="pt-2">
        <Keypad
          onInput={(val) => {
            if (stage === 'estimating') {
              // Only digits and decimals in estimating stage
              if (/[0-9.]/.test(val.trim())) {
                setEstimateInput((prev) => prev + val.trim());
              }
            } else {
              handleAppend(val);
            }
          }}
          onClear={handleClearAll}
          onBackspace={() => {
            if (stage === 'estimating') {
              setEstimateInput((prev) => prev.slice(0, -1));
            } else {
              handleBackspace();
            }
          }}
          onToggleSign={handleToggleSign}
          onSubmit={() => {
            if (stage === 'entering') {
              handleRequestEstimate();
            } else if (stage === 'estimating') {
              handleCheckEstimate();
            } else {
              handleClearAll();
            }
          }}
          isEstimateMode={stage === 'estimating'}
          submitLabel={stage === 'evaluated' ? 'Next' : '='}
        />
      </div>

      {/* Tolerance Config Drawer / Box */}
      <ToleranceSelector tolerance={tolerance} onToleranceChange={onToleranceChange} />
    </div>
  );
};

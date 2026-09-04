import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { DifficultyLevel, ProblemCategory, SimulatedProblem, EvaluationResult, EstimationRecord } from '../types';
import { generateProblem } from '../utils/problemGenerator';
import { checkEstimate, formatAnswer } from '../utils/mathEngine';
import { sounds } from '../utils/soundEffects';
import { ToleranceGauge } from './ToleranceGauge';
import { ToleranceSelector } from './ToleranceSelector';
import {
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface SimulatorModeProps {
  tolerance: number;
  onToleranceChange: (val: number) => void;
  onRecordResult: (record: EstimationRecord) => void;
}

const CATEGORIES: { id: ProblemCategory; label: string }[] = [
  { id: 'all', label: 'All Mixed' },
  { id: 'arithmetic', label: 'Arithmetic (× / ÷)' },
  { id: 'percentages', label: 'Percentages & Tips' },
  { id: 'roots-powers', label: 'Roots & Powers' },
  { id: 'applied', label: 'Real-world / Applied' },
];

const DIFFICULTIES: { id: DifficultyLevel; label: string }[] = [
  { id: 'easy', label: 'Apprentice' },
  { id: 'medium', label: 'Practitioner' },
  { id: 'hard', label: 'Master' },
];

export const SimulatorMode: React.FC<SimulatorModeProps> = ({
  tolerance,
  onToleranceChange,
  onRecordResult,
}) => {
  const [category, setCategory] = useState<ProblemCategory>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [problem, setProblem] = useState<SimulatedProblem>(() =>
    generateProblem('all', 'medium')
  );
  const [estimateInput, setEstimateInput] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalAttempted, setTotalAttempted] = useState<number>(0);
  const [totalPassed, setTotalPassed] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [problem]);

  const loadNewProblem = (cat = category, diff = difficulty) => {
    const newProb = generateProblem(cat, diff);
    setProblem(newProb);
    setEstimateInput('');
    setEvaluation(null);
    setShowHint(false);
    setErrorMessage(null);
  };

  const handleCategoryChange = (cat: ProblemCategory) => {
    setCategory(cat);
    loadNewProblem(cat, difficulty);
  };

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    loadNewProblem(category, diff);
  };

  const handleSubmitEstimate = () => {
    const estNum = parseFloat(estimateInput);
    if (isNaN(estNum)) {
      setErrorMessage('Please enter a valid numeric estimate');
      sounds.playFail();
      return;
    }

    const evalResult = checkEstimate(problem.actualAnswer, estNum, tolerance, problem.expression);
    setEvaluation(evalResult);
    setTotalAttempted((prev) => prev + 1);

    if (evalResult.isAccepted) {
      sounds.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setTotalPassed((prev) => prev + 1);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      sounds.playFail();
      setStreak(0);
    }

    onRecordResult({
      id: 'sim_' + Date.now(),
      timestamp: Date.now(),
      mode: 'simulator',
      questionOrExpression: problem.question,
      actualAnswer: problem.actualAnswer,
      userEstimate: estNum,
      percentageError: evalResult.percentageError,
      isAccepted: evalResult.isAccepted,
      tolerancePercent: tolerance,
      attemptsCount: 1,
    });
  };

  return (
    <div className="space-y-4">
      {/* Category and Difficulty Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              id={`cat-${c.id}`}
              onClick={() => handleCategoryChange(c.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                category === c.id
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                type="button"
                id={`diff-${d.id}`}
                onClick={() => handleDifficultyChange(d.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  difficulty === d.id
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Quick Streak & Stats */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-amber-800 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{streak} Streak</span>
            </div>
            {bestStreak > 0 && (
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl text-slate-600 border border-slate-200 shadow-2xs">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>Best: {bestStreak}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Problem Challenge Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-indigo-600 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Simulation Problem
          </span>
          <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
            Tolerance: ±{tolerance}%
          </span>
        </div>

        {/* The Question Prompt */}
        <div className="py-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight leading-snug">
            {problem.question}
          </h2>
        </div>

        {/* If evaluated: show the reveal and gauge */}
        {evaluation ? (
          <div className="space-y-4 pt-2">
            <ToleranceGauge evaluation={evaluation} />

            {/* Step-by-step mental clue breakdown */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                <Lightbulb className="w-4 h-4" />
                <span>Mental Estimation Technique</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{problem.suggestedTip}</p>
            </div>

            {/* Next Problem CTA */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-next-sim-problem"
                onClick={() => loadNewProblem()}
                className="flex-1 h-12 bg-slate-900 hover:bg-black text-white font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Next Problem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="btn-retry-same-prob"
                onClick={() => {
                  setEvaluation(null);
                  setEstimateInput('');
                }}
                className="px-4 h-12 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        ) : (
          /* Estimate Input Form */
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="sim-estimate-input" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Enter Your Estimate:</span>
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="sim-estimate-input"
                  type="number"
                  step="any"
                  value={estimateInput}
                  onChange={(e) => {
                    setErrorMessage(null);
                    setEstimateInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmitEstimate();
                    }
                  }}
                  placeholder="e.g. 750"
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl py-3 px-4 text-2xl font-mono text-center font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {errorMessage}
              </div>
            )}

            {/* Mental tip toggle */}
            <div>
              <button
                type="button"
                id="btn-sim-hint"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide estimation hint' : 'Stuck? Reveal mental rounding hint'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed">
                  {problem.suggestedTip}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-sim-submit"
                onClick={handleSubmitEstimate}
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base rounded-xl shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Submit Estimate (±{tolerance}%)</span>
              </button>
              <button
                type="button"
                id="btn-skip-prob"
                onClick={() => loadNewProblem()}
                className="px-4 h-12 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-xl border border-slate-200 shadow-2xs"
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Performance Card */}
      {totalAttempted > 0 && (
        <div className="grid grid-cols-3 gap-2 bg-white border border-slate-200 rounded-2xl p-3 text-center text-xs shadow-2xs">
          <div>
            <div className="text-slate-400 text-[11px]">Total Solved</div>
            <div className="text-slate-900 font-bold font-mono text-sm">{totalAttempted}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Accepted</div>
            <div className="text-emerald-600 font-bold font-mono text-sm">{totalPassed}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Pass Rate</div>
            <div className="text-indigo-600 font-bold font-mono text-sm">
              {Math.round((totalPassed / totalAttempted) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Tolerance Selector */}
      <ToleranceSelector tolerance={tolerance} onToleranceChange={onToleranceChange} />
    </div>
  );
};

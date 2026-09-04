export type AppMode = 'user-task' | 'simulator';

export type CalculatorStatus = 'entering-task' | 'awaiting-estimate' | 'result-revealed' | 'estimate-failed';

export interface EvaluationResult {
  actualAnswer: number;
  userEstimate: number;
  difference: number;
  percentageError: number;
  isAccepted: boolean;
  minAllowed: number;
  maxAllowed: number;
  tolerancePercent: number;
  estimationTip: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'fermi';

export type ProblemCategory = 'all' | 'arithmetic' | 'percentages' | 'roots-powers' | 'applied';

export interface SimulatedProblem {
  id: string;
  category: ProblemCategory;
  difficulty: DifficultyLevel;
  question: string;
  expression: string;
  actualAnswer: number;
  context?: string;
  suggestedTip: string;
}

export interface EstimationRecord {
  id: string;
  timestamp: number;
  mode: AppMode;
  questionOrExpression: string;
  actualAnswer: number;
  userEstimate: number;
  percentageError: number;
  isAccepted: boolean;
  tolerancePercent: number;
  attemptsCount: number;
}

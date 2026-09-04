import { DifficultyLevel, ProblemCategory, SimulatedProblem } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

/**
 * Procedurally generates an estimation problem based on category and difficulty.
 */
export function generateProblem(
  category: ProblemCategory = 'all',
  difficulty: DifficultyLevel = 'medium'
): SimulatedProblem {
  const availableCategories: ('arithmetic' | 'percentages' | 'roots-powers' | 'applied')[] =
    category === 'all'
      ? ['arithmetic', 'percentages', 'roots-powers', 'applied']
      : [category as any];

  const chosenCat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  const id = 'prob_' + Math.random().toString(36).substring(2, 9);

  if (chosenCat === 'arithmetic') {
    if (difficulty === 'easy') {
      const op = Math.random() > 0.5 ? '×' : '÷';
      if (op === '×') {
        const a = randomInt(12, 49);
        const b = randomInt(4, 9);
        return {
          id,
          category: 'arithmetic',
          difficulty,
          question: `Calculate: ${a} × ${b}`,
          expression: `${a} * ${b}`,
          actualAnswer: a * b,
          suggestedTip: `Round ${a} to ${Math.round(a / 10) * 10}, then multiply by ${b}.`,
        };
      } else {
        const divisor = randomInt(4, 9);
        const quotient = randomInt(15, 45);
        const dividend = divisor * quotient + randomInt(0, divisor - 1);
        return {
          id,
          category: 'arithmetic',
          difficulty,
          question: `Calculate: ${dividend} ÷ ${divisor}`,
          expression: `${dividend} / ${divisor}`,
          actualAnswer: Number((dividend / divisor).toFixed(2)),
          suggestedTip: `Find the closest multiple of ${divisor} near ${dividend} (${divisor * quotient}).`,
        };
      }
    } else if (difficulty === 'medium') {
      const op = Math.random() > 0.4 ? '×' : '÷';
      if (op === '×') {
        const a = randomFloat(18.2, 89.5, 1);
        const b = randomFloat(12.1, 48.6, 1);
        const ans = Number((a * b).toFixed(2));
        return {
          id,
          category: 'arithmetic',
          difficulty,
          question: `Estimate: ${a} × ${b}`,
          expression: `${a} * ${b}`,
          actualAnswer: ans,
          suggestedTip: `Round ${a} to ${Math.round(a / 10) * 10} and ${b} to ${Math.round(b / 10) * 10}.`,
        };
      } else {
        const a = randomInt(450, 2400);
        const b = randomInt(14, 48);
        const ans = Number((a / b).toFixed(2));
        return {
          id,
          category: 'arithmetic',
          difficulty,
          question: `Estimate: ${a} ÷ ${b}`,
          expression: `${a} / ${b}`,
          actualAnswer: ans,
          suggestedTip: `Round ${b} to ${Math.round(b / 10) * 10}. ${a} ÷ ${Math.round(b / 10) * 10} gives an immediate baseline.`,
        };
      }
    } else {
      // Hard / Fermi arithmetic
      const a = randomFloat(140, 890, 1);
      const b = randomFloat(24, 78, 1);
      const c = randomFloat(10, 50, 1);
      const ans = Number((a * b + c).toFixed(1));
      return {
        id,
        category: 'arithmetic',
        difficulty,
        question: `Estimate: (${a} × ${b}) + ${c}`,
        expression: `(${a} * ${b}) + ${c}`,
        actualAnswer: ans,
        suggestedTip: `Compute order of magnitude: ${Math.round(a / 100) * 100} × ${Math.round(b / 10) * 10}.`,
      };
    }
  }

  if (chosenCat === 'percentages') {
    if (difficulty === 'easy') {
      const pct = [10, 15, 20, 25, 50][randomInt(0, 4)];
      const base = randomInt(40, 320);
      const ans = Number(((pct / 100) * base).toFixed(2));
      return {
        id,
        category: 'percentages',
        difficulty,
        question: `What is ${pct}% of ${base}?`,
        expression: `${pct}% of ${base}`,
        actualAnswer: ans,
        suggestedTip: `${pct}% is easy to find via ${pct === 10 ? '1/10' : pct === 20 ? '1/5 or 2×10%' : pct === 50 ? 'half' : pct === 25 ? 'quarter' : '10% + half of 10%'}.`,
      };
    } else if (difficulty === 'medium') {
      const pct = randomInt(18, 42);
      const base = randomFloat(85, 480, 1);
      const ans = Number(((pct / 100) * base).toFixed(2));
      return {
        id,
        category: 'percentages',
        difficulty,
        question: `Calculate ${pct}% of $${base}`,
        expression: `${pct}% * ${base}`,
        actualAnswer: ans,
        suggestedTip: `Round ${pct}% to ${Math.round(pct / 5) * 5}% and base to ${Math.round(base / 10) * 10}.`,
      };
    } else {
      const pct = randomFloat(6.5, 14.5, 1);
      const base = randomFloat(1200, 8500, 0);
      const ans = Number(((pct / 100) * base).toFixed(2));
      return {
        id,
        category: 'percentages',
        difficulty,
        question: `Calculate a ${pct}% annual return or tax on $${base.toLocaleString()}`,
        expression: `(${pct} / 100) * ${base}`,
        actualAnswer: ans,
        suggestedTip: `Find 10% ($${Math.round(base * 0.1)}), then scale up or down proportionally.`,
      };
    }
  }

  if (chosenCat === 'roots-powers') {
    if (difficulty === 'easy') {
      const base = randomInt(11, 25);
      const ans = base * base;
      return {
        id,
        category: 'roots-powers',
        difficulty,
        question: `Estimate: ${base}² (squared)`,
        expression: `${base}^2`,
        actualAnswer: ans,
        suggestedTip: `Nearby benchmarks: 10² = 100, 15² = 225, 20² = 400, 25² = 625.`,
      };
    } else if (difficulty === 'medium') {
      // Square root of non-perfect square
      const trueRoot = randomFloat(12.5, 34.5, 1);
      const square = Number((trueRoot * trueRoot).toFixed(1));
      return {
        id,
        category: 'roots-powers',
        difficulty,
        question: `Estimate: √${square} (square root)`,
        expression: `sqrt(${square})`,
        actualAnswer: Number(trueRoot.toFixed(2)),
        suggestedTip: `Find which perfect squares bound ${Math.round(square)} (e.g. between 20²=400 and 30²=900).`,
      };
    } else {
      // Powers
      const base = randomInt(2, 6);
      const exp = base === 2 ? randomInt(7, 12) : base === 3 ? randomInt(4, 7) : randomInt(3, 5);
      const ans = Math.pow(base, exp);
      return {
        id,
        category: 'roots-powers',
        difficulty,
        question: `Calculate: ${base}^${exp} (${base} to the power of ${exp})`,
        expression: `${base}^${exp}`,
        actualAnswer: ans,
        suggestedTip: `Double or multiply in manageable milestones. E.g., 2^5 = 32, 2^10 = 1024.`,
      };
    }
  }

  // Applied / Fermi estimation
  const scenarios = [
    {
      q: (d: number, s: number) => `Driving ${d} miles at an average speed of ${s} mph. How many hours will it take?`,
      math: (d: number, s: number) => Number((d / s).toFixed(2)),
      tip: 'Divide total distance by rounded speed.',
      gen: () => {
        const d = randomInt(220, 780);
        const s = randomInt(55, 72);
        return { question: `Driving ${d} miles at ${s} mph. About how many hours?`, actual: Number((d / s).toFixed(2)), expr: `${d} / ${s}` };
      },
    },
    {
      q: (items: number, price: number) => `Purchasing ${items} items priced at $${price} each. Total cost?`,
      math: (i: number, p: number) => Number((i * p).toFixed(2)),
      tip: 'Round price to nearest whole dollar or 5, then multiply.',
      gen: () => {
        const items = randomInt(14, 45);
        const price = randomFloat(17.5, 39.9, 2);
        return { question: `Purchasing ${items} items at $${price} each. Total cost?`, actual: Number((items * price).toFixed(2)), expr: `${items} * ${price}` };
      },
    },
    {
      q: (l: number, w: number) => `A rectangular lawn measures ${l} ft by ${w} ft. What is its area in sq ft?`,
      math: (l: number, w: number) => l * w,
      tip: 'Round length and width to nearest tens.',
      gen: () => {
        const l = randomInt(32, 88);
        const w = randomInt(18, 54);
        return { question: `A room/lawn is ${l} ft by ${w} ft. What is the area (sq ft)?`, actual: l * w, expr: `${l} * ${w}` };
      },
    },
    {
      q: (daily: number, days: number) => `Saving $${daily} per day over ${days} days. Total savings?`,
      math: (d: number, n: number) => Number((d * n).toFixed(2)),
      tip: 'Multiply daily rate by days.',
      gen: () => {
        const daily = randomFloat(12.5, 34.5, 2);
        const days = [30, 90, 180, 365][randomInt(0, 3)];
        return { question: `Saving $${daily}/day for ${days} days. Total accumulated?`, actual: Number((daily * days).toFixed(2)), expr: `${daily} * ${days}` };
      },
    },
  ];

  const scenario = scenarios[randomInt(0, scenarios.length - 1)].gen();
  return {
    id,
    category: 'applied',
    difficulty,
    question: scenario.question,
    expression: scenario.expr,
    actualAnswer: scenario.actual,
    suggestedTip: `Round the numbers to 1 significant figure first.`,
  };
}

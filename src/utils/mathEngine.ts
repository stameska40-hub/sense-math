import { EvaluationResult } from '../types';

/**
 * Clean and standardize math expression string for display and computation.
 */
export function sanitizeExpression(input: string): string {
  return input
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/√\s*(\d+(?:\.\d+)?)/g, 'sqrt($1)')
    .trim();
}

/**
 * Safe Recursive Descent Math Evaluator.
 * Supports: +, -, *, /, ^, %, parentheses, sqrt, unary minus, decimals.
 */
export function evaluateMathExpression(expr: string): { success: boolean; result: number; error?: string } {
  try {
    const sanitized = sanitizeExpression(expr);
    if (!sanitized) {
      return { success: false, result: 0, error: 'Empty expression' };
    }

    // Tokenize
    const tokens: string[] = [];
    let i = 0;
    while (i < sanitized.length) {
      const char = sanitized[i];
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if (char === 's' && sanitized.startsWith('sqrt', i)) {
        tokens.push('sqrt');
        i += 4;
        continue;
      }

      if (/[0-9.]/.test(char)) {
        let numStr = '';
        while (i < sanitized.length && /[0-9.]/.test(sanitized[i])) {
          numStr += sanitized[i];
          i++;
        }
        tokens.push(numStr);
        continue;
      }

      if ('+-*/^()%'.includes(char)) {
        tokens.push(char);
        i++;
        continue;
      }

      return { success: false, result: 0, error: `Unexpected character '${char}'` };
    }

    let tokenIndex = 0;

    function peek(): string | undefined {
      return tokens[tokenIndex];
    }

    function consume(expected?: string): string {
      const current = tokens[tokenIndex++];
      if (expected && current !== expected) {
        throw new Error(`Expected '${expected}' but got '${current}'`);
      }
      return current;
    }

    // Grammar:
    // Expression -> Term (( '+' | '-' ) Term)*
    // Term       -> Power (( '*' | '/' | '%' ) Power)*
    // Power      -> Factor ( '^' Power )?
    // Factor     -> ( '+' | '-' ) Factor | Primary
    // Primary    -> NUMBER | '(' Expression ')' | 'sqrt' '(' Expression ')' | 'sqrt' NUMBER

    function parseExpression(): number {
      let val = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const nextVal = parseTerm();
        if (op === '+') val += nextVal;
        else val -= nextVal;
      }
      return val;
    }

    function parseTerm(): number {
      let val = parsePower();
      while (peek() === '*' || peek() === '/' || peek() === '%') {
        const op = consume();
        const nextVal = parsePower();
        if (op === '*') {
          val *= nextVal;
        } else if (op === '/') {
          if (nextVal === 0) throw new Error('Division by zero');
          val /= nextVal;
        } else if (op === '%') {
          // modulo
          val = val % nextVal;
        }
      }
      return val;
    }

    function parsePower(): number {
      let base = parseFactor();
      if (peek() === '^') {
        consume('^');
        const exponent = parsePower(); // right-associative
        base = Math.pow(base, exponent);
      }
      return base;
    }

    function parseFactor(): number {
      if (peek() === '+') {
        consume('+');
        return parseFactor();
      }
      if (peek() === '-') {
        consume('-');
        return -parseFactor();
      }
      return parsePrimary();
    }

    function parsePrimary(): number {
      const token = peek();
      if (!token) throw new Error('Unexpected end of expression');

      if (token === 'sqrt') {
        consume('sqrt');
        if (peek() === '(') {
          consume('(');
          const inner = parseExpression();
          consume(')');
          if (inner < 0) throw new Error('Cannot take square root of negative number');
          return Math.sqrt(inner);
        } else {
          const inner = parseFactor();
          if (inner < 0) throw new Error('Cannot take square root of negative number');
          return Math.sqrt(inner);
        }
      }

      if (token === '(') {
        consume('(');
        const inner = parseExpression();
        consume(')');
        return inner;
      }

      // Check number
      const num = parseFloat(token);
      if (!isNaN(num)) {
        consume();
        return num;
      }

      throw new Error(`Syntax error near '${token}'`);
    }

    const finalResult = parseExpression();
    if (tokenIndex < tokens.length) {
      throw new Error(`Unexpected token at position ${tokenIndex}: '${tokens[tokenIndex]}'`);
    }

    if (!isFinite(finalResult) || isNaN(finalResult)) {
      return { success: false, result: 0, error: 'Mathematical overflow or invalid operation' };
    }

    return { success: true, result: finalResult };
  } catch (err: any) {
    return { success: false, result: 0, error: err.message || 'Invalid syntax' };
  }
}

/**
 * Formats a number cleanly, avoiding float noise like 0.30000000000000004
 */
export function formatAnswer(num: number): string {
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-4 && num !== 0)) {
    return num.toExponential(4);
  }
  // Round to max 6 decimal places if needed
  const fixed = Number(num.toFixed(6));
  return fixed.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

/**
 * Generate human-friendly estimation tips for expressions.
 */
export function generateEstimationTip(expression: string, actual: number): string {
  const clean = expression.replace(/\s+/g, '');
  
  // Check for simple multiplication like A * B
  const multMatch = clean.match(/^([0-9.]+)[*×]([0-9.]+)$/);
  if (multMatch) {
    const a = parseFloat(multMatch[1]);
    const b = parseFloat(multMatch[2]);
    const roundA = Math.round(a >= 10 ? Math.round(a / 10) * 10 : Math.round(a));
    const roundB = Math.round(b >= 10 ? Math.round(b / 10) * 10 : Math.round(b));
    return `Mental tip: Round ${a} → ${roundA} and ${b} → ${roundB}. Then compute ${roundA} × ${roundB} = ${roundA * roundB}.`;
  }

  // Check for division like A / B
  const divMatch = clean.match(/^([0-9.]+)[/÷]([0-9.]+)$/);
  if (divMatch) {
    const a = parseFloat(divMatch[1]);
    const b = parseFloat(divMatch[2]);
    const roundB = Math.round(b);
    const roundA = Math.round(a / roundB) * roundB;
    return `Mental tip: Round divisor ${b} → ${roundB}. Find a nearby friendly multiple of ${roundB} (e.g. ~${roundA}), giving ~${(roundA / roundB).toFixed(1)}.`;
  }

  // General rounding tip
  if (Math.abs(actual) > 100) {
    const approx = Math.round(actual / 100) * 100;
    return `Mental tip: Look at highest place values. Order of magnitude is around ${approx}.`;
  } else if (Math.abs(actual) > 10) {
    const approx = Math.round(actual / 10) * 10;
    return `Mental tip: Nearest tens estimate is around ${approx}.`;
  }

  return `Mental tip: Estimate each term to 1 significant digit before combining.`;
}

/**
 * Evaluate estimation accuracy against tolerance.
 */
export function checkEstimate(
  actual: number,
  estimate: number,
  tolerancePercent: number,
  expressionContext: string = ''
): EvaluationResult {
  const diff = estimate - actual;
  // Calculate percentage error relative to actual
  const percentageError = actual === 0
    ? (estimate === 0 ? 0 : 100)
    : Math.abs(diff / actual) * 100;

  const isAccepted = percentageError <= tolerancePercent;

  let minAllowed: number;
  let maxAllowed: number;

  if (actual >= 0) {
    minAllowed = actual * (1 - tolerancePercent / 100);
    maxAllowed = actual * (1 + tolerancePercent / 100);
  } else {
    minAllowed = actual * (1 + tolerancePercent / 100);
    maxAllowed = actual * (1 - tolerancePercent / 100);
  }

  const estimationTip = generateEstimationTip(expressionContext, actual);

  return {
    actualAnswer: actual,
    userEstimate: estimate,
    difference: diff,
    percentageError: Number(percentageError.toFixed(2)),
    isAccepted,
    minAllowed: Number(minAllowed.toFixed(4)),
    maxAllowed: Number(maxAllowed.toFixed(4)),
    tolerancePercent,
    estimationTip,
  };
}

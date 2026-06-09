import { parseTokens } from './parser';
import { tokenize } from './tokenizer';
import type { AstNode, EvalError, EvalResult, Token } from './types';

export function evaluateExpression(input: string): EvalResult {
  const tokenized = tokenize(input);

  if (!tokenized.ok) {
    return {
      ok: false,
      error: tokenized.error,
    };
  }

  return evaluateTokens(tokenized.tokens);
}

export function evaluateTokens(tokens: Token[]): EvalResult {
  const parsed = parseTokens(tokens);

  if (!parsed.ok) {
    return parsed;
  }

  return evaluateAst(parsed.node);
}

function evaluateAst(node: AstNode): EvalResult {
  switch (node.type) {
    case 'number':
      return { ok: true, value: node.value };
    case 'unary':
      return evaluateUnary(node);
    case 'binary':
      return evaluateBinary(node);
  }
}

function evaluateUnary(node: Extract<AstNode, { type: 'unary' }>): EvalResult {
  const evaluated = evaluateAst(node.argument);

  if (!evaluated.ok) {
    return evaluated;
  }

  const value = node.operator === '-' ? -evaluated.value : evaluated.value;

  return ensureFinite(value, node.start, node.end);
}

function evaluateBinary(node: Extract<AstNode, { type: 'binary' }>): EvalResult {
  const left = evaluateAst(node.left);

  if (!left.ok) {
    return left;
  }

  const right = evaluateAst(node.right);

  if (!right.ok) {
    return right;
  }

  switch (node.operator) {
    case '+':
      return ensureFinite(left.value + right.value, node.start, node.end);
    case '-':
      return ensureFinite(left.value - right.value, node.start, node.end);
    case '*':
      return ensureFinite(left.value * right.value, node.start, node.end);
    case '/':
      if (right.value === 0) {
        return createError(
          'DIVIDE_BY_ZERO',
          'Cannot divide by zero.',
          node.right.start,
          node.right.end,
        );
      }

      return ensureFinite(left.value / right.value, node.start, node.end);
    case '%':
      if (right.value === 0) {
        return createError(
          'DIVIDE_BY_ZERO',
          'Cannot divide by zero.',
          node.right.start,
          node.right.end,
        );
      }

      return ensureFinite(left.value % right.value, node.start, node.end);
    case '^':
      return ensureFinite(left.value ** right.value, node.start, node.end);
  }
}

function ensureFinite(value: number, start: number, end: number): EvalResult {
  if (!Number.isFinite(value)) {
    return createError(
      'OVERFLOW',
      'Calculation result is outside the supported range.',
      start,
      end,
    );
  }

  return { ok: true, value };
}

function createError(
  code: EvalError['code'],
  message: string,
  start: number,
  end: number,
): EvalResult {
  return {
    ok: false,
    error: {
      code,
      message,
      start,
      end: Math.max(end, start + 1),
    },
  };
}

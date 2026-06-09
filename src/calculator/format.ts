import type { EvalError } from '../engine';

const MAX_SIGNIFICANT_DIGITS = 12;
const NEAR_ZERO = 1e-12;

export function formatNumber(value: number): string {
  const normalized = Math.abs(value) < NEAR_ZERO ? 0 : value;

  if (Number.isInteger(normalized)) {
    return normalized.toString();
  }

  const absolute = Math.abs(normalized);

  if (absolute !== 0 && (absolute >= 1e12 || absolute < 1e-8)) {
    return trimNumericString(normalized.toExponential(MAX_SIGNIFICANT_DIGITS - 1));
  }

  return trimNumericString(normalized.toPrecision(MAX_SIGNIFICANT_DIGITS));
}

export function formatError(error: EvalError): string {
  switch (error.code) {
    case 'EMPTY_EXPRESSION':
      return 'Ready';
    case 'DIVIDE_BY_ZERO':
      return 'Cannot divide by zero';
    case 'DOMAIN_ERROR':
      return error.message;
    case 'MISMATCHED_PAREN':
      return 'Check parentheses';
    case 'OVERFLOW':
      return 'Result is too large';
    case 'INVALID_CHARACTER':
    case 'INVALID_NUMBER':
    case 'UNKNOWN_IDENTIFIER':
    case 'UNEXPECTED_TOKEN':
    case 'UNSUPPORTED_TOKEN':
      return 'Invalid expression';
  }
}

function trimNumericString(value: string): string {
  return value.replace(/(\.\d*?[1-9])0+(e[+-]?\d+)?$/i, '$1$2').replace(/\.0+(e[+-]?\d+)?$/i, '$1');
}

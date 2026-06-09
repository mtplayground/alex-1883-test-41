import { describe, expect, it } from 'vitest';
import { evaluateExpression } from '.';
import type { EvaluateOptions, EvalErrorCode, EvalResult } from './types';

function expectValue(input: string, expected: number, options?: EvaluateOptions): void {
  const result = evaluateExpression(input, options);

  if (!result.ok) {
    throw new Error(`Expected "${input}" to evaluate, received ${result.error.code}.`);
  }

  expect(result.value).toBeCloseTo(expected, 10);
}

function expectError(input: string, code: EvalErrorCode, options?: EvaluateOptions): void {
  const result: EvalResult = evaluateExpression(input, options);

  if (result.ok) {
    throw new Error(`Expected "${input}" to fail with ${code}, received ${result.value}.`);
  }

  expect(result.error.code).toBe(code);
}

describe('expression engine', () => {
  it('respects arithmetic precedence and associativity', () => {
    expectValue('2 + 3 * 4', 14);
    expectValue('(2 + 3) * 4', 20);
    expectValue('2 ^ 3 ^ 2', 512);
    expectValue('-2 ^ 2', -4);
    expectValue('(-2) ^ 2', 4);
    expectValue('10 % 4', 2);
    expectValue('5 + -2', 3);
  });

  it('evaluates scientific functions and constants', () => {
    expectValue('sqrt(9)', 3);
    expectValue('cbrt(-8)', -2);
    expectValue('log(100)', 2);
    expectValue('ln(e)', 1);
    expectValue('exp(1)', Math.E);
    expectValue('abs(-7)', 7);
    expectValue('2 ^ 5', 32);
    expectValue('pi', Math.PI);
  });

  it('applies degree and radian angle modes', () => {
    expectValue('sin(90)', 1, { angleMode: 'deg' });
    expectValue('cos(180)', -1, { angleMode: 'deg' });
    expectValue('tan(45)', 1, { angleMode: 'deg' });
    expectValue('sin(pi / 2)', 1, { angleMode: 'rad' });
    expectValue('cos(0)', 1);
  });

  it('returns structured errors for invalid expressions and domains', () => {
    expectError('', 'EMPTY_EXPRESSION');
    expectError('1 / 0', 'DIVIDE_BY_ZERO');
    expectError('1 % 0', 'DIVIDE_BY_ZERO');
    expectError('(1 + 2', 'MISMATCHED_PAREN');
    expectError('1 + )', 'UNEXPECTED_TOKEN');
    expectError('sqrt(-1)', 'DOMAIN_ERROR');
    expectError('log(0)', 'DOMAIN_ERROR');
    expectError('tan(90)', 'DOMAIN_ERROR', { angleMode: 'deg' });
    expectError('unknown(1)', 'UNKNOWN_IDENTIFIER');
    expectError('asin(1)', 'UNSUPPORTED_TOKEN');
  });

  it('returns overflow errors for finite inputs that exceed supported output range', () => {
    expectError('1e308 * 10', 'OVERFLOW');
    expectError('2 ^ 1024', 'OVERFLOW');
    expectError('exp(1000)', 'OVERFLOW');
  });
});

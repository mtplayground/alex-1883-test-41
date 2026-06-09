import { describe, expect, it } from 'vitest';
import { createCalculatorState } from './state';

describe('calculator state', () => {
  it('starts ready for an empty expression', () => {
    const state = createCalculatorState();

    expect(state.expression).toBe('');
    expect(state.angleMode).toBe('rad');
    expect(state.result.status).toBe('idle');
    expect(state.result.text).toBe('Ready');
  });

  it('evaluates the current expression through the engine', () => {
    const state = createCalculatorState('2 + 3 * 4');

    expect(state.result.status).toBe('success');
    expect(state.result.text).toBe('14');
  });

  it('uses angle mode when evaluating expressions', () => {
    const state = createCalculatorState('sin(90)', 'deg');

    expect(state.angleMode).toBe('deg');
    expect(state.result.status).toBe('success');
    expect(state.result.text).toBe('1');
  });

  it('stores structured engine errors for display', () => {
    const state = createCalculatorState('1 / 0');

    expect(state.result.status).toBe('error');
    expect(state.result.text).toBe('Cannot divide by zero');

    if (state.result.status === 'error') {
      expect(state.result.code).toBe('DIVIDE_BY_ZERO');
    }
  });
});

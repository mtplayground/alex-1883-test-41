import { describe, expect, it } from 'vitest';
import { calculatorReducer, createCalculatorState } from './state';

describe('calculator state', () => {
  it('starts ready for an empty expression', () => {
    const state = createCalculatorState();

    expect(state.expression).toBe('');
    expect(state.angleMode).toBe('rad');
    expect(state.history).toEqual([]);
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

  it('updates angle mode and recomputes the active expression', () => {
    let state = createCalculatorState('sin(90)');

    expect(state.angleMode).toBe('rad');

    state = calculatorReducer(state, { type: 'setAngleMode', angleMode: 'deg' });

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

  it('appends keypad input and recomputes the result', () => {
    let state = createCalculatorState();

    for (const input of ['1', '2', ' + ', '3']) {
      state = calculatorReducer(state, { type: 'appendInput', input });
    }

    expect(state.expression).toBe('12 + 3');
    expect(state.result.status).toBe('success');
    expect(state.result.text).toBe('15');
  });

  it('supports backspace, all-clear, and equals commit actions', () => {
    let state = createCalculatorState('12 + 3');

    state = calculatorReducer(state, { type: 'backspace' });
    expect(state.expression).toBe('12 +');
    expect(state.result.status).toBe('error');

    state = calculatorReducer(state, { type: 'clear' });
    expect(state.expression).toBe('');
    expect(state.result.status).toBe('idle');

    state = createCalculatorState('10 ÷ 4');
    state = calculatorReducer(state, { type: 'commitResult' });
    expect(state.expression).toBe('2.5');
    expect(state.result.status).toBe('success');
  });

  it('records successful committed calculations in session history', () => {
    let state = createCalculatorState('2 + 2');

    state = calculatorReducer(state, { type: 'commitResult' });

    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toMatchObject({
      expression: '2 + 2',
      result: '4',
      angleMode: 'rad',
    });
  });

  it('reuses a history entry without removing it from the session list', () => {
    let state = createCalculatorState('sin(90)', 'deg');

    state = calculatorReducer(state, { type: 'commitResult' });

    const entry = state.history[0];
    state = calculatorReducer(state, { type: 'clear' });
    state = calculatorReducer(state, { type: 'reuseHistory', entry });

    expect(state.expression).toBe('sin(90)');
    expect(state.angleMode).toBe('deg');
    expect(state.result.status).toBe('success');
    expect(state.result.text).toBe('1');
    expect(state.history).toHaveLength(1);
  });
});

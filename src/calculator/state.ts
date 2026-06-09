import { useReducer } from 'react';
import { evaluateExpression } from '../engine';
import type { AngleMode } from '../engine';
import { formatError, formatNumber } from './format';
import type { CalculatorAction, CalculatorResult, CalculatorState, HistoryEntry } from './types';

const MAX_HISTORY_ENTRIES = 10;

const READY_RESULT: CalculatorResult = {
  status: 'idle',
  text: 'Ready',
};

export function createCalculatorState(
  expression = '',
  angleMode: AngleMode = 'rad',
  history: HistoryEntry[] = [],
): CalculatorState {
  return {
    expression,
    angleMode,
    result: evaluateCalculatorExpression(expression, angleMode),
    history,
  };
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'setExpression':
      return createCalculatorState(action.expression, state.angleMode, state.history);
    case 'appendInput':
      return createCalculatorState(
        `${state.expression}${action.input}`,
        state.angleMode,
        state.history,
      );
    case 'setAngleMode':
      return createCalculatorState(state.expression, action.angleMode, state.history);
    case 'clear':
      return createCalculatorState('', state.angleMode, state.history);
    case 'backspace':
      return createCalculatorState(
        removeLastInput(state.expression),
        state.angleMode,
        state.history,
      );
    case 'commitResult':
      return commitResult(state);
    case 'reuseHistory':
      return createCalculatorState(action.entry.expression, action.entry.angleMode, state.history);
  }
}

export function useCalculatorState(initialExpression = '') {
  const [state, dispatch] = useReducer(calculatorReducer, initialExpression, (expression) =>
    createCalculatorState(expression),
  );

  return { state, dispatch };
}

function evaluateCalculatorExpression(expression: string, angleMode: AngleMode): CalculatorResult {
  if (expression.trim().length === 0) {
    return READY_RESULT;
  }

  const result = evaluateExpression(expression, { angleMode });

  if (!result.ok) {
    return {
      status: 'error',
      text: formatError(result.error),
      code: result.error.code,
    };
  }

  return {
    status: 'success',
    text: formatNumber(result.value),
    value: result.value,
  };
}

function removeLastInput(expression: string): string {
  return expression.trimEnd().slice(0, -1).trimEnd();
}

function commitResult(state: CalculatorState): CalculatorState {
  if (state.result.status !== 'success' || state.expression.trim().length === 0) {
    return state;
  }

  const entry = createHistoryEntry(state);
  const history = addHistoryEntry(state.history, entry);

  return createCalculatorState(state.result.text, state.angleMode, history);
}

function createHistoryEntry(state: CalculatorState): HistoryEntry {
  const expression = state.expression.trim();
  const result = state.result.status === 'success' ? state.result.text : '';

  return {
    id: `${state.angleMode}:${expression}=${result}`,
    expression,
    result,
    angleMode: state.angleMode,
  };
}

function addHistoryEntry(history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  return [entry, ...history.filter((item) => item.id !== entry.id)].slice(0, MAX_HISTORY_ENTRIES);
}

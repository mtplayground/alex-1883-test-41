import { useReducer } from 'react';
import { evaluateExpression } from '../engine';
import type { AngleMode } from '../engine';
import { formatError, formatNumber } from './format';
import type { CalculatorAction, CalculatorResult, CalculatorState } from './types';

const READY_RESULT: CalculatorResult = {
  status: 'idle',
  text: 'Ready',
};

export function createCalculatorState(
  expression = '',
  angleMode: AngleMode = 'rad',
): CalculatorState {
  return {
    expression,
    angleMode,
    result: evaluateCalculatorExpression(expression, angleMode),
  };
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'setExpression':
      return createCalculatorState(action.expression, state.angleMode);
    case 'appendInput':
      return createCalculatorState(`${state.expression}${action.input}`, state.angleMode);
    case 'setAngleMode':
      return createCalculatorState(state.expression, action.angleMode);
    case 'clear':
      return createCalculatorState('', state.angleMode);
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

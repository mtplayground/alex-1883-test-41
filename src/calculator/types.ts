import type { AngleMode, EvalErrorCode } from '../engine';

export type CalculatorResult =
  | {
      status: 'idle';
      text: string;
    }
  | {
      status: 'success';
      text: string;
      value: number;
    }
  | {
      status: 'error';
      text: string;
      code: EvalErrorCode;
    };

export interface CalculatorState {
  expression: string;
  angleMode: AngleMode;
  result: CalculatorResult;
}

export type CalculatorAction =
  | {
      type: 'setExpression';
      expression: string;
    }
  | {
      type: 'appendInput';
      input: string;
    }
  | {
      type: 'setAngleMode';
      angleMode: AngleMode;
    }
  | {
      type: 'clear';
    }
  | {
      type: 'backspace';
    }
  | {
      type: 'commitResult';
    };

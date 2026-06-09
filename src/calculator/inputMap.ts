import type { CalculatorAction } from './types';

export interface KeyboardInput {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}

const OPERATOR_INPUTS: Record<string, string> = {
  '+': ' + ',
  '-': ' - ',
  '*': ' × ',
  x: ' × ',
  X: ' × ',
  '/': ' ÷ ',
  '%': ' % ',
  '^': ' ^ ',
};

const SCIENTIFIC_INPUTS: Record<string, string> = {
  s: 'sin(',
  S: 'sin(',
  c: 'cos(',
  C: 'cos(',
  t: 'tan(',
  T: 'tan(',
  l: 'ln(',
  L: 'ln(',
  g: 'log(',
  G: 'log(',
  r: 'sqrt(',
  R: 'sqrt(',
  a: 'abs(',
  A: 'abs(',
  p: 'pi',
  P: 'pi',
  e: 'e',
  E: 'e',
};

export function mapKeyboardInputToAction(input: KeyboardInput): CalculatorAction | null {
  if (input.altKey || input.ctrlKey || input.metaKey) {
    return null;
  }

  if (isDigitKey(input.key)) {
    return { type: 'appendInput', input: input.key };
  }

  if (input.key === '.') {
    return { type: 'appendInput', input: '.' };
  }

  if (input.key === '(' || input.key === ')') {
    return { type: 'appendInput', input: input.key };
  }

  const operatorInput = OPERATOR_INPUTS[input.key];

  if (operatorInput !== undefined) {
    return { type: 'appendInput', input: operatorInput };
  }

  const scientificInput = SCIENTIFIC_INPUTS[input.key];

  if (scientificInput !== undefined) {
    return { type: 'appendInput', input: scientificInput };
  }

  switch (input.key) {
    case 'Enter':
    case '=':
      return { type: 'commitResult' };
    case 'Backspace':
      return { type: 'backspace' };
    case 'Escape':
    case 'Delete':
      return { type: 'clear' };
    default:
      return null;
  }
}

function isDigitKey(key: string): boolean {
  return key.length === 1 && key >= '0' && key <= '9';
}

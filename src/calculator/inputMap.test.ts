import { describe, expect, it } from 'vitest';
import { mapKeyboardInputToAction } from './inputMap';

describe('keyboard input mapping', () => {
  it('maps digits, decimal, operators, and grouping keys to append actions', () => {
    expect(mapKeyboardInputToAction({ key: '7' })).toEqual({ type: 'appendInput', input: '7' });
    expect(mapKeyboardInputToAction({ key: '.' })).toEqual({ type: 'appendInput', input: '.' });
    expect(mapKeyboardInputToAction({ key: '+' })).toEqual({ type: 'appendInput', input: ' + ' });
    expect(mapKeyboardInputToAction({ key: '-' })).toEqual({ type: 'appendInput', input: ' - ' });
    expect(mapKeyboardInputToAction({ key: '*' })).toEqual({ type: 'appendInput', input: ' × ' });
    expect(mapKeyboardInputToAction({ key: '/' })).toEqual({ type: 'appendInput', input: ' ÷ ' });
    expect(mapKeyboardInputToAction({ key: '%' })).toEqual({ type: 'appendInput', input: ' % ' });
    expect(mapKeyboardInputToAction({ key: '^' })).toEqual({ type: 'appendInput', input: ' ^ ' });
    expect(mapKeyboardInputToAction({ key: '(' })).toEqual({ type: 'appendInput', input: '(' });
    expect(mapKeyboardInputToAction({ key: ')' })).toEqual({ type: 'appendInput', input: ')' });
  });

  it('maps scientific shortcuts and constants', () => {
    expect(mapKeyboardInputToAction({ key: 's' })).toEqual({ type: 'appendInput', input: 'sin(' });
    expect(mapKeyboardInputToAction({ key: 'c' })).toEqual({ type: 'appendInput', input: 'cos(' });
    expect(mapKeyboardInputToAction({ key: 't' })).toEqual({ type: 'appendInput', input: 'tan(' });
    expect(mapKeyboardInputToAction({ key: 'g' })).toEqual({ type: 'appendInput', input: 'log(' });
    expect(mapKeyboardInputToAction({ key: 'l' })).toEqual({ type: 'appendInput', input: 'ln(' });
    expect(mapKeyboardInputToAction({ key: 'r' })).toEqual({ type: 'appendInput', input: 'sqrt(' });
    expect(mapKeyboardInputToAction({ key: 'p' })).toEqual({ type: 'appendInput', input: 'pi' });
    expect(mapKeyboardInputToAction({ key: 'e' })).toEqual({ type: 'appendInput', input: 'e' });
  });

  it('maps action keys and ignores modified or unknown keys', () => {
    expect(mapKeyboardInputToAction({ key: 'Enter' })).toEqual({ type: 'commitResult' });
    expect(mapKeyboardInputToAction({ key: '=' })).toEqual({ type: 'commitResult' });
    expect(mapKeyboardInputToAction({ key: 'Backspace' })).toEqual({ type: 'backspace' });
    expect(mapKeyboardInputToAction({ key: 'Escape' })).toEqual({ type: 'clear' });
    expect(mapKeyboardInputToAction({ key: 'Delete' })).toEqual({ type: 'clear' });
    expect(mapKeyboardInputToAction({ key: '7', ctrlKey: true })).toBeNull();
    expect(mapKeyboardInputToAction({ key: 'ArrowLeft' })).toBeNull();
  });
});

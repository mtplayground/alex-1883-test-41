import { useEffect } from 'react';
import type { Dispatch } from 'react';
import { mapKeyboardInputToAction } from './inputMap';
import type { CalculatorAction } from './types';

export function useKeyboardInput(dispatch: Dispatch<CalculatorAction>): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (isEditableTarget(event.target)) {
        return;
      }

      const action = mapKeyboardInputToAction(event);

      if (action === null) {
        return;
      }

      event.preventDefault();
      dispatch(action);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

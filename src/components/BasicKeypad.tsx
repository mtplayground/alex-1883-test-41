import type { Dispatch } from 'react';
import type { CalculatorAction } from '../calculator/types';

type KeyVariant = 'digit' | 'operator' | 'control' | 'equals';

interface KeyDefinition {
  label: string;
  ariaLabel: string;
  action: CalculatorAction;
  variant: KeyVariant;
  wide?: boolean;
}

interface BasicKeypadProps {
  dispatch: Dispatch<CalculatorAction>;
}

const keys: KeyDefinition[] = [
  { label: 'AC', ariaLabel: 'All clear', action: { type: 'clear' }, variant: 'control' },
  { label: 'C', ariaLabel: 'Clear last input', action: { type: 'backspace' }, variant: 'control' },
  {
    label: '%',
    ariaLabel: 'Modulo',
    action: { type: 'appendInput', input: ' % ' },
    variant: 'operator',
  },
  {
    label: '÷',
    ariaLabel: 'Divide',
    action: { type: 'appendInput', input: ' ÷ ' },
    variant: 'operator',
  },
  { label: '7', ariaLabel: 'Seven', action: { type: 'appendInput', input: '7' }, variant: 'digit' },
  { label: '8', ariaLabel: 'Eight', action: { type: 'appendInput', input: '8' }, variant: 'digit' },
  { label: '9', ariaLabel: 'Nine', action: { type: 'appendInput', input: '9' }, variant: 'digit' },
  {
    label: '×',
    ariaLabel: 'Multiply',
    action: { type: 'appendInput', input: ' × ' },
    variant: 'operator',
  },
  { label: '4', ariaLabel: 'Four', action: { type: 'appendInput', input: '4' }, variant: 'digit' },
  { label: '5', ariaLabel: 'Five', action: { type: 'appendInput', input: '5' }, variant: 'digit' },
  { label: '6', ariaLabel: 'Six', action: { type: 'appendInput', input: '6' }, variant: 'digit' },
  {
    label: '−',
    ariaLabel: 'Subtract',
    action: { type: 'appendInput', input: ' - ' },
    variant: 'operator',
  },
  { label: '1', ariaLabel: 'One', action: { type: 'appendInput', input: '1' }, variant: 'digit' },
  { label: '2', ariaLabel: 'Two', action: { type: 'appendInput', input: '2' }, variant: 'digit' },
  { label: '3', ariaLabel: 'Three', action: { type: 'appendInput', input: '3' }, variant: 'digit' },
  {
    label: '+',
    ariaLabel: 'Add',
    action: { type: 'appendInput', input: ' + ' },
    variant: 'operator',
  },
  {
    label: '0',
    ariaLabel: 'Zero',
    action: { type: 'appendInput', input: '0' },
    variant: 'digit',
    wide: true,
  },
  {
    label: '.',
    ariaLabel: 'Decimal point',
    action: { type: 'appendInput', input: '.' },
    variant: 'digit',
  },
  { label: '=', ariaLabel: 'Equals', action: { type: 'commitResult' }, variant: 'equals' },
];

export function BasicKeypad({ dispatch }: BasicKeypadProps) {
  return (
    <section className="grid grid-cols-4 gap-2.5" aria-label="Basic calculator keypad">
      {keys.map((key) => (
        <button
          className={`${baseKeyClass} ${variantClass[key.variant]} ${key.wide ? 'col-span-2' : ''}`}
          type="button"
          aria-label={key.ariaLabel}
          onClick={() => dispatch(key.action)}
          key={key.label}
        >
          {key.label}
        </button>
      ))}
    </section>
  );
}

const baseKeyClass =
  'min-h-14 rounded-lg border text-lg font-semibold shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:translate-y-0';

const variantClass: Record<KeyVariant, string> = {
  digit: 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
  operator: 'border-cyan-800 bg-cyan-800 text-white hover:bg-cyan-700',
  control: 'border-slate-300 bg-slate-200 text-slate-900 hover:bg-slate-300',
  equals: 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-600',
};

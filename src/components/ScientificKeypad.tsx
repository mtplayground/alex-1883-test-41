import type { Dispatch } from 'react';
import type { AngleMode } from '../engine';
import type { CalculatorAction, CalculatorState } from '../calculator/types';

type ScientificKeyVariant = 'function' | 'operator' | 'constant' | 'grouping';

interface ScientificKeyDefinition {
  label: string;
  ariaLabel: string;
  input: string;
  variant: ScientificKeyVariant;
}

interface ScientificKeypadProps {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}

const angleModes: AngleMode[] = ['rad', 'deg'];

const scientificKeys: ScientificKeyDefinition[] = [
  { label: 'sin', ariaLabel: 'Sine', input: 'sin(', variant: 'function' },
  { label: 'cos', ariaLabel: 'Cosine', input: 'cos(', variant: 'function' },
  { label: 'tan', ariaLabel: 'Tangent', input: 'tan(', variant: 'function' },
  { label: 'log', ariaLabel: 'Base ten logarithm', input: 'log(', variant: 'function' },
  { label: 'ln', ariaLabel: 'Natural logarithm', input: 'ln(', variant: 'function' },
  { label: '√', ariaLabel: 'Square root', input: 'sqrt(', variant: 'function' },
  { label: '∛', ariaLabel: 'Cube root', input: 'cbrt(', variant: 'function' },
  { label: 'x²', ariaLabel: 'Square power', input: ' ^ 2', variant: 'operator' },
  { label: 'xʸ', ariaLabel: 'Power', input: ' ^ ', variant: 'operator' },
  { label: 'exp', ariaLabel: 'Exponential', input: 'exp(', variant: 'function' },
  { label: '(', ariaLabel: 'Open parenthesis', input: '(', variant: 'grouping' },
  { label: ')', ariaLabel: 'Close parenthesis', input: ')', variant: 'grouping' },
  { label: 'π', ariaLabel: 'Pi constant', input: 'pi', variant: 'constant' },
  { label: 'e', ariaLabel: 'Euler constant', input: 'e', variant: 'constant' },
  { label: 'abs', ariaLabel: 'Absolute value', input: 'abs(', variant: 'function' },
];

export function ScientificKeypad({ state, dispatch }: ScientificKeypadProps) {
  return (
    <section className="grid gap-2.5" aria-label="Scientific calculator keypad">
      <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Angle mode">
        {angleModes.map((angleMode) => {
          const isActive = state.angleMode === angleMode;

          return (
            <button
              className={`${angleButtonClass} ${
                isActive
                  ? 'border-cyan-800 bg-cyan-800 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              type="button"
              aria-pressed={isActive}
              onClick={() => dispatch({ type: 'setAngleMode', angleMode })}
              key={angleMode}
            >
              {angleMode.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {scientificKeys.map((key) => (
          <button
            className={`${baseKeyClass} ${variantClass[key.variant]}`}
            type="button"
            aria-label={key.ariaLabel}
            onClick={() => dispatch({ type: 'appendInput', input: key.input })}
            key={key.label}
          >
            {key.label}
          </button>
        ))}
      </div>
    </section>
  );
}

const angleButtonClass =
  'min-h-11 rounded-lg border text-sm font-bold tracking-normal shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2';

const baseKeyClass =
  'min-h-12 rounded-lg border text-sm font-bold tracking-normal shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:translate-y-0';

const variantClass: Record<ScientificKeyVariant, string> = {
  function: 'border-violet-800 bg-violet-800 text-white hover:bg-violet-700',
  operator: 'border-cyan-800 bg-cyan-800 text-white hover:bg-cyan-700',
  constant: 'border-amber-500 bg-amber-100 text-amber-950 hover:bg-amber-200',
  grouping: 'border-slate-300 bg-slate-200 text-slate-900 hover:bg-slate-300',
};

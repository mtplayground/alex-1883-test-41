import type { CalculatorState } from '../calculator/types';

interface DisplayProps {
  state: CalculatorState;
}

export function Display({ state }: DisplayProps) {
  const isError = state.result.status === 'error';

  return (
    <section
      className="grid min-h-36 content-between gap-4 rounded-lg border border-slate-200 bg-white p-6 text-right shadow-xl shadow-slate-200/70"
      aria-label="Calculator display"
    >
      <div className="flex items-center justify-between gap-3 text-left">
        <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold tracking-normal text-slate-600 uppercase">
          {state.angleMode}
        </span>
        <p className="min-w-0 flex-1 text-right text-lg break-all text-slate-500">
          {state.expression || '0'}
        </p>
      </div>

      <p
        className={`text-3xl font-bold break-all ${isError ? 'text-rose-700' : 'text-slate-950'}`}
        role={isError ? 'alert' : undefined}
      >
        {state.result.text}
      </p>
    </section>
  );
}

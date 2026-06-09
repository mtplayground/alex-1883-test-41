import type { Dispatch } from 'react';
import type { CalculatorAction, HistoryEntry } from '../calculator/types';

interface HistoryPanelProps {
  history: HistoryEntry[];
  dispatch: Dispatch<CalculatorAction>;
}

export function HistoryPanel({ history, dispatch }: HistoryPanelProps) {
  return (
    <section
      className="grid content-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70"
      aria-label="Calculation history"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-950">History</h2>
        <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
          {history.length}
        </span>
      </div>

      {history.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-500">
          No calculations yet
        </p>
      ) : (
        <ol className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
          {history.map((entry) => (
            <li key={entry.id}>
              <button
                className="grid w-full gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-cyan-700 hover:bg-cyan-50 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none"
                type="button"
                onClick={() => dispatch({ type: 'reuseHistory', entry })}
              >
                <span className="text-sm break-all text-slate-600">{entry.expression}</span>
                <span className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold break-all text-slate-950">{entry.result}</span>
                  <span className="shrink-0 text-xs font-semibold text-slate-500 uppercase">
                    {entry.angleMode}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

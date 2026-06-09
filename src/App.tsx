import { useKeyboardInput } from './calculator/keyboard';
import { useCalculatorState } from './calculator/state';
import { BasicKeypad } from './components/BasicKeypad';
import { Display } from './components/Display';
import { HistoryPanel } from './components/HistoryPanel';
import { ScientificKeypad } from './components/ScientificKeypad';

export default function App() {
  const { state, dispatch } = useCalculatorState();
  useKeyboardInput(dispatch);

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 text-slate-950 sm:px-6"
      aria-labelledby="app-title"
    >
      <section
        className="grid w-full max-w-[900px] gap-4 lg:grid-cols-[minmax(0,480px)_minmax(260px,1fr)]"
        aria-label="Calculator application shell"
      >
        <header className="grid gap-1.5 lg:col-span-2">
          <p className="text-sm text-slate-600">alex-1883-test-41</p>
          <h1
            id="app-title"
            className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl"
          >
            Scientific calculator
          </h1>
        </header>

        <div className="grid gap-4">
          <Display state={state} />

          <ScientificKeypad state={state} dispatch={dispatch} />

          <BasicKeypad dispatch={dispatch} />
        </div>

        <HistoryPanel history={state.history} dispatch={dispatch} />
      </section>
    </main>
  );
}

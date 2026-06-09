import { useKeyboardInput } from './calculator/keyboard';
import { useCalculatorState } from './calculator/state';
import { BasicKeypad } from './components/BasicKeypad';
import { Display } from './components/Display';
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
        className="grid w-full max-w-[480px] gap-4"
        aria-label="Calculator application shell"
      >
        <header className="grid gap-1.5">
          <p className="text-sm text-slate-600">alex-1883-test-41</p>
          <h1
            id="app-title"
            className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl"
          >
            Scientific calculator
          </h1>
        </header>

        <Display state={state} />

        <ScientificKeypad state={state} dispatch={dispatch} />

        <BasicKeypad dispatch={dispatch} />
      </section>
    </main>
  );
}

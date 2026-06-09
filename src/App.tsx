import { useCalculatorState } from './calculator/state';
import { Display } from './components/Display';

const previewKeys = [
  '7',
  '8',
  '9',
  '/',
  '4',
  '5',
  '6',
  '*',
  '1',
  '2',
  '3',
  '-',
  '0',
  '.',
  '=',
  '+',
];

export default function App() {
  const { state } = useCalculatorState();

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 text-slate-950 sm:px-6"
      aria-labelledby="app-title"
    >
      <section
        className="grid w-full max-w-[420px] gap-4"
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

        <section className="grid grid-cols-4 gap-2.5" aria-label="Calculator keypad preview">
          {previewKeys.map((key) => (
            <button
              className="min-h-14 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 shadow-sm disabled:cursor-not-allowed disabled:opacity-80"
              type="button"
              disabled
              key={key}
            >
              {key}
            </button>
          ))}
        </section>
      </section>
    </main>
  );
}

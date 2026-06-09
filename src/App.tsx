const previewKeys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'];

export default function App() {
  return (
    <main className="app-shell" aria-labelledby="app-title">
      <section className="calculator-shell" aria-label="Calculator application shell">
        <header className="calculator-header">
          <p className="eyebrow">alex-1883-test-41</p>
          <h1 id="app-title">Scientific calculator</h1>
        </header>

        <section className="display-panel" aria-label="Calculator display">
          <p className="expression">0</p>
          <p className="result">Ready</p>
        </section>

        <section className="keypad-preview" aria-label="Calculator keypad preview">
          {previewKeys.map((key) => (
            <button className="key" type="button" disabled key={key}>
              {key}
            </button>
          ))}
        </section>
      </section>
    </main>
  );
}

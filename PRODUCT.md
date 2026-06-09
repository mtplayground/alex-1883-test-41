# alex-1883-test-41

## What It Is

alex-1883-test-41 is a static browser-based scientific calculator built with
Vite, React, TypeScript, and Tailwind CSS. It runs entirely in the browser and
does not require a backend, database, authentication, or runtime secrets.

## What It Does

- Evaluates arithmetic expressions with precedence, parentheses, unary
  operators, modulo, and exponentiation.
- Supports scientific functions and constants: `sin`, `cos`, `tan`, `sqrt`,
  `cbrt`, `log`, `ln`, `exp`, `abs`, `pi`, and `e`.
- Provides degree/radian angle modes for trigonometric evaluation.
- Shows the current expression, live result or error message, and session
  calculation history.
- Lets users enter calculations through on-screen basic/scientific keypads or
  physical keyboard shortcuts.
- Allows selecting a recent history entry to restore and reuse that expression.

## Architecture

- `src/engine/` contains the framework-independent expression engine:
  tokenizer, parser, evaluator, shared types, and unit tests.
- `src/calculator/` contains calculator state, formatting, keyboard mapping,
  and reducer-oriented behavior.
- `src/components/` contains React UI pieces for the display, keypads, and
  history panel.
- `tests/e2e/` contains Playwright coverage for core UI flows.
- Production output is static Vite assets in `dist/` from `npm run build`.

## Conventions

- Engine APIs return structured success/error results; UI formatting is handled
  separately in calculator formatting code.
- User-facing errors are intentionally concise: invalid expression, check
  parentheses, cannot divide by zero, domain-specific messages, or result too
  large.
- Session history is in browser memory only.
- Static hosting should serve the contents of `dist/`; no server routes are
  required.

## Validation

Use the existing npm scripts:

- `npm run format:check`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run test:e2e`

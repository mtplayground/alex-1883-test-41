import type {
  ConstantName,
  FunctionName,
  ConstantToken,
  FunctionToken,
  NumberToken,
  OperatorSymbol,
  Token,
  TokenizeError,
  TokenizeResult,
} from './types';

type NumberScanResult = { ok: true; token: NumberToken } | { ok: false; error: TokenizeError };
type IdentifierScanResult =
  | { ok: true; token: FunctionToken | ConstantToken }
  | { ok: false; error: TokenizeError };

const OPERATOR_ALIASES: Record<string, OperatorSymbol> = {
  '+': '+',
  '-': '-',
  '−': '-',
  '*': '*',
  '×': '*',
  '/': '/',
  '÷': '/',
  '^': '^',
  '%': '%',
};

const FUNCTIONS = new Set<FunctionName>([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sqrt',
  'log',
  'ln',
  'exp',
  'abs',
]);

const CONSTANT_ALIASES: Record<string, ConstantName> = {
  e: 'e',
  pi: 'pi',
  π: 'pi',
};

export function tokenize(input: string): TokenizeResult {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    const current = input[index];

    if (current === undefined) {
      break;
    }

    if (isWhitespace(current)) {
      index += 1;
      continue;
    }

    if (isNumberStart(input, index)) {
      const scanned = scanNumber(input, index);

      if (!scanned.ok) {
        return scanned;
      }

      tokens.push(scanned.token);
      index = scanned.token.end;
      continue;
    }

    const operator = OPERATOR_ALIASES[current];

    if (operator !== undefined) {
      tokens.push({
        type: 'operator',
        value: operator,
        raw: current,
        start: index,
        end: index + 1,
      });
      index += 1;
      continue;
    }

    if (current === '(') {
      tokens.push({
        type: 'leftParen',
        raw: current,
        start: index,
        end: index + 1,
      });
      index += 1;
      continue;
    }

    if (current === ')') {
      tokens.push({
        type: 'rightParen',
        raw: current,
        start: index,
        end: index + 1,
      });
      index += 1;
      continue;
    }

    if (isIdentifierStart(current)) {
      const scanned = scanIdentifier(input, index);

      if (!scanned.ok) {
        return scanned;
      }

      tokens.push(scanned.token);
      index = scanned.token.end;
      continue;
    }

    return {
      ok: false,
      error: createError(
        'INVALID_CHARACTER',
        `Unexpected character "${current}".`,
        index,
        index + 1,
      ),
    };
  }

  return { ok: true, tokens };
}

function scanNumber(input: string, start: number): NumberScanResult {
  let index = start;
  let hasDigit = false;

  while (isDigit(input[index])) {
    hasDigit = true;
    index += 1;
  }

  if (input[index] === '.') {
    index += 1;

    while (isDigit(input[index])) {
      hasDigit = true;
      index += 1;
    }
  }

  if (!hasDigit) {
    return {
      ok: false,
      error: createError('INVALID_NUMBER', 'Expected a digit in the number literal.', start, index),
    };
  }

  if (input[index] === 'e' || input[index] === 'E') {
    const exponentStart = index;
    index += 1;

    if (input[index] === '+' || input[index] === '-') {
      index += 1;
    }

    const digitStart = index;

    while (isDigit(input[index])) {
      index += 1;
    }

    if (digitStart === index) {
      return {
        ok: false,
        error: createError(
          'INVALID_NUMBER',
          'Expected exponent digits after the exponent marker.',
          exponentStart,
          index,
        ),
      };
    }
  }

  const raw = input.slice(start, index);
  const value = Number(raw);

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      error: createError(
        'INVALID_NUMBER',
        'Number literal is outside the supported range.',
        start,
        index,
      ),
    };
  }

  return {
    ok: true,
    token: {
      type: 'number',
      value,
      raw,
      start,
      end: index,
    },
  };
}

function scanIdentifier(input: string, start: number): IdentifierScanResult {
  let index = start;

  if (input[index] === 'π') {
    index += 1;
  } else {
    while (isIdentifierPart(input[index])) {
      index += 1;
    }
  }

  const raw = input.slice(start, index);
  const normalized = raw.toLowerCase();
  const constant = CONSTANT_ALIASES[normalized];

  if (constant !== undefined) {
    return {
      ok: true,
      token: {
        type: 'constant',
        name: constant,
        raw,
        start,
        end: index,
      },
    };
  }

  if (FUNCTIONS.has(normalized as FunctionName)) {
    return {
      ok: true,
      token: {
        type: 'function',
        name: normalized as FunctionName,
        raw,
        start,
        end: index,
      },
    };
  }

  return {
    ok: false,
    error: createError('UNKNOWN_IDENTIFIER', `Unknown identifier "${raw}".`, start, index),
  };
}

function isNumberStart(input: string, index: number): boolean {
  const current = input[index];
  const next = input[index + 1];

  return isDigit(current) || (current === '.' && isDigit(next));
}

function isDigit(value: string | undefined): boolean {
  return value !== undefined && value >= '0' && value <= '9';
}

function isWhitespace(value: string): boolean {
  return /\s/.test(value);
}

function isIdentifierStart(value: string): boolean {
  return value === 'π' || isAsciiLetter(value);
}

function isIdentifierPart(value: string | undefined): boolean {
  return value !== undefined && isAsciiLetter(value);
}

function isAsciiLetter(value: string): boolean {
  const lower = value.toLowerCase();

  return lower >= 'a' && lower <= 'z';
}

function createError(
  code: TokenizeError['code'],
  message: string,
  start: number,
  end: number,
): TokenizeError {
  return {
    code,
    message,
    start,
    end: Math.max(end, start + 1),
  };
}

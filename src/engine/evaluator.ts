import { parseTokens } from './parser';
import { tokenize } from './tokenizer';
import type { AstNode, EvaluateOptions, EvalError, EvalResult, FunctionName, Token } from './types';

const DEFAULT_EVALUATE_OPTIONS = {
  angleMode: 'rad',
} satisfies Required<EvaluateOptions>;

const NEAR_ZERO = 1e-12;

export function evaluateExpression(input: string, options: EvaluateOptions = {}): EvalResult {
  const tokenized = tokenize(input);

  if (!tokenized.ok) {
    return {
      ok: false,
      error: tokenized.error,
    };
  }

  return evaluateTokens(tokenized.tokens, options);
}

export function evaluateTokens(tokens: Token[], options: EvaluateOptions = {}): EvalResult {
  const parsed = parseTokens(tokens);

  if (!parsed.ok) {
    return parsed;
  }

  return evaluateAst(parsed.node, normalizeOptions(options));
}

function evaluateAst(node: AstNode, options: Required<EvaluateOptions>): EvalResult {
  switch (node.type) {
    case 'number':
      return { ok: true, value: node.value };
    case 'constant':
      return evaluateConstant(node);
    case 'unary':
      return evaluateUnary(node, options);
    case 'binary':
      return evaluateBinary(node, options);
    case 'functionCall':
      return evaluateFunction(node, options);
  }
}

function evaluateConstant(node: Extract<AstNode, { type: 'constant' }>): EvalResult {
  switch (node.name) {
    case 'pi':
      return { ok: true, value: Math.PI };
    case 'e':
      return { ok: true, value: Math.E };
  }
}

function evaluateUnary(
  node: Extract<AstNode, { type: 'unary' }>,
  options: Required<EvaluateOptions>,
): EvalResult {
  const evaluated = evaluateAst(node.argument, options);

  if (!evaluated.ok) {
    return evaluated;
  }

  const value = node.operator === '-' ? -evaluated.value : evaluated.value;

  return ensureFinite(value, node.start, node.end);
}

function evaluateBinary(
  node: Extract<AstNode, { type: 'binary' }>,
  options: Required<EvaluateOptions>,
): EvalResult {
  const left = evaluateAst(node.left, options);

  if (!left.ok) {
    return left;
  }

  const right = evaluateAst(node.right, options);

  if (!right.ok) {
    return right;
  }

  switch (node.operator) {
    case '+':
      return ensureFinite(left.value + right.value, node.start, node.end);
    case '-':
      return ensureFinite(left.value - right.value, node.start, node.end);
    case '*':
      return ensureFinite(left.value * right.value, node.start, node.end);
    case '/':
      if (right.value === 0) {
        return createError(
          'DIVIDE_BY_ZERO',
          'Cannot divide by zero.',
          node.right.start,
          node.right.end,
        );
      }

      return ensureFinite(left.value / right.value, node.start, node.end);
    case '%':
      if (right.value === 0) {
        return createError(
          'DIVIDE_BY_ZERO',
          'Cannot divide by zero.',
          node.right.start,
          node.right.end,
        );
      }

      return ensureFinite(left.value % right.value, node.start, node.end);
    case '^':
      return ensureFinite(left.value ** right.value, node.start, node.end);
  }
}

function evaluateFunction(
  node: Extract<AstNode, { type: 'functionCall' }>,
  options: Required<EvaluateOptions>,
): EvalResult {
  const evaluated = evaluateAst(node.argument, options);

  if (!evaluated.ok) {
    return evaluated;
  }

  const value = applyFunction(node.name, evaluated.value, node, options);

  if (!value.ok) {
    return value;
  }

  return ensureFinite(value.value, node.start, node.end);
}

function applyFunction(
  name: FunctionName,
  value: number,
  node: Extract<AstNode, { type: 'functionCall' }>,
  options: Required<EvaluateOptions>,
): EvalResult {
  switch (name) {
    case 'sin':
      return { ok: true, value: snapNearZero(Math.sin(toRadiansIfNeeded(value, options))) };
    case 'cos':
      return { ok: true, value: snapNearZero(Math.cos(toRadiansIfNeeded(value, options))) };
    case 'tan':
      return evaluateTangent(value, node, options);
    case 'sqrt':
      if (value < 0) {
        return createError(
          'DOMAIN_ERROR',
          'Square root requires a non-negative value.',
          node.start,
          node.end,
        );
      }

      return { ok: true, value: Math.sqrt(value) };
    case 'cbrt':
      return { ok: true, value: Math.cbrt(value) };
    case 'log':
      if (value <= 0) {
        return createError(
          'DOMAIN_ERROR',
          'Logarithm requires a positive value.',
          node.start,
          node.end,
        );
      }

      return { ok: true, value: Math.log10(value) };
    case 'ln':
      if (value <= 0) {
        return createError(
          'DOMAIN_ERROR',
          'Natural logarithm requires a positive value.',
          node.start,
          node.end,
        );
      }

      return { ok: true, value: Math.log(value) };
    case 'exp':
      return { ok: true, value: Math.exp(value) };
    case 'abs':
      return { ok: true, value: Math.abs(value) };
    case 'asin':
    case 'acos':
    case 'atan':
      return createError(
        'UNSUPPORTED_TOKEN',
        `"${name}" is not supported by this scientific function set.`,
        node.start,
        node.end,
      );
  }
}

function evaluateTangent(
  value: number,
  node: Extract<AstNode, { type: 'functionCall' }>,
  options: Required<EvaluateOptions>,
): EvalResult {
  const radians = toRadiansIfNeeded(value, options);

  if (Math.abs(Math.cos(radians)) < NEAR_ZERO) {
    return createError(
      'DOMAIN_ERROR',
      'Tangent is undefined for this angle.',
      node.start,
      node.end,
    );
  }

  return { ok: true, value: snapNearZero(Math.tan(radians)) };
}

function toRadiansIfNeeded(value: number, options: Required<EvaluateOptions>): number {
  return options.angleMode === 'deg' ? (value * Math.PI) / 180 : value;
}

function snapNearZero(value: number): number {
  return Math.abs(value) < NEAR_ZERO ? 0 : value;
}

function ensureFinite(value: number, start: number, end: number): EvalResult {
  if (!Number.isFinite(value)) {
    return createError(
      'OVERFLOW',
      'Calculation result is outside the supported range.',
      start,
      end,
    );
  }

  return { ok: true, value };
}

function normalizeOptions(options: EvaluateOptions): Required<EvaluateOptions> {
  return {
    ...DEFAULT_EVALUATE_OPTIONS,
    ...options,
  };
}

function createError(
  code: EvalError['code'],
  message: string,
  start: number,
  end: number,
): EvalResult {
  return {
    ok: false,
    error: {
      code,
      message,
      start,
      end: Math.max(end, start + 1),
    },
  };
}

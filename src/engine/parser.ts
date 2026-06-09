import type { EvalError, OperatorSymbol, ParseResult, Token } from './types';

const BINARY_PRECEDENCE: Record<OperatorSymbol, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 4,
};

const RIGHT_ASSOCIATIVE_OPERATORS = new Set<OperatorSymbol>(['^']);
const UNARY_PRECEDENCE = 3;

export function parseTokens(tokens: Token[]): ParseResult {
  const parser = new Parser(tokens);
  return parser.parse();
}

class Parser {
  private position = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): ParseResult {
    if (this.tokens.length === 0) {
      return {
        ok: false,
        error: createError('EMPTY_EXPRESSION', 'Enter an expression to calculate.', 0, 1),
      };
    }

    const expression = this.parseExpression(0);

    if (!expression.ok) {
      return expression;
    }

    const trailing = this.peek();

    if (trailing !== undefined) {
      return {
        ok: false,
        error: createError(
          trailing.type === 'rightParen' ? 'MISMATCHED_PAREN' : 'UNEXPECTED_TOKEN',
          trailing.type === 'rightParen'
            ? 'Closing parenthesis has no matching opening parenthesis.'
            : `Unexpected token "${trailing.raw}".`,
          trailing.start,
          trailing.end,
        ),
      };
    }

    return expression;
  }

  private parseExpression(minPrecedence: number): ParseResult {
    const leftResult = this.parsePrefix();

    if (!leftResult.ok) {
      return leftResult;
    }

    let left = leftResult.node;

    while (true) {
      const operator = this.peek();

      if (operator?.type !== 'operator') {
        break;
      }

      const precedence = BINARY_PRECEDENCE[operator.value];

      if (precedence < minPrecedence) {
        break;
      }

      this.advance();

      const nextMinPrecedence = RIGHT_ASSOCIATIVE_OPERATORS.has(operator.value)
        ? precedence
        : precedence + 1;
      const rightResult = this.parseExpression(nextMinPrecedence);

      if (!rightResult.ok) {
        return rightResult;
      }

      left = {
        type: 'binary',
        operator: operator.value,
        left,
        right: rightResult.node,
        start: left.start,
        end: rightResult.node.end,
      };
    }

    return { ok: true, node: left };
  }

  private parsePrefix(): ParseResult {
    const token = this.peek();

    if (token === undefined) {
      const lastToken = this.tokens.at(-1);
      const start = lastToken?.end ?? 0;

      return {
        ok: false,
        error: createError(
          'UNEXPECTED_TOKEN',
          'Expected a number or opening parenthesis.',
          start,
          start + 1,
        ),
      };
    }

    if (token.type === 'operator' && (token.value === '+' || token.value === '-')) {
      this.advance();

      const argument = this.parseExpression(UNARY_PRECEDENCE);

      if (!argument.ok) {
        return argument;
      }

      return {
        ok: true,
        node: {
          type: 'unary',
          operator: token.value,
          argument: argument.node,
          start: token.start,
          end: argument.node.end,
        },
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ParseResult {
    const token = this.peek();

    if (token === undefined) {
      const lastToken = this.tokens.at(-1);
      const start = lastToken?.end ?? 0;

      return {
        ok: false,
        error: createError(
          'UNEXPECTED_TOKEN',
          'Expected a number or opening parenthesis.',
          start,
          start + 1,
        ),
      };
    }

    if (token.type === 'number') {
      this.advance();
      return {
        ok: true,
        node: {
          type: 'number',
          value: token.value,
          start: token.start,
          end: token.end,
        },
      };
    }

    if (token.type === 'constant') {
      this.advance();
      return {
        ok: true,
        node: {
          type: 'constant',
          name: token.name,
          start: token.start,
          end: token.end,
        },
      };
    }

    if (token.type === 'function') {
      this.advance();

      const argument = this.parseExpression(UNARY_PRECEDENCE);

      if (!argument.ok) {
        return argument;
      }

      return {
        ok: true,
        node: {
          type: 'functionCall',
          name: token.name,
          argument: argument.node,
          start: token.start,
          end: argument.node.end,
        },
      };
    }

    if (token.type === 'leftParen') {
      this.advance();

      const expression = this.parseExpression(0);

      if (!expression.ok) {
        return expression;
      }

      const closing = this.peek();

      if (closing?.type !== 'rightParen') {
        return {
          ok: false,
          error: createError(
            'MISMATCHED_PAREN',
            'Opening parenthesis is missing a closing parenthesis.',
            token.start,
            token.end,
          ),
        };
      }

      this.advance();

      return {
        ok: true,
        node: {
          ...expression.node,
          start: token.start,
          end: closing.end,
        },
      };
    }

    return {
      ok: false,
      error: createError(
        'UNEXPECTED_TOKEN',
        `Expected a number or opening parenthesis, received "${token.raw}".`,
        token.start,
        token.end,
      ),
    };
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private advance(): Token | undefined {
    const token = this.peek();

    if (token !== undefined) {
      this.position += 1;
    }

    return token;
  }
}

function createError(
  code: EvalError['code'],
  message: string,
  start: number,
  end: number,
): EvalError {
  return {
    code,
    message,
    start,
    end: Math.max(end, start + 1),
  };
}

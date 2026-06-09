export type OperatorSymbol = '+' | '-' | '*' | '/' | '^' | '%';

export type FunctionName =
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'sqrt'
  | 'log'
  | 'ln'
  | 'exp'
  | 'abs';

export type ConstantName = 'pi' | 'e';

export interface SourceSpan {
  start: number;
  end: number;
}

interface BaseToken extends SourceSpan {
  raw: string;
}

export interface NumberToken extends BaseToken {
  type: 'number';
  value: number;
}

export interface OperatorToken extends BaseToken {
  type: 'operator';
  value: OperatorSymbol;
}

export interface FunctionToken extends BaseToken {
  type: 'function';
  name: FunctionName;
}

export interface ConstantToken extends BaseToken {
  type: 'constant';
  name: ConstantName;
}

export interface ParenthesisToken extends BaseToken {
  type: 'leftParen' | 'rightParen';
}

export type Token = NumberToken | OperatorToken | FunctionToken | ConstantToken | ParenthesisToken;

export type TokenizeErrorCode = 'INVALID_CHARACTER' | 'INVALID_NUMBER' | 'UNKNOWN_IDENTIFIER';

export interface TokenizeError extends SourceSpan {
  code: TokenizeErrorCode;
  message: string;
}

export type TokenizeResult = { ok: true; tokens: Token[] } | { ok: false; error: TokenizeError };

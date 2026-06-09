export type OperatorSymbol = '+' | '-' | '*' | '/' | '^' | '%';

export type FunctionName =
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'sqrt'
  | 'cbrt'
  | 'log'
  | 'ln'
  | 'exp'
  | 'abs';

export type ConstantName = 'pi' | 'e';

export type AngleMode = 'rad' | 'deg';

export interface EvaluateOptions {
  angleMode?: AngleMode;
}

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

export type AstNode =
  | NumberAstNode
  | ConstantAstNode
  | UnaryAstNode
  | BinaryAstNode
  | FunctionCallAstNode;

export interface NumberAstNode extends SourceSpan {
  type: 'number';
  value: number;
}

export interface ConstantAstNode extends SourceSpan {
  type: 'constant';
  name: ConstantName;
}

export interface UnaryAstNode extends SourceSpan {
  type: 'unary';
  operator: '+' | '-';
  argument: AstNode;
}

export interface BinaryAstNode extends SourceSpan {
  type: 'binary';
  operator: OperatorSymbol;
  left: AstNode;
  right: AstNode;
}

export interface FunctionCallAstNode extends SourceSpan {
  type: 'functionCall';
  name: FunctionName;
  argument: AstNode;
}

export type EvalErrorCode =
  | TokenizeErrorCode
  | 'EMPTY_EXPRESSION'
  | 'UNEXPECTED_TOKEN'
  | 'MISMATCHED_PAREN'
  | 'UNSUPPORTED_TOKEN'
  | 'DOMAIN_ERROR'
  | 'DIVIDE_BY_ZERO'
  | 'OVERFLOW';

export interface EvalError extends SourceSpan {
  code: EvalErrorCode;
  message: string;
}

export type ParseResult = { ok: true; node: AstNode } | { ok: false; error: EvalError };

export type EvalResult = { ok: true; value: number } | { ok: false; error: EvalError };

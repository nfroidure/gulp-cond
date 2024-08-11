import { PassThrough, type Duplex } from 'node:stream';

export default function gulpCond(
  condition: (() => boolean) | boolean,
  expr1: (() => Duplex) | Duplex,
  expr2?: (() => Duplex) | Duplex,
) {
  const value = typeof condition === 'function' ? condition() : condition;

  if (value) {
    return typeof expr1 === 'function' ? expr1() : expr1;
  }

  if (expr2) {
    return typeof expr2 === 'function' ? expr2() : expr2;
  }

  return new PassThrough({ objectMode: true });
}

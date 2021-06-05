import { Decoder } from './decoder';
import { DecodeError, DecodeTypeError } from "./error";

export const string = new Decoder<string, string>(
  value => {
    if (typeof value !== 'string') {
      throw new DecodeTypeError(`Expected string but got ${typeof value}`);
    }

    return value;
  }
);

export const stringLiteral = <T extends string>(literalValue: T) => new Decoder<T, T>(
  value => {
    if (value !== literalValue) {
      throw new DecodeError(`Expected string literal: "${literalValue}", got "${value}"`);
    }

    return literalValue;
  }
);
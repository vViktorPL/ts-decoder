import { Decoder } from './decoder';
import {DecodeError} from "./error";

export const number = new Decoder<number, number>(
  value => {
    if (typeof value !== 'number') {
      throw new DecodeError(`Expected number but got ${typeof value}`);
    }

    return value;
  }
);

export const numberLiteral = <T extends number>(literalValue: T) => new Decoder<T, T>(
  value => {
    if (value !== literalValue) {
      throw new DecodeError(`Expected number literal: "${literalValue}", got "${value}"`);
    }

    return literalValue;
  }
);
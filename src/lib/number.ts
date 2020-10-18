import { DecodeError, Decoder } from './decoder';

export const number = new Decoder(
  value => {
    if (typeof value !== 'number') {
      throw new DecodeError(`Expected number but got ${typeof value}`);
    }

    return value;
  }
);

export const numberLiteral = <T extends number>(literalValue: T) => new Decoder(
  value => {
    if (value !== literalValue) {
      throw new DecodeError(`Expected number literal: "${literalValue}", got "${value}"`);
    }

    return literalValue;
  }
);
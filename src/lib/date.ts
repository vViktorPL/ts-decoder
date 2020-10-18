import {DecodeError, Decoder} from "./decoder";
import {string} from "./string";
import {number} from "./number";

export const dateFromString = string.map(
  value => {
    const date = new Date(value);
    if (isNaN(+date)) {
      throw new DecodeError('Invalid date');
    }

    return date;
  }
);

const dateFromNumber = (multiplier: number) => number.map(
  value => {
    const date = new Date(value * multiplier);
    if (isNaN(+date)) {
      throw new DecodeError('Invalid date');
    }

    return date;
  }
);

export const dateFromPosix = dateFromNumber(1000)
export const dateFromMs = dateFromNumber(1);
import { Decoder } from './decoder';
import {DecodeError, DecodeTypeError} from "./error";

export const boolean = new Decoder<boolean, boolean>(
  value => {
    if (typeof value !== 'boolean') {
      throw new DecodeTypeError(`Expected boolean but got ${typeof value}`);
    }

    return value;
  }
);
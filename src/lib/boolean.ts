import { Decoder } from './decoder';
import {DecodeError} from "./error";

export const boolean = new Decoder<boolean, boolean>(
  value => {
    if (typeof value !== 'boolean') {
      throw new DecodeError(`Expected boolean but got ${typeof value}`);
    }

    return value;
  }
);
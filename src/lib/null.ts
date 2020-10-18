import {DecodeError, Decoder} from "./decoder";
import {union} from "./union";

export const nullValue = new Decoder(
  value => {
    if (value !== null) {
      throw new DecodeError(`Expected null but got: ${typeof value}`);
    }

    return null as null;
  }
);

export const nullable = <T>(decoder: Decoder<T>) =>
  union(decoder, nullValue);
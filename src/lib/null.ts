import {DecodeError, Decoder} from "./decoder";
import {union} from "./union";

export const nullValue = new Decoder<null, null>(
  value => {
    if (value !== null) {
      throw new DecodeError(`Expected null but got: ${typeof value}`);
    }

    return null as null;
  }
);

export const nullable = <TDecoder extends Decoder<any, any>>(decoder: TDecoder) =>
  union(decoder, nullValue);
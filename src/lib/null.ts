import {Decoder} from "./decoder";
import {union} from "./union";
import {DecodeTypeError} from "./error";

export const nullValue = new Decoder<null, null>(
  value => {
    if (value !== null) {
      throw new DecodeTypeError(`Expected null but got: ${typeof value}`);
    }

    return null as null;
  }
);

export const nullable = <TDecoder extends Decoder<any, any>>(decoder: TDecoder) =>
  union(decoder, nullValue);
import { Decoder } from './decoder';
import {DecoderValidInput, DecoderValue} from "./utils";
import {DecodeError} from "./error";

export const union = <T extends [Decoder<any, any>, ...Array<Decoder<any, any>>]>(...decoders: T) => new Decoder<
  DecoderValidInput<T[number]>,
  DecoderValue<T[number]>
>(
  value => {
    for (const i in decoders) {
      try {
        return decoders[i].decode(value)
      } catch (e) {}
    }

    throw new DecodeError('None of the union decoders match this value');
  }
);
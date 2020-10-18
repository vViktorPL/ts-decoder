import { DecodeError, Decoder } from './decoder';

export const union = <T extends [Decoder<any>, ...Array<Decoder<any>>]>(...decoders: T) => new Decoder(
  value => {
    for (const i in decoders) {
      try {
        return decoders[i].decode(value) as T extends Array<Decoder<infer D>>? D : never
      } catch (e) {}
    }

    throw new DecodeError('None of the union decoders match this value');
  }
);
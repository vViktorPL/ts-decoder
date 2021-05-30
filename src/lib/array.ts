import { DecodeError, DecodeErrorWithPath, Decoder } from './decoder';
import {DecoderValidInput, DecoderValue, NonEmptyArray, pathToString} from "./utils";

export const arrayOf = <TDecoder extends Decoder<any, any>>(entryDecoder: TDecoder) => new Decoder<
  DecoderValidInput<TDecoder>[],
  DecoderValue<TDecoder>[]
>(
  value => {
    if (!Array.isArray(value)) {
      throw new DecodeError('Value is not an array');
    }

    return value.map(
      (entry, index) => {
        try {
          return entryDecoder.decode(entry);
        } catch (e) {
          if (e instanceof DecodeErrorWithPath) {
            throw new DecodeErrorWithPath(
              `Error at path ${pathToString(e.path)}`,
              [index, ...e.path],
              e.leafError
            )
          } else if (e instanceof  DecodeError) {
            throw new DecodeErrorWithPath(
              `Error at index ${index}: ${e.message}`,
              [index],
              e
            );
          }

          throw e;
        }
      }
    )
  }
);

const isNonEmptyArray = <T>(a: T[]): a is NonEmptyArray<T> => a.length > 0;

export const nonEmptyArrayOf = <TDecoder extends Decoder<any, any>>(entryDecoder: TDecoder) =>
  arrayOf(entryDecoder).refine(isNonEmptyArray);

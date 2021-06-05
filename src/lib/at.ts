import {Decoder} from "./decoder";
import {DecoderValidInput, DecoderValue, NonEmptyArray, pathToString} from "./utils";
import {DecodeError, DecodeErrorWithPath} from "./error";

type ValidInputForKey<TKey, TValue> =
  TKey extends string ?
    Record<TKey, TValue> :
    TValue[];

type ValidInputForPath<TPath extends [...any[]], TValue> =
  TPath extends [infer THead, ...infer TTail]
    ? ValidInputForKey<THead, ValidInputForPath<TTail, TValue>>
    : TValue;

type K = string | number;

export function at<TKey extends string, TDecoder extends Decoder>(key: TKey, valueDecoder: TDecoder): Decoder<
  Record<TKey, DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder>(index: number, valueDecoder: TDecoder): Decoder<
  DecoderValidInput<TDecoder>[],
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder, P1 extends K>(path: [P1], valueDecoder: TDecoder): Decoder<
  ValidInputForPath<[P1], DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder, P1 extends K, P2 extends K>(path: [P1, P2], valueDecoder: TDecoder): Decoder<
  ValidInputForPath<[P1, P2], DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder, P1 extends K, P2 extends K, P3 extends K>(path: [P1, P2, P3], valueDecoder: TDecoder): Decoder<
  ValidInputForPath<[P1, P2, P3], DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder, P1 extends K, P2 extends K, P3 extends K, P4 extends K>(path: [P1, P2, P3, P4], valueDecoder: TDecoder): Decoder<
  ValidInputForPath<[P1, P2, P3, P4], DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder, P1 extends K, P2 extends K, P3 extends K, P4 extends K, P5 extends K>(path: [P1, P2, P3, P4, P5], valueDecoder: TDecoder): Decoder<
  ValidInputForPath<[P1, P2, P3, P4, P5], DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder, P1 extends K, P2 extends K, P3 extends K, P4 extends K, P5 extends K, P6 extends K>(path: [P1, P2, P3, P4, P5], valueDecoder: TDecoder): Decoder<
  ValidInputForPath<[P1, P2, P3, P4, P5, P6], DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder, TPath extends NonEmptyArray<K>>(path: TPath, valueDecoder: TDecoder): Decoder<
  ValidInputForPath<TPath, DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TDecoder extends Decoder>(keyOrPath: string|number|NonEmptyArray<string | number>, valueDecoder: TDecoder): Decoder<object, unknown> {
  const path: any[] = Array.isArray(keyOrPath) ? keyOrPath : [keyOrPath];

  return new Decoder(
    value => {
      const resolvedValue = path.reduce(
        (currentNode: any, key: any) => {
          if (typeof currentNode !== 'object' || currentNode === null) {
            throw new DecodeError(`Couldn't resolve path: ${pathToString(path)}`);
          }

          return (currentNode as any)[key];
        },
        value
      );

      try {
        return valueDecoder.decode(resolvedValue)
      } catch (e) {
        if (e instanceof DecodeError) {
          throw new DecodeErrorWithPath(e.message, path, e);
        }

        throw e;
      }
    }
  );

}
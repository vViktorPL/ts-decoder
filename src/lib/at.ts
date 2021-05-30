import {DecodeError, DecodeErrorWithPath, Decoder} from "./decoder";
import {DecoderValidInput, DecoderValue, NonEmptyArray, pathToString} from "./utils";

export function at<TKey extends string, TDecoder extends Decoder<any, any>>(key: TKey, valueDecoder: TDecoder): Decoder<
  Record<TKey, DecoderValidInput<TDecoder>>,
  DecoderValue<TDecoder>
>;
export function at<TIndex extends number, TDecoder extends Decoder<any, any>>(index: TIndex, valueDecoder: TDecoder): Decoder<
  DecoderValidInput<TDecoder>[],
  DecoderValue<TDecoder>
>;
// TODO: use TS template string conditional types to infer object that has specific path
// export function at<T>(path: NonEmptyArray<string|number>, valueDecoder: Decoder<T>): Decoder<T>;
export function at<TDecoder extends Decoder<any, any>>(keyOrPath: string|number /*|NonEmptyArray<string|number>*/, valueDecoder: TDecoder): Decoder<object, unknown> {
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
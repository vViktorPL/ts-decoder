import {DecodeError, DecodeErrorWithPath, Decoder} from "./decoder";
import {NonEmptyArray, pathToString} from "./utils";

export function at<T>(key: string, valueDecoder: Decoder<T>): Decoder<T>;
export function at<T>(index: number, valueDecoder: Decoder<T>): Decoder<T>;
export function at<T>(path: NonEmptyArray<string|number>, valueDecoder: Decoder<T>): Decoder<T>;
export function at<T>(keyOrPath: string|number|NonEmptyArray<string|number>, valueDecoder: Decoder<T>): Decoder<T> {
  const path = Array.isArray(keyOrPath) ? keyOrPath : [keyOrPath];

  return new Decoder(
    value => {
      const resolvedValue = path.reduce(
        (currentNode, key) => {
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
import {Decoder} from "./decoder";

export type NonEmptyArray<T> = [T, ...T[]];

export type DecoderValue<T> = T extends Decoder<infer V> ? V : never;

export const pathToString = (path: Array<string|number>) =>
  (path.length === 1 && typeof path[0] === 'number') ?
    `[${path[0]}]` :
    path.reduce(
      (path, currentKey) => path + (typeof currentKey === 'number' ? `[${currentKey}]` : `.${currentKey}`)
    );
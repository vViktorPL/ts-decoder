import { Decoder } from "./decoder";

export const hardcoded = <T>(value: T) => new Decoder(() => value);
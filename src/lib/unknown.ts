import { Decoder } from "./decoder";

export const unknown = new Decoder<unknown, unknown>(
  value => value
);
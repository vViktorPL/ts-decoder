import {string} from "./string";
import {DecodeError} from "./error";

export const url = string.map(value => {
  try {
    return new URL(value);
  } catch (error) {
    throw new DecodeError("Invalid URL");
  }
});
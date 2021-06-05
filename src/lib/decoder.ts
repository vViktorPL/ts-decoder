import {DecoderValidInput, DecoderValue} from "./utils";
import {DecodeError} from "./error";

export type DecoderFn<T> = (value: unknown) => T;

// declare const Tags: unique symbol;



// export type Tagged<Tag extends string, Type> = Type & {
//   [Tags]: {
//     [t in Tag]: true
//   }
// }

export class Decoder<TValidInput = unknown, TOutput = unknown> {
  private readonly fn: DecoderFn<TOutput>;

  constructor(fn: DecoderFn<TOutput>) {
    this.fn = fn;
  }

  public map<TNewOutput>(f: (a: TOutput) => TNewOutput): Decoder<TValidInput, TNewOutput> {
    return new Decoder(
      (value: unknown) => f(this.fn(value))
    );
  }

  public mapError(f: (error: DecodeError) => DecodeError): Decoder<TValidInput, TOutput> {
    return new Decoder(
      (value: unknown) => {
        try {
          return this.fn(value);
        } catch (error) {
          throw f(error);
        }
      }
    )
  }

  public andThen<TNewDecoder extends Decoder<any, any>>(f: (v: TOutput) => TNewDecoder) {
    return new Decoder<TValidInput & DecoderValidInput<TNewDecoder>, DecoderValue<TNewDecoder>>(
      (value: unknown) => {
        const decodedValue = this.fn(value);
        return f(decodedValue).decode(value);
      }
    )
  }

  public refine<T extends TOutput>(f: (v: TOutput) => v is T): Decoder<TValidInput, T>;
  public refine(f: (v: TOutput) => boolean): Decoder<TValidInput, TOutput>;
  public refine<T extends TOutput>(f: (v: TOutput) => v is T): Decoder<TValidInput, T> {
    return new Decoder<TValidInput, T>(
      (value: unknown) => {
        const decodedValue = this.fn(value);

        if (!f(decodedValue)) {
          throw new DecodeError('Value does not satisfy predicate');
        }

        return value as T;
      }
    )
  }

  public decode<TValue>(value: TValue) {
    return this.fn(value) as unknown extends TValue ? TOutput : TValue extends TValidInput ? TOutput : never;
  }

  public decodeJSON(json: string): TOutput {
    return this.decode(JSON.parse(json));
  }

  public fallback<T>(fallbackValue: T) {
    return new Decoder(
      (value: unknown) => {
        try {
          return this.fn(value);
        } catch (e) {
          return fallbackValue;
        }
      }
    )
  }
}
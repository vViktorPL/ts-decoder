export type DecoderFn<T> = (value: unknown) => T;

// declare const Tags: unique symbol;

class BaseError {
  constructor (public message: string) {
    Error.call(this, message);
  }
}
BaseError.prototype = new Error();

export class DecodeError extends BaseError {}


export class DecodeErrorWithPath extends DecodeError {
  public path: (string|number)[];
  public leafError: DecodeError;

  constructor(message: string, path: (string|number)[], leafError: DecodeError) {
    super(message);
    this.path = path;
    this.leafError = leafError;
  }
}

// export type Tagged<Tag extends string, Type> = Type & {
//   [Tags]: {
//     [t in Tag]: true
//   }
// }

export class Decoder<A> {
  protected fn: DecoderFn<A>;

  constructor(fn: DecoderFn<A>) {
    this.fn = fn;
  }

  public map<B>(f: (a: A) => B): Decoder<B> {
    return new Decoder(
      (value: unknown) => f(this.fn(value))
    );
  }

  public mapError(f: (error: DecodeError) => DecodeError): Decoder<A> {
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

  public andThen<B>(f: (v: A) => Decoder<B>): Decoder<B> {
    return new Decoder<B>(
      (value: unknown) => {
        const decodedValue = this.fn(value);
        return f(decodedValue).fn(decodedValue);
      }
    )
  }

  public refine<T extends A>(f: (v: A) => v is T): Decoder<T>;
  public refine(f: (v: A) => boolean): Decoder<A>;
  public refine<T extends A>(f: (v: A) => v is T): Decoder<T> {
    return new Decoder<T>(
      (value: unknown) => {
        const decodedValue = this.fn(value);

        if (!f(decodedValue)) {
          throw new DecodeError('Value does not satisfy predicate');
        }

        return value as T;
      }
    )
  }

  public decode(value: unknown): A {
    return this.fn(value);
  }

  public decodeJSON(json: string): A {
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
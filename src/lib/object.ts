import {DecodeError, DecodeErrorWithPath, Decoder} from "./decoder";
import {DecoderValue, pathToString} from "./utils";

export type ObjectSchema = { [key: string]: Decoder<any> };

export type ObjectDecoderOptions = Partial<{
  extraKeys: boolean;
  aggregateErrors: boolean;
}>;

export class AggregatedDecodeError extends DecodeError {
  constructor(message: string, public errors: DecodeError[]) {
    super(message);
  }
}

export const object = <T extends ObjectSchema>(
  schema: T,
  {
    extraKeys = false,
    aggregateErrors = false,
  }: ObjectDecoderOptions = {}
) => {
  return new Decoder(value => {
    if (typeof value !== 'object') {
      throw new DecodeError(`Expected object, got "${typeof value}"`)
    } else if (value === null) {
      throw new DecodeError('Expected object, got "null"');
    } else if (!extraKeys && Object.keys(value).length > Object.keys(schema).length) {
      const extraKeysList = Object.keys(value)
        .filter(key => !(key in schema))
        .map(key => `"${key}"`)
        .join(", ");

      throw new DecodeError(
        extraKeysList.length === 1 ?
          `This extra key is not allowed: ${extraKeysList[0]}` :
          `These extra keys are not allowed: ${extraKeysList}`
      );
    }

    let result = {};
    let errors = [];
    for (const key in schema) {
      if (!(key in value) && !(schema[key] instanceof OptionalDecoder)) {
        errors.push(new DecodeError(`Missing key: ${key}`));
        if (!aggregateErrors) {
          throw errors[0];
        } else {
          continue;
        }
      }

      try {
        (result as any)[key] = schema[key].decode((value as any)[key]);
      } catch (e) {
        if (e instanceof DecodeErrorWithPath) {
          errors.push(new DecodeErrorWithPath(
            `Error at path ${pathToString([key, ...e.path])}: ${e.leafError.message}`,
            [key, ...e.path],
            e.leafError
          ));
        } else if (e instanceof DecodeError) {
          errors.push(new DecodeErrorWithPath(`Error at key ${key}: ${e.message}`, [key], e));
        }

        errors.push(e);

        if (!aggregateErrors) {
          throw errors[0];
        }
      }
    }

    if (errors.length > 0) {
      throw new AggregatedDecodeError('One or more object key values are invalid', errors);
    }

    return result as { [key in keyof T]: DecoderValue<T[key]> };
  })
};

export class OptionalDecoder<T> extends Decoder<T|undefined> {
  withDefault<Default>(defaultValue: Default) {
    return this.map(
      value => value === undefined
        ? defaultValue as Default extends T ? T : Default
        : (value as Exclude<T, undefined>)
    );
  }
}

export const optional = <T>(decoder: Decoder<T>) => new OptionalDecoder(
  value => value === undefined ? undefined : decoder.decode(value)
);

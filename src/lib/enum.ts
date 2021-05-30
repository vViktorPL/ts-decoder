import {DecodeError, Decoder} from "./decoder";

const getEnumValues = (enumObject: object) => {
  const values: (string | number)[] = [];

  for (let key in enumObject) {
    if (typeof (enumObject as any)[key] === "number" || (key !== "0" && !/^[1-9]([0-9]*)$/.test(key))) {
      values.push((enumObject as any)[key]);
    }
  }

  return values;
}

export const enumValue = <TEnum>(enumFromRuntime: object) => {
  const enumValues = getEnumValues(enumFromRuntime);
  const expectedEnumValues = enumValues.map(value => JSON.stringify(value)).join(", ");

  return new Decoder<string | number, TEnum>(
    value => {
      if ((typeof value !== "string" && typeof value !== "number") || enumValues.indexOf(value) === -1) {
        throw new DecodeError(`Invalid enum value. Expected one of these values: ${expectedEnumValues}`);
      }

      return value as any as TEnum;
    }
  )
}
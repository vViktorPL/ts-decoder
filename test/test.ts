import { number, object, string, union, nullValue, at, arrayOf, optional} from "../src/lib";
import {DecoderValidInput, DecoderValue} from "../src/lib/utils";
import {enumValue} from "../src/lib/enum";
const songName = at('name', string);
const hobby = object({
  name: string,
  icon: string.refine(s => s.length <= 1)
});

type PersonInput = DecoderValidInput<typeof person>;
type Person = DecoderValue<typeof person>;

const person = object({
  name: optional(string).withDefault("Anonymous"),
  age: number,
  favoriteSong: union(string, songName, nullValue.map(() => 'N/A')),
  hobbies: optional(arrayOf(hobby)).withDefault([]),
});

const p = person
  .decode({ "name": "John", "age": 1, "favoriteSong": "x", "hobbies": [{"name": "", "icon": "A"}]});

const versionedApi = at('version', number.refine((v): v is keyof typeof apiDecoders => v in apiDecoders)).andThen(
  version => apiDecoders[version]
)

const v1Decoder = object({
  name: string,
});

const v2Decoder = object({
  firstName: string,
  lastName: string,
});

const apiDecoders = {
  1: v1Decoder,
  2: v2Decoder,
};


enum TestEnum {
  "Value0",
  "01" = "1",
  "" = 15,
  A,
  X,
}

const enumDecoder = enumValue<TestEnum>(TestEnum);

// OK
enumDecoder.decode(0);
enumDecoder.decode("1");
enumDecoder.decode(15);
enumDecoder.decode(16);
enumDecoder.decode(17);

// Not OK:
enumDecoder.decode("");
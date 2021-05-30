import { number, object, string, union, nullValue, at, arrayOf, optional} from "../src/lib";
import { DecoderValue } from "../src/lib/utils";
const songName = at('name', string);
const hobby = object({
  name: string,
  icon: string.refine(s => s.length <= 1)
});

type Person = DecoderValue<typeof person>;

const person = object({
  name: optional(string).withDefault("Anonymous"),
  age: number,
  favoriteSong: union(string, songName, nullValue.map(() => 'N/A')),
  hobbies: optional(arrayOf(hobby)).withDefault([]),
});

person
  .decode({ "name": "John", "age": 1, "favoriteSong": "x", "hobbies": [{"name": 1, "icon": "A"}]});

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

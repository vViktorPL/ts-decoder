import {Decoder, number, object, string, union, nullValue, at, arrayOf, optional} from "./index";
const songName = at('name', string);
const hobby = object({
  name: string,
  icon: string.refine(s => s.length <= 1)
});

const person = object({
  name: optional(string).withDefault("Anonymous"),
  age: number,
  favoriteSong: union(string, songName, nullValue.map(() => 'N/A')),
  hobbies: optional(arrayOf(hobby)).withDefault([]),
});

person
  .decode({ "name": "John", "age": 1, "favoriteSong": "x", "hobbies": [{"name": 1, "icon": "A"}]});
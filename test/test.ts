import {Decoder, number, unknown, stringLiteral, object, string, optional, combine, at} from '../src/lib/index';


const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const natFromString = string
  .refine(value => /^\d+$/.test(value))
  .map(parseInt);

const pageNumberDecoder = optional(natFromString)
  .map(value => (value || 1) - 1);
const pageSizeDecoder = optional(natFromString)
  .withDefault(DEFAULT_PAGE_SIZE)
  .refine(value => value > 0 && value <= MAX_PAGE_SIZE);

const queryParamsDecoder = string.map(
  value => {
    const result: Record<string, string> = {};
    const url = new URL(value);

    url.searchParams.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }
)

const paginationDecoder = combine({
  page: at("p", pageNumberDecoder),
  pageSize: at("s", pageSizeDecoder),
});

const fancy = at([0, "payload", "name", "firstName"], string);

fancy.decode([{ payload: { name: { firstName: "a"} } }])

const paginationFromUrlDecoder = queryParamsDecoder.andThen(
  (params) => unknown.map(() => params) as any
).andThen(
  () => paginationDecoder
)

// const paginationFromUrlDecoder = string.map(value => {
//   const { searchParams } = new URL(value);
//
//   return {
//     page: searchParams.get("page"),
//     pageSize: searchParams.get("pageSize"),
//   };
// }).map(() => paginationDecoder());

console.log(paginationFromUrlDecoder.decode("http://localhost/?p=3"));
console.log(paginationFromUrlDecoder.decode("http://localhost/?s=50"));
console.log(paginationFromUrlDecoder.decode("http://localhost/?p=0&s=20"));
console.log(paginationFromUrlDecoder.decode("http://localhost/?p=1"));



const x = object({
  host: string,
  port: number,
})

const appConfigParser = combine({
  database: combine({
    host: at("DB_HOST", string),
    port: at("DB_PORT", natFromString),
  }),
});

// const appConfig = appConfigParser.decode(process.env);

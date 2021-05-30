# Smartly-typed Decoder

## Motivation

Applications written in statically-typed manner can make "once it compiles, it just works!" feature more likely to come true.
In TypeScript however, static typing is optional. Hence, it cannot fully guarantee that runtime errors won't happen.
There exist at least one potential source of runtime errors. One of such is API JSON response. This
package makes it easy to compose decoders that can be perceived as border control between statically-typed app and
untyped values (of type `any` or `unknown`) that may come from JSON parsing process.

How decoders could help:

* 🛂 They perform validation so incorrect values won't show up in unexpected places (like `NaN` string inside the span element in the DOM due to adding `undefined` that came from the backend, to a number)
* 🏷️ They support TypeScript by tagging "validated" value with correct type (if it is correct)
* 🔁 They can easily transform the value to more desired shape in accordance with ["Parse don't validate"](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) philosophy

The first two points can be addressed by using some existing popular validation libraries (like [typesafe-joi](https://github.com/hjkcai/typesafe-joi) fork), but the third point
is the extra thing that decoders can be good at.

## Examples



```typescript
import { Decoder } from 'smartly-typed-decoder';

// TO BE DONE

```

## Alternatives

There are some existing "decoder" libraries but IMHO they have some drawbacks (which inspired me to write this library by the way):

* [io-ts](https://github.com/gcanti/io-ts) - nice library but wrapping errors with `Either` may be not so intuitive for devs that are not functional programming fans
* [superstruct](https://github.com/ianstormtaylor/superstruct) - pretty similar library to this one, but IMHO coercing type-inference has room for improvement
* [type-safe-json-decoder](https://github.com/ooesili/type-safe-json-decoder) - nicely imitates [Elm](https://elm-lang.org) decoders but for instance using `map` or `andThen` on them in JS/TS syntax isn't so readable as it is in Elm which has support for pipe operator (`|>`)

But this is just an opinion! These three are great projects that you may consider depending on your preferences :)

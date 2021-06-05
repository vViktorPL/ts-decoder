#! /usr/bin/env node

const fs = require('fs');
const data = fs.readFileSync(0, 'utf-8');
const prettier = require('prettier');

console.log(prettier.format(decoderFromValue(JSON.parse(data)), { parser: "typescript"}));

function decoderFromValue (value) {
  const usedDecoders = new Set();
  function valueToCode(jsonValue) {
    if (typeof jsonValue === "string") {
      if (/^https?/.test(jsonValue)) {
        usedDecoders.add("url");
        return "url";
      }

      usedDecoders.add("string");
      return "string";
    } else if (typeof jsonValue === "number") {
      usedDecoders.add("number");
      return "number";
    } else if (typeof jsonValue === "boolean"){
      usedDecoders.add("boolean");
      return "boolean";
    } else if (jsonValue === null) {
      usedDecoders.add("unknown");
      return "unknown";
    } else if (Array.isArray(jsonValue)) {
      usedDecoders.add("arrayOf");

      const uniqueValueDecoders = [...new Set(jsonValue.map(
        entryValue => valueToCode(entryValue)
      ))];

      if (uniqueValueDecoders.length === 0) {
        usedDecoders.add("unknown");
        return `arrayOf(unknown)`;
      } else if (uniqueValueDecoders.length === 1) {
        return `arrayOf(${uniqueValueDecoders[0]})`;
      }

      usedDecoders.add("union");

      return `arrayOf(union(${uniqueValueDecoders.join(", ")}))`;
    } else if (typeof jsonValue === "object") {
      usedDecoders.add("object");

      const entryDecoders = Object.keys(jsonValue).map(
        entryKey => `${entryKey}: ${valueToCode(jsonValue[entryKey])}`,
      )

      return `object({${entryDecoders.join(", ")}})`;
    }

    usedDecoders.add("unknown");
    return "unknown";
  }

  const decoderExpression = valueToCode(value);

  return `import { ${[...usedDecoders.keys()].join(", ")} } from 'smartly-typed-decoder';\n\nconst decoder = ${decoderExpression};`;
}


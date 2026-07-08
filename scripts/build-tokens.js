// Regenerates package/tokens.json from package/tokens.css (the canonical source).
// Groups follow the /* Comment */ section headers in the CSS.
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync("package/tokens.css", "utf8");
const groups = new Map();
let current = "misc";

for (const line of css.split("\n")) {
  const header = line.match(/^\s*\/\*\s*(.+?)\s*(?:\(.*\))?\s*\*\//);
  if (header && !header[1].includes("=====")) { current = header[1].trim(); continue; }
  const tok = line.match(/^\s*(--[a-z0-9-]+)\s*:\s*(.+?);/);
  if (tok) {
    if (!groups.has(current)) groups.set(current, []);
    groups.get(current).push({ name: tok[1], value: tok[2].trim() });
  }
}

const out = {
  $schema: "curie-design-tokens/v1",
  name: "Curie Design Tokens",
  source: "package/tokens.css",
  generatedBy: "scripts/build-tokens.js — do not edit by hand; edit tokens.css and regenerate",
  groups: [...groups.entries()].map(([name, tokens]) => ({ name, tokens })),
};
writeFileSync("package/tokens.json", JSON.stringify(out, null, 2));
console.log(`tokens.json: ${out.groups.length} groups, ${out.groups.reduce((n, g) => n + g.tokens.length, 0)} tokens`);

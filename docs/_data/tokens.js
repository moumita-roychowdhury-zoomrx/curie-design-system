import { readFileSync } from "node:fs";
export default JSON.parse(readFileSync("package/tokens.json", "utf8"));

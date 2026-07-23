import { readFileSync } from "node:fs";
export default JSON.parse(readFileSync("package/templates-manifest.json", "utf8")).templates;

import { readFileSync } from "node:fs";
export default JSON.parse(readFileSync("package/charts-manifest.json", "utf8"));

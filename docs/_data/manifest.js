import { readFileSync } from "node:fs";
export default JSON.parse(readFileSync("package/components-manifest.json", "utf8"));

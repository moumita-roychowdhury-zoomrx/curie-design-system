import { readFileSync } from "node:fs";
export default JSON.parse(readFileSync("package/components-mobile-manifest.json", "utf8"));

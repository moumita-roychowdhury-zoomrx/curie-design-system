import { readFileSync } from "node:fs";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
export default { version: pkg.version, name: "Curie Design System" };

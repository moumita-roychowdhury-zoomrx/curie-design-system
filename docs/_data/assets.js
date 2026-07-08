import { readFileSync } from "node:fs";
const cat = JSON.parse(readFileSync("package/assets-catalog.json", "utf8"));
const all = cat.assets || [];
export default {
  version: cat.version,
  all,
  icons: all.filter((a) => a.type === "icon"),
  illustrations: all.filter((a) => a.type === "illustration"),
};

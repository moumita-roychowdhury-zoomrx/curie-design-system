import fs from "node:fs";
import path from "node:path";
import { HtmlBasePlugin } from "@11ty/eleventy";

const OUT = "_site";

// Files that must exist in BOTH /css (docs + previews) and /examples (golden pages).
// NOTE: Eleventy keys addPassthroughCopy by *source* path, so registering the same
// source to two targets makes the second silently override the first — which used to
// drop /css and /assets entirely. So the primary location goes through passthrough
// (kept for fast --serve rebuilds) and the /examples mirror is written in an after hook.
const CSS_FILES = ["tokens.css", "components.css", "layout.css", "utilities.css", "responsive.css"];

export default function (eleventyConfig) {
  // Rewrites root-absolute URLs in generated HTML to respect --pathprefix, so the
  // site works when served from a GitHub Pages subpath (/curie-design-system/).
  // No-op locally (pathPrefix defaults to "/"). The golden example pages are
  // passthrough-copied and already use relative URLs, so they're unaffected.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // The docs read package/ (tokens.json, components-manifest.json, CSS) via _data
  // files that Eleventy can't infer as dependencies, so watch package/ explicitly —
  // otherwise `--serve` won't rebuild when the design system source changes.
  eleventyConfig.addWatchTarget("package/");

  // The design-system CSS, served at /css/ for docs + previews
  for (const f of CSS_FILES) {
    eleventyConfig.addPassthroughCopy({ [`package/${f}`]: `css/${f}` });
  }

  // Brand assets, served at /assets/ for docs + previews
  eleventyConfig.addPassthroughCopy({ "package/assets": "assets" });

  // Canonical golden pages, byte-identical. They live at /examples/pages/ and
  // reference ../tokens.css and ../Assets/… (i.e. /examples/…).
  eleventyConfig.addPassthroughCopy({ "package/examples": "examples/pages" });

  // Docs' own stylesheet
  eleventyConfig.addPassthroughCopy({ "docs/docs-theme.css": "docs-theme.css" });

  // Real page-local mobile CSS (ed-hero, edp, m-foryou, …) extracted from the golden
  // pages so the isolated mobile-component specimens render faithfully in the harness.
  eleventyConfig.addPassthroughCopy({ "docs/mobile-preview-extras.css": "mobile-preview-extras.css" });

  // Machine-readable surfaces, published so agents can fetch them from the site too
  eleventyConfig.addPassthroughCopy({ "package/tokens.json": "api/tokens.json" });
  eleventyConfig.addPassthroughCopy({ "package/components-manifest.json": "api/components-manifest.json" });
  eleventyConfig.addPassthroughCopy({ "package/assets-catalog.json": "api/assets-catalog.json" });

  // Mirror the CSS + assets into /examples/ (same source as /css + /assets, which
  // passthrough copy cannot duplicate). Runs after every build, including --serve.
  eleventyConfig.on("eleventy.after", () => {
    const examplesDir = path.join(OUT, "examples");
    fs.mkdirSync(examplesDir, { recursive: true });
    for (const f of CSS_FILES) {
      fs.copyFileSync(`package/${f}`, path.join(examplesDir, f));
    }
    fs.cpSync("package/assets", path.join(examplesDir, "Assets"), { recursive: true });
  });

  return {
    dir: { input: "docs", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
  };
}

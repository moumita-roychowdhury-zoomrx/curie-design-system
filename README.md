# Curie Design System

The single source of truth for Curie's visual language — ZoomRx's dark-themed medical-content platform for healthcare professionals — plus the documentation site generated from it.

## Structure

```
package/                      ← THE SOURCE OF TRUTH (consumers read only this)
├── tokens.css                ← canonical token values
├── tokens.json               ← generated from tokens.css (npm run tokens)
├── components.css            ← all component styling
├── layout.css  utilities.css
├── components-manifest.json  ← machine-readable component catalog (drives docs + AI plugins)
├── assets-catalog.json       ← machine-readable icon/illustration catalog
├── brand-principles.md
├── assets/                   ← logos, icons, illustrations
└── examples/                 ← the 8 canonical golden pages (reference, not templates)

docs/                         ← Eleventy templates that READ package/ and generate the site
├── _data/                    ← loads package/*.json into the templates
├── _includes/base.njk        ← page shell (sidebar nav + main column)
└── *.njk                     ← index, foundations, components, assets, previews, examples
scripts/build-tokens.js       ← regenerates tokens.json from tokens.css
eleventy.config.js            ← passthrough copy + build config
```

The docs site duplicates nothing: token pages render from `tokens.json`, component pages and previews from `components-manifest.json`, the asset gallery from `assets-catalog.json`, and previews load the real `components.css`. Change `package/`, rebuild, and the site follows. The built site republishes the machine-readable files at `/api/tokens.json`, `/api/components-manifest.json`, and `/api/assets-catalog.json`.

## Prerequisites

- **Node.js 18+** and npm (Eleventy 3 requires Node 18 or newer). Check with `node -v`.

## Setup & local development

```bash
git clone https://github.com/moumita-roychowdhury-zoomrx/curie-design-system.git
cd curie-design-system
npm install

npm run dev        # live-reload preview at http://localhost:8080
```

Other scripts:

```bash
npm run build      # regenerates tokens.json, then writes the full site to _site/
npm run tokens     # regenerates package/tokens.json from tokens.css only
```

`npm run dev` serves the site with hot reload. Config changes (`eleventy.config.js`) require restarting the dev server; content/CSS/template changes reload automatically.

## Editing workflow

- **Change a token** → edit `package/tokens.css` → `npm run build` (runs `tokens` first). Never edit `package/tokens.json` by hand — it's generated.
- **Add / edit a component** → edit `package/components.css`, then add or update its entry in `package/components-manifest.json` (copy an existing entry for the schema; the `snippet` markup should come verbatim from a golden page in `package/examples/`, never invented). Optional `variants[]` render multiple labeled specimens on the component page. The docs page, nav link, and live preview are generated automatically.
- **Add an icon / illustration** → drop the file in `package/assets/…` and add an entry to `package/assets-catalog.json` (`source: "file"` with a `path`, or `source: "inline"` with an `svg` string). It appears in the Assets gallery automatically.
- Bump `version` in `package.json` on releases and tag (`git tag v0.2.0`); the site header shows the version it was built from.

## Deploying

The site is a static build (`_site/`), so any static host works. Build command `npm run build`, output directory `_site`.

### Cloudflare Pages + Access (recommended for internal use)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select this repo.
   - Build command: `npm run build`
   - Output directory: `_site`
2. Every push to `main` auto-deploys; other branches get preview URLs.
3. Gate it: **Zero Trust → Access → Applications → Add → self-hosted**, point at the Pages domain (and `*.pages.dev` previews). Login: ZoomRx SSO. Policy: allow emails ending `@zoomrx.com`. (Free up to 50 users.)
4. Optional: add a custom domain (e.g. `curie-design.zoomrx.com`) in Pages settings — one CNAME from whoever manages DNS.

### GitHub Pages

Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy docs
on:
  push: { branches: [main] }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deploy.outputs.page_url }}" }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: _site }
      - id: deploy
        uses: actions/deploy-pages@v4
```

Then enable **Settings → Pages → Source: GitHub Actions**. (Note: GitHub Pages is public unless the repo is private on a plan that supports private Pages — for internal-only, prefer Cloudflare Access.)

### Netlify / Vercel

Same settings — build command `npm run build`, publish/output directory `_site`.

### Any host

`npm run build`, then upload the contents of `_site/` (e.g. to S3 + CloudFront, nginx, etc.).

## Consumers

- **People** — the hosted docs site (foundations, components with live previews + variants, the Icons & Illustrations gallery, and the golden page examples).
- **AI agents / Claude plugins** — consume `package/` directly via git (pin a tag), or fetch `/api/tokens.json`, `/api/components-manifest.json`, and `/api/assets-catalog.json` from the site. Plugins should carry no copies of tokens, component markup, or assets.

## Status

v0.1.0 — design tokens across 12 groups, **23 documented components** (with variants for side-nav states, page-header sections, the games grid, and home-banner themes), an asset library of **42 icons + 10 illustrations**, and 8 golden reference pages.

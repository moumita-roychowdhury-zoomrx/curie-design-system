# Curie Design System

The single source of truth for Curie's visual language — ZoomRx's dark-themed medical-content platform for HCPs — plus the documentation site generated from it.

## Structure

```
package/                      ← THE SOURCE OF TRUTH (consumers read only this)
├── tokens.css                ← canonical token values
├── tokens.json               ← generated from tokens.css (npm run tokens)
├── components.css            ← all component styling
├── layout.css  utilities.css
├── components-manifest.json  ← machine-readable component catalog (drives docs + AI plugins)
├── brand-principles.md
├── assets/                   ← logos, icons, illustrations (+ assets-catalog.json)
└── examples/                 ← the 8 canonical golden pages (reference, not templates)

docs/                         ← Eleventy templates that READ package/ and generate the site
scripts/build-tokens.js       ← regenerates tokens.json from tokens.css
```

The docs site duplicates nothing: token pages render from `tokens.json`, component pages from `components-manifest.json`, previews load the real CSS. Change the package, rebuild, and the site follows. The built site also republishes the two machine-readable files at `/api/tokens.json` and `/api/components-manifest.json`.

## Local development

```bash
npm install
npm run dev        # live-reload preview at http://localhost:8080
npm run build      # regenerates tokens.json, writes the site to _site/
```

## Editing workflow

- **Change a token** → edit `package/tokens.css` → `npm run tokens` (or just `npm run build`, which runs it).
- **Add a component** → append an entry to `package/components-manifest.json` (copy an existing entry for the schema; snippet markup should come verbatim from a golden page or the product bundle, never invented). The docs page, nav link, and live preview are generated automatically.
- **Never** edit `package/tokens.json` by hand — it's generated.
- Bump `version` in `package.json` on releases and tag (`git tag v0.2.0`); the site header shows the version it was built from.

## Deploying (Cloudflare Pages + Access)

1. Push this repo to GitHub (ZoomRx org preferred; personal account works and can be transferred later).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select the repo.
   - Build command: `npm run build`
   - Output directory: `_site`
3. Every push to `main` now auto-deploys; other branches get preview URLs.
4. **Zero Trust → Access → Applications → Add** → self-hosted → point at the Pages domain (and `*.pages.dev` previews). Login method: ZoomRx's Google/Microsoft SSO. Policy: allow emails ending `@zoomrx.com`. Free for up to 50 users.
5. Optional: add a custom domain (e.g. `curie-design.zoomrx.com`) in Pages settings — one CNAME from whoever manages DNS.

Any static host works identically (Netlify/Vercel: same build command and output dir; S3: upload `_site/`).

## Consumers

- **People** — the hosted docs site.
- **AI agents / Claude plugins** — consume `package/` directly via git (pin a tag), or fetch `/api/tokens.json` and `/api/components-manifest.json` from the site. Plugins should carry no copies of tokens or component markup.

## Status

v0.1.0 — 82 tokens across 12 groups, 8 documented components, 8 golden pages. Remaining components (FAQ, FAB, footer/chrome, featured brief, conference card, audio player…) are catalogued in `components.css` and should be added to the manifest incrementally.

# Curie Design System

The single source of truth for Curie's visual language — ZoomRx's dark-themed medical-content platform for healthcare professionals — plus the documentation site generated from it.

## Structure

```
package/                      ← THE SOURCE OF TRUTH (consumers read only this)
├── tokens.css                ← canonical token values (incl. breakpoint tokens)
├── tokens.json               ← generated from tokens.css (npm run tokens)
├── components.css            ← all component styling
├── responsive.css            ← the ONLY @media file: mobile chrome + per-page mobile views
├── layout.css  utilities.css
├── components-manifest.json  ← machine-readable component catalog (drives docs + AI plugins)
├── assets-catalog.json       ← machine-readable icon/illustration catalog
├── brand-principles.md
├── assets/                   ← logos, icons, illustrations
└── examples/                 ← the 8 canonical golden pages (7 responsive; reference, not templates)

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
- **Add / edit a component** → edit `package/components.css`, then add or update its entry in `package/components-manifest.json` (copy an existing entry for the schema; the `snippet` markup should come verbatim from a golden page in `package/examples/`, never invented). Optional `variants[]` render multiple labeled specimens on the component page; optional `states[]` render a state matrix (default / hover / focus / active / disabled / loading — pin them with the `.is-hover` / `.is-focus` / `.is-active` / `.is-disabled` helpers). The docs page, nav link, and live preview are generated automatically.
- **Responsive / mobile** → all responsive behavior lives in `package/responsive.css` (the only file with `@media`). Each golden page ships its desktop content plus a `.m-view` mobile view; desktop stays byte-identical. See the **Responsive layouts** docs page.
- **Add an icon / illustration** → drop the file in `package/assets/…` and add an entry to `package/assets-catalog.json` (`source: "file"` with a `path`, or `source: "inline"` with an `svg` string). It appears in the Assets gallery automatically.
- Bump `version` in `package.json` on releases and tag (`git tag v0.2.0`); the site header shows the version it was built from.

## Deploying (GitHub Pages via GitHub Actions)

The repo ships a workflow at **`.github/workflows/deploy.yml`** that builds the site in the cloud and publishes it to GitHub Pages on every push to `main` — you never run Eleventy yourself. The published URL is:

**https://moumita-roychowdhury-zoomrx.github.io/curie-design-system/**

### Requirements

GitHub Pages for a **private** repo requires a paid plan (**GitHub Pro / Team / Enterprise**). On the free plan, Pages only serves public repos. So either be on Pro/Team, or make the repo public.

### One-time setup

1. Ensure the account is on a plan that allows private Pages (or make the repo public).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.** (The workflow's `actions/configure-pages` step also enables this automatically once the plan allows it.)
3. Push to `main` — or run the workflow manually from the **Actions** tab (`Deploy to GitHub Pages → Run workflow`). After it finishes, the site is live at the URL above.

### How the subpath is handled

A project Pages site serves under `/curie-design-system/`, so the workflow builds with `--pathprefix="/curie-design-system/"`. Eleventy's **`HtmlBasePlugin`** (wired up in `eleventy.config.js`) rewrites every internal URL — including those inside component snippets and preview iframes — to that prefix. Local `npm run dev` / `npm run build` stay at root (no prefix), so nothing changes for local work.

### Alternatives (if you'd rather not pay for private Pages)

- **Make the repo public** — free GitHub Pages works immediately with the same workflow.
- **Cloudflare Pages + Access** — free, keeps the repo private, gates the site behind ZoomRx SSO. Connect the repo, build command `npm run build`, output `_site`; add a custom domain to avoid the subpath entirely.
- **Netlify / Vercel / any static host** — build `npm run build`, publish `_site/`.

## Consumers

- **People** — the hosted docs site (foundations, components with live previews + variants, the Icons & Illustrations gallery, and the golden page examples).
- **AI agents / Claude plugins** — consume `package/` directly via git (pin a tag), or fetch `/api/tokens.json`, `/api/components-manifest.json`, and `/api/assets-catalog.json` from the site. Plugins should carry no copies of tokens, component markup, or assets.

## Status

v0.3.0 — now **responsive**. Design tokens across 18 groups (including breakpoint tokens), **60 documented components** — the original 36 plus a full primitive/pattern/standard library added per the developer review (Button, Icon Button, Checkbox, Textarea, Search input, Select, Link, Modal, Accordion, Tooltip, Dropdown menu, Tabs, Progress, Avatar, Badge, Spinner, Skeleton, Empty state, Inline alert, Divider, Table, Pagination, Breadcrumb, Stepper, Slider), each documented with a `states[]` matrix (default / hover / focus / active / disabled / loading). An asset library of **62 icons + 10 illustrations**, and 8 golden reference pages — **7 of which (all except Podcasts) are now responsive**: at ≤600px each swaps its desktop chrome for a purpose-built mobile view (top app bar, bottom tab bar, drawer, bottom-sheet, FABs) that exactly replicates the mobile designs, while every desktop render stays byte-for-byte identical. See the new **Responsive layouts** docs page.

# Curie brand principles

> Derived from `tokens.css` + the 8 golden templates. This file states the rules CSS can't encode. It **never restates token values** — `tokens.css` is the single source for every color, font, radius, and space. Read by the **designer** agent (when a request fits no golden) and the **evaluator** (when grading a design-route page).

These are the rules a fresh composition must honor to read as Curie. They are deliberately few. When in doubt, open a golden template and do what it does.

## 1. Dark canvas, always

Every page sits on `var(--color-bg-primary)`. There is no light page, no white card, no inverted section. Surfaces are dark-on-dark: `var(--color-bg-card)` panels float on the canvas. (The canvas is delivered by the golden CSS through the page's `pg-*` body class — keep that class.)

## 2. Two fonts, no more

`var(--font-primary)` (Manrope) carries everything — headings, body, UI. `var(--font-accent)` (Playfair Display) is for **accents only**: a hero headline, a pull quote, a single display number. Never Playfair for body copy, labels, nav, or card titles. Never a third family.

## 3. Color comes only from tokens

Every color is a `var(--color-*)` or `var(--text-*)`. Never a raw hex, `rgba()`, or named color in your own CSS. The `--text-*` opacity ladder (`--text-primary` → `--text-bright` → `--text-body` → `--text-secondary` → `--text-muted` → … → `--text-whisper`) **is** the hierarchy device — step down it to signal importance, instead of reaching for a new hue. Purple is the brand; teal / cyan / blue / green / pink are sparing accents.

## 4. Restraint

One accent gesture per view, not five. A page earns attention with a single strong move (one gradient headline, one featured card, one CTA) and lets the rest stay quiet. Over-decoration reads as off-brand faster than anything else.

## 5. Glass-morphism via existing components

Cards and panels read as frosted glass — dark translucent surfaces (`var(--color-bg-card)`), soft blur (`var(--blur-*)`), a faint purple edge (`var(--color-purple-card-border)`), and a low shadow (`var(--shadow-card-*)`). You get this look by **reusing the existing card components** (`.card`, `.editorial-card`, `.brief-item`, `.conf-card`, …), not by re-deriving the glass recipe yourself.

## 6. Hover on every interactive

Every clickable — card, button, nav link, tag — has a hover state, with motion timed by `var(--duration-*)`. Reuse the components that already carry one; never ship a flat, stateless interactive.

## 7. Component reuse over invention

A new layout is an **arrangement of existing components**, never a new painted component. The catalog in `components.css` is broad (cards, lists, sections, headers, tags, badges, CTAs, FAQ blocks, profile cards, scroll rows, metric-ish tiles, …) — choose the component whose existing styling fits each content piece. If nothing fits exactly, pick the nearest and adapt with **layout-only** CSS (grid, gap, padding, max-width) where every value is a token. Do not create a `.my-widget` with its own paint.

## 8. Chrome is cloned, never redesigned

The sidebar, top bar, and footer come verbatim from a golden template (the chrome donor). You never redesign, restyle, or recompose the chrome — only move the `.active` nav target and edit documented inner copy.

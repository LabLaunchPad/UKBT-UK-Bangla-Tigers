# Mobile axe-core sweep — heading-order gaps across all 16 routes

**Date:** 2026-08-27. A follow-on UI/UX audit round, requested after the
homepage red-team fixes (F1–F8) had shipped: check for further visual/design-
system gaps, with a mobile-UX lens, and fix what's found — same working
pattern as F1–F8 (measure in a real browser first, fix, falsification-check,
run the full gate, ship).

## The gap this round found

`apps/web/playwright.config.ts` configures exactly one project,
`{ ...devices['Desktop Chrome'] }`. Every axe-core scan already in the suite
(`homepage.spec.ts`, `axe.spec.ts`, `pages.spec.ts`) has therefore only ever
run at desktop viewport — no route has ever had a full accessibility scan at
mobile width before this round, despite this session's extensive prior
mobile-visual-QA work (`MOBILE-VISUAL-QA.md`).

A scratch script (`chromium.launch` + `AxeBuilder`, 390×844,
`isMobile: true`, `hasTouch: true`) swept all 16 routes with
`withTags(['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice'])` and found 4
real `heading-order` violations (moderate), invisible to every existing
desktop-only scan:

| Route | Violating node(s) |
|---|---|
| `/about` | `.ukbt-mission__fact h4` "International Cricket" (×4 facts) |
| `/franchises` | `li h4` "Based in Sweden" (×2 facts); `.ukbt-roster-card h4` "Mohammad Chowdhury" (×5 players) |
| `/community` | `h4` "Meet Uppsala Tigers" (FranchiseTeaser CTA) |
| `/404` | `.ukbt-footer__col h3` "UK Bangla Tigers" (H1→H3 skip, no H2 on the page at all) |

Root cause in each case (except `/404`): a component or page authored a fixed
`<h4>` without checking what heading actually precedes it in that specific
page's document flow — the same class of bug as red-team finding **F4**
(`F4-F8-STATUS-CORRECTION.md`), but F4's fix and verification were scoped
only to the homepage; no other route was ever checked.

## Fixes

Each h4→h3 promotion keeps the component's `font-size`/`margin` unchanged
(same CSS rule, selector only) so no visual weight changes — only the
semantic level, to close the gap axe actually flags (an increase of more
than one level; axe never flags a *decrease*).

- **`RosterGrid.astro`** (only call site: `/franchises`) — player-name
  heading `h4` → `h3`.
- **`franchises.astro`** — its own inline facts list `h4` → `h3`.
- **`MissionWelcome.astro`** (only call site: `/about`) — facts `h4` → `h3`.
- **`FranchiseTeaser.astro`** (call sites: homepage, `/community`) — the CTA
  panel's `h4` → `h3`. Verified this doesn't newly break the homepage: the
  h4 there already followed an h3, so h3-after-h3 stays legal too.
- **`404.astro`** — the only route with no H2 anywhere on its own content
  (footer's H3 columns immediately follow the page's H1). Fixed by adding a
  genuine "Popular Pages" section (`<h2>` + links) built entirely from the
  site's own existing `homepage.nav` data — no invented copy, and it doubles
  as real 404-recovery UX.

## A second, self-inflicted violation, caught and fixed before shipping

The `/404` "Popular Pages" links were first styled
`color: var(--ukbt-color-brand-accent)` (the site's gold) on the page's
default light surface. Re-running the sweep caught a new `color-contrast`
(serious) violation on all 7 links — gold is only contrast-safe on the dark
inverse surface (the same lesson `F3-FOCUS-CONTRAST-FIX.md` already
documented for focus rings). Fixed by switching the links to
`var(--ukbt-color-surface-inverse)` (navy) with an underline, which is
already the established light-surface link pattern elsewhere in the codebase.
Re-swept clean.

## Deliberately NOT fixed

`AboutStory.astro` has an `<h4>` (line 33) that appears **before** its own
`<h2>` (line 38) — heading levels decrease then jump back up, a genuinely odd
structure. This does **not** trigger axe's `heading-order` rule (which only
flags level *increases* greater than 1; a decrease is never flagged), and it
was not among the 4 violations the sweep reported. Restructuring it now would
be a content/structure change with no flagged finding behind it, out of scope
for this evidence-based fix pass.

## Falsification-checked, per `knowledge/08-VALIDATION-POLICY.yaml` DR-010

- Reverted the `RosterGrid.astro` fix (`h3` → `h4`) → the new regression
  test correctly **failed** on `/franchises` with a real `heading-order`
  violation reported.
- Restored the fix → test passes again.
- All 16 routes re-swept clean after every fix was back in place.

## New regression test

`tests/visual/mobile-axe.spec.ts` — a dedicated mobile-viewport (390×844,
`isMobile: true`, `hasTouch: true`) axe-core sweep across all 16 routes,
same tag set as the sweep script. This is a permanent gap-closer:
`axe.spec.ts` / `pages.spec.ts` stay desktop-only (per the frozen
`playwright.config.ts` project), so this file is what now catches a
mobile-only accessibility regression before it reaches production.

## Gates run

| Command | Result |
|---|---|
| Mobile axe sweep (all 16 routes, ad hoc script) | 0 violations after fixes |
| `pnpm exec playwright test tests/visual/mobile-axe.spec.ts` | PASS — 16/16 |
| `pnpm exec playwright test` (full suite) | PASS — 265 passed, 1 skipped |
| `pnpm deploy:verify` | PASS (governance-scaffold, deps, lint, tokens:build, typecheck, test:unit, build, check:links) |

# Tool Selection & Extraction Layer

**Status:** ADOPTED · 2026-08-31 · **Authority:** `EV-20260831-003`
**Companion to:** `docs/13-visual-truth-system.md`

Extraction tooling is a **capability underneath the nine roles**, never a
tenth role. This document fixes *which tool is authoritative for which
fact*, so that agents reason over normalized evidence instead of
rediscovering the stack every task.

---

## 1. Detect before you extract

Before auditing or modifying UI, identify what this project actually is:
framework/runtime, CSS architecture, design-token format, component
system, build system, test framework, browser-automation capability,
visual-regression capability.

**Never assume Tailwind, React, CSS Modules, or any other stack.**

### UKBT's detected stack (verified 2026-08-31 against this repository)

| Layer | What UKBT actually uses | Evidence |
|---|---|---|
| Framework | Astro 7, `output: 'static'` | `apps/web/astro.config.mjs`, `package.json` |
| CSS architecture | Plain CSS + Astro scoped `<style>` blocks | `apps/web/src/**/*.astro`, `src/styles/` |
| Design tokens | Style Dictionary → generated CSS custom properties | `packages/truth/src/tokens/`, `style-dictionary.config.json` → `apps/web/src/styles/generated/tokens.css` |
| Component system | Astro components, UKBT-original | `apps/web/src/components/` |
| Build | pnpm workspaces, Astro build | root `package.json` |
| Test | Vitest (unit), Playwright (visual/UX/a11y) | `packages/truth`, `apps/web/tests/visual/` |
| Browser automation | Playwright + Chromium | `apps/web/playwright.config.ts` |
| Accessibility | `@axe-core/playwright` | `apps/web/tests/visual/*.spec.ts` |
| Visual regression | Playwright screenshots into `artifacts/ui/screenshots/` | `apps/web/tests/visual/screenshots.spec.ts` |

**Not present, and not to be assumed present:** Tailwind (any version),
React, Vue, SCSS, CSS Modules, a third-party component library, a
CSS-in-JS runtime, Lighthouse wiring. The adapter table in §8 names them
only so that a future detection result has somewhere to land — it is not
a claim that any of them exists here today.

---

## 2. Extraction priority

For **rendered UI**:

```
BROWSER RUNTIME → COMPUTED CSS → DOM GEOMETRY → SCREENSHOT
```

For **source / design-system truth**:

```
SOURCE FILES → TOKEN FILES → CSS CONFIGURATION → GENERATED CSS
```

For **history**:

```
CURRENT GIT → CURRENT CONTRACTS → DECISION LEDGER → AVAILABLE PAST CHAT/ARTIFACTS
```

---

## 3. Tool matrix

| Use case | Authoritative method here | Extract |
|---|---|---|
| DOM structure | Playwright | tree, roles, attributes, relationships |
| Computed CSS | Playwright `getComputedStyle` | resolved styles |
| Box geometry | Playwright `getBoundingClientRect()` | x/y/w/h, gaps, alignment |
| Screenshots | Playwright (`screenshots.spec.ts`) | deterministic per-viewport captures |
| Pixel/region diff | Playwright + image diff | reference/target differences |
| Responsive | Playwright multi-viewport (`viewports.ts`) | breakpoint transitions |
| Interaction | Playwright | hover/focus/click/keyboard/touch |
| Accessibility | axe-core + Playwright | WCAG/semantic evidence |
| Source extraction | repo search + parser | component/source structure |
| CSS extraction | authored CSS + runtime CSS | declarations, selectors, variables |
| CSS variables/tokens | token source + `getComputedStyle()` | definitions **and** resolved values |
| Design tokens | `packages/truth/src/tokens/` + generated CSS | color/type/spacing/radius/shadow/motion |
| Design-system docs | Markdown search | approved visual rules |
| Astro components | source inspection **plus** browser runtime | props, slots, rendered output |
| Assets | filesystem + image metadata | dimensions, format, ratio, provenance |
| Fonts | font metadata + computed CSS | family, weight, loaded face |
| SVG/icons | SVG parse | viewBox, paths, dimensions, usage |
| Network/runtime | Playwright | requests, failures, runtime dependencies |
| Git history | git | SHA, changed files, history |
| Past UI decisions | stored artifacts + ledger | decision timeline, rejected/superseded |
| Repo architecture | filesystem + search | components, routes, tokens, dependencies |
| SEO | browser + source extraction | title, description, canonical, OG, structured data |
| Performance | Playwright/CDP where appropriate | loading/runtime/layout signals |

---

## 4. DOM

Use browser automation for DOM tree, semantic roles, attributes, text,
visibility, layout relationships and interactive states.

**Do not infer rendered DOM solely from source code.** Astro compiles,
conditionally renders and scopes styles; the source is a claim about the
DOM, not the DOM.

---

## 5. CSS

Extract **both** authored CSS and resolved runtime CSS — authored values
may be overridden, inherited, transformed or replaced at runtime. Capture
property/value, selector, specificity, inheritance, custom properties,
media queries and pseudo-states.

This project has a concrete precedent for why runtime resolution matters:
a scoped selector in `FranchiseTeaser.astro` silently stopped matching
once `Surface.astro` began rendering the element, and the regression
surfaced as a **measured** contrast failure, not as anything visible in
the authored CSS.

---

## 6. Geometry

Use runtime measurement, never visual estimation: bounding boxes,
dimensions, coordinates, margins, padding, gaps, alignment, overflow,
scroll dimensions, stacking relationships. `ukbt-geometry.spec.ts` is the
existing probe and writes `artifacts/ui/ukbt-geometry.json`.

---

## 7. Design tokens

Extract from every relevant source — colors, typography, spacing, sizing,
breakpoints, radii, shadows, motion, z-index, container widths — and
normalize:

```
TOKEN · SOURCE · RAW_VALUE · RESOLVED_VALUE · USAGE_COUNT
COMPONENTS · VIEWPORTS · STATUS · EVIDENCE
```

**Never replace a measured runtime value with a guessed token.** Tokens
explain the *intended* system; runtime extraction proves what the browser
actually rendered. When they disagree, that disagreement is the finding.

---

## 8. Framework adapters

Build one common interface, not a bespoke extractor per framework:

```
discover() · extract_source() · extract_dom() · extract_computed_styles()
extract_geometry() · extract_tokens() · extract_assets()
capture_screenshot() · capture_interaction() · compare_visuals()
```

| Adapter | Status here |
|---|---|
| `AstroAdapter` | **APPLICABLE** — the only one UKBT needs today |
| `PlainCSSAdapter` | **APPLICABLE** — plain CSS + custom properties |
| `TailwindAdapter` | NOT APPLICABLE — no Tailwind in this repository |
| `ReactAdapter` / `VueAdapter` | NOT APPLICABLE |
| `CSSModulesAdapter` | NOT APPLICABLE |

Do **not** build an adapter until detection shows the repository needs
it. If Tailwind ever lands here, its audit must inspect *source classes,
generated CSS and runtime computed styles* — a config file alone does not
represent the rendered design, and dynamically constructed class names can
fail to generate the utilities they appear to request.

---

## 9. Documentation is policy, not implementation truth

Treat Markdown and design documentation as `POLICY / DECISION / CONTEXT`,
never automatically as implementation truth. Reconcile it against current
code and rendered UI, and classify contradictions:

```
DOC_DRIFT · CODE_DRIFT · VISUAL_DRIFT · UNKNOWN
```

**Worked example, found while adopting this document:**
`contracts/VISUAL-REGRESSION-CONTRACT.md` AMENDMENT 01 added 1920×1080 to
the frozen matrix on 2026-08-26, but `apps/web/tests/visual/viewports.ts`
still listed six viewports and still described itself as "the frozen
6-viewport matrix". Classification: `CODE_DRIFT` (the contract was
authoritative and correct; the transcription lagged). Closed on
2026-08-31 by transcribing the amendment into `viewports.ts` and
capturing the missing 1920×1080 evidence — not by weakening the
contract to match the code.

---

## 10. Visual extraction package

For every target viewport produce:

```
SCREENSHOT · DOM_SNAPSHOT · COMPUTED_STYLE_SNAPSHOT · GEOMETRY_SNAPSHOT
ASSET_MAP · INTERACTION_STATE_MAP
```

---

## 11. Normalized evidence

All extractor output converges on one structure, so the visual roles work
identically regardless of stack:

```
PAGE · SECTION · ELEMENT · SOURCE · PROPERTY
OBSERVED_VALUE · MEASURED_VALUE · EXPECTED_VALUE · VIEWPORT
EVIDENCE · STATUS
```

---

## 12. Tool principle

**Use the cheapest authoritative tool that can prove the fact.**

- Do not use screenshot vision where DOM/computed-style measurement proves
  it.
- Do not use source inspection where runtime behaviour is what must be
  proven.
- Do not use model judgement where deterministic extraction is available.
- Do not introduce a new extraction tool when an existing repository tool
  already provides equivalent evidence — a new dependency needs its reason
  recorded (`knowledge/10`) and must clear
  `scripts/check-dependency-allowlist.mjs`.

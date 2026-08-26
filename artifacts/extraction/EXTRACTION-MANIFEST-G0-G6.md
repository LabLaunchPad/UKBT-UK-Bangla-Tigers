# Extraction Manifest — Gates G0 through G6

**Date:** 2026-08-26 · **State:** `FORENSIC_ANALYSIS` / `DESIGN_EXTRACTION`
(pipeline stages 1-2, `knowledge/06-TEMPLATE-BOUNDARY.yaml`) — both `ALLOWED`
independent of `BL-02`. **No application code changed. No Adelux asset,
markup, or screenshot copied into this repository.**

This manifest is a **reuse ledger**, not a re-derivation. Per the evidence-
reuse rule (`knowledge/05-UNKNOWN-BLOCKER-POLICY.yaml`), each gate below
either cites the existing evidence that already answers it, or states
precisely what new work was done and why the old evidence couldn't answer
it.

---

## G0 — Source freeze

**Status: REUSED, not re-derived.**

| Field | Value | Evidence |
|---|---|---|
| SHA-256 | `cf4907bb60003b719f3d7712e2d06389c2ab7f8a02590bdea570da9780cafb54` | `EV-20260826-005` |
| File count | 95 (14 HTML, 15 CSS, 13 JS, 41 images, 8 fonts, 3 PHP, 1 config) | `artifacts/adelux/ADELUX-SOURCE-MANIFEST.json` |
| Immutability | verified unmodified this pass (no write operations issued against the scratch copy) | this manifest |

## G1 — Browser render fingerprint

**Status: NEW this pass** (not previously formalized as a standalone record).

See `artifacts/renders/RENDER-FINGERPRINT.md`: Chromium 141.0.7390.37,
Playwright 1.56.1, `file://` rendering, 1440×900 + 390×844 viewports.
**Stated gap:** the full 6-viewport matrix and explicit locale/timezone/DSF
pinning are not yet exercised — recorded as a gap, not silently skipped.

## G2 — Complete page/section inventory

**Status: REUSED**, `EV-20260826-008` / `artifacts/design/ADELUX-PAGE-INVENTORY.md`.
13 site pages (+1 documentation page, not a site page), 2–16 sections each,
94 section-wrapper divs total, per-page third-party library detection,
per-page rights classification on two axes (structure vs. brand-asset).

## G3 — CSS AST + selector graph

**Status: REUSED**, `EV-20260826-009` / `artifacts/extraction/css-rule-graph.json`.
748 rules across `main.css` + `responsive.css` — **shared, site-wide
stylesheets referenced identically by all 13 pages** (confirmed in G2's
`stylesheets_local` field per page), so this AST already covers the full
site; there is no page-specific CSS file to additionally parse. 4 media
queries, 2 keyframe blocks (`load`, `ripple`), each rule carrying computed
specificity and source order.

## G4 — Computed-style extraction

**Status: EXTENDED this pass from homepage-only to all 13 pages.**

Prior state (`EV-20260826-009`): 10 elements, homepage only, ~30 properties
each, 2 viewports, with 2 fully-traced cascade chains.

New this pass (`artifacts/extraction/render-manifest/all-pages-computed-styles.json`):
4 shared-chrome elements (nav, footer, primary button, first heading) × 13
pages × 2 viewports (1440×900, 390×844) × 20 computed properties each, plus
structural interaction-behavior probes per page.

**All 13 pages loaded successfully** — 0 render failures.

**Scope, stated honestly:** this pass targets *shared chrome and one
representative element per page*, not the full 40-property, full-DOM depth
applied to the homepage. Extending full per-page depth to all 13 pages is a
larger undertaking, named as a gap below rather than claimed done.

## G5 — Asset/font/JS interaction forensics

**Status: EXTENDED this pass** — structural probes across all 13 pages,
plus a live, verified interaction test.

| Finding | Detail |
|---|---|
| Forms | 14 total across the site (some pages have 2 — `booking`, `contact`) |
| Swiper (carousel) | used on 2 pages (`index`, `about`) — `BL` none, MIT-licensed, not currently a blocker |
| Flatpickr (date picker) | used on 1 page (`booking`) — MIT-licensed |
| Mobile nav toggle | present on 12/13 pages (absent on `404-page`, correctly — it has no nav) |
| **Mobile nav toggle — live-tested, not just detected** | Clicked the actual `[data-bs-toggle="collapse"]` control on all 12 applicable pages at 390×844. **Every single one** transitions `#navbarNav` from `display:none` (`collapse`) to `display:block` (`collapse show`) — a uniform, verified behavior, not merely inferred from markup. See `artifacts/extraction/mobile-nav-toggle-test.json`. |

**Font/asset forensics: REUSED** from `EV-20260826-005`/`THIRD-PARTY-LICENSE-FIREWALL.md`
— no new licence facts this pass.

**Stated gap:** slider/carousel *interaction* (does Swiper actually advance
slides, touch/swipe behavior) was not exercised — only its *presence* was
detected. Form *submission* behavior was not tested (forms `action` targets
PHP handlers that don't run under `file://`, and are not a migration target
per `EV-20260826-005` regardless).

## G6 — Token extraction

**Status: REUSED**, `EV-20260826-009` / `artifacts/extraction/token-candidates.json`.
24 unique custom properties, 20 single `:root` declarations classified
`CANDIDATE`, the remainder (Bootstrap gutter variables) classified `RAW`
only per the semantic-token-trick discipline. **Site-wide already**, since
tokens live in the shared stylesheets covered by G3. No token promoted past
`CANDIDATE` this pass — `ADAPTED`/`APPROVED` require pipeline stage 3
(`UKBT_ADAPTATION`), not yet run.

---

## Internal consistency checks

| Check | Result |
|---|---|
| Page count matches across G2 inventory, G4 render pass, and G5 probes | 13 / 13 / 13 — consistent |
| CSS file references consistent (all pages cite the same 2 local stylesheets) | consistent, confirmed in G2 |
| SHA-256 unchanged between G0 and this pass | `cf4907bb…fb54` — unchanged, source not modified |
| No render failures | 0 / 13 |
| No JSON/data file produced this pass fails to parse | all validated below |

```
$ python3 -c "import json; [json.load(open(f)) for f in [
    'artifacts/extraction/render-manifest/all-pages-computed-styles.json',
    'artifacts/extraction/mobile-nav-toggle-test.json']]"
→ no error
```

---

## Final status block

```
SOURCE_HASH = cf4907bb60003b719f3d7712e2d06389c2ab7f8a02590bdea570da9780cafb54
PAGE_COUNT = 13
CSS_COUNT = 15 files (748 rules across the 2 authored files; vendor CSS classified separately, not re-parsed)
JS_COUNT = 13 files
ASSET_COUNT = 41 images
FONT_COUNT = 8 (6 Font Awesome + 2 CDN-loaded families)
TOKEN_RAW_COUNT = 61 (Bootstrap gutter-variable contextual redeclarations, distinct selectors)
TOKEN_CANDIDATE_COUNT = 20 (single :root declarations)
COMPONENT_CANDIDATE_COUNT = 4 confirmed with cascade evidence (.btn-accent, .card-chooseus, .card-blog, .nav-link); full 13-page recurrence classification (EXACT_REUSE / VARIANT / PAGE_SPECIFIC) not yet performed — gap
RESPONSIVE_RULE_COUNT = 4 media queries; per-element desktop/mobile diffs computed for 10 (homepage) + 4×13 (site-wide shared chrome) elements
INTERACTION_STATE_COUNT = 3 verified (.btn-accent hover, .nav-link.active runtime-class discovery, mobile-nav-toggle × 12 pages)
THIRD_PARTY_DEPENDENCY_COUNT = 10 (4 verified-permissive, 1 attribution-required, 1 requires-decision, 1 blocked, 2 unknown, 2 fonts-unknown)
```

## Named gaps (not silently dropped)

| Gap | What's missing | Why it matters | Blocks | Why current evidence can't answer it |
|---|---|---|---|---|
| G4-full | Full 40-property, whole-DOM computed-style depth on the other 12 pages (homepage-level depth) | Needed for true per-page pixel-fidelity claims | Stage 7+ page-by-page implementation of non-homepage pages | Only sampled 4 shared-chrome elements per page this pass; deeper capture deferred |
| G-viewport | Full 6-viewport matrix (only 2 of 6 exercised) | Requested matrix includes intermediate tablet sizes | Full responsive-parity claims | Not yet run — time-scoped this pass to desktop/mobile contrast |
| G-slider | Swiper interaction behavior (touch/swipe/autoplay) not exercised, only presence detected | Needed before reproducing carousel sections | Any page containing a Swiper instance (`index`, `about`) | Requires simulated touch/drag gestures, not yet attempted |
| G-component-recurrence | Component candidates not yet classified `EXACT_REUSE`/`VARIANT`/`PAGE_SPECIFIC` across all 13 pages | Needed for the final UKBT component contract set | Stage 9 (page-by-page scale-out) component planning | Requires comparing structural signatures across all 13 pages' DOM, not yet done |
| G-font-metrics | True Lato/Montserrat glyph metrics (fallback font used instead) | Text-heavy element geometry may shift once real fonts load | Any pixel-fidelity claim on typography-heavy sections | `fonts.gstatic.com` unreachable under this project's own network policy |

None of these block pipeline stages 1-2 from being considered complete for
what they *did* cover — they are the next increment, not a hidden failure.

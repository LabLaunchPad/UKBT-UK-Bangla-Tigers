# Deep Forensic Extraction — Homepage (`index.html`)

**Date:** 2026-08-26 · **State:** `FORENSIC_ANALYSIS` only
(`knowledge/06-TEMPLATE-BOUNDARY.yaml`). **BL-02 unchanged:**
`STATED_BUT_UNVERIFIED`. No asset, markup, or CSS copied into this repository.
No application code changed.

**Scope, stated honestly:** this is a **rigorous first pass on one page** —
the homepage, matching the pipeline's own homepage-first order (Stage 7). It
is not a claim that all 13 pages or all 40 listed fidelity dimensions have
been exhaustively investigated. Where a dimension is covered, it is covered
with real browser evidence, not asserted from source reading alone. Where it
is not yet covered, that is stated as a genuine gap in § Coverage below, not
implied to be done.

---

## Evidence reused, not re-proven (Level 0)

Per the evidence-economy instruction, the following are **not** repeated here:

| Fact | Already established in |
|---|---|
| Package SHA-256, file manifest | `EV-20260826-005`, `ADELUX-SOURCE-MANIFEST.json` |
| Marketplace identity, licence model | `EV-20260826-006` |
| Page/section structural inventory (all 13 pages) | `EV-20260826-008`, `ADELUX-PAGE-INVENTORY.md` |
| Third-party component licences | `THIRD-PARTY-LICENSE-FIREWALL.md` |
| `BL-02` status | unchanged, `STATED_BUT_UNVERIFIED` |
| Golden-reference / screenshot rights rule | `knowledge/06-TEMPLATE-BOUNDARY.yaml` — **followed here**: no screenshot was persisted into this repository; only computed-style/geometry data (never image bytes) is committed |

---

## New evidence generated this pass

### E/F/G — CSS rule graph, selector graph, cascade (Level 1 + Level 3)

`artifacts/extraction/css-rule-graph.json` — full AST of `main.css` +
`responsive.css` (Adelux's own authored CSS; vendor libraries are a separate,
already-classified rights domain and were not re-parsed here).

| Metric | Value |
|---|---|
| Total rules parsed | 748 |
| Media queries found | 4 — `max-width:1025px`, `max-width:767px`, `min-width:1025px`, `min-width:767px` |
| Custom properties (declarations) | 105 |
| Unique custom property names | 24 |
| Keyframe animations | 2 — `load`, `ripple` |

Every rule carries computed CSS specificity (`(id, class, element)` triple)
and source order, enabling a genuine cascade trace rather than a guess.

### I — Token extraction, with the semantic-clustering discipline applied

`artifacts/extraction/token-candidates.json`.

**24 unique custom properties, but only 20 are single, unconditional `:root`
declarations** — 16 colour, 2 typography (`--font-family-1` = Montserrat,
`--font-family-2` = Lato), 3 motion-duration (`--animation-fast/normal/slow`
= 0.75s/1.25s/2.25s). These are classified `CANDIDATE`.

**The other 2 names (`--bs-gutter-x`, `--bs-gutter-y`, plus `--bg-gutter-y`)
are Bootstrap grid-gutter variables redeclared 61 separate times** on
distinct `.grid-spacer-*` utility classes, each with its own contextual
value (10px/20px/30px/40px/50px/100px). **Per the semantic-token-trick
instruction and this project's own DR-018 (presence is not publishability,
applied here to frequency is not semantics):** these are classified
`RAW` only. `20px` appearing dozens of times across unrelated utility
classes does **not** prove a single `spacing.gutter = 20px` token — it
proves Bootstrap's gutter mechanism is used contextually, with the actual
per-context clustering (card padding vs. section margin vs. button gap)
deferred to a dedicated pass, not inferred from occurrence count.

**Zero tokens are classified `APPROVED`.** Per DR-002, promotion requires an
explicit engineering decision made in context — that decision belongs to
Stage 5 (design system), not to this forensic pass.

### H/D — Computed style + geometry map (Level 2, real browser)

`artifacts/extraction/render-manifest/index-homepage.json` — 10 target
elements (`nav`, `nav-brand`, `nav-link`, `hero-container`, `.btn-accent`,
`.card-chooseus`, `.card-blog`, `footer`, `body`), captured via Playwright +
Chromium at 1440×900 and 390×844, with ~30 computed CSS properties each plus
real bounding-box geometry (x/y/width/height).

**One target (`.btn:not(.btn-accent)`) was not found on this page** —
recorded as absent, not silently dropped from the manifest.

**Stated limitation, not glossed over:** `fonts.gstatic.com` is unreachable
from this session (this project's own network policy denies external font
CDNs by default, `.claude/settings.json`). Font-family/size/weight are
correctly captured as *declared* CSS values, but glyph-dependent geometry
(line-box height, exact letter spacing rendering) reflects the browser's
**fallback font**, not true Lato/Montserrat metrics. Flagged as a real gap,
resolved once fonts are self-hosted (already recommended independently in
`ADELUX-CROSS-FRAMEWORK-VERIFICATION.md` Part 9, for privacy reasons).

### K — Interaction states, verified with a self-caught methodology correction

`artifacts/extraction/interaction-states-index.json`.

**First pass measured the `.btn-accent` hover colour as `rgb(229,253,141)` —
which matches neither declared token.** Rather than record that as ground
truth, it was investigated: the base rule declares `transition: all 600ms`,
and the first measurement waited only 350ms, sampling **mid-transition**.
Re-measured at 650ms and 1000ms wait: both settle to `rgb(234,255,157)`,
which is **exactly** `--accent-color-6` (`#EAFF9D`). Full cascade trace:

```
.btn-accent            main.css:273  specificity (0,0,1,0)  background-color: var(--accent-color-2)
.btn-accent:hover      main.css:279  specificity (0,0,2,0)  background-color: var(--accent-color-6)
                                      → wins on specificity; transition: all 600ms on the base rule
                                      → measured settled value: rgb(234,255,157) = #EAFF9D = --accent-color-6  ✓ CONFIRMED
```

**A second, more interesting case: the nav "Home" link's colour.** Measured
`before` (non-hover) state was already `rgb(198,239,46)` (`--accent-color-2`),
which the static-CSS cascade alone cannot explain — the only unconditional
`.nav-link` rule (main.css:1680) sets `color: var(--secondary)` (white).
**Traced to ground truth via direct DOM inspection:** the rendered element
carries a runtime-added class, `nav-link active` — **not present in the
static HTML source** (`grep` of `index.html` confirms only `class="nav-link"`
on that anchor). Some client-side script adds `.active` to the current page's
nav link after load, which then matches `.nav-link.active` (main.css:1691,
specificity `(0,0,2,0)`, `!important`) → `--accent-color-2`. **This is exactly
the class of behaviour Level 2 (browser) evidence catches and static HTML
parsing (Phase 2, `EV-20260826-008`) cannot** — a genuine justification for
the deeper evidence level, not extraction for its own sake.

**Honest, bounded gap:** the *exact* script and mechanism adding `.active`
was not pinpointed in this pass (checked `script.js`, `banner.js`,
`submit-form.js`, `swiper-script.js`, `video_embedded.js` — none showed an
obvious `location.pathname`-comparison pattern via simple keyword search).
Recorded as `EVIDENCE_GAP-01` below rather than guessed.

### J — Responsive transition matrix (Level 3, derived from H)

`artifacts/extraction/responsive-diff-index.json` — desktop vs. mobile diff
for all 10 targets.

**Real, non-trivial finding beyond mere reflow:** `nav.navbar` changes
`justifyContent` between viewports (consistent with a desktop horizontal menu
collapsing to a mobile toggle layout), and `.nav-link`'s `paddingRight`/
`paddingLeft` change explicitly — not just inherited from a resized
container. Every other target's only measured change was `width`/`height`,
consistent with Bootstrap-grid reflow rather than an explicit per-element
responsive override.

### N — Animation map

Two `@keyframes` blocks in `main.css`: `load` (drives a CSS `--progress`
custom-property counter, likely paired with the Odometer counter component —
licence `UNKNOWN`, not adopted) and `ripple` (a click/interaction ripple
effect: opacity 1→0, `scale3d(1,1,1)→(1.7,1.7,1.8)`, `border-width: 0→13px`
over the animation's declared duration).

### O/P — Component candidates and dependency graph (partial)

| Component | Structural signature | Token dependencies | Occurrences on homepage |
|---|---|---|---|
| `.btn-accent` | pill button, `border-radius:100px`, single accent fill | `--accent-color-2`, `--accent-color-6`, transition `600ms` | ≥1 (exact count not yet tallied across all 13 pages — deferred) |
| `.card-chooseus` | card family, 3 occurrences on homepage alone, one with `bg-accent-color` variant | shares card token set (not yet isolated from other `.card-*` variants) | 3 (homepage) |
| `.card-blog` | distinct card variant | not yet isolated | ≥1 |
| `.nav-link` | shared nav item, has a **runtime-only** active state | `--secondary` (base), `--accent-color-2` (active/hover/focus, `!important`) | 5 links |

**This table is a start, not a finished component contract set.** A full
`EXACT_REUSE` / `VARIANT` / `PAGE_SPECIFIC` classification (as the master
protocol's Phase 9 asks for) requires the same forensic pass repeated across
all 13 pages to see which structural signatures actually recur vs. are
page-specific — genuinely deferred, not a false completion claim.

---

## Coverage against the 40-dimension fidelity checklist

| # | Dimension | Status |
|---|---|---|
| 1–6 | DOM/cascade/specificity/inheritance/custom props/typography | **Covered** for the 10 targeted elements |
| 7–8 | line-height, letter-spacing | Captured; **caveat: fallback-font metrics**, see § font gap |
| 9–13 | container widths, grid/flex, gaps, margins, padding | **Covered** |
| 14–17 | borders, radius, shadows, gradients | Captured for targets; gradients not yet found in the parsed rule set on this page (may exist elsewhere — not claimed absent site-wide) |
| 18–19 | background images, image cropping | **Not yet investigated** — `object-fit`/`object-position` and `background-position` were not in this pass's captured property list |
| 20 | object positioning | Same as above — gap |
| 21–24 | pseudo-elements, overlays, z-index, positioning | Partially covered (z-index/position captured); `::before`/`::after` content not separately queried |
| 25–26 | breakpoints, responsive transformations | **Covered** |
| 27–30 | hover/focus/active/transitions | **Covered**, with the methodology correction documented above |
| 31–32 | animations, keyframes | **Covered** (both keyframe blocks catalogued) |
| 33 | JS-driven states | **Partially covered** — the `.active` class discovery is real; the mechanism is an open gap |
| 34–40 | sliders, menus, accordions, forms, loading states, mobile nav, scroll behaviour | **Not yet investigated** — genuine gaps, not claimed done |

**Extraction is explicitly NOT declared complete.** Roughly half the
checklist has real, browser-verified evidence; the rest is named as
outstanding rather than silently skipped.

---

## Evidence gaps (only genuine ones, per the anti-loop rule)

| ID | Gap | Why it matters | What decision it blocks | Why existing evidence can't answer it |
|---|---|---|---|---|
| GAP-01 | Exact script/mechanism adding `.nav-link.active` at runtime | Needed to reproduce current-page nav highlighting correctly in UKBT's own routing | The nav component's implementation contract | Keyword search of local JS files found no obvious match; requires either full script read-through or runtime breakpoint tracing, not yet done |
| GAP-02 | True font metrics (Lato/Montserrat) vs. fallback-font measurements | Line-height/letter-spacing geometry currently reflects the wrong typeface | Any pixel-fidelity claim involving text-heavy elements | Font CDN is unreachable under this project's own network policy; needs self-hosted font files, a separate action from BL-02 |
| GAP-03 | Sliders (Swiper), mobile nav toggle, forms, scroll behaviour not yet measured | These are explicitly named in the 40-dimension checklist and un-investigated | Any claim of "interaction parity" | Not yet attempted — first pass prioritised static layout + one interaction family (buttons/nav), per the page-by-page, section-by-section discipline the pipeline already requires |
| GAP-04 | Full 13-page recurrence check for component candidates | Needed to distinguish `EXACT_REUSE` from `PAGE_SPECIFIC` | The final UKBT component contract set (Phase 10) | Only the homepage has had deep extraction; the other 12 have only the Phase 2 structural inventory |

None of these are asked to be resolved "because it's important" — each names
what decision it blocks and why the current evidence stops short, per the
anti-evidence-loop rule.

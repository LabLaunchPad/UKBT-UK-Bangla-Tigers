# Mobile Visual QA — component-by-component, viewport-by-viewport

**Date:** 2026-08-27 · **Scope:** mobile only · **Baseline SHA:** `f8d030c`
**Method:** real Chromium (`isMobile: true`, `hasTouch: true`,
`deviceScaleFactor: 3`), served over HTTP from the production build,
reading `getBoundingClientRect()` / `getComputedStyle()` — no inference
from media-query text, no screenshot-only judgement.

## Viewport matrix

| Width | Device class | Why included |
|---|---|---|
| 320×568 | iPhone SE (1st gen) / small Android | Narrowest width still in real use |
| 360×800 | Most common Android | Highest-share Android width |
| 390×844 | iPhone 14/15 | Highest-share iOS width |
| 430×932 | iPhone 15 Pro Max | Largest phone before tablet |

**320 and 360 are not in the frozen matrix.** `contracts/VISUAL-REGRESSION-CONTRACT.md`
stops at 390×844 — its narrowest width. The most serious defect found
below existed *only* at 320 and 360, so the frozen matrix structurally
could not see it. The frozen file was left untouched (widening it is a
contract amendment); the narrow widths live in the new
`apps/web/tests/visual/mobile-ux.spec.ts` instead.

## Roles applied per component

Layout/frontend engineering (overflow, stacking), interaction design
(tap-target size and spacing), accessibility (contrast, focus, keyboard
operability, semantics), visual design (type scale, legibility floors),
content design (clipping, measure), performance (image supply, CLS risk).

## Method correction worth recording

The first pass rendered from `file://` and produced ~40 confident
findings — **all of them false**. Astro's absolute `/_astro/*.css` paths
404 under `file://`, so every measurement was of unstyled DOM
(`display: inline`, UA-default padding). Caught by sanity-checking a
measured value (toggle 16×6) against its own CSS (`padding: 10px 14px`)
rather than by the numbers looking wrong. All results below come from an
HTTP-served build.

A second false class was self-inflicted: an "overhang" rule that flagged
elements with `left < 0` reported the *correctly* off-canvas closed nav
drawer as overflow, and a rule ignoring scroll containers reported the
stats table (contained by `overflow-x: auto`) as page overflow. Both
rules were corrected; the surviving findings are those that reproduce
against a scrollable-ancestor-aware page-overflow check.

---

## Findings fixed

### 1. Page-level horizontal scroll on `/club-captain` — HIGH
**Where:** 320×568 and 360×800 only. `document.scrollWidth` 336 vs
`clientWidth` 320.
**Root cause:** `h1` resolves to a fixed `50px` for the whole
320px–767px band (`--ukbt-font-heading-h1-size-sm`). The captain's name
contains a word whose `min-content` width measures **316px** against a
**280px** container — it cannot wrap, so the flex item overflows and the
page scrolls sideways.
**Not** the stats table, which was the obvious suspect and was ruled out:
its `overflow-x: auto` wrapper contains it by design.
**Fix:** `h1 { font-size: min(var(--ukbt-font-heading-h1-size-sm), 13vw); }`
in the ≤767px block. The approved token stays the ceiling (identical at
≥384px); only narrower widths scale. No token value was redefined —
that would be a re-approval event. Plus `overflow-wrap: break-word` on
all headings, since names are client-supplied and length cannot be
guaranteed by copy.
**Verified:** 16 routes × 4 widths = 64 combinations, zero overflow.

### 2. Nav drawer does not contain focus — HIGH (a11y)
**Where:** all mobile widths.
**Measured:** the drawer sets `aria-modal="true"`, but Tab #9 moved focus
to a social link in `<main>` (`insideDrawer: false`) sitting behind the
dimmed overlay. A keyboard user operated controls that a screen reader
had just been told do not exist.
**Fix:** a Tab/Shift+Tab handler cycling focus within the drawer while
open — making behaviour match the ARIA promise already being made.
**Verified:** 12 consecutive Tabs, focus never leaves the drawer; Escape
still closes and restores focus to the toggle.

### 3. Background scrolls behind the open drawer — HIGH (UX)
**Measured:** with the drawer open, a scroll gesture moved the page from
`scrollY` 0 → **700** while the menu stayed pinned. Closing the menu
returned the reader to somewhere they never navigated to.
**Fix:** `document.body.style.overflow = 'hidden'` while open, cleared on
close. **Verified:** `scrollY` stays 0; `body.style.overflow` returns to
`''` after Escape.

### 4. Tap targets below the WCAG 2.5.8 floor — HIGH (a11y)
**Measured:** every one of these rendered as a bare **~19px line box** —
below the 24×24 CSS px Level-AA minimum, in places that are *nothing but*
tap targets:

| Group | Measured | Now |
|---|---|---|
| Footer nav links (11) | 19px tall | ≥24px |
| Hero social links (4) | 82×19 | ≥24px |
| About-CTA social links (4) | 70×19 … 11×19 | ≥24×24 |
| "See all tournaments →" | 158×19 | ≥24px |
| "Full profile →" | 93×19 | ≥24px |
| "See the franchise →" | 108×16 | ≥24px |
| Breadcrumb "Home" | 34×19 | ≥24px |
| Footer social icons (4) | 32×32 | 44×44 |

The About-CTA "X" link needed a **min-width** too: a one-character label
left an 11px-wide target even after the height was fixed.
**Fix:** `inline-flex` + `min-height` (and `min-width` where the label is
one character). Type scale and visual rhythm unchanged.

### 5. Text below the 12px legibility floor — HIGH (visual)
**Measured:** `0.7rem` = **11.2px** hard-coded in three components
(`RosterGrid`, `TournamentCard`, `TournamentGrid`) — below the legibility
floor, and bypassing the design-system scale entirely.
**Fix:** `var(--ukbt-font-size-0)` (12.8px) — the smallest approved step.

### 6. Scrollable stats table unreachable by keyboard — HIGH (WCAG 2.1.1)
**Measured:** the table is a fixed 491px (cells are `white-space: nowrap`,
correctly — wrapped score columns are harder to read), leaving 61–171px
off-screen on a phone. The `overflow-x: auto` wrapper had no `tabindex`,
so the off-screen columns were reachable *only* by a drag gesture.
**Fix:** `tabindex="0"` + `role="region"` + `aria-label={caption}` on both
tables (Batting and Bowling).
**Verified:** arrow keys scroll each region 0 → 191 (its full extent),
with a visible focus ring.

---

## Findings recorded, deliberately NOT changed

- **RosterGrid renders 2 columns at 430px.** `minmax(11rem, 1fr)` yields
  187px cards. Nothing clips, and two columns of name+country on a
  430px-wide phone is a legitimate `auto-fill` outcome, not a defect. The
  strict "must be single column on mobile" rule was wrong here.
- **Stats table wider than the viewport.** Intended and correct for
  tabular score data; addressed as a keyboard-operability issue (#6)
  rather than by forcing the columns to wrap.
- **Body copy at 12.8px** in several components. This is
  `--ukbt-font-size-0`, the smallest *approved* step, used deliberately
  for secondary/meta text. Above the 12px floor. Raising it is a type-scale
  decision, not a QA fix.
- **`crest-512.png` supplied at 512px into 44–106px slots** (4.8×–11.6×).
  A real transfer-size waste on mobile data, but closing it means
  generating and committing new raster assets (and touching
  `apps/web/src/assets/MANIFEST.md` provenance). Out of scope for a QA
  pass; logged in `docs/12-roadmap-and-open-items.md`.
- **Heading jump h2 → h4** in `MissionWelcome`. Real (matches red-team
  F4's family of findings) but is a content-structure decision spanning
  the About page, not a mobile-specific defect.

---

## Correction to a previously merged claim

`docs/12-roadmap-and-open-items.md` (PR #11) listed red-team finding
**F1 — "Mobile/tablet nav drawer is 100% keyboard-inoperable"** as OPEN.
**That was wrong.** F1 was already fixed before this session; verified
empirically here at 390×844:

- Tab #3 reaches the toggle (visible 2px gold focus ring)
- Enter opens the drawer — `aria-expanded="true"`, `inert` removed,
  drawer at `x: 0`
- All 8 nav links tab-reachable at 260×65 (well above any target minimum)
- Escape closes and returns focus to the toggle

The roadmap entry was written from the red-team receipt without
re-verifying against the current code — exactly the
"historical evidence is not current evidence" failure `CLAUDE.md` warns
about. Corrected in the same commit as this receipt.

---

## Regression protection

`apps/web/tests/visual/mobile-ux.spec.ts` — **44 tests, all passing**:
32 overflow checks (16 routes × 320/360), 7 tap-target group checks, a
sub-12px text check, 3 drawer-modal behaviour checks, and the table
keyboard-operability check.

**Falsification-checked**, per `knowledge/08-VALIDATION-POLICY.yaml`
DR-010 (a test that cannot fail is decoration): the scroll-lock fix was
reverted, the suite was re-run, and the corresponding test **failed** as
required. The fix was then restored and the suite returned to green.

## Gates run

| Command | Exit | Result |
|---|---|---|
| `pnpm lint` | 0 | PASS — 36 files |
| `pnpm typecheck` | 0 | PASS — 60 files, 0 errors |
| `pnpm test:unit` | 0 | PASS — 21/21 |
| `pnpm run check:links` | 0 | PASS — 524 links, 0 broken |
| `pnpm test:e2e` (pre-existing suite) | 0 | PASS — 204 passed, 1 env-gated skip |
| `pnpm exec playwright test mobile-ux.spec.ts` | 0 | PASS — 44/44 (new) |

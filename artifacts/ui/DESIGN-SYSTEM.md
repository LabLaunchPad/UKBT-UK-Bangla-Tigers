# Design System — Stage 5

**Date:** 2026-08-26 · **Gate:** `prompts/15-design-system.md`, requires
`FOUNDATION_STATUS = PASS` (achieved, `PASS_WITH_VERIFICATION_LIMITATION`
— see the Foundation report; the limitation is the independent-verifier
agent being unavailable, not a defect in Foundation itself).

## Scope

This audits the implemented Foundation and defines the UKBT visual
system: typography, spacing, breakpoints, color, surfaces, borders, radii,
shadows, motion, focus states, and two reusable primitives (Button, Card)
exercising them. **Not** page-by-page styling — no real route beyond the
Foundation placeholder homepage exists yet (`contracts/ROUTE-CONTRACT.md`).

## Token domains and their classification

Full detail and rationale: `packages/truth/src/tokens/approved/README.md`
(this section summarizes it).

| Domain | File | Classification |
|---|---|---|
| Spacing | `spacing.json` | DERIVED |
| Typography (family) | `typography.json` | **PROPOSED** |
| Typography (scale/weight/line-height) | `typography.json` | DERIVED |
| Color (neutral, feedback) | `color.json` | **PROPOSED** |
| Color (surface roles) | `color.json` | CSS system-color keywords (`Canvas`/`CanvasText`/`LinkText`) — theme-tracking, not a value decision at all |
| Border radius | `radius.json` | DERIVED |
| Shadow/elevation | `shadow.json` | DERIVED |
| Motion (duration/easing) | `motion.json` | DERIVED |
| Breakpoints | `breakpoint.json` | **EVIDENCE_BACKED** (restates `contracts/VISUAL-REGRESSION-CONTRACT.md`'s frozen 6-viewport matrix) |
| Container/gutter | `layout.json` | DERIVED |

**Zero `BRAND_FACT` tokens exist.** No authoritative UKBT brand evidence
exists (`knowledge/01-VERIFIED-FACTS.yaml` has no color/typography
entries — `U-05`, open). Per this stage's explicit instruction ("Do NOT
invent brand colors if authoritative brand evidence is unavailable") and
`knowledge/05-UNKNOWN-BLOCKER-POLICY.yaml`'s own worked example for this
exact case, colors and the font family are `PROPOSED`: centrally defined,
never hard-coded in a component, so real brand evidence arriving later is
a value change in one file, not a component refactor.

**None of this is Adelux-derived.** Every value is either a CSS
system-color keyword, a generic convention used by most design systems,
or the project's own already-frozen viewport matrix — never a value read
off the Adelux reference render. Adopting Adelux's specific choices (its
Lato/Montserrat typefaces, its Bootstrap container/gutter values — the 61
RAW token redeclarations in `artifacts/extraction/token-candidates.json`)
would be a Track B adaptation decision, which remains `RIGHTS_GATED`.
This design system is UKBT-original engineering and does not depend on
Track B closing.

## Components (design-system layers 6-7)

| Component | Contract | Implementation | Variants | States |
|---|---|---|---|---|
| Button | `packages/truth/src/contracts/button.contract.md` | `apps/web/src/components/Button.astro` | primary, secondary, danger | default, hover, focus-visible, disabled |
| Card | `packages/truth/src/contracts/card.contract.md` | `apps/web/src/components/Card.astro` | static / linked (whole-card link) | default, hover (linked only), focus-visible (linked only) |

Neither is derived from Adelux's `.card-blog`/`.card-chooseus`/`.btn-accent`
candidates (`artifacts/extraction/COMPONENT-CANDIDATES.md`) — those remain
Track A evidence only, not adapted. Both are independently designed to
prove the layer 6→7 pipeline with a genuinely different DOM/interaction
shape (a single interactive element vs. a content surface with an
optional whole-card link), not a trivial restyle of one shape twice.

## Global base styles

`apps/web/src/styles/base.css` — box-sizing reset, body typography/color
from tokens, `.ukbt-container` layout primitive, a global
`:focus-visible` rule (no `SOURCE_DEFECT` inherited — the Adelux reference
has a known invisible-focus-outline defect on `.btn-accent`,
`INTERACTION-FORENSICS.md`; this project's own components never exhibit
it), and a `prefers-reduced-motion` override disabling all
animation/transition durations for users who request it
(`contracts/ACCESSIBILITY-CONTRACT.md`).

## Visual test page

`apps/web/src/pages/design-system.astro` — exercises the full type scale,
neutral color ramp, feedback colors, all three button variants and their
disabled/link states, both card variants, and the spacing scale, inside
the `.ukbt-container` layout primitive. Not a real UKBT route
(`contracts/ROUTE-CONTRACT.md`) — infrastructure for this stage's
verification only.

## A real accessibility defect found and fixed during this stage

The first axe-core run against the test page failed for real: the neutral
color-ramp swatch labels (plain step-number text, e.g. "900") had no
explicit text color, inheriting default black — illegible against the
darker swatches (`neutral-700`, `neutral-900`; measured contrast 1.18:1
against `neutral-900`, needs 4.5:1). Fixed by computing the real WCAG
contrast of black vs. white text against each of the 7 neutral swatches
and choosing per-step (steps ≥ 500 use white, below use black — 500 itself
is borderline: black scores 4.41, white scores 4.77, so white is used).
This was not suppressed, weakened, or excluded from the check — the page
markup was fixed and the check re-run to confirm.

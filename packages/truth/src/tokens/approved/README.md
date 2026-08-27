# Approved tokens (design-system layer 5)

Every file here is a real, executing Style Dictionary source (`source:
["src/tokens/approved/**/*.json"]`, `style-dictionary.config.json`) —
compiled into `apps/web/src/styles/generated/tokens.css` on every build.
Nested `$description` keys per token group carry each group's
classification inline; no file carries a top-level `$description` (that
caused a real token-collision warning when Style Dictionary merged all
files into one tree — fixed by moving this rationale here instead).

## Classification summary (per `prompts/15-design-system.md`)

| File | Domain | Classification |
|---|---|---|
| `spacing.json` | Spacing scale | DERIVED — base-4 rem scale, generic convention |
| `typography.json` | Font family/size/weight/line-height | **PROPOSED** (family) / DERIVED (scale, weight, line-height) |
| `color.json` | Color | **PROPOSED** (neutral ramp, feedback hues) / uses CSS system-color keywords for surface roles |
| `radius.json` | Border radius | DERIVED |
| `shadow.json` | Elevation | DERIVED |
| `motion.json` | Duration/easing | DERIVED |
| `breakpoint.json` | Viewport widths | **EVIDENCE_BACKED** — restates `contracts/VISUAL-REGRESSION-CONTRACT.md`'s frozen 6-viewport matrix verbatim |
| `layout.json` | Container/gutter | DERIVED |

**No `BRAND_FACT` token exists.** No authoritative UKBT brand evidence
exists anywhere in this repository (`knowledge/01-VERIFIED-FACTS.yaml`
has zero color/typography entries — `U-05`, still open). Per
`prompts/15-design-system.md`'s explicit instruction ("Do NOT invent
brand colors if authoritative brand evidence is unavailable") and
`knowledge/05-UNKNOWN-BLOCKER-POLICY.yaml`'s own worked example for
exactly this case ("the token SYSTEM can be built with replaceable
placeholder values; only brand VERIFICATION is blocked"), every color and
the font family are `PROPOSED`: centrally defined here, never hard-coded
in a component, so real brand evidence arriving later is a value change
in one file, not a refactor.

## Why none of this is Adelux-derived

Every value here is either a CSS system-color keyword, a generic
numeric/greyscale convention used by most design systems, or (for
breakpoints) the project's own already-frozen viewport matrix — never a
value read off the Adelux reference render. Adopting Adelux's specific
choices (its Lato/Montserrat typefaces, its Bootstrap container/gutter
values — the 61 RAW token redeclarations in
`artifacts/extraction/token-candidates.json`) would be a Track B
adaptation decision, which remains `RIGHTS_GATED`. This design system is
UKBT-original engineering and does not depend on Track B closing.

## Accessibility verification performed, not asserted

`color.feedback.danger/success/warning` and `color.neutral.500` were
checked against `color.surface.background` (`#ffffff`/`Canvas`) with a
real WCAG relative-luminance contrast calculation (not eyeballed):
danger 6.54:1, success 6.53:1, warning 5.93:1, neutral-500 4.77:1 — all
clear the WCAG AA 4.5:1 threshold for normal text.

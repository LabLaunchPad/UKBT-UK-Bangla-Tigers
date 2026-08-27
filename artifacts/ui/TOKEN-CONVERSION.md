# Token Conversion — reference scale → UKBT token layer

**Date:** 2026-08-26 · **Authority:** `CLIENT_REQ_012` / `EV-20260826-032`
("exact token and css … tailored and converted for our UK Bangla tigers
frameworks tech stacks") · **Phase 1** of the parity reconstruction.

## Why this was the first thing to change

Prior builds passed every automated gate yet did not read as the
template. Measuring the reference's stylesheet against our token file
found the reason, and it was not per-component drift:

| Role | Reference | Ours (before) | Gap |
|---|---|---|---|
| Section block padding | 120px | `space-8` 32px | 3.75× |
| Section rhythm gap | 100px | `space-8` 32px | 3.1× |
| Inner-banner top padding | 230px | 32px | 7× |
| h1 | 90px | 48.8px | 1.8× |
| h2 | 64px | 31.2px | 2× |
| Paragraph | 18px | 12.8px | 1.4× |
| Page container | 1340px | 1440px | wrong |

**Our spacing scale topped out at 32px where the reference's base rhythm
is 100–120px.** No amount of component-level adjustment reaches the
template's proportions from there; the scale itself had to carry the
reference geometry.

## What was ported

All values are measured from `assets/css/main.css` /`responsive.css` and
now live in `packages/truth/src/tokens/approved/`, compiled by Style
Dictionary to `--ukbt-*` custom properties.

| Token group | Values |
|---|---|
| `space.gap.0..5,100` | 0, 10, 20, 30, 40, 50, **100**px — the reference's own `.gspace-*` rhythm utilities |
| `space.section.*` | padding 120px, inline 20px, wrapper inset 30 → 20 → 10px |
| `space.banner.*` | 230px top / 120px bottom |
| `font.heading.h1..h6` | 90/64/36/24/21/16px, each with `Md` (≤1025px) and `Sm` (≤767px) steps, plus weight + line-height |
| `font.body.*` | body 16px, paragraph 18px → 16px, 20px bottom margin |
| `radius.ref*` | 20 (dominant), 17, 30, 10, 8, pill 100, circle 50%, asymmetric `0 20px 0 20px` |
| `container.maxWidth.page` | 1340px |

Colour **roles** are preserved with UKBT **values** (navy `#001E3A`,
gold `#CCA44F`); the existing brand token block already carried these and
was not re-derived here.

### Deliberately not promoted

`font.family.*` stays `PROPOSED`. Porting a type *scale* says nothing
about whether the club confirmed the *typeface*. The reference's own
families happen to be Montserrat + Lato — the same two shipped in UKBT's
brand pack — so no conflict arises, but the classification is unchanged.

The pre-existing rem micro-scale (`space.1..8`, `font.size.0..6`) is
retained, not deprecated: it is the right tool for intra-component
padding. The new tokens carry *page rhythm*. Mixing the two was the
original error.

## Defect corrections (reference bugs deliberately not reproduced)

- **`h5` at ≤767px.** The reference declares a unitless `font-size: 16`,
  which is invalid CSS and silently never applies, leaving h5 at 18px on
  mobile. The evidently-intended 16px is implemented and annotated in the
  token.
- **Split-layout breakpoint.** Our two-column sections collapsed at
  767px; the reference collapses `.about-wrapper`,
  `.team-content-wrapper` and `.community-grid` at **≤1025px** with a
  50px gap (`column-reverse` for the first two). Ours now match. This was
  both a parity mismatch and the cause of a real 768px overflow once the
  100px gap landed.

## Deviations from the reference, and why

- **Detail card stacked, not overlaid** (`ClubIntro`, `AboutStory`). The
  reference overlays `.card-about-detail` on a photograph, where covering
  part of the frame is harmless. Our slot holds the crest, and the
  overlay landed on the "UK BANGLA TIGERS" wordmark — the larger ported
  type scale made the card taller and re-triggered a collision fixed
  earlier in the build. Reverts to a true overlay once a photograph
  occupies the slot (`CLIENT_REQ_010` asset work, Phase 3).
- **`overflow-wrap: break-word` on headings.** UKBT titles are materially
  longer than the reference's ("International Tournaments/Events" vs
  "Tournaments") and offer no break opportunity; at the reference's 50px
  mobile size that title measured 546px against a 430px viewport. Per the
  parity spec's content-length rule the geometry stays and the text
  wraps, rather than shrinking the scale to fit our copy. `max-width:
  100%` on the banner title is what actually enables the break, since a
  centred column-flex child otherwise sizes to `max-content`.
- **Mobile section padding.** 120px block padding at 390px wide leaves
  almost no room for content; the section primitive steps to 50px below
  767px.

## Screenshot-reading note

The pages are now tall (about/index exceed 3000px). A full-page
screenshot viewed scaled-to-fit does not resolve fine detail — during
this phase two "defects" in the About banner turned out to be misreadings
of a 1.59×-downscaled image. Both `elementFromPoint` probing and a
full-resolution crop showed the region empty, and the DOM contained
exactly one `<footer>`. **Crop the region of interest at full resolution
before concluding anything about it.** The capture harness now also
disables animations and neutralises the sticky header, per
`VISUAL-REGRESSION-CONTRACT`'s deterministic-comparison requirement.

## Verification

`pnpm typecheck` 0 errors · `pnpm lint` clean · `pnpm build` 9 routes ·
**101/101 Playwright + axe passing**, including zero-overflow across all
frozen viewports (two real overflow regressions were caught by that gate
during this phase and fixed, not waived). Screenshots re-captured at the
frozen matrix and inspected at full resolution on desktop and mobile.

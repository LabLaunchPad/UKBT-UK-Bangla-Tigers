# Homepage Visual QA

**Date:** 2026-08-26 · Method: real rendered screenshots at the frozen
6-viewport matrix (`apps/web/tests/visual/screenshots.spec.ts`),
inspected directly (not judged by "the build passed"). Two rounds: an
initial build, then a template-geometry revision per the requester's
instruction to mirror the Adelux source's actual section layouts
(`HTML_TEMPLATE/index.html`/`main.css`, read a second time) rather than
a generic reinterpretation.

## Round 1 defects found and fixed

| Viewport | Element | Expected | Actual | Severity | Fix |
|---|---|---|---|---|---|
| 1440×900, 390×844 | Hero crest logo | Rendered at intrinsic aspect ratio, ~5rem tall | Stretched to full container width, illegible, overlapping the headline | **P0** | `.ukbt-hero__title` is a column flex container with no `align-items` (defaults to `stretch`), which overrides the image's own `width:auto`. Added `align-items: flex-start` + `flex: none` on the image |
| 1440×900 | ClubIntro overlay card vs. stat row | Card overlaps only the image | Card's `bottom:-1.5rem` placement, plus no reserved clearance on the image column, let it overlap the 3-stat row in the sibling column | **P1** | Repositioned card to `bottom: 1rem` (on the image, not hanging below it) and added `margin-bottom: 4rem` to the image-side column to reserve clearance |
| 1440×900 | Hero CTA card body copy | Distinct supporting copy | Repeated the exact tagline already shown above it in the same viewport | **P2** | Replaced with distinct, non-factual CTA copy ("Be part of the next chapter, on and off the pitch.") |
| 1440×900 | Franchise teaser CTA overlay | Legible over a clear part of the image | Overlaid on the image top-left, covering a player's face in the source graphic | **P1** | Initially moved to bottom-left; on reflection, guessing at a "safe" spot on a busy multi-subject photo is fragile — restructured as a caption bar *below* the image instead of an overlay, which cannot collide with any part of the photo regardless of its content |

## Round 2 defect found and fixed (after the template-geometry revision)

| Viewport | Element | Expected | Actual | Severity | Fix |
|---|---|---|---|---|---|
| 1440×900 | ClubIntro overlay card vs. paragraph text | Card stays within the image's own horizontal bounds | Card's fixed `max-width: 16rem` was wider than the image's rendered width (~10.3rem at the crest's aspect ratio), so centering it under the image let it spill rightward into the "We are not only a team..." paragraph in the sibling column | **P1** | Changed from a centered fixed-max-width box to `left: 0; right: 0` within the (unsized, shrink-to-fit) image-side container — the card now exactly matches the image's own rendered width, never wider |

## Final state, both rounds' fixes applied

Re-screenshotted at all 6 frozen viewports after each fix (not assumed
fixed from the CSS change alone). Confirmed clean at 1440×900 and
390×844 by direct visual inspection: crest renders undistorted, About
overlay stays within the image bounds and no longer touches the
paragraph, tournament grid mirrors the reference's real 0.32/0.68 split
with real UKBT tournament data, franchise teaser has no text-over-face
collision, captain spotlight row is clean, footer icon-only social links
render correctly, mobile nav toggle works, no horizontal overflow at any
of the 6 viewports (automated + visually confirmed).

## What was not pixel-matched, and why

- Reference-specific decorative elements with no functional purpose
  (background blur shapes, decorative SVG flourishes) were not ported —
  Stage 6's own rule is to adapt *layout grammar*, not clone the
  reference's exact decorative treatment.
- Testimonial and Service/Booking sections are omitted entirely — no
  real UKBT content exists for either (no consented member testimonials,
  no court-booking product), and inventing placeholder content for them
  would violate this project's core "never fabricate" rule.
- Exact pixel values (e.g. the reference's specific `724px` main-event
  card min-height) were not copied literally; proportional relationships
  (grid fractions, gap sizes, alignment rules) were — consistent with
  "reference geometry through tokens/CSS," not a 1:1 pixel clone.

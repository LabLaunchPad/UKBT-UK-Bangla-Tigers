# About Us Visual QA

**Date:** 2026-08-26 · Method: real rendered screenshots at the frozen
6-viewport matrix (`apps/web/tests/visual/screenshots.spec.ts`),
inspected directly — same discipline as `HOMEPAGE-VISUAL-QA.md`.

## Result

No defects found on first build. Inspected directly at 1440×900,
768×1024, and 390×844:

- Mission-fact cards (4-up desktop → 2-up tablet → 1-up mobile) render
  without overlap or clipped text at any width.
- The "Our Story" image/detail-card pairing (same overlap-prone pattern
  fixed twice during Homepage QA) reused `ClubIntro.astro`'s corrected
  geometry (`left:0; right:0` card matched to the image's own rendered
  width) — no recurrence of that defect here.
- Leadership cards stack correctly (2-col desktop/tablet → 1-col mobile)
  and are confirmed text-only (no photo element rendered — enforced by
  `about.spec.ts`'s "no leadership photo" check).
- CTA section's two cards stack correctly below 768px; the "Join the
  Club" button reads correctly against the accent-gold card background at
  every viewport checked.
- No horizontal overflow at any of the 6 frozen viewports (automated +
  visually confirmed at 3 of the 6).

## What was not pixel-matched, and why

- Sponsor/partner logo swiper — omitted, no sponsor evidenced.
- "Why Choose Us" 2×2 card grid — omitted, no distinct evidenced content
  beyond what the mission-fact cards already show.
- Testimonial section — omitted, no consented member testimonials exist.
- Team section's photo-overlay card style (`.card-team`) — deliberately
  not ported; leadership cards are text-only since no leadership portrait
  has a confirmed identity/rights source.

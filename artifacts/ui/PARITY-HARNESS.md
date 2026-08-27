# Parity Harness — measuring the reference, not guessing at it

**Date:** 2026-08-26 · **Phase 2** of the parity reconstruction.

Until now every parity claim in this project rested on reading CSS and
eyeballing screenshots. This adds measurement on both sides so a claim
like "our section rhythm matches the reference" cites two numbers.

## Pieces

| File | Role |
|---|---|
| `apps/web/tests/visual/reference-geometry.spec.ts` | Renders the reference package and measures it → `artifacts/ui/reference-geometry.json` |
| `apps/web/tests/visual/ukbt-geometry.spec.ts` | Measures our build with the same probes → `artifacts/ui/ukbt-geometry.json` |
| `scripts/compare-geometry.mjs` | Diffs the two, prints a P0–P3 table, exits non-zero on P0 |

Run:

```bash
UKBT_REFERENCE_DIR=/path/to/Adelux_Main_File/HTML_TEMPLATE \
  pnpm --filter @ukbt/web exec playwright test tests/visual/reference-geometry.spec.ts
pnpm --filter @ukbt/web exec playwright test tests/visual/ukbt-geometry.spec.ts
node scripts/compare-geometry.mjs
```

## Why measurements are committed and renders are not

`knowledge/01-VERIFIED-FACTS.yaml` records the template as
`in_repository: false` — deliberately excluded. Committing full-page
renders of it would import its visual expression (branding, demo
photography) into this repository through the back door, defeating that
exclusion. Reading and measuring it is separately permitted
(`FORENSIC_PERMISSION = ALLOWED`, and this repo already holds forensic
measurements under `artifacts/extraction/`).

So: geometry JSON is committed; rendered images go to a scratch
directory. The reference suite **skips** unless `UKBT_REFERENCE_DIR` is
set, so it is reproducible by anyone holding the licensed package and
inert in CI.

## Two harness problems found and fixed

**The reference homepage never finished loading.** It embeds a YouTube
iframe; with no outbound network that request hangs and `load` never
fires, so the first run timed out. Non-`file://` requests are now
aborted and navigation waits on `domcontentloaded`. Measurement only
needs the local CSS/JS.

**The first probe measured markup order, not the type scale.** Taking
"the first `<p>` on the page" gave 25px on our homepage (a styled
tagline) and 13px on /about (an eyebrow pill), against the reference's
18px — 30 reported mismatches that were not defects. The probe now
appends bare, unstyled elements and measures those, isolating the
stylesheet's own cascade. That is what "was the scale ported correctly"
actually means.

## What the harness caught in our build

Two assumptions I had written into the code, both disproved by
measurement and both corrected:

| Assumption | Reality | Was |
|---|---|---|
| "120px section padding leaves almost no room at 390px, halve it on mobile" | The reference holds **120px at every viewport**, 1920 → 390 | 8 P1 mismatches |
| "230px banner padding is far too tall for a phone, scale it down" | The reference holds **230/120 at every viewport** | 16 P1 mismatches |

Also caught: the hero headline used a fluid `clamp()` rendering 60px
against the reference's 90px (3 mismatches).

Neither of the first two would have been noticed by looking — each
produced a plausible-looking page. They were wrong only relative to a
measurement of the thing we are supposed to be matching.

## Current state

```
Geometry parity: 156 comparisons, 0 mismatches
P0 0  P1 0  P2 0  P3 0
```

Covering h1/h2/h3/paragraph base sizes, section block padding, and
banner padding across 7 UKBT routes × 7 viewports.

**This does not mean the site matches the template.** It means the
*scale* now does. Section composition, component structure, the
navbar/footer architecture, and imagery are still to come — the navbar
alone measures 162px tall in the reference against our 72px. Those are
Phases 3–5, and the harness is what will keep them honest.

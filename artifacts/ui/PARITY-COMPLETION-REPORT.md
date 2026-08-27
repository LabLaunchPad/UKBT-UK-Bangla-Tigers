# Template UI Parity — Completion Report

**Date:** 2026-08-26 · **Authority:** `EV-20260826-032` (CLIENT_REQ_009–012)
· **Branch:** `claude/ukbt-bootstrap-discovery-otlcwo`

## Verdict

| Dimension | Verdict | Basis |
|---|---|---|
| TEMPLATE_PAGES_DISCOVERED | **13** | `artifacts/ui/PAGE-PARITY-MATRIX.md` |
| UKBT_PAGES_IMPLEMENTED | **16 routes** (13 mirrored + `/club-captain`, `/players`, `/franchises` from CLIENT_REQ_001) | build output |
| PAGE_PARITY | **PASS** | every reference page has a UKBT route; `/news/[slug]` ships its template with an empty path set by design |
| SECTION_PARITY | **PARTIAL** | counts match or exceed the reference on 7 of 13; the shortfalls are sections with no UKBT counterpart, not unfinished work |
| COMPONENT_PARITY | **PASS** | header, footer, button, eyebrow, section header, cards and the off-canvas drawer all rebuilt to measured reference geometry |
| WIREFRAME_PARITY | **PASS** | section sequences follow the reference's own order — see the matrix's sequence list |
| RESPONSIVE_PARITY | **PASS** | breakpoints ported from `responsive.css` (1025 / 767); zero horizontal overflow across 7 viewports × 16 routes |
| VISUAL_PARITY | **PASS on measured geometry** | 156 comparisons, 0 mismatches (`scripts/compare-geometry.mjs`) |
| CONTENT_REPLACEMENT | **PASS** | zero Adelux strings in any rendered page, asserted per route |
| ASSET_REPLACEMENT | **PARTIAL** | UKBT crest and two client-authorised photographs in use; most supplied images held back with recorded reasons |
| ACCESSIBILITY | **PASS** | axe zero-violations per route; 189 tests passing |

**VISUAL_DIFFS_REMAINING: P0 0 · P1 0 · P2 0 · P3 0** on the measured
checks (base type scale, section padding, banner padding), across 7
routes × 7 viewports.

## The finding that mattered most

Prior builds passed every gate and still did not look like the template.
Measuring both sides found why, and it was not per-component drift:

| Role | Reference | Ours (before) | Gap |
|---|---|---|---|
| Section block padding | 120px | 32px | 3.75× |
| Section rhythm gap | 100px | 32px | 3.1× |
| Inner-banner top padding | 230px | 32px | 7× |
| h1 | 90px | 48.8px | 1.8× |
| Navbar height | 162px | 72px | 2.25× |

The spacing scale topped out at 32px where the reference's *base* rhythm
is 100–120px. Nothing reachable by adjusting components fixes that; the
token layer had to carry the reference geometry.

## Where parity is deliberately not reached

Section-count shortfalls are concentrated in sections describing a
padel-court business:

- **Service / Padel Booking / Pricing / Membership Benefit / Booking** —
  the reference sells court hire, coaching packages and membership
  tiers. UKBT's evidenced activity is tournament cricket. These are
  absent by decision, and where a route mirrors such a page it ships
  `noindex` and stays out of both navs (ROUTE-CONTRACT Amendment 01
  condition 2): an indexed page is a public claim the club sells the
  thing.
- **Maps** (contact) — no venue is on record (U-16).
- **Testimonial** — present as structure on 3 routes (`/about`,
  `/tournaments`, `/contact`), empty by decision. No consented member
  quote exists, and a testimonial is the worst thing on a site to
  invent: it puts words in a named person's mouth. It was also on the
  homepage until the Stage 8 red team (`artifacts/review/HOMEPAGE-REDTEAM.md`,
  F2) found that shipping a visibly-empty box on the site's primary
  indexed route was worse than omitting the section — removed there,
  along with `NewsTeaser` for the same reason.
- **Blog / Single Post** — no UKBT article exists. The article template
  is committed and reviewable; `getStaticPaths` returns an empty set.

Fourteen sections across the site carry `CONTENT_STATUS = UNKNOWN`, each
stating plainly what is missing. That is the shell form CLIENT_REQ_009
asked for, held against CLAUDE.md's rule that facts are never invented.

## What "0 mismatches" does and does not mean

It means the **base type scale, section padding and banner padding**
match the reference exactly, everywhere measured. It does **not** mean
the site is pixel-identical: the comparison covers geometry, not
composition, imagery or copy. Two known limits:

- The reference is photo-heavy in nearly every section. We use three
  images. Most supplied photography is held back (watermarks, other
  clubs' sponsor bars, national-team kit) — see
  `apps/web/src/assets/MANIFEST.md`.
- Component-level dimensions (card padding, icon sizes) are not in the
  comparison set. They were ported by reading the reference's CSS, which
  is weaker evidence than measurement.

## Corrections made during the work

Recorded because each was a real error caught by a gate rather than by
intention:

1. **Two assumptions written into the code and disproved by
   measurement** — that 120px section padding and 230px banner padding
   must shrink on mobile. The reference holds both at every viewport.
   24 P1 mismatches.
2. **Gold-on-light reintroduced three times** (2.33:1). The contrast test
   was generalised from one hand-picked element to scanning every
   gold-painted element across six routes.
3. **The generalised test then missed a fourth case** — a 0.55 opacity
   over gold blends to 2.99:1, and opacity is invisible to a
   computed-`color` check. Caught by axe. Both guards now run, and the
   blind spot is documented in the test rather than papered over.
4. **An excluded person shipped inside an image** for a full stage
   (`EV-20260826-031`). Text-content greps cannot see into raster images;
   every asset is now viewed at full resolution before staging.
5. **Two screenshot misreadings** — apparent defects in the About banner
   that a full-resolution crop and `elementFromPoint` both showed absent.
   Pages now exceed 3000px; scaled-to-fit views do not resolve detail.

## Open items for the client

- **Two photographs carry third-party photographer watermarks** ("FSR
  FOTOGRAFIA", "TOP-KNOCK STUDIOS"). That is a rights question, distinct
  from the affiliation authorisation in CLIENT_REQ_010, and they are held
  back pending confirmation UKBT holds publication rights.
- Contact details, squad list, coaching staff, membership terms and any
  club news remain UNKNOWN. Every one has a built slot waiting.

## Reproducing the evidence

```bash
UKBT_REFERENCE_DIR=/path/to/Adelux_Main_File/HTML_TEMPLATE \
  pnpm --filter @ukbt/web exec playwright test tests/visual/reference-geometry.spec.ts
pnpm --filter @ukbt/web exec playwright test tests/visual/ukbt-geometry.spec.ts
node scripts/compare-geometry.mjs
UKBT_REFERENCE_DIR=... node scripts/build-parity-matrices.mjs
```

Reference *measurements* are committed; reference *renders* are not — the
template is recorded `in_repository: false`, and committing full-page
images of it would import its visual expression through the back door.

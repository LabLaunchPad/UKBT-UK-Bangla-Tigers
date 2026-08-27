# UK Bangla Tigers — Branding Assets

Exported from the `LabLaunchPad/UK-Bangla-Tigers` repo (`apps/web/public/`) on 2026-08-26.

## Provenance

- **Logo / crest** (`brand/crest*.png`, `brand/crest-256.webp`, `brand/icon-32.png`,
  `brand/icon-180.png`, `brand/favicon.svg`): mirrored from the club's own live site,
  https://ukbanglatigers.co.uk (original: `Asset-1@4x-2-scaled.png`). Recorded as a
  `verified` fact in `packages/truth/src/brand.ts`. No vector original has been
  supplied by the club — all files are raster (PNG/WebP/SVG-wrapped-raster favicon).
- **Fonts** (`fonts/lato-400.woff2`, `fonts/lato-700.woff2`,
  `fonts/montserrat-variable.woff2`): Lato and Montserrat, both open-source Google
  Fonts (SIL Open Font License), recorded as an `assumption` fact — the club has
  published no typography spec, so these were adopted from the approved Adelux
  template used for visual design.
- **Images** (`images/gallery`, `images/leadership`, `images/uppsala`,
  `images/hero`, `images/social-card`): mirrored from the club's live site and
  re-encoded to WebP/JPEG, per `docs/12-media-assets.md`. Nothing here is stock
  photography.

## Deliberately excluded

Player portraits (`apps/web/public/media/players/`) are **not** included in this
export. `docs/12-media-assets.md` flags that gallery as mixing club-produced studio
portraits with what appear to be press/agency photographs of international
cricketers, with rights unconfirmed for several of them (tracked as the
`image-rights` truth note). One case (a Times of India–watermarked photo) has
already been pulled from publication. Until the club confirms licensing, those
files should not be redistributed further — request them separately if you have
a specific, cleared need.

## Brand palette (sampled from the crest, `packages/truth/src/brand.ts`)

| Colour | Hex       |
| ------ | --------- |
| Navy   | `#001E3A` |
| Gold   | `#CCA44F` |
| Green  | `#064D49` |
| Cream  | `#F8F4E8` |
| White  | `#FFFFFF` |

Note: gold-on-white contrast is 2.42:1 — never use gold for text on a white background.

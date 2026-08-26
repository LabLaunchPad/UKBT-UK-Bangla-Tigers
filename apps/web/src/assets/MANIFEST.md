# Asset Manifest

Per `contracts/ASSET-CONTRACT.md`: every file under `apps/web/public/` is
recorded here with its provenance class before use. Source stage: 7
(`artifacts/brand/raw/`, `EV-20260826-029`).

| Path | Source | Identity | Usage | Rights status | UKBT-required | Alternative |
|---|---|---|---|---|---|---|
| `public/brand/crest-512.png` | `artifacts/brand/raw/brand/crest-512.png` | UK Bangla Tigers crest logo | Header logo, hero mark | UKBT-owned (client-supplied) | Yes | None — canonical logo |
| `public/brand/crest-256.webp` | `artifacts/brand/raw/brand/crest-256.webp` | Same crest, WebP, smaller size | Smaller-context logo instances (footer) | UKBT-owned (client-supplied) | Yes | `crest-512.png` |
| `public/favicon.svg` | `artifacts/brand/raw/brand/favicon.svg` | Simplified "UBT" monogram favicon | `<link rel="icon">` | UKBT-owned (client-supplied) | Yes | `icon-32.png` |
| `public/icon-32.png` | `artifacts/brand/raw/brand/icon-32.png` | Favicon PNG fallback | `<link rel="icon" sizes="32x32">` | UKBT-owned (client-supplied) | Yes | None |
| `public/icon-180.png` | `artifacts/brand/raw/brand/icon-180.png` | Apple touch icon | `<link rel="apple-touch-icon">` | UKBT-owned (client-supplied) | Yes | None |
| `public/social-card.jpg` | `artifacts/brand/raw/images/social-card/default.jpg` | Official OG/social preview image (crest + wordmark + tagline), 1200x630 | `og:image`, `twitter:image` | UKBT-owned (client-supplied) | Yes | None |
| `public/fonts/lato-400.woff2` | `artifacts/brand/raw/fonts/lato-400.woff2` | Lato Regular | Body text, self-hosted | Third-party (cleared) — SIL Open Font License | Yes (PROPOSED typography) | System font stack |
| `public/fonts/lato-700.woff2` | `artifacts/brand/raw/fonts/lato-700.woff2` | Lato Bold | Body emphasis, self-hosted | Third-party (cleared) — SIL Open Font License | Yes (PROPOSED typography) | System font stack |
| `public/fonts/montserrat-variable.woff2` | `artifacts/brand/raw/fonts/montserrat-variable.woff2` | Montserrat Variable | Headings, self-hosted | Third-party (cleared) — SIL Open Font License | Yes (PROPOSED typography) | System font stack |

## Explicitly NOT staged to production (per Stage 7G exclusions, extended)

- `home-hero.webp`, `join-us.webp`, `gallery-06.webp` — team/event
  affiliation not confirmed as UK Bangla Tigers (`EV-20260826-030`).
- `nordic-smash-slide.webp` — **removed after initial staging**: has
  "NIPO KHADEM / PORTUGAL" baked into the photo itself, which
  `CLIENT_REQ_008` requires excluded from any published content
  (`EV-20260826-031`, found on direct visual inspection — a text-content
  grep cannot catch a name inside a raster image). It shipped briefly on
  the Homepage's FranchiseTeaser section before this was caught; both
  that section and the new Our Franchises page now use the crest instead.
  No alternative Uppsala Tigers photo excluding this player exists in
  evidence.

No other file from `artifacts/brand/raw/images/` is staged here.

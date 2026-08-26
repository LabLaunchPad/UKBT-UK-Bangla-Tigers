# UKBT Brand Decision Record

**Date:** 2026-08-26 · Source: `EV-20260826-029` (client-supplied branding
asset archive, `artifacts/brand/raw/`). This is Stage 7's brand decision
(§8-12/§13-15 of the Stage 7 execution prompts) — closes the part of
U-05 (brand assets) that was previously fully `UNKNOWN`.

## Provenance note on the supplied README

`artifacts/brand/raw/SUPPLIED-README-AS-IS.md` is preserved verbatim as
supplied. It references file paths (`packages/truth/src/brand.ts`,
`docs/12-media-assets.md`, `apps/web/public/media/players/`) and a repo
name (`LabLaunchPad/UK-Bangla-Tigers`) that **do not exist in this
repository** — confirmed by direct search, not assumed. Per the
requester's clarification, this is because the export originates from a
**previous, different repository attempt**, not this one — not a
fabrication. Accordingly: its specific file-path claims are treated as
**inapplicable to this repo**, not evidence of anything here; its
"verified" framing is not adopted on its say-so. Everything below is
independently re-derived from the actual asset files themselves.

## Logo

`brand/crest.png` (1504×2048, RGBA) and its pre-sized variants
(crest-96/128/256/512, crest-256.webp) are a shield crest: "UK BANGLA
TIGERS," a tiger-head mark, a crown, "EST 2020," in a heraldic shield
outline. `brand/favicon.svg` is a simplified 64×64 monogram ("UBT") using
the identical three-color scheme. `brand/icon-32.png`/`icon-180.png` are
standard favicon/apple-touch-icon raster sizes of the same mark.

```
CANONICAL_LOGO = artifacts/brand/raw/brand/crest.png (1504x2048, source-of-truth resolution)
FAVICON        = artifacts/brand/raw/brand/favicon.svg
STATUS         = VERIFIED (real, well-formed image files; visually inspected directly)
LIGHT/DARK/MONOCHROME VARIANTS = NOT SUPPLIED — only one colorway exists across all sizes
```

## Colour palette — independently verified, not taken on the supplied README's word

Sampled directly from `brand/crest.png`'s actual pixel data (Python/
Pillow, opaque pixels only, 2,224,801 sampled):

| Colour | Hex | Share of crest | Role (by usage pattern, not raw frequency) |
|---|---|---|---|
| Navy | `#001E3A` | 62.1% | Dominant field colour — appears as the base/background in every brand mark (crest field, favicon background, management-team graphic background) |
| Gold | `#CCA44F` | 10.1% (+7.8% antialiased) | Consistent accent/detail colour — shield border, crown, "EST/2020" text, favicon stroke, in every mark |
| White | `#FFFFFF` | 8.2% | Text/foreground on dark fields |
| Green | `#064D49` | 3.3% | Minor detail only — appears solely in a small mountain/wave motif at the crest's base; no independent UI usage observed |
| Cream | `#F8F4E8` | 2.3% | Light warm-neutral tint, minor presence |

**This independently confirms the supplied README's palette claim is
accurate** (its hex values match direct pixel sampling to within
antialiasing noise) — its palette table is adopted as `VERIFIED`, even
though its surrounding provenance narrative is not.

### Real contrast checks (WCAG relative-luminance formula, computed — not eyeballed)

| Pair | Ratio | AA normal text (4.5:1)? |
|---|---|---|
| Gold on White | 2.34:1 | **FAILS** |
| Gold on Navy | 7.21:1 | PASSES |
| White on Navy | 16.84:1 | PASSES |
| White on Green | 9.70:1 | PASSES |
| Navy on Cream | 15.32:1 | PASSES |
| Green on White | 9.70:1 | PASSES |

This confirms the supplied README's own caution ("gold-on-white contrast
is 2.42:1 — never use gold for text on white") — recomputed independently
at 2.34:1, materially the same finding. **Rule adopted: Gold is never
used as text on White/Cream; it is used on Navy/dark surfaces, or as a
non-text accent (borders, icons, underlines) on light surfaces.**

### Decided tokens

| Token | Value | Status | Basis |
|---|---|---|---|
| `PRIMARY` | `#001E3A` (Navy) | VERIFIED | Dominant field colour across every supplied brand mark |
| `PRIMARY_HOVER` | `#001A33` | DERIVED | Navy, −12% lightness (deterministic formula, not brand-specified) |
| `PRIMARY_ACTIVE` | `#00172D` | DERIVED | Navy, −22% lightness |
| `PRIMARY_CONTRAST` | `#FFFFFF` | VERIFIED | 16.84:1 on Navy |
| `SECONDARY`/`ACCENT` | `#CCA44F` (Gold) | VERIFIED | Consistent accent/detail role across every supplied brand mark |
| `ACCENT_HOVER` | `#B49046` | DERIVED | Gold, −12% lightness |
| `ACCENT_ACTIVE` | `#9F803E` | DERIVED | Gold, −22% lightness |
| `ACCENT_CONTRAST` | `#001E3A` (Navy) or `#000000` | VERIFIED | 7.21:1 (Navy-on-Gold direction); never White text on Gold |
| `TERTIARY` (Green) | `#064D49` | PROPOSED | Real colour, but only observed as a minor crest-artwork detail — no independent UI-usage evidence yet; proposing it as an optional tertiary/semantic accent, not asserting it as decided |
| `SURFACE_ALT` (Cream) | `#F8F4E8` | PROPOSED | Same basis as Green — real but minor presence |
| `BACKGROUND`/`SURFACE`/`TEXT`/`TEXT_MUTED`/`BORDER`/`FOCUS` | unchanged from Stage 5 | UNCHANGED | Stage 5's neutral scale (`packages/truth/src/tokens/approved/color.json`) is system-derived, not Adelux-derived, and isn't superseded by this brand find — it will be re-themed around Navy/Gold at implementation time (Stage 7G), not decided here |
| `SUCCESS`/`WARNING`/`ERROR`/`INFO` | unchanged from Stage 5 | UNCHANGED | Semantic feedback colours are a separate decision axis; no evidence here changes them |

**This record does not itself apply these tokens to `packages/truth`'s
token files** — that is Stage 7G implementation, gated behind the
Homepage Contract (Stage 7F), consistent with this pipeline's own "do not
implement before the contract passes" rule.

## Typography

`fonts/lato-400.woff2`, `fonts/lato-700.woff2`, `fonts/montserrat-variable.woff2`
— verified as real, valid WOFF2 files (correct `wOF2` magic bytes, not
placeholder/corrupt data).

```
HEADING_FONT = Montserrat (variable weight)
BODY_FONT    = Lato (400, 700)
STATUS       = PROPOSED, not VERIFIED
```

**Why PROPOSED, not VERIFIED:** the supplied README states these were
"adopted from the approved Adelux template" as an explicit assumption,
not something the club itself specified. No independent confirmation
exists that these are UKBT's actual chosen typefaces. They are also,
notably, the exact same two families already recorded as Adelux's own
typography (`token-candidates.json`) — plausible (Lato/Montserrat are
extremely common, freely-licensed choices), but this record does not
overstate that coincidence as brand truth. `licence: SIL Open Font
License` for both — real, checkable, low-risk regardless of the
verification-status question.

## New content facts surfaced by these assets (update Truth Model separately)

- `brand/crest.png` reads "EST 2020" — a real, directly-observed founding
  year (narrows U-03).
- `images/leadership/management-team.webp` — a real announcement graphic:
  **Mohammad Chowdhury: Founder & CEO** (new role, in addition to Club
  Captain per `EV-20260826-026`); **MD Shahidul Alam Ratan: Chairman**
  (this graphic itself uses "Chairman" — the client's correction
  instruction in `EV-20260826-026`, "must read Acting Chairman," is very
  likely a correction *to this exact graphic*, not a fresh conflict);
  **Sayem Rahman: Vice-Chairman** (new). Tagline: "WE ARE NOT ONLY A
  TEAM, BUT ALSO AN INSTITUTE FOR LEARNING!" — matches, nearly verbatim,
  the independent `WebSearch` snippet already on record
  (`EV-20260826-028`). Also visible: a "NORDIC SMASH T20" event mark,
  consistent with the tournament already on record.
- `images/hero/home-hero.webp` — a real photograph of a team in
  light-blue/black kit with sponsor logos on the kit (not confidently
  legible from the photo — recorded as "sponsor logos present, names
  unconfirmed," not guessed at).
- `images/gallery/gallery-15.webp` and `images/leadership/our-story.webp`
  are byte-identical (same SHA256) — the same photo reused under two
  names, not two different images.

## What was explicitly NOT supplied

No player portraits (the supplied README itself flags this — regardless
of that README's other inapplicable claims, no such files exist in this
archive, which is independently verifiable by its own file listing). No
sponsor name/logo list. No explicit brand guideline document (colour
values were derived by direct pixel sampling, not read from a style
guide).

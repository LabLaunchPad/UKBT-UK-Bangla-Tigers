# UKBT Brand Foundation

**Date:** 2026-08-26 · **Status:** FROZEN for Stage 7 homepage work.
Consolidates `EV-20260826-029`/`-030` and `artifacts/brand/BRAND-DECISION.md`
into the single reference the Homepage Contract and Template Mapping cite.
Supersedes nothing by deletion — the full reasoning and raw evidence stay
at `artifacts/brand/BRAND-DECISION.md` and `artifacts/evidence/`.

## Identity

```
CANONICAL_LOGO   = artifacts/brand/raw/brand/crest.png (1504x2048, source resolution)
FAVICON          = artifacts/brand/raw/brand/favicon.svg
ICON_SIZES       = 32, 96, 128, 180, 256, 512 (all supplied, all one colourway)
LOGO_VARIANTS    = NONE SUPPLIED — no light/dark/monochrome alternates exist;
                   the single colourway (navy field, gold detail, white text)
                   is used as-is; do not synthesize variants that weren't supplied
FOUNDING_YEAR    = 2020 ("EST 2020," read directly off the crest)
CLEAR_SPACE_RULE = NOT EVIDENCED — no usage guide was supplied; treat the
                   logo with generous padding by default until a rule exists
```

Logo content, directly observed: "UK BANGLA TIGERS" wordmark, a tiger-head
mark, a crown, "EST 2020," in a heraldic shield outline.

## Colour

Independently verified by direct pixel sampling of `crest.png`
(2,224,801 opaque pixels) — not taken from any supplied README's word.
Full contrast math: `artifacts/brand/BRAND-DECISION.md`.

```
PRIMARY          = #001E3A  (Navy)   — VERIFIED
PRIMARY_HOVER    = #001A33            — DERIVED (−12% lightness)
PRIMARY_ACTIVE   = #00172D            — DERIVED (−22% lightness)
PRIMARY_CONTRAST = #FFFFFF            — VERIFIED, 16.84:1 on Navy

ACCENT           = #CCA44F  (Gold)   — VERIFIED
ACCENT_HOVER     = #B49046            — DERIVED (−12% lightness)
ACCENT_ACTIVE    = #9F803E            — DERIVED (−22% lightness)
ACCENT_CONTRAST  = #001E3A or #000000 — VERIFIED, 7.21:1 (Navy-on-Gold)

TERTIARY         = #064D49  (Green)  — PROPOSED (real colour, minor crest-artwork presence only, no independent UI-usage evidence)
SURFACE_ALT      = #F8F4E8  (Cream)  — PROPOSED (same basis as Green)
```

### Binding accessibility rule (measured, not assumed)

```
Gold on White/Cream  = 2.34:1  → FAILS WCAG AA normal text (4.5:1)
Gold on Navy         = 7.21:1  → PASSES
White on Navy        = 16.84:1 → PASSES
```

**Gold MUST NOT be used as normal text on white/light backgrounds.** Gold
is used on Navy/dark surfaces, or as a non-text accent (borders, icons,
underlines, thin rules) on light surfaces. This is a binding constraint
on the Homepage Contract and every future page, not a suggestion.

### What this does NOT license

- Inventing additional "brand" colours beyond Navy/Gold — Green and Cream
  stay `PROPOSED` until an actual UI use is evidenced or decided.
- Reinterpreting the accessibility rule to permit "a slightly different
  gold" on white — any new gold-family value must pass the same
  contrast check before use, computed the same way, not eyeballed.

## Typography

```
HEADING_FONT = Montserrat (variable weight)  — PROPOSED, not VERIFIED
BODY_FONT    = Lato (400, 700)               — PROPOSED, not VERIFIED
FILES        = artifacts/brand/raw/fonts/*.woff2 (valid WOFF2, confirmed by magic bytes)
LICENCE      = SIL Open Font License (both families)
```

Stays `PROPOSED` deliberately: the supplied material's own framing is
that these were adopted from the Adelux reference as an assumption, not
specified by the club. Font *files* existing is not evidence of a brand
*decision* — this is exactly the distinction this project's evidence
policy exists to hold. If the club later confirms or changes this, one
evidence record updates this status; the font files themselves don't
need to change to do it.

## Design principle — the line that must hold through implementation

```
Reference (Adelux) informs:  layout grammar · spacing rhythm · responsive
                              behavior · component composition ·
                              interaction patterns
                              (Stage 6, artifacts/ui/REFERENCE-ANALYSIS.md)

UKBT determines:              logo · colour · typography (pending) ·
                              content · imagery · terminology · brand
                              hierarchy
                              (this document)
```

The shipped homepage must be identifiably **UK Bangla Tigers built using
structural lessons from a reference template** — never an Adelux reskin
with UKBT's name swapped in. Every visual decision in the Homepage
Contract traces to this document or to Stage 6, never to an Adelux value
adopted by default.

## Known cautions carried into implementation

- Two supplied images (`leadership/join-us.webp`, `gallery/gallery-06.webp`)
  do not appear to depict UK Bangla Tigers (different kit/sponsor
  branding, no crest) — excluded from use as UKBT imagery pending
  confirmation (`EV-20260826-030`).
- One portrait (`leadership/management-portrait.webp`) has no confirmed
  identity — not captioned with a name until confirmed.
- `images/hero/home-hero.webp` (the Homepage-critical hero candidate)
  has the SAME caution: its kit's small shoulder patches aren't legible
  as the UKBT crest, and the dominant kit branding is a charity/event-
  style heart/hands logo, not the tiger mark. Treated as a provisional
  hero candidate, not a confirmed one — see the Homepage Contract for
  how this is handled without blocking the whole contract.
- "Nipo Khadem" (Uppsala Tigers overseas-signings graphic) is very likely
  the player already instructed for removal from any squad list
  (`CLIENT_REQ_008`) — excluded regardless of which list it appears on.

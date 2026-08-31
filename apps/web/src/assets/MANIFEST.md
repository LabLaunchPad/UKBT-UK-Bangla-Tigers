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
| `public/brand/uppsala-tigers-crest.jpg` | Direct chat upload, `EV-20260831-004` | Uppsala Tigers crest (circular, navy/gold, tiger head + cricket ball + "UPPSALA TIGERS / EST - 2026" wordmark), 1500x1500 | `/franchises` card grid, `/franchises/uppsala-tigers` intro panel | UKBT-owned (client-supplied) | Yes | `crest-512.png` (UK Bangla Tigers crest — used only until this asset was supplied) |
| `public/brand/sponsors/wolffit.jpg` | Direct chat upload, `EV-20260831-007` | WOLFFIT sponsor logo (black background, "FUEL. FOCUS. FITNESS." tagline, ® mark), 1254x1254 | `/about` Sponsors section | **Third-party mark, client-authorised** — this is WOLFFIT's own registered trademark, not a UKBT asset; the club supplied it with the instruction to display it as "Proud Sponsor." The sponsorship relationship itself (i.e. that WOLFFIT has actually agreed to be displayed) is the club's representation, not independently verified by this project — same epistemic posture as the "Client-authorised" photography class below, applied here to a mark rather than a photo. | Yes (as supplied) | None |
| `public/fonts/lato-400.woff2` | `artifacts/brand/raw/fonts/lato-400.woff2` | Lato Regular | Body text, self-hosted | Third-party (cleared) — SIL Open Font License | Yes (PROPOSED typography) | System font stack |
| `public/fonts/lato-700.woff2` | `artifacts/brand/raw/fonts/lato-700.woff2` | Lato Bold | Body emphasis, self-hosted | Third-party (cleared) — SIL Open Font License | Yes (PROPOSED typography) | System font stack |
| `public/fonts/montserrat-variable.woff2` | `artifacts/brand/raw/fonts/montserrat-variable.woff2` | Montserrat Variable | Headings, self-hosted | Third-party (cleared) — SIL Open Font License | Yes (PROPOSED typography) | System font stack |

## Client-authorised photography

Provenance class added by `ASSET-CONTRACT.md` Amendment 01. Authorisation
is `CLIENT_REQ_010` / `EV-20260826-032` ("treat all supplied photos as
usable club imagery"). Per that amendment, **the client's authorisation
and this project's own verification are recorded as separate fields** —
the first is theirs, the second is ours, and neither is restated as the
other.

Every entry below was viewed at full resolution before staging,
specifically checking for names, captions, or third-party branding baked
into the pixels (the `EV-20260826-031` lesson: a text grep cannot see
inside a raster image).

| Path | Source | Usage | AUTHORISATION | INDEPENDENT_VERIFICATION |
|---|---|---|---|---|
| `public/media/club-feature.webp` | `artifacts/brand/raw/images/gallery/gallery-07.webp` | Feature media slot on the homepage club-intro and About story sections | `CLIENT_REQ_010` / `EV-20260826-032` | Viewed at full resolution. One player on a cricket ground, tiger-striped orange/black kit, mountain backdrop. **No photographer watermark, no sponsor bar, no baked-in names.** The kit is not UKBT navy/gold and carries no UKBT crest, so this is not independently confirmable as UKBT team photography — it is used on the client's authorisation, not on our verification. The individual is not identified and is not captioned. |
| `public/media/team-huddle.webp` | `artifacts/brand/raw/images/gallery/gallery-19.webp` | Team/community media slot | `CLIENT_REQ_010` / `EV-20260826-032` | Viewed at full resolution. Team huddle in green/blue numbered kit, opposition batter in frame. No photographer watermark and no baked-in names; ground-perimeter banners in the background read "STRONGER TOGETHER" (a third-party event/ground mark, disclosed here per Amendment 01 rule 4, not scrubbed). Kit carries no UKBT crest — same caveat as above. |

### Reviewed and NOT staged, with reasons

Findings from the full-set review (contact sheet of all 20 supplied
gallery images plus hero/leadership/uppsala):

- **Third-party photographer watermarks.** `gallery-04` carries "FSR
  FOTOGRAFIA / www.fsabater.com" across the centre of the frame;
  `gallery-08` carries "Photography by TOP-KNOCK STUDIOS". A visible
  photographer credit is evidence of a **third-party rights-holder**,
  which is a different question from the affiliation doubt
  `CLIENT_REQ_010` resolved. Not staged pending confirmation that UKBT
  holds publication rights.
- **Heavy third-party event branding.** `gallery-08`, `-09`, `-11` carry
  full "Safari T20 Cup 2024" sponsor bars listing other clubs and
  companies (Maverick Titans, Scorpios, Dubai Pelicans, PGI Group, DHM
  Falcon, United Kent CC, Croxwood Events, tapnstay, LION, gsl, Q Leaf
  Care). `gallery-10` carries a "European Cup 2025" banner. Usable, but
  they advertise other organisations across a UKBT page, so they are held
  back rather than used as generic club imagery.
- **Other teams' kit.** `gallery-13` is a **Bangladesh national team**
  shirt; `gallery-17` appears to be a West Indian/Caribbean kit;
  `gallery-03` an Oman kit. Presenting national-team photography as UKBT
  club imagery would misrepresent, regardless of authorisation.
- **Unidentified individual portraits** (`gallery-02`, `-12`, `-14`,
  `-15`, `-16`). Held back: usable as decoration, but this project does
  not caption an unidentified person with a name, and a lone portrait
  invites exactly that.
- `nordic-smash-slide.webp` — remains excluded on `CLIENT_REQ_008`
  grounds (visible "NIPO KHADEM"), unaffected by `CLIENT_REQ_010`.

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

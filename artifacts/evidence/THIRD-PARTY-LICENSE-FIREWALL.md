# Third-Party License Firewall

**Purpose:** Adelux's licence — whatever it turns out to be — cannot
sublicense a bundled third party's own rights (DR-019: a licensor cannot
convey rights it does not hold). Each material below is audited as an
independent rights domain.

**Date:** 2026-08-26 · **Application code changed:** none.

| ASSET | VERSION | LICENSE | COMMERCIAL_USE | MODIFICATION | REDISTRIBUTION | ATTRIBUTION | UKBT_STATUS | REUSE_FOR_OTHER_SITES | ACTION |
|---|---|---|---|---|---|---|---|---|---|
| **Bootstrap** | 5.3.x | MIT (verbatim header) | Permitted | Permitted | Permitted | Not required (courtesy) | **VERIFIED** | Permitted (MIT has no end-product cap) | Safe to keep, but A10 proposes no framework CSS library at all |
| **jQuery** | 3.7.1 | MIT (`jquery.org/license`) | Permitted | Permitted | Permitted | Not required | **VERIFIED** | Permitted | A01 (Astro/zero-JS-by-default) makes it unnecessary regardless of licence |
| **Swiper** | bundled | MIT (verbatim header) | Permitted | Permitted | Permitted | Not required | **VERIFIED** | Permitted | Adopt only if a carousel is actually needed; MIT poses no blocker |
| **Flatpickr** | bundled | MIT (verbatim header) | Permitted | Permitted | Permitted | Not required | **VERIFIED** | Permitted | Adopt only if a date picker is actually needed |
| **Font Awesome** | Free 6.7.2 | Icons **CC BY 4.0** · Fonts **SIL OFL 1.1** · Code **MIT** (verbatim header) | Permitted | Permitted | Permitted, **with attribution** | **REQUIRED for icons used** | **CONDITIONAL** | Permitted (CC BY/OFL/MIT carry no end-product cap) | If adopted: attribution must be recorded per icon used and must **survive framework conversion** — see Part 8 below |
| **animate.css** | 4.1.1 | **Hippocratic License 2.1** (verbatim header) | Conditional — ethical-use restrictions, not OSI-approved | Permitted | Governed by HL2.1 terms, not reviewed further here | Not required | **REQUIRES DECISION** | Same licence travels with any reuse | Do not adopt without a specific sign-off; A09/A10 (CSS custom properties, no third-party UI lib) make it avoidable |
| **Isotope** | 3.0.6 (PACKAGED) | **GPLv3 OR Isotope Commercial License** (verbatim header) — Metafizzy | **Conditional** — GPLv3 compliance or a paid commercial licence | Permitted under either tier | GPLv3 requires source disclosure of derivative works; commercial tier has its own terms | Not required under commercial; GPLv3 has its own notice obligations | **BLOCKED** (BL-05) | Same licence obligation attaches to every site it ships on | **DO_NOT_ADOPT** — see Part 6 |
| **fsLightbox** | bundled, no version marked | **UNKNOWN** — no header, no licence file found | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | **UNKNOWN** | UNKNOWN | Do not adopt without independently locating its licence |
| **Odometer** | bundled, no version marked | **UNKNOWN** — no header, no licence file found | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | **UNKNOWN** | UNKNOWN | Do not adopt without independently locating its licence |
| **Lato** (font) | served from Google Fonts | Google Fonts distributes Lato under **SIL OFL 1.1** (Google's own catalogue — not independently reverified in this pass) | Permitted under OFL | Permitted | Permitted | Not required | **STATED_BUT_UNVERIFIED** here (OFL is Google's stated basis for the catalogue, not re-checked against Lato's own upstream repo in this pass) | Permitted under OFL | Self-host under OFL, or keep the Google Fonts CDN reference — either is a licence-compatible choice; the concern is privacy, not rights (Part 9) |
| **Montserrat** (font) | served from Google Fonts | Same basis as Lato — Google Fonts catalogue, stated OFL | Permitted under OFL | Permitted | Permitted | Not required | **STATED_BUT_UNVERIFIED** here, same caveat | Permitted under OFL | Same as Lato |
| **Client-\*.png, Icon-\*.png, Gp-\*.png** | template assets | UNKNOWN — no licence marked; documentation credits "Envato Elements (stock images)" for imagery generally, but these specific files read as placeholder brand marks, not photography | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | **UNKNOWN** | UNKNOWN | Do not carry any of these files into the UKBT repository under any circumstance while unverified |
| **dummy-img-\*.jpg/png** | template placeholders | Evidently intended as replace-before-use placeholders | N/A — not intended to ship | N/A | N/A | N/A | **NOT FOR USE** | N/A | Never publishable; not organization content and not real imagery |
| **Adelux-Logo.png, Adelux-Black-Logo.png** | template branding | The template author's **own trademark/brand assets** | **NOT PERMITTED for UKBT** at any tier | N/A | N/A | N/A | **NOT PERMITTED** | **NOT PERMITTED** | Never use under any Adelux licence tier — this is Fox Creation's own branding, not licensed content to build with |
| **favicon.ico** | template asset | Bundled with the template; no independent marking | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | **UNKNOWN** | UNKNOWN | Replace with a UKBT-owned favicon regardless — no reason to inherit this one |

## Reading the matrix

**Genuinely clear (four items):** Bootstrap, jQuery, Swiper, Flatpickr are MIT
and pose no rights obstacle at any tier, for any number of sites. A10 already
proposes not adopting a third-party UI library, which is the *architecture*
reason to skip them — not a licence reason.

**Clear but conditional (one item):** Font Awesome is legitimately usable, and
the price of using it is a real, ongoing attribution obligation that must be
tracked per icon and must not be lost when the site is rebuilt in a different
framework (see Part 8 in the main verification report).

**Blocked independent of Adelux (one item):** Isotope. No Adelux licence tier,
however favourable, can clear this — see DR-019 and BL-05.

**Requires an explicit decision (one item):** animate.css's Hippocratic
License 2.1 is not a rights *blocker* in the same sense as Isotope, but it is
not a default-safe choice either, and adopting it should be a recorded decision
rather than an inherited one.

**Genuinely unknown (four items):** fsLightbox, Odometer, and the two fonts'
precise upstream terms were not independently re-verified past Google's stated
catalogue basis. None of these block anything **unless adopted** — A10 already
argues against adopting any of them as bundled dependencies.

**Never permitted regardless of licence tier (one item):** the Adelux logo
files. A licence to *use a template* is never a licence to *use the licensor's
own brand assets as if they were generic material*. This holds even under a
hypothetically fully verified Extended Licence.

# Adelux Page Inventory — Phase 2 (Forensic Analysis, Non-Distributive)

**Date:** 2026-08-26 · **State:** `FORENSIC_ANALYSIS` only, per the three-state
model in `knowledge/06-TEMPLATE-BOUNDARY.yaml § lifecycle_states` (added this pass).
**Not authorization to publish, redistribute, resell, or build a reusable
Adelux-derived template.** BL-02 remains `STATED_BUT_UNVERIFIED`, unchanged.

**Method:** static structural parsing of the shipped HTML (section wrapper
classes, script/stylesheet references, form actions, image references, detected
third-party library markers). **No CSS values, computed styles, or DOM markup
were extracted or copied.** No asset was copied into this repository — the full
machine-readable inventory sits alongside this file at
`artifacts/design/ADELUX-PAGE-INVENTORY.json`, containing only structural
metadata (counts, class-name identifiers, file paths, SHA-256 of each source file),
never image bytes or literal CSS/JS content.

**Rights sensitivity is tracked on two independent axes per page, not one:**

- **`structure_rights`** — the section composition, layout pattern, and JS
  behaviour. Currently `RIGHTS_GATED`: it is genuinely pending BL-02 and could
  become usable if the licence clears (subject also to the Part 3 idea/expression
  question, `U-26`, `LEGAL_REVIEW_REQUIRED`).
- **`brand_asset_rights`** — whether Adelux's own logo files appear in that page's
  shared chrome. Where present, this is `PROHIBITED_ABSOLUTE` — it does **not**
  improve if BL-02 clears. A licence to use a template is never a licence to use
  the licensor's own brand.

## Summary

| PAGE_ID | SECTIONS | THIRD-PARTY LIBS | FORMS | STRUCTURE_RIGHTS | BRAND_ASSET_RIGHTS | UKBT_RELEVANCE |
|---|---|---|---|---|---|---|
| `index` | 16 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `about` | 10 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `service` | 9 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UNKNOWN |
| `coaching` | 6 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UNKNOWN |
| `booking` | 7 | 5 | 2 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UNKNOWN |
| `membership` | 7 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `community` | 10 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UNKNOWN |
| `event` | 7 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `blog` | 4 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `single-post` | 5 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `faq` | 6 | 5 | 1 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `contact` | 6 | 5 | 2 | RIGHTS_GATED | PROHIBITED_ABSOLUTE | UKBT_IMPLEMENTATION_CANDIDATE |
| `404-page` | 2 | 4 | 0 | RIGHTS_GATED | N/A | UKBT_IMPLEMENTATION_CANDIDATE |

## Per-page detail

### `index` — Adelux

| Field | Value |
|---|---|
| PAGE_ID | `index` |
| SOURCE_FILE | `HTML_TEMPLATE/index.html` |
| SOURCE_HASH (sha256) | `c20239a9a21e9e24cdefc6b46e043c4a1c525f23aa571603d9b77d67d3be7486` |
| SECTION_COUNT | 16 |
| SECTION_ORDER | `section-wrapper pb-0`, `section p-0`, `section`, `section-wrapper py-0`, `section section-chooseus`, `section`, `section pt-0`, `section-wrapper py-0`, `section section-academy`, `section`, `section-wrapper py-0`, `section section-community`, `section testimonial-banner`, `section py-0`, `section`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 14 referenced, 5 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/banner.js, ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js, ./assets/js/video_embedded.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — Homepage — every club site needs one; this is the Stage 7 target |

### `about` — About Us - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `about` |
| SOURCE_FILE | `HTML_TEMPLATE/about.html` |
| SOURCE_HASH (sha256) | `31ee35e17a47b302c451e03742663df4d11607d24dc2f7d0ee7fdb26a539d263` |
| SECTION_COUNT | 10 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-about`, `section`, `section pt-0`, `section-wrapper py-0`, `section section-chooseus`, `section pb-0`, `section testimonial-banner`, `section pt-0`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 13 referenced, 3 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — History/mission page — content entirely BLOCKED on BL-01 org facts |

### `service` — Our Services - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `service` |
| SOURCE_FILE | `HTML_TEMPLATE/service.html` |
| SOURCE_HASH (sha256) | `a41a8ac6114abd62f662568a34619b3fdc0cdda71c5154ba57564928afd7517e` |
| SECTION_COUNT | 9 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-service`, `section`, `section pt-0`, `section-wrapper`, `section section-pricing`, `section testimonial-banner`, `section pt-0`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 10 referenced, 3 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UNKNOWN** — Padel-specific 'services' (court booking, coaching packages) — may not map to a cricket/football-style club; needs a UKBT purpose decision (U-01/U-02) before treating as a candidate |

### `coaching` — Coaching / Academy - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `coaching` |
| SOURCE_FILE | `HTML_TEMPLATE/coaching.html` |
| SOURCE_HASH (sha256) | `e293f4753183f889211b966582e7f64bb2ca29c29924689ec3280f915d8e7f6e` |
| SECTION_COUNT | 6 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-coaching`, `section`, `section py-0`, `section testimonial-banner`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 2 referenced, 2 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UNKNOWN** — Padel-specific coaching programme structure — same caveat as service |

### `booking` — Booking Court - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `booking` |
| SOURCE_FILE | `HTML_TEMPLATE/booking.html` |
| SOURCE_HASH (sha256) | `bd9652933d46d2d0c8761fc9af07e6cf6bf912408f0dea2c19d673f5b3d22add` |
| SECTION_COUNT | 7 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-booking`, `section`, `section`, `section py-0`, `section testimonial-banner`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=2 |
| ASSETS (named, non-placeholder) | 2 referenced, 2 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UNKNOWN** — Court booking/scheduling — depends entirely on whether UKBT's sport involves bookable facilities (U-02); currently no evidence either way |

### `membership` — Join Our Club / Membership - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `membership` |
| SOURCE_FILE | `HTML_TEMPLATE/membership.html` |
| SOURCE_HASH (sha256) | `39d5850601dcee75982a16df3444c715b1da06acf5ca9aa32ae6692b451f7251` |
| SECTION_COUNT | 7 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-membership`, `section`, `section-wrapper py-0`, `section section-pricing`, `section`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 2 referenced, 2 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — Membership/subscription info is a plausible generic need for most clubs, content BLOCKED on BL-01 |

### `community` — Community - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `community` |
| SOURCE_FILE | `HTML_TEMPLATE/community.html` |
| SOURCE_HASH (sha256) | `cff31f2bf164a1d1ede9385762ae29241240fcfea3050b9026681084d4f0db13` |
| SECTION_COUNT | 10 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-community`, `section`, `section-wrapper py-0`, `section section-academy`, `section testimonial-banner`, `section-wrapper py-0`, `section section-community`, `section`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 5 referenced, 4 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UNKNOWN** — Padel-specific community/social features — generic 'community' framing may transfer, specifics may not |

### `event` — Event/Tournament - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `event` |
| SOURCE_FILE | `HTML_TEMPLATE/event.html` |
| SOURCE_HASH (sha256) | `42b43d77990cbed519214cc6fbbdf6cf4014c892ed32923be9b969232473d1b4` |
| SECTION_COUNT | 7 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-event`, `section`, `section-wrapper py-0`, `section section-community`, `section testimonial-banner`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 5 referenced, 4 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — Events/fixtures listing — plausible generic need, content BLOCKED on BL-01 |

### `blog` — Blog / News - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `blog` |
| SOURCE_FILE | `HTML_TEMPLATE/blog.html` |
| SOURCE_HASH (sha256) | `902b10d7863e92250cc6756900b6cd6a6829558a079ea9a762b90ab93c717c84` |
| SECTION_COUNT | 4 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-blog`, `section`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 2 referenced, 3 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — News/articles — plausible generic need, content BLOCKED on BL-01 |

### `single-post` — Single Post - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `single-post` |
| SOURCE_FILE | `HTML_TEMPLATE/single-post.html` |
| SOURCE_HASH (sha256) | `b1f2e79c0bc8b232a149f4e8a82937c4e901eecc20c0ce8267dfd134cb6b52ce` |
| SECTION_COUNT | 5 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-single-post`, `section`, `section pt-0`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 2 referenced, 2 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — Article detail template — companion to blog, same status |

### `faq` — FAQ - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `faq` |
| SOURCE_FILE | `HTML_TEMPLATE/faq.html` |
| SOURCE_HASH (sha256) | `73e608a9b0e5a8d2a0da2d5e1b0f6dd6492c9f375e5d4ac4121ae5d993731a7a` |
| SECTION_COUNT | 6 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-faq`, `section`, `section py-0`, `section`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=1 |
| ASSETS (named, non-placeholder) | 2 referenced, 2 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — FAQ — generic need, content BLOCKED on BL-01, high AEO value per A14 |

### `contact` — Contact Us - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `contact` |
| SOURCE_FILE | `HTML_TEMPLATE/contact.html` |
| SOURCE_HASH (sha256) | `4b7c660979c31bc87757dfb22c0e04d1055dad900be99c2eea453b2d9be3e57d` |
| SECTION_COUNT | 6 |
| SECTION_ORDER | `section-wrapper pb-0`, `section-banner-inner banner-inner-contact`, `section`, `section py-0`, `section`, `section pb-0 bg-accent-color` |
| COMPONENTS (structural signal) | nav=True, footer=True, forms=2 |
| ASSETS (named, non-placeholder) | 2 referenced, 1 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT), animate.css (Hippocratic 2.1) — DO_NOT_ADOPT |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **PROHIBITED_ABSOLUTE** — Adelux-Logo.png / Adelux-Black-Logo.png present in shared chrome |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — Contact page — generic need; form mechanics gated by A05/C1-C2 (forms architecture), content (address/phone) BLOCKED on BL-01 |

### `404-page` — 404 Error - Adelux

| Field | Value |
|---|---|
| PAGE_ID | `404-page` |
| SOURCE_FILE | `HTML_TEMPLATE/404-page.html` |
| SOURCE_HASH (sha256) | `89ad6b7955a1146870f301dd7a340c2d50db162fe99357d05eadbdcd8781e9dd` |
| SECTION_COUNT | 2 |
| SECTION_ORDER | `section-wrapper`, `section-banner-inner banner-inner-404` |
| COMPONENTS (structural signal) | nav=False, footer=False, forms=0 |
| ASSETS (named, non-placeholder) | 0 referenced, 0 placeholder `dummy-img-*` |
| JS_BEHAVIOR (local) | ./assets/js/script.js, ./assets/js/submit-form.js, ./assets/js/swiper-script.js |
| RESPONSIVE_BEHAVIOR | governed by shared `assets/css/responsive.css` — not page-specific; not analysed at CSS-rule level in this pass (that is Phase 5, still gated) |
| THIRD_PARTY_DEPENDENCIES | Flatpickr (MIT), Font Awesome (CC BY 4.0 / OFL / MIT) — attribution required, Isotope (GPLv3/Commercial) — BLOCKED, BL-05, Swiper (MIT) |
| RIGHTS_SENSITIVITY (structure) | **RIGHTS_GATED** |
| RIGHTS_SENSITIVITY (Adelux brand asset) | **N/A** |
| ISOTOPE DEPENDENCY | **YES** — BL-05 — DO_NOT_ADOPT decided; page uses masonry/filter behavior via Isotope in source, UKBT implementation must use native CSS Grid/JS instead |
| UKBT_RELEVANCE | **UKBT_IMPLEMENTATION_CANDIDATE** — Error page — purely structural, no org-fact dependency at all |

## Classification rollup

**UKBT_RELEVANCE:**
- `UKBT_IMPLEMENTATION_CANDIDATE`: 9
- `UNKNOWN`: 4

**RIGHTS_SENSITIVITY (worst-case per page):**
- `LICENSE_BLOCKED (brand asset)`: 12
- `RIGHTS_GATED`: 1

## What this inventory establishes, and what it does not

**Establishes:** how many pages exist (13, plus the separate Documentation
page already catalogued in `ADELUX-SOURCE-MANIFEST.json`), their section
counts and identifiers, which third-party libraries each page's markup pulls
in, which pages reference the Adelux brand assets, and a first-pass UKBT
relevance judgement based on generic club-website structure — never on any
UKBT-specific fact, since none exist.

**Does not establish:** any actual token value, CSS rule, computed style, or
pixel measurement — that is Phase 3 onward (rendering truth, computed-style
extraction, CSS forensics), which remains **not started**, gated the same way
BL-02 gates it, independent of this inventory having run.

**Notable finding: every page except the 404 page carries the Adelux logo**
in shared navigation/footer chrome. This is not a per-page issue — it is one
shared-chrome issue that propagates to 12 of 13 pages. A UKBT implementation
never inherits this: the chrome is rebuilt with UKBT's own identity regardless
of how BL-02 resolves (`knowledge/06-TEMPLATE-BOUNDARY.yaml`:
`never_allowed_without_specific_evidence: use_adelux_own_branding`).

**Notable finding: `index.html` is the only page using Isotope** (masonry/
filter behaviour, likely a gallery or listing section). Since `BL-05` already
resolved `DO_NOT_ADOPT_ISOTOPE`, the UKBT homepage's equivalent section — if
one exists — will need a native CSS Grid or plain JS filter implementation.
This is now a concrete, page-scoped engineering note rather than an abstract
dependency-policy line.

**Structural relevance genuinely varies by page.** `service`, `coaching`,
`booking`, and `community` are marked `UNKNOWN` rather than
`UKBT_IMPLEMENTATION_CANDIDATE` because their content is inherently
padel-specific (court booking, coaching packages) and it is not yet known
whether UKBT's sport or activity model (`U-02`, still open) involves anything
structurally similar. Marking these as candidates before `U-01`/`U-02` resolve
would be exactly the template-leak pattern `INV-014` and finding `F4` (Stage 2)
exist to prevent — carrying a padel club's information architecture into
UKBT's site without it ever looking like an invention.

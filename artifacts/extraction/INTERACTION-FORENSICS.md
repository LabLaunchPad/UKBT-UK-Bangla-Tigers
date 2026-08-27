# Interaction Forensics

**Date:** 2026-08-26 · State: `FORENSIC_ANALYSIS` (Track A). Verifies actual
behavior, not merely JS/markup presence, per the distinction the requester
drew between "discovered" and "exercised."

| Interaction | Method | Result | Classification |
|---|---|---|---|
| Mobile nav toggle | Live click of `[data-bs-toggle="collapse"]`, 12/13 pages, 390×844 | `#navbarNav` transitions `display:none/collapse` → `display:block/collapse show`, uniformly on all 12 applicable pages (404-page has no nav) | **VERIFIED** |
| `.btn-accent` hover | Live hover, wait ≥ declared 600ms transition | `rgb(198,239,46)` → `rgb(234,255,157)`, exactly matching `--accent-color-2` → `--accent-color-6` | **VERIFIED** (methodology self-corrected from an initial mid-transition read — `EV-20260826-009`) |
| `.nav-link` active state | DOM inspection | Runtime-only `.active` class, absent from static HTML, added by client-side script (exact script not pinpointed — `GAP-01`, `EV-20260826-009`) | **VERIFIED present, mechanism NOT_EXERCISED** |
| **`.btn-accent` focus state** | Live `.focus()`, computed-style diff | `outline` stays `none` in both states; only the (invisible, `0px`) outline's *color* shifts (`rgb(33,37,41)` → `rgb(35,38,40)`). **No perceptible visible focus indicator exists on this control.** | **`SOURCE_DEFECT`** — relevant to `A2`/`A15` (visible focus indicator, WCAG 2.2 AA). **`VISUAL_FIDELITY ≠ BLIND_REPRODUCTION_OF_ACCESSIBILITY_DEFECTS`: this is not automatically reproduced in UKBT.** The adaptation layer (Track B, once unlocked) must explicitly decide preserve-vs-repair — recorded here so the decision isn't made by default via silent inheritance. |
| Swiper initialization | Live DOM inspection after page load | `swiper-initialized` class present; live `.swiper` object exists; `slides.length` matches the source config exactly (5 slides on `index`'s booking swiper, 7 on `about`'s partner swiper); `autoplay.running: true` | **VERIFIED** |
| Swiper drag-to-advance | Simulated mouse drag (`mousedown` → `mousemove` ×10 steps → `mouseup`) across the slider's bounding box | `activeIndex` unchanged (0 → 0) on both tested pages | **`INTERACTION_STATUS = INCONCLUSIVE`** — not PASS, not FAIL. Mouse-event simulation did not cross Swiper's internal gesture threshold; this likely requires native touch events (`touchstart`/`touchmove`/`touchend`), not attempted this pass. Initialization is verified; drag behavior specifically is not. **Rule for future work:** only investigate further if a later implementation decision genuinely depends on exact drag behavior — do not re-attempt merely because the answer would be nice to have. |
| Swiper autoplay | Observed via `autoplay.running` flag | `true` on both instances (delay 5000ms/4000ms per config, `assets/js/swiper-script.js`) | **OBSERVED_STATICALLY** (flag read; slide auto-advance itself not timed/verified this pass) |
| Flatpickr (date picker) | Structural detection only, `booking.html` | 1 input matched | **OBSERVED_STATICALLY — NOT_EXERCISED** (no live open/select interaction attempted this pass) |
| fsLightbox | Markup search across all 13 pages | **Zero markup invocations found anywhere** — the JS file is bundled (`assets/js/vendor/fslightbox.js`) but no page's HTML references it | **NOT_USED_BY_SOURCE** — distinct from "not exercised": there is nothing to exercise. Simplifies the third-party disposition (§G below): its unresolved licence status is moot if it's never adopted. |
| Odometer (counter animation) | Markup search across all 13 pages | **Zero markup invocations found anywhere**, same basis as fsLightbox | **NOT_USED_BY_SOURCE** |
| Forms (submission) | Structural only — 14 forms across the site | `action` targets point to PHP handlers (`assets/php/form-*.php`) that do not execute under `file://` and are not a migration target regardless (`EV-20260826-005`) | **NOT_EXERCISED — correctly out of scope**, not a gap |

## Summary

**Verified (live-tested, real behavior confirmed):** mobile nav toggle (12
pages), button hover (with a self-caught and corrected methodology error),
button focus (revealing a real accessibility defect), Swiper initialization
and config-matching.

**Attempted but inconclusive:** Swiper drag-to-advance — a genuine
`NOT_EXERCISED` result for that specific interaction, not a false claim
either way.

**Correctly out of scope, not a gap:** form submission (no PHP runtime
under `file://`, irrelevant to fidelity regardless per the static-first
architecture decision), Flatpickr live interaction (deferred, not falsely
claimed), fsLightbox/Odometer (moot — never invoked by any page).

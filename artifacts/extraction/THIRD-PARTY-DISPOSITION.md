# Third-Party Dependency Disposition

**Date:** 2026-08-26 · Reformats already-established facts
(`EV-20260826-005`, `THIRD-PARTY-LICENSE-FIREWALL.md`) into the exact
per-dependency fields requested; **adds one new fact this pass** —
fsLightbox and Odometer are bundled but invoked by zero pages, confirmed
by grep across all 13 pages this session.

**Explicit, per instruction: the Adelux/LabLaunchPad authority discussion
does NOT clear any of these.** Each is independently governed regardless of
how `provenance_chain.B` resolves (`knowledge/06-TEMPLATE-BOUNDARY.yaml`).

| Dependency | USED_BY_SOURCE | REQUIRED_BY_UKBT | LICENSE_STATUS | DISPOSITION | ATTRIBUTION_REQUIRED |
|---|---|---|---|---|---|
| Bootstrap | Yes, site-wide | Not yet decided (A01/A10 propose no CSS framework dependency) | MIT — `VERIFIED` | `REPLACE` — Astro + authored CSS custom properties per the frozen (`REVISE`-pending) architecture proposal, not because of any licence issue | No |
| jQuery | Yes, site-wide | No — A01 selects a zero-JS-by-default framework | MIT — `VERIFIED` | `REMOVE` | No |
| Swiper | Yes, 2 pages (`index`, `about`) | Only if carousel sections are reproduced | MIT — `VERIFIED` | `MIGRATE` if the carousel sections are kept; otherwise `REMOVE` — a UKBT-specific decision, not a licence one | No |
| Flatpickr | Yes, 1 page (`booking`) | Only if a booking/date-picker feature exists on UKBT (unknown — depends on U-01/U-02) | MIT — `VERIFIED` | `MIGRATE` if needed, `REMOVE` otherwise | No |
| Font Awesome | Yes, site-wide (icons) | Likely (icons are near-universal UI need) | CC BY 4.0 (icons) / OFL (fonts) / MIT (code) — `VERIFIED`, obligation attaches | `MIGRATE`, icon-by-icon (only icons actually used) | **Yes — per icon used**, must survive the framework port (`ADELUX-CROSS-FRAMEWORK-VERIFICATION.md` Part 8) |
| animate.css | Yes, site-wide (scroll animations) | Not demonstrated | Hippocratic License 2.1 — not OSI-approved | `DO_NOT_ADOPT` — **decision already recorded**, `knowledge/06` `decisions` block, 2026-08-26 | N/A |
| Isotope | Yes, `index.html` only (masonry/filter section) | Not demonstrated — native CSS Grid/JS can substitute | GPLv3 OR paid commercial (Metafizzy) — `BLOCKED`, independent of Adelux entirely (`DR-019`) | `DO_NOT_ADOPT` — **decision already recorded** | N/A |
| fsLightbox | **Bundled but invoked by zero pages** (confirmed this pass, all 13 pages checked) | No — nothing to migrate | Unknown, and now moot | `REMOVE` — there is nothing using it | N/A |
| Odometer | **Bundled but invoked by zero pages** (confirmed this pass, all 13 pages checked) | No | Unknown, and now moot | `REMOVE` — same basis | N/A |
| Lato (font) | Yes, site-wide, via `fonts.gstatic.com` | Only if the typeface itself is adopted (a Track B/design-system decision) | Stated SIL OFL 1.1 via Google's catalogue, not independently reverified past that | `MIGRATE` (self-host) if adopted, per the standing privacy recommendation (`ADELUX-CROSS-FRAMEWORK-VERIFICATION.md` Part 9) — **never** continue the CDN dependency regardless | No |
| Montserrat (font) | Yes, site-wide, via `fonts.gstatic.com` | Same as Lato | Same as Lato | Same as Lato | No |

## What's new this pass

The fsLightbox/Odometer finding **simplifies** their disposition
materially: previously "licence `UNKNOWN`," now "licence irrelevant because
nothing invokes them." `REMOVE` is now a confident, evidence-backed
disposition rather than a cautious default.

## What stays exactly as it was

Isotope and animate.css's `DO_NOT_ADOPT` decisions are unchanged and are
**not** being revisited — they were already correctly decided, and this
document does not re-litigate them, per the instruction not to spend time
re-proving what's established.

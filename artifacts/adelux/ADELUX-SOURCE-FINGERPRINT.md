# Adelux Source Fingerprint — Phase 1

**Date:** 2026-08-26 · **Method:** direct read-only inspection of the supplied
archive, held in a scratch directory outside this repository. **The original
package was not modified.** Nothing from it has been copied into this
repository — per `knowledge/06-TEMPLATE-BOUNDARY.yaml`, only `inspect`,
`analyze`, and `record_package_identity` are permitted while `BL-02` is open.

This restates and extends `artifacts/evidence/ADELUX-PACKAGE-IDENTITY.md`
(2026-08-26, earlier this session) in the structured form this protocol asks
for. Nothing here contradicts that record; the full manifest is now also
machine-readable at `artifacts/adelux/ADELUX-SOURCE-MANIFEST.json`.

## Package identity

| Field | Value |
|---|---|
| Filename as supplied | `3073e848-adeluxpadelclubcommunityhtmlbootstrap20260107040317utc.zip` |
| **SHA-256** | `cf4907bb60003b719f3d7712e2d06389c2ab7f8a02590bdea570da9780cafb54` |
| Size | 1,296,131 bytes |
| Zip entries (incl. directories) | 110 |
| Actual files | 95 |
| Root | `Adelux_Main_File/` → `Documentation/`, `HTML_TEMPLATE/` |

## Product identity (self-declared by the package; not independently verified)

| Field | Value |
|---|---|
| Product | Adelux — Padel Club & Community HTML Bootstrap Template |
| Version | 1.0.0 |
| Created | October 2025 |
| Author | Fox Creation |
| **ThemeForest item ID** | `60543035` — located this session via web search, `EV-20260826-006` |
| **Envato Elements slug** | `X3FTRWG` — a second, differently-licensed acquisition channel for the same product |
| Acquisition channel actually used for this copy | **UNKNOWN** (`U-25`) |

## File inventory by type

| Type | Count |
|---|---|
| HTML pages | 14 |
| CSS files | 15 |
| JavaScript files | 13 |
| Images | 41 |
| Fonts | 8 |
| PHP backend handlers | 3 |
| Config (`.vscode/settings.json`) | 1 |
| **Total** | **95** |

## Third-party components identified (licence read from the shipped file header)

| Component | Stated licence | Status |
|---|---|---|
| Bootstrap | MIT | verified permissive |
| jQuery 3.7.1 | MIT | verified permissive |
| Swiper | MIT | verified permissive |
| Flatpickr | MIT | verified permissive |
| Font Awesome Free 6.7.2 | CC BY 4.0 (icons) / SIL OFL 1.1 (fonts) / MIT (code) | conditional — attribution required |
| animate.css 4.1.1 | Hippocratic License 2.1 | requires decision — **DO_NOT_ADOPT** (recorded) |
| Isotope PACKAGED v3.0.6 | GPLv3 OR Isotope Commercial License (Metafizzy) | blocked (`BL-05`) — **DO_NOT_ADOPT** (recorded) |
| fsLightbox | no header found | unknown |
| Odometer | no header found | unknown |
| Lato, Montserrat | stated SIL OFL 1.1 via Google Fonts catalogue (not independently reverified) | unknown/unverified |

## PHP backend handlers

Three PHP files exist (`assets/php/form-contact.php`, `form-newsletter.php`,
and a third under the same directory). These presuppose a PHP runtime. Per
`EV-20260826-001` (static-first, forms routed through a service or serverless
function), **these files are not a migration target** regardless of licence
status — the target architecture has no PHP runtime to run them in.

## Licence-bearing files in the package

**None.** No `LICENSE`, `COPYING`, purchase receipt, order confirmation, or
item-ID file exists anywhere in the archive. Confirmed again this pass; matches
`EV-20260826-005`.

## What this fingerprint does and does not establish

**Establishes:** the exact bytes under discussion, a complete per-file
manifest with individual SHA-256 hashes (`ADELUX-SOURCE-MANIFEST.json`), and
the licence status of every bundled third-party component as read from its own
file header.

**Does not establish:** who holds a licence to Adelux itself, which tier,
whether it covers UKBT, or whether the forensic extraction phases of this
protocol (page inventory, rendered-style capture, CSS/token extraction —
Phases 2 onward) may proceed. Those remain gated on `BL-02`, unchanged.

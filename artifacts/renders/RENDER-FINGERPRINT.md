# Browser Render Fingerprint — G1

**Purpose:** pin the rendering environment so computed-style/geometry
evidence is reproducible and comparable across pages and across sessions.
**Date:** 2026-08-26.

| Dimension | Value |
|---|---|
| Browser | Chromium |
| Browser version | 141.0.7390.37 |
| Playwright version | 1.56.1 (globally installed in this container) |
| OS / container | Linux 6.18.44, this session's container |
| Rendering method | `file://` URL against the immutable source (no server — a background `http-server` was denied by this session's own permission policy; `file://` proved sufficient) |
| Viewports used this pass | 1440×900 (desktop), 390×844 (mobile) |
| Device scale factor | 1 (Playwright default; not explicitly overridden) |
| Fonts | **Fallback stack, not true Lato/Montserrat** — `fonts.gstatic.com` is unreachable under this project's own network policy (`.claude/settings.json` denies external font CDN fetches by default). Recorded as a standing limitation, not silently worked around. |
| Locale | Playwright/Chromium default (not explicitly pinned this pass) |
| Timezone | container default (not explicitly pinned this pass) |
| `prefers-reduced-motion` | not explicitly set (default: no-preference) |
| Animation state | pages sampled after a 500ms post-load settle wait; CSS transitions sampled only after waiting ≥ the transition's own declared duration (see `EV-20260826-009`'s hover-state methodology correction) |
| Content fixture | none — this is the *reference* being measured, not a UKBT implementation compared against it |

## Deviations from the full requested matrix, stated honestly

The requested viewport matrix (1440×900, 1280×800, 1024×768, 768×1024,
390×844, 430×932) is not fully exercised this pass. Two viewports
(1440×900, 390×844) were used, chosen as the clearest desktop/mobile
contrast pair. **Not claimed complete** — extending to the intermediate
tablet breakpoints (1280×800, 1024×768, 768×1024) and the second mobile
size (430×932) is deferred, named as a gap in the extraction manifest below,
not silently skipped.

Locale, timezone, and explicit device-scale-factor pinning are also not yet
set — Playwright/Chromium defaults were used. If a future comparison proves
sensitive to these (unlikely for a desktop/mobile CSS comparison, but not
verified), this record is the place that would need updating, with a new
fingerprint superseding this one.

## Reproducibility

Given the same Chromium build (141.0.7390.37) and the same immutable source
(SHA-256 `cf4907bb60003b719f3d7712e2d06389c2ab7f8a02590bdea570da9780cafb54`),
this fingerprint is sufficient to reproduce the computed-style measurements
in `artifacts/extraction/` for the two viewports actually used.

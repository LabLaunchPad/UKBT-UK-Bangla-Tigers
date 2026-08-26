# Visual Regression Contract

**ID:** CONTRACT-VISUAL-REGRESSION-01
**Status:** FROZEN · Stage 3 (Contract Freeze)
**Purpose:** Fix the viewport matrix, the pinned rendering environment, the
required evidence per page, and the anti-vacuity rules — this is the gate
that decides `IMPLEMENTED → VERIFIED` (`DESIGN-SYSTEM-CONTRACT.md`).

## Outputs / Frozen viewport matrix (canonical, 6 viewports)

```
1440×900   (desktop large)
1280×800   (desktop / laptop)
1024×768   (tablet landscape / small laptop — nav-toggle breakpoint
            behaviorally confirmed here vs. 1280×800,
            mobile-nav-toggle-test.json)
768×1024   (tablet portrait)
430×932    (mobile large)
390×844    (mobile standard)
```

Source: `artifacts/responsive/RESPONSIVE-MATRIX.yaml`, already exercised
against all 13 Track A reference pages (`EV-20260826-013` /
responsive-matrix-raw.json).

## Pinned rendering environment (CI-vs-CI only)

```
BROWSER = Chromium, pinned exact version (RENDER-FINGERPRINT.md's existing
          141.0.7390.37 pin, re-pinned at Stage 4 to whatever CI's runner
          image ships — never a floating "latest")
CI_RUNNER_IMAGE = pinned exact OS image (e.g. ubuntu-24.04, never a
                  `-latest` tag that can silently update under the project)
FONTS = self-hosted (DEPLOYMENT-CONTRACT.md), not system-dependent
LOCALE = fixed (en-GB, matching INV-007's English-only decision)
TIMEZONE = fixed
DEVICE_SCALE_FACTOR = fixed per viewport entry
ANIMATION_MODE = disabled/deterministic (reduced-motion or frozen) for
                 comparison stability
```

**Comparisons run CI-vs-CI only, never local-vs-CI.** Font rendering,
sub-pixel anti-aliasing, and OS-level hinting differ across operating
systems in ways that produce spurious diffs unrelated to any real
regression — the classic cause of "flaky" visual tests
(`ARCHITECTURE-PROPOSAL-V3.md` §10, v3 red-team finding). A local
developer render is useful for debugging, never for the gate decision.

## Required evidence per page, all five, before a page is `VERIFIED`

| Evidence | What it proves |
|---|---|
| Structural | DOM shape / section presence matches the intended contract |
| Visual | Pixel/region-diff against the frozen reference render, per viewport |
| Responsive | Behavior across the full 6-viewport matrix, including the confirmed nav-toggle breakpoint |
| Interaction | State changes (hover/focus/active/toggle) render correctly — `INCONCLUSIVE` interactions (e.g. Swiper drag, `INTERACTION-FORENSICS.md`) are named as such, never silently assumed passing |
| Accessibility | axe-core + keyboard suite (`ACCESSIBILITY-CONTRACT.md`) pass for that page |

A page missing any one of the five is not `VERIFIED`, regardless of how
many of the other four pass.

## Reference evidence immutability

- The frozen reference render (screenshot, computed styles, geometry) is
  never altered to make a comparison pass — that would falsify the
  comparison it exists to provide (`knowledge/06
  reference_screenshot_storage.immutability`, restated bindingly here).
- **A golden reference is never updated to hide a regression.** A diff is
  investigated to root cause (token → component → minimal fix →
  re-render), never silently accepted by moving the baseline
  (`ARCHITECTURE-PROPOSAL-V3.md` §10).
- Each diff investigation records: `REFERENCE` / `TARGET` / `DIFF` /
  `CAUSE` / `DECISION` / `STATUS`.

## Anti-vacuity (binding, from `knowledge/08 visual_fidelity_gate`)

Never accepted as visual proof: "looks identical," "tokens match," "CSS
was migrated." Required instead: an executed rendered comparison producing
a recorded diff (or confirmed zero-diff), per element/viewport, per this
matrix.

## Invariants

- `IMPLEMENTED` and `VERIFIED` are distinct states (`DESIGN-SYSTEM-
  CONTRACT.md`) — this gate is the only mechanism that promotes to
  `VERIFIED`.
- Reference screenshots, if committed to the repository, carry provenance
  (source page, viewport, date, SHA-256 of the source page at capture
  time) and remain `GOVERNED` by `PRODUCTION_CLEARANCE = NOT_CLEARED`
  until Track B resolves for that page's Adelux-derived content
  (`knowledge/06`).

## Forbidden behavior

- Comparing a local developer render against a CI-produced reference.
- Editing a golden reference file to eliminate a diff.
- Marking a page `VERIFIED` with fewer than all five required evidence
  types recorded.
- Reporting an `INCONCLUSIVE` interaction (per `INTERACTION-FORENSICS.md`'s
  precedent) as `PASS`.

## Validation method

- Playwright suite (`apps/web/tests/visual/`) executed in CI on every PR
  touching `apps/web`.
- Diff output stored per PR run; a non-zero diff blocks merge until
  triaged to `CAUSE`/`DECISION`/`STATUS`.

## Owner

Track C for the suite mechanism and pinning. Track B for any comparison
whose reference render derives from Adelux-adapted content (rights-gated
until that content's adaptation is itself cleared).

## Dependency

`DESIGN-SYSTEM-CONTRACT.md` (the state this gate promotes to).
`ACCESSIBILITY-CONTRACT.md` (one of the five required evidence types).
`CI-CONTRACT.md` (merge-blocking wiring).

## Change authority

Changing the viewport matrix or pinned environment requires a new evidence
record — the matrix is already exercised against all 13 Track A pages
(`EV-20260826-013`); changing it invalidates that existing baseline and
must say so explicitly.

## Evidence required

`RESPONSIVE-MATRIX.yaml`, `responsive-matrix-raw.json`,
`RENDER-FINGERPRINT.md` (all reused, not re-derived).

## Reversibility

REVERSIBLE at the tooling level (suite config). NOT REVERSIBLE for a
regression that ships unnoticed because the gate was skipped — which is
why this gate is mandatory and merge-blocking, not advisory.

---

## AMENDMENT 01 — 1920×1080 added to the viewport matrix

**Date:** 2026-08-26 · **Authority:** `EV-20260826-032` (template-parity
direction, §16 of the client's parity specification) · **Status:**
AMENDED (frozen text above preserved verbatim)

The frozen matrix said it must not change without a contract amendment.
This is that amendment.

### Matrix (canonical, 7 viewports)

```
1920×1080  (desktop XL)          ← ADDED by this amendment
1440×900   (desktop large)
1280×800   (desktop / laptop)
1024×768   (tablet landscape / small laptop — nav-toggle breakpoint)
768×1024   (tablet portrait)
430×932    (mobile large)
390×844    (mobile standard)
```

### Why

The parity work compares UKBT renders against reference renders of the
template. The template's container caps at `1340px`, so behaviour above
that width — how the layout centres, and whether background/full-bleed
sections extend correctly past the container — is only observable above
1440. Without a 1920 row, the widest real-world desktop case is untested
in both the reference and our build.

### What this does not change

Everything else in the frozen text stands: the pinned rendering
environment, CI-vs-CI-only comparison, and the five required evidence
kinds per page (structural, visual, responsive, interaction,
accessibility). A page missing any one is still not `VERIFIED`.

`artifacts/responsive/RESPONSIVE-MATRIX.yaml` recorded the original six
against the reference pages; the 1920 row has no historical reference
measurement behind it and is newly measured at Stage 9 for both the
reference and UKBT builds.

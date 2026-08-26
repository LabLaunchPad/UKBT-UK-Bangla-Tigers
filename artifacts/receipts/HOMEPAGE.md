# Homepage Receipt (Stage 7)

**Backfilled 2026-08-26** by a zoom-out state audit that found this stage's
work complete but its named receipt (`schemas/receipt.schema.json`) never
written. This receipt cites the original Stage 7 implementation, notes the
later revision, and re-runs the homepage's own acceptance commands **now** so
every result below is real and current.

```
task_id:      STAGE-7-HOMEPAGE
baseline_sha: 5373d7c   # "Stage 7: Readiness Matrix, Template Mapping, Homepage Contract" — pre-implementation
verified_at_sha: 3b95009
```

## Implementation history

| Commit | Description |
|---|---|
| `7a00221` | Stage 7G: Homepage implementation, geometry mirrored from Adelux source — original build against `artifacts/pages/HOMEPAGE-CONTRACT.md` |
| *(parity reconstruction, later)* | The client-directed "Full Template UI Parity Reconstruction" subsequently rebuilt the homepage on a corrected token scale (`artifacts/ui/TOKEN-CONVERSION.md`) and expanded it from 5 to 10 sections (`artifacts/ui/PARITY-COMPLETION-REPORT.md`). The homepage in the current tree is the *revised* version; this receipt verifies that current version, not the original 7a00221 snapshot. |
| `872ef5f`, `d08841d` | Motion-verified full-page delivery screenshots (mobile/tablet/desktop), `homepage-delivery.spec.ts` |

`changed_files` (original implementation, `5373d7c..7a00221`): 38 files,
+1675/-15 — `homepage-data.ts`, `index.astro`, `BaseLayout.astro`, base/font
CSS, `homepage.spec.ts`, `screenshots.spec.ts`, `HOMEPAGE-VISUAL-QA.md`,
6 baseline screenshots, 4 token files.

## Pre-implementation contract

`artifacts/pages/HOMEPAGE-CONTRACT.md` (Status: FROZEN) — sections, content
requirements, data requirements, responsive behavior, accessibility
requirements, SEO requirements, and acceptance criteria were defined before
implementation began, per `prompts/17-homepage.md`.

## Acceptance — commands actually run 2026-08-26 at `3b95009`

| # | Check | Exit code | Result |
|---|---|---|---|
| 1 | `pnpm build` | 0 | PASS — homepage (`/index.html`) builds as 1 of 16 pages |
| 2 | axe-core scan, zero violations | 0 | PASS (`homepage.spec.ts:9`) |
| 3 | Keyboard/focus: nav links, hero CTA, footer social links | 0 | PASS — all show a visible focus outline (`homepage.spec.ts:25`) |
| 4 | Mobile nav toggle (CSS-only off-canvas drawer) | 0 | PASS — shows/hides without console error (`homepage.spec.ts:48`) |
| 5 | Content-contamination grep (no Adelux/reference strings) | 0 | PASS (`homepage.spec.ts:63`) |
| 6 | Excluded-asset grep (no excluded images referenced) | 0 | PASS (`homepage.spec.ts:83`) |
| 7 | Gold-accent contrast, computed + axe pixel scan | 0 | PASS, every route (`homepage.spec.ts:123`) |
| 8 | Full-page capture at mobile/tablet/desktop, motion positively verified frozen (`document.getAnimations()` = `[]` at capture) | 0 | PASS — 3/3 (`homepage-delivery.spec.ts`) |
| 9 | Responsive geometry vs. licensed reference (7 viewports) | 0 | PASS — 0 mismatches on homepage rows (`scripts/compare-geometry.mjs`, `artifacts/ui/PARITY-COMPLETION-REPORT.md`) |

9/9 homepage-scoped Playwright tests pass (`homepage.spec.ts` +
`homepage-delivery.spec.ts`, run together above). Desktop/tablet/mobile
screenshots exist at `artifacts/ui/delivery/homepage-*.png` and (pre-parity
baseline) `artifacts/ui/screenshots/homepage-*.png`.

## Deterministic UI measurements before screenshots

Per `docs/07-visual-contract.md`'s ordering (DOM/CSS/computed styles first,
screenshots second, taste last): `reference-geometry.spec.ts` /
`ukbt-geometry.spec.ts` measure real computed type scale, section padding,
and banner padding against the licensed Adelux reference, diffed by
`scripts/compare-geometry.mjs` — not a visual-only comparison.

## Unresolved risks

- **Stage 8 (independent homepage red team) has never run.** This is the
  single most important open item against this receipt: the pipeline
  requires an independent-session review specifically so a reviewer without
  the implementer's assumptions checks the homepage before scaling to other
  pages. That did not happen before Stage 9 (site-scale) proceeded. See the
  plan file's "Zoom-out" section and task list for the follow-up.
- Hero imagery affiliation: per `artifacts/STAGE_7_READINESS_MATRIX.md`, the
  photographic hero option was never promoted past "optional enhancement,
  affiliation not confirmed" — the crest/wordmark treatment is the committed
  option, unaffected by this.

## Rollback

Revert to `5373d7c` (contract frozen, no homepage markup) and re-run
`prompts/17-homepage.md`. Content is gate-bound (`@ukbt/truth`), so no
fabricated fact is at risk of persisting through a rollback.

## Verifier

Backfilled and commands re-run by the same Claude Code session performing
this repository's zoom-out state audit, 2026-08-26 — not an independent
verifier. Stage 8 remains the open gate for that.

```
HOMEPAGE_STATUS = PASS            # this receipt's own Stage 7 verdict (implementation + verification)
STAGE_8_HOMEPAGE_VERDICT = NOT_YET_RUN   # the pipeline's separate Stage 8 gate — see Unresolved risks above
TESTS = 9/9 homepage-scoped Playwright, 192/193 full-suite (see FOUNDATION.md)
BUILD = PASS
ACCESSIBILITY = PASS (axe zero-violations, focus-visible, contrast)
CHANGES = 0 (backfill only)
```

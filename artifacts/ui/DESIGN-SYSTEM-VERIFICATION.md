# Design System Verification — Stage 5

**Date:** 2026-08-26 · All checks below were executed for real; exit
codes/output are recorded, not asserted (`knowledge/08-VALIDATION-POLICY.yaml`
— "a check that did not run did not pass").

## Adversarial proof: approved-only Style Dictionary compile still holds

A decoy token (`{"decoy": {"value": {"$value": "999px", ...}}}`) was
planted in `packages/truth/src/tokens/adapted/` (empty otherwise) and
`tokens:build` was re-run. The decoy did **not** appear in the compiled
`tokens.css`. Decoy removed, rebuilt clean. This re-proves
`contracts/CSS-CONTRACT.md`'s fail-closed compile rule after adding 7 new
token files this stage, not just at Foundation.

## Token-collision bug found and fixed

Initial `tokens:build` reported "Token collisions detected (7)" — a real
Style Dictionary warning, not ignored. Root cause: each new token file
carried a top-level `$description` key; Style Dictionary merges all
`approved/**/*.json` files into one token tree, so 8 files each declaring
a key at the identical root path collided 7 times (8 files − 1). Fixed by
moving all cross-file documentation into
`packages/truth/src/tokens/approved/README.md` and keeping only
group-scoped (non-colliding) `$description` keys nested under distinct
paths (e.g. `color.neutral.$description`). Rebuilt: zero collisions.

## Real accessibility defect found and fixed

`axe-core` failed for real on the first run against `/design-system`:
insufficient contrast (1.18:1, needs 4.5:1) on the neutral-scale swatch
labels. See `artifacts/ui/DESIGN-SYSTEM.md`'s "A real accessibility
defect found and fixed" section for the root cause and fix. Re-run
confirmed zero violations after the fix.

## Checks run

| Check | Command | Result |
|---|---|---|
| Typecheck (both packages) | `pnpm typecheck` | PASS — `packages/truth`: `tsc --noEmit` clean; `apps/web`: `astro check` → 8 files, 0 errors/warnings/hints |
| Lint | `pnpm lint` (after `pnpm lint:fix` for formatting-only diffs) | PASS — 21 files checked, 0 errors |
| Unit tests | `pnpm test:unit` | PASS — 17/17 (`packages/truth`, unchanged from Foundation — no schema/gate code changed this stage) |
| Build | `pnpm run build` | PASS — 2 pages built (`/`, `/design-system`), tokens compiled first |
| Dependency allowlist | `node scripts/check-dependency-allowlist.mjs` | PASS — 12 allowed entries, no new dependency added this stage |
| Playwright (full suite) | `pnpm exec playwright test` (from `apps/web`) | PASS — 19/19, up from Foundation's 10 (9 new: 1 design-system axe scan, 2 keyboard/focus tests, 6 new-route responsive checks) |
| axe-core | (part of the Playwright run above) | PASS — 3 axe specs: homepage zero-violation, homepage deliberate-violation sanity check, design-system-page zero-violation (the last one failed once for real, fixed, now passes) |
| Keyboard/focus-visible | `design-system.spec.ts` | PASS — every non-disabled button and the linked card show a real non-`none`, non-zero-width outline when focused (computed-style assertion, not just element presence); the disabled button is confirmed genuinely `disabled` (unreachable by tab) |
| Responsive (6-viewport matrix × 2 routes) | `responsive.spec.ts` | PASS — 12/12, zero horizontal overflow on `/` and `/design-system` at all 6 frozen viewports |

## Contract compliance re-check

- `CSS-CONTRACT.md`: approved-only compile — re-proven adversarially above.
- `ACCESSIBILITY-CONTRACT.md`: visible focus indicator (real computed-style
  test, not asserted), `prefers-reduced-motion` override present, no
  `SOURCE_DEFECT` inherited (no Adelux-derived component exists to inherit
  one from).
- `RIGHTS-CONTRACT.md` / `DESIGN-SYSTEM-CONTRACT.md`: no token or
  component this stage touched Track B; zero Adelux-derived value entered
  `approved/`; `packages/truth/src/tokens/{raw,candidate}/` remain
  uncreated per `CONTRACT-CONFLICT-001`'s resolution.
- `CONTENT-CONTRACT.md`: `Button`'s `label` and `Card`'s `heading`/`body`
  props are UI/generic-copy content (exempt from the truth gate) — no
  organizational fact appears anywhere in the design-system test page.
- `ROUTE-CONTRACT.md`: `/design-system` is explicitly documented as
  verification infrastructure, not a UKBT route candidate.

## Verdict

```
DESIGN_SYSTEM_STATUS = PASS
TOKEN_DOMAINS_DEFINED = 8 (spacing, typography, color, radius, shadow, motion, breakpoint, layout)
BRAND_FACT_TOKENS = 0 (correct — no evidence exists yet)
COMPONENTS_BUILT = 2 (Button, Card)
REAL_DEFECTS_FOUND_AND_FIXED = 2 (token-collision warning, axe contrast violation)
ALL_CHECKS = PASS
NEXT_GATE = Stage 6 — Reference analysis (BLOCKED on licence evidence per prompts/16-reference-analysis.md; Track B remains RIGHTS_GATED)
```

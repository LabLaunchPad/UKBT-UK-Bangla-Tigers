# Foundation Receipt (Stage 4)

**Backfilled 2026-08-26** by a zoom-out state audit that found this stage's
work complete but its named receipt (`schemas/receipt.schema.json`) never
written — `artifacts/receipts/` held only `.gitkeep`. This receipt cites the
original Stage 4 commits as the implementation evidence, then re-runs every
acceptance command **now**, on the current head, so every exit code below is
real and current rather than reconstructed from commit messages.

```
task_id:      STAGE-4-FOUNDATION
baseline_sha: 28fb361   # "Stage 3: freeze the 15 Track C contracts" — contract freeze completes
verified_at_sha: 3b95009
```

## Original implementation commits (2026-08-26)

| Commit | Description |
|---|---|
| `d7f3612` | Stage 4 Foundation (partial, in progress): workspace root + packages/truth |
| `6862d8a` | Foundation checkpoint: apps/web builds end-to-end, all checks green |
| `4cdbbdd` | Foundation: Playwright+axe infrastructure, dependency allowlist, CI workflow |
| `55dc381` | Fix: add @types/node to apps/web (typecheck was actually failing) |
| `23d0825` | Fix CI: Playwright webServer must build tokens before Astro build |
| `33325f8` | Fix CI: pin preview/dev server to 127.0.0.1, exclude test artifacts from typecheck |

`changed_files`: 46 files, +8646/-14 lines across `28fb361..33325f8`
(`git diff --stat`) — workspace root (`package.json`, `pnpm-workspace.yaml`,
`tsconfig.base.json`, Biome config), `packages/truth` scaffold (content
schemas, truth gate, token source dirs), `apps/web` scaffold (Astro config,
static output), `.github/workflows/ci.yml`, Playwright + axe-core
infrastructure, `scripts/check-dependency-allowlist.mjs` +
`scripts/dependency-allowlist.json`, `scripts/scaffold-self-test.mjs`.

## Acceptance — commands actually run 2026-08-26 at `3b95009`

| # | Command | Exit code | Result |
|---|---|---|---|
| 1 | `pnpm check:governance-scaffold` | 0 | PASS — `{"status":"PASS","required_files":23}` |
| 2 | `pnpm check:deps` | 0 | PASS — `{"status":"PASS","allowed_count":12}` |
| 3 | `pnpm typecheck` (`tsc --noEmit` + `astro check`) | 0 | PASS — 52 files, 0 errors, 0 warnings, 1 hint |
| 4 | `pnpm lint` (Biome) | 0 | PASS — 35 files, no fixes needed |
| 5 | `pnpm build` (tokens + Astro static output) | 0 | PASS — 16 pages built |
| 6 | `pnpm test:unit` (truth gate + content schema, Vitest) | 0 | PASS — 2 files, 17/17 tests |
| 7 | `pnpm --filter @ukbt/web exec playwright test` | 0 | PASS — 192 passed, 1 skipped (reference-geometry.spec.ts, requires `UKBT_REFERENCE_DIR`, not a foundation requirement) |

All 7 acceptance criteria from `prompts/14-foundation.md` (project/workspace
structure, framework config, TS config, lint/format config, content/truth
model foundation, design-token foundation, testing foundation, deterministic
validation commands, CI checks, minimal application shell) are satisfied —
demonstrated by the commands above, not asserted.

## Unresolved risks

- None specific to Foundation. The scope has grown well beyond "minimal
  application shell" since Stage 4 (16 pages, full component library) — that
  growth is legitimate later-stage work, tracked by its own evidence
  (`artifacts/ui/PARITY-COMPLETION-REPORT.md`), not a Foundation defect.

## Rollback

Revert to `28fb361` (pre-Foundation, contracts frozen, no application code)
and re-run Stage 4 from `prompts/14-foundation.md`. No data/content loss risk:
Foundation predates all organization-specific content ingestion.

## Verifier

Backfilled and commands re-run by the same Claude Code session performing
this repository's zoom-out state audit, 2026-08-26. Not an independent
verifier — see Stage 8 (`artifacts/review/HOMEPAGE-REDTEAM.md`, not yet run)
for the one gate this project's own pipeline requires to run independently.

```
FOUNDATION_STATUS = PASS
TESTS = 17/17 unit, 192/193 Playwright (1 skipped, env-gated, not a failure)
BUILD = PASS (16 pages)
CONTENT_TRUTH = PASS (truth-gate unit tests 17/17; fail-closed behavior verified adversarially per commit 7a00221)
CHANGES = 0 (backfill only — no application code modified to produce this receipt)
```

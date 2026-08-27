# Repository Baseline — Phase 0

**Date:** 2026-08-26 · **Method:** direct inspection of this checkout.
**Application code changed:** none.

## Framework

**NOT CONFIRMED. NOT ASTRO — YET.** No framework config file, no `package.json`,
no `.astro` file, no `next.config.*`, no `vite.config.*` exists anywhere in this
repository.

Astro is `PROPOSED` in `artifacts/bootstrap/ARCHITECTURE-PROPOSAL.md` (A01) and
was reviewed, not approved, by the Stage 2 architecture red team
(`ARCHITECTURE_VERDICT = REVISE`). Per `docs/10-fresh-repo-pipeline.md`, a
framework becomes chosen at **Stage 3** (`contracts/REPOSITORY-CONTRACT.md`),
which has not run. This protocol's own Phase 11 ("If Astro is confirmed…")
correctly treats it as conditional; this baseline confirms the condition is
**not yet met**.

## Package manager

**NOT CONFIRMED.** No lockfile of any kind exists (`pnpm-lock.yaml`,
`package-lock.json`, `yarn.lock`, `bun.lockb` — none present). pnpm is
`PROPOSED` (A03), not chosen.

## Node version

**Container measurement only, not a project commitment:** `v22.22.2`, this
session's container. Per `contracts/evidence-contract.md`, a container
fingerprint is not evidence about any developer or CI machine and expires at
session end. `A04` in the architecture proposal was itself flagged `REVISE` by
Stage 2 for deriving a pinned range from exactly this kind of evidence
(finding F8) — not repeating that error here.

## Build system

**Does not exist.** No build script, no bundler config, nothing to build.

## Deployment target

**Not decided.** `U-11` (hosting vendor, domain, DNS) is open. A16 specifies a
capability requirement (static + preview deploys + serverless-function
support, per `EV-20260826-001`/C1-revision) but names no vendor.

## Existing source structure

None. No `src/`, `apps/`, `packages/` directory exists.

## Existing scripts

One: `scripts/scaffold-self-test.mjs` — a governance self-check (verifies the
scaffold's own required files exist), not an application script. Command run
now to confirm current state:

```
$ node scripts/scaffold-self-test.mjs
{"status":"PASS","required_files":23}
```

## Existing dependencies

**Zero.** No `node_modules`, no manifest declaring any dependency.

## Existing CI

**None.** No `.github/workflows/` directory exists. Per `knowledge/
08-VALIDATION-POLICY.yaml`, this is recorded as `ABSENT`, never as `PASS`.

## Existing configuration

Only governance configuration: `.claude/settings.json` (permission
allow/deny lists — no `WebFetch`, no destructive git, no publish commands),
`.claude/commands/*.md` (12 slash commands mapping to the pipeline stages),
`contracts/*.md` and `*.yaml` templates, `knowledge/*.yaml` (the decision
substrate), `docs/*.md`, `prompts/*.md`. No application configuration exists
because no application exists.

## What this baseline actually establishes

The repository is at exactly the state left by Stage 2A: governance and
evidence layers only, zero lines of application code, zero dependencies,
architecture `PROPOSED` and under revision, nothing frozen. This baseline does
not discover anything new — it confirms, by direct inspection rather than by
memory of prior turns, that nothing has drifted.

**Consequence for this protocol's later phases.** Phase 11 ("Framework
Implementation," conditional on Astro being confirmed) and everything
downstream of a chosen stack cannot start honestly until Stage 3 freezes a
contract. That gate is unrelated to the Adelux licence question — it is
`BL-03`, not `BL-02` — and is not addressed by this protocol's Track
separation. Flagged here so it surfaces now rather than mid-implementation.

# CLAUDE.md — packages/truth

This file provides guidance to Claude Code when working inside
`packages/truth` (`@ukbt/truth`). It is loaded alongside the root
`CLAUDE.md`, which carries the governance contract (evidence rules,
pipeline stages, hard invariants) that still applies here in full — this
file only adds package-local detail.

## Commands

Run from `packages/truth/`, or via `pnpm --filter @ukbt/truth <script>`
from the repo root.

```bash
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
pnpm tokens:build # style-dictionary build --config style-dictionary.config.json
```

Single test file: `pnpm --filter @ukbt/truth exec vitest run src/gate/rules.test.ts`.

## Architecture

This package owns **no framework/UI code** — it is the trust boundary that
`apps/web` depends on (`workspace:*`). Exports are deliberately narrow:
`.` (`src/index.ts`), `./gate` (`src/gate/index.ts`), `./schema`
(`src/schema/index.ts`).

- `src/schema/` — Zod content schemas + provenance types
  (`content-types.ts`, `provenance.ts`) that every organization-specific
  claim (players, fixtures, results, sponsors, etc.) must satisfy before it
  can appear on the site.
- `src/gate/` — the deterministic "truth gate": `rules.ts` / `registry.ts` /
  `derive.ts` decide machine-checkable facts (e.g. evidence classification,
  UNKNOWN-vs-FACT). This logic decides, not the model — see
  `CLAUDE.md § Hard invariants` at the repo root ("AI proposes; deterministic
  policy/tools decide machine-checkable facts").
- `src/tokens/` (`approved/`, `adapted/`) — design tokens, built by
  `style-dictionary` into `apps/web/src/styles/generated/`. Edit the source
  tokens here, then run `pnpm tokens:build`; never hand-edit the generated
  output in `apps/web`.
- `src/contracts/` — per-component contract docs (`button.contract.md`,
  `card.contract.md`) that pair with the repo-root
  `contracts/COMPONENT-CONTRACT.md`.

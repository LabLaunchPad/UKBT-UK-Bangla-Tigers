# Contracts

`docs/` explains *how* to work. `contracts/` states *what is agreed, currently
true, and permitted*. A contract is machine-checkable or it is not a contract.

## Present now (stage-independent)

| File | Purpose | Status |
|---|---|---|
| `evidence-contract.md` | Evidence registry, freshness, classification discipline | FROZEN |
| `evidence-record.template.yaml` | Per-claim skeleton | FROZEN |
| `task-contract.template.yaml` | Per-task skeleton | FROZEN |
| `schemas/receipt.schema.json` | Receipt shape (mirrors `schemas/`) | FROZEN |

## Created at Stage 3, not before

| File | Created by | Gate |
|---|---|---|
| `REPOSITORY-CONTRACT.md` | `prompts/13-contract-freeze.md` | after `ARCHITECTURE_VERDICT = PASS` |

**This file does not exist yet, and that is correct.** Architecture is `PROPOSED`
in `artifacts/bootstrap/ARCHITECTURE-PROPOSAL.md` and must survive
`prompts/12-architecture-redteam.md` first. Freezing a contract before the red
team runs pre-empts it and defeats the purpose of having one.

## Rules

1. One source of truth per subject. A contract supersedes any prose restating it.
2. `PROVISIONAL` is not authorization to build on. `REQUIRED` and `CHOSEN` are.
3. Every frozen item carries a `REVERSAL_CONDITION`. An item nobody can describe
   a reversal for is either genuinely immutable or wasn't understood.
4. Amending a frozen contract requires a new evidence record naming the
   observation that invalidated it. Contracts are amended, never quietly edited.
5. Freeze only what protects correctness or prevents drift. Over-specification is
   itself lock-in.

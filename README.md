# UKBT — UK Bangla Tigers

Repository for the UK Bangla Tigers website.

**Status: bootstrap.** No application code exists yet. The repository currently
holds its engineering governance and evidence layer only.

## Working here

Read in this order:

| File | What it gives you |
|---|---|
| `CLAUDE.md` | operating contract, authority order, hard invariants |
| `AGENTS.md` | evidence and role doctrine |
| `docs/10-fresh-repo-pipeline.md` | **the build order and the gate for each stage** |
| `contracts/` | frozen, machine-checkable agreements |
| `artifacts/bootstrap/` | current discovery output |

## The two rules that matter most

1. **No organization-specific claim about UK Bangla Tigers may be published
   without a sourced evidence record.** Not players, fixtures, history,
   leadership, honours, sponsors, venues, or contact details. `UNKNOWN` is a
   complete and acceptable answer; a plausible guess is not.
2. **No stage skipping.** Architecture is frozen at Stage 3, after a red team —
   not before. Pages are built one at a time, each with its own verification
   receipt.

## Current state

- Architecture: `PROPOSED`, not approved — `artifacts/bootstrap/ARCHITECTURE-PROPOSAL.md`
- Verified UKBT organization facts: **0** — `artifacts/bootstrap/UNKNOWN-EVIDENCE.md`
- Open blockers: 4 (BL-01…BL-04)
- Next stage: 2 — architecture red team (`/architecture-redteam`)

Scaffold integrity check: `node scripts/scaffold-self-test.mjs`

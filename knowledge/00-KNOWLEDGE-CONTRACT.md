# UKBT Agent Knowledge Contract

This directory is the local decision substrate for the UK Bangla Tigers
engineering agent. It exists so the agent does not have to remember a
conversation: **the repository carries the knowledge.**

Keep it compact, machine-readable, and evidence-linked. Detailed evidence lives
in `artifacts/` and is retrieved only when a decision requires it.

## Priority

1. Direct authoritative evidence
2. Repository evidence
3. Recorded verified project facts
4. Explicit project decisions
5. Deterministic tool output
6. Model inference

**Inference must not override higher-level evidence.**

## Fundamental rule

```
FACT != ASSUMPTION != DECISION != PROPOSAL
```

Every agent decision must preserve that distinction.

## Agent operating model

The agent may: `OBSERVE → REASON → PROPOSE → VERIFY → ACT`
The agent must not: `ASSUME → ACT → JUSTIFY`

## Fail-closed conditions

STOP when:

- required evidence is contradictory;
- a rights-sensitive decision lacks required evidence;
- a project fact would need to be invented;
- a frozen contract would be silently changed;
- validation evidence is missing;
- an external side effect lacks authorization.

## Evidence principle

**"The model believes X" is never evidence for X.**

## Scope

Architecture · Adelux template adaptation · UKBT content · truth/provenance ·
SEO · accessibility · validation · Claude Code orchestration · implementation.

## Relationship to the rest of the repository

| Layer | Role |
|---|---|
| `CLAUDE.md`, `AGENTS.md` | operating contract and doctrine |
| **`knowledge/`** | **durable, compact decision substrate — read before project-level decisions** |
| `contracts/` | frozen, machine-checkable agreements |
| `docs/`, `prompts/` | process and stage definitions |
| `artifacts/` | evidence and receipts — never a rule source |

`knowledge/` restates nothing it does not need. Where it and a frozen contract
disagree, that is a conflict to escalate (DR-015), never one to resolve silently.

## Maintenance

A file here changes only when evidence changes, and the change cites the evidence
ID that caused it. Anything asserted here without an evidence link is a defect in
this directory, not a fact about the project.

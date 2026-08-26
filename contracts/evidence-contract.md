# Evidence Contract (repository binding)

The normative schema is `docs/03-evidence-contract.md`. This file binds it to
this repository.

## Registry
- Evidence records live in `artifacts/evidence/EV-<date>-<nnn>.yaml`.
- IDs are append-only. A superseded record is never edited in place; a new record
  is written and the old one is reclassified `SUPERSEDED` with a pointer.

## Freshness defaults
| Claim kind | `valid_until` default |
|---|---|
| Command output (versions, git state) | end of the session that produced it |
| Test / build / lint result | invalidated by the next commit touching its scope |
| Repository structure | invalidated by the next commit |
| Organization fact sourced from UKBT | 12 months, or the source's own stated validity |
| Fixture, result, squad, or standings | invalidated by the next match or transfer window |
| Licence / legal | until the licence terms change |
| Immutable historical record (e.g. a completed match result) | `null`, with justification |

An expired record is `STALE`. `STALE` is not `FALSE` — it means *unverified now*.
Publishing from a `STALE` record is a release-gate failure.

## Classification discipline
- `UNKNOWN` and `INFERRED` never silently become `FACT`. Promotion requires a new
  record naming the source and the verification method.
- `USER-SUPPLIED` claims intended for publication stay unverified until
  independently confirmed against a UKBT-controlled or reputable source.
- Model confidence is not evidence and is never recorded as a classification.

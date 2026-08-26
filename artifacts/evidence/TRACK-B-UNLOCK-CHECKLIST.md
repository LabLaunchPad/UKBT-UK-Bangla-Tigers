# Track B Unlock Checklist

**Date:** 2026-08-26 · This is a **checklist artifact**, not a governance
model change — `knowledge/06-TEMPLATE-BOUNDARY.yaml`'s `provenance_chain`
and `required_evidence_to_close_track_b` are unchanged and unreopened, per
explicit instruction. This document restates that requirement as the
requester's exact 10-item form, for use when real evidence is eventually
supplied — nothing here is filled in, and nothing here is fabricated.

**Do not attempt to satisfy any item below by inference, assertion, or a
prompt's statement that it is satisfied — that is exactly the pattern
`DR-022`/`DR-023` exist to catch.**

| # | Required item | Current state | What would satisfy it |
|---|---|---|---|
| 1 | Executed instrument | **NOT PRESENT** — only a blank, unsigned template exists (`EV-20260826-012`) | A signed licence, contract, assignment, or equivalent — actually executed, not a template |
| 2 | Identifiable parties | **NOT PRESENT** — no name appears anywhere in the supplied material | The instrument names a real, identifiable person or entity with authority to act |
| 3 | Authorship/authority relationship | **CONFLICTING, now three-way** — Adelux's own documentation credits Fox Creation (`EV-20260826-005/-012`); LabLaunchPad's claim is asserted, not reconciled with that; a supplied archive's LICENSE file (`EV-20260826-022`) adds a third, unreconciled MIT-under-"Adelux" claim, dated at packaging time rather than shown to ship with the marketplace listing | Evidence resolving the conflict: e.g. Fox Creation is a LabLaunchPad-controlled account/alias, an assignment from Fox Creation, or a correction explaining the discrepancy — and, separately, verification the LICENSE file actually ships with the live marketplace listing |
| 4 | Explicit permission to adapt | **NOT ESTABLISHED** — depends on 1-3 | The instrument states adaptation/modification is permitted, not merely implied by a role claim |
| 5 | Explicit permission covering UKBT | **NOT ESTABLISHED** | The instrument's scope names UK Bangla Tigers, or a class of use that unambiguously includes it |
| 6 | Confirmation of framework translation/adaptation | **NOT ESTABLISHED** | The instrument addresses reimplementation in a different framework, or the idea/expression question (`U-26`) is otherwise resolved |
| 7 | Single-site scope | **STATED but unverified**, and moot until 1-6 resolve | Confirmation the permission is bounded to this one site, not a template for reuse |
| 8 | Treatment of bundled third-party components | **ALREADY INDEPENDENTLY GOVERNED** — unaffected by items 1-7; see `THIRD-PARTY-DISPOSITION.md` | N/A — this item does not block on the others; it is tracked separately regardless of how 1-7 resolve |
| 9 | Applicable attribution obligations | **ALREADY IDENTIFIED** — Font Awesome (CC BY 4.0), independent of items 1-7 | N/A — same as item 8, tracked regardless |
| 10 | Retention of the original evidence | **SATISFIED, ongoing** — `EV-20260826-005` through `-015` retained, append-only, none rewritten | Continue as-is; this item is a discipline, not a document to obtain |

## Items that gate Track B vs. items that don't

**Actually block Track B (1-7):** all depend on resolving the authorship
conflict. None can be satisfied from inside this repository — they require
primary evidence from outside it.

**Do not block Track B, already resolved or independently tracked (8-10):**
these were never waiting on the LabLaunchPad question and should not be
re-litigated once 1-7 resolve — they stay exactly as currently documented.

## Validation procedure, when evidence arrives

1. Check each of items 1-7 against the supplied evidence individually — not
   as a bundle "the licence is fine."
2. If any item remains unsatisfied, Track B stays gated and the specific
   unsatisfied item is named.
3. If all seven are satisfied, update `knowledge/06-TEMPLATE-BOUNDARY.yaml`'s
   `provenance_verdicts` **once**, with the new evidence's ID, per
   `knowledge/06`'s own instruction not to rewrite history — the current
   `CONFLICTING`/`ASSERTED_NOT_EXECUTED` records are superseded, not deleted.
4. This checklist itself does not get "mostly satisfied" — it is binary per
   item, and Track B unlocks only when 1-7 are ALL satisfied, not a majority.

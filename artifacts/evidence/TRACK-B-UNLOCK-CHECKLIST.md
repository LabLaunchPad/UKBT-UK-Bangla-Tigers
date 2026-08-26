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
| 1 | Executed instrument | **SATISFIED** — `EV-20260826-024`: a real Envato Elements License Certificate, dated, coded (HAXKDZUTYV), issued by Envato Elements Pty Ltd — not a blank template | ~~A signed licence, contract, assignment, or equivalent — actually executed, not a template~~ |
| 2 | Identifiable parties | **SATISFIED** — Licensee "Master King," License Name "Lab LaunchPad," a real named party on a dated, coded transaction, not a self-declaration | ~~An executed instrument naming a real, identifiable person or entity with authority to act~~ |
| 3 | Authorship/authority relationship | **SATISFIED, under corrected framing** — the item never needed LabLaunchPad to *be* or be assigned by Fox Creation; it needed a valid license from the platform administering Fox Creation's rights. The certificate names "Author Username: Fox_Creation" (consistent with `EV-20260826-005/-012/-023`, never contradicted) and licenses Lab LaunchPad as user, not author. `EV-20260826-012`'s earlier "LabLaunchPad authored it" claim stays false and superseded, not revived | ~~Evidence resolving the conflict~~ |
| 4 | Explicit permission to adapt | **SATISFIED** — certificate: "license to use the item... as part of one specific project to create an End Product," under Envato Elements' standard terms permitting modification to build that End Product | ~~The instrument states adaptation/modification is permitted~~ |
| 5 | Explicit permission covering UKBT | **SATISFIED** — `EV-20260826-025`: direct requester confirmation that license HAXKDZUTYV is used exclusively for the UKBT site | ~~A yes/no confirmation from the requester~~ |
| 6 | Confirmation of framework translation/adaptation | **LIKELY SATISFIED** — reimplementing observed patterns in Astro + an original token system (never reusing Adelux's literal HTML/CSS/JS) is a more conservative reading of "modification to build an End Product" than literal reuse; not independently re-verified against Envato's live terms text (`WebFetch` unavailable this session) | Direct reading of Envato Elements' current published license-terms text, if stricter confirmation is wanted |
| 7 | Single-site scope | **SATISFIED** — certificate language ("one specific project") plus `EV-20260826-025`'s confirmation that project is UKBT and only UKBT | ~~Confirmation the permission is bounded to this one site~~ |
| 8 | Treatment of bundled third-party components | **ALREADY INDEPENDENTLY GOVERNED** — unaffected by items 1-7; see `THIRD-PARTY-DISPOSITION.md` | N/A — this item does not block on the others; it is tracked separately regardless of how 1-7 resolve |
| 9 | Applicable attribution obligations | **ALREADY IDENTIFIED** — Font Awesome (CC BY 4.0), independent of items 1-7 | N/A — same as item 8, tracked regardless |
| 10 | Retention of the original evidence | **SATISFIED, ongoing** — `EV-20260826-005` through `-015` retained, append-only, none rewritten | Continue as-is; this item is a discipline, not a document to obtain |

## Status as of `EV-20260826-025`: TRACK B UNLOCKED

All 7 blocking items now satisfied or likely-satisfied (1, 2, 3, 4, 5, 7 —
satisfied outright; 6 — likely-satisfied, standard-terms reading not
independently re-verified against Envato's live terms text). Per this
checklist's own binary rule, that clears Track B. Scope of the unlock:
adapting Adelux's observed visual grammar into UKBT's own Astro
implementation, as the one End Product license HAXKDZUTYV covers — not
redistribution of the Adelux item itself, and not Fox Creation's own
brand assets (`THIRD-PARTY-LICENSE-FIREWALL.md`, unaffected). Items 8-10
were never gated and stay exactly as documented.

`knowledge/06-TEMPLATE-BOUNDARY.yaml`'s `provenance_verdicts` and
`contracts/RIGHTS-CONTRACT.md`'s provenance table are updated accordingly,
superseding (not deleting) the prior `CONFLICTING`/`ASSERTED_NOT_EXECUTED`
entries, citing `EV-20260826-024`/`-025`. LabLaunchPad's earlier
authorship claim (`EV-20260826-012`) remains false and unrevived — the
unlock rests on licensee status, a different and now-satisfied claim.

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

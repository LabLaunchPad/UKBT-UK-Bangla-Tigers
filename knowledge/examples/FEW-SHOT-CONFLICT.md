# Few-shot: handling a conflict

## Scenario
**Evidence A:** LabLaunchPad states Adelux is authorized.
**Evidence B:** The actual licence document contains a restriction that may conflict.

## Incorrect
Choose the more convenient interpretation.

## Correct
```
RIGHTS_STATUS = CONFLICTING
```
STOP the affected operation.

**Report:** the conflicting clauses · the affected assets · the affected
implementation · the required human resolution.

**Do not guess.**

## Scoping the stop — equally important

A conflict stops **what it actually affects**, not everything.

| Blocked | Not blocked |
|---|---|
| Stage 6 reference analysis | Stage 3 contract freeze |
| Any Adelux-derived markup, CSS, asset | Stage 4 foundation |
| Adopting the bundled libraries | Stage 5 design system from first principles |

Widening a scoped blocker into a general halt is its own failure mode
(05-UNKNOWN-BLOCKER-POLICY § anti_overblocking). Under-scoping it — proceeding
with the affected work — is the worse one.

## A real instance from this project

The bundled `isotope.pkgd.min.js` declares *"Licensed GPLv3 for open source use
or Isotope Commercial License for commercial use"* (Metafizzy).

This is **not** resolvable by any Adelux licence tier: Fox Creation cannot
sublicense rights it does not hold (DR-019). It is a separate blocker (BL-05)
with a narrow scope — it blocks adopting Isotope, and nothing else. Since A10
proposes no third-party UI library, it is cheaply avoided — **but declining to
adopt it must be a recorded decision, not an accident.**

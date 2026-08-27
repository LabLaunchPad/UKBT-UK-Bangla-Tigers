# Architecture Red Team v2 — Verifying the 15 Revisions

**Date:** 2026-08-26 · **Scope:** this is not a re-run of Stage 2's full
20-decision analysis — the 14 decisions that already passed (A01, A02, A03,
A05, A07, A09, A10, A11, A12, A14, A15, A17, A18, A20) are **not
re-litigated**; nothing about them changed. This attacks specifically:
whether each of the 15 revisions actually resolves the finding that
produced it, whether any revision introduces a *new* problem, and whether
the 3 newly-added decisions (A21–A23) hold up.

**No Adelux-derived visual expression was used to make any decision here** —
verified: nothing in this document or `ARCHITECTURE-PROPOSAL-V2.md`
references a CSS value, token, or component finding from Track A.

---

## Attacking the critical fixes (R1, R2 — Truth Gate Mechanism)

**ATTACK:** "Fail-closed-by-default means every field needs provenance,
including trivial ones — doesn't this make content authoring impossible?"

**SURVIVES.** `not_organization_claims` (generic copy, UI labels, legal
boilerplate — already defined in `CONTENT-TRUTH-MODEL.md`) is the exempt
list. The mechanism blocks *unregistered* organization-fact fields from
publishing silently; it does not block content generally.

**ATTACK (sharper):** "`U-22` (registry owner) and `U-23` (named approver)
are still open. Doesn't that mean the gate can never pass anything, which
blocks Stage 4 (foundation) from being buildable at all?"

**Genuine finding, now resolved explicitly:** building the gate's
*mechanism* (schema validation, registry-ID resolution, build-time checks)
does not require `U-22`/`U-23` to be answered — it requires the mechanism
to be *testable*, which a test fixture with a synthetic registry entry and
a placeholder approver ID satisfies. **Publishing a real UKBT fact** through
the gate does require `U-22`/`U-23` resolved. This distinction — building
the gate vs. using it — was implicit before and is now stated as a
required clarification for Stage 4's own task contract, not left for
Stage 4 to discover on its own.

## Attacking R5 (workspace shape)

**ATTACK:** "`packages/core` is a vague name. Does it risk becoming a
dumping ground for anything that doesn't obviously belong in `apps/web`?"

**Real risk, addressed by scoping it explicitly:** `packages/core` contains
*only* content schemas and the truth gate (the two things that must
co-evolve, per Stage 2's original finding). UI primitives, shared config,
and site-specific logic stay in `apps/web` until a second consumer justifies
extraction — consistent with A09/A10 and Stage 2's `DEFER` verdict on
`packages/ui`. **Added to `ARCHITECTURE-PROPOSAL-V2.md`'s A06 row as an
explicit boundary, not left implicit.**

## Attacking R6 (C1 → decision-time check)

**ATTACK:** "Deferring the host-capability check to 'host selection time'
risks nobody actually performing it — silently defaulting to a host that
supports neither form route."

**Genuine gap, closed:** the check must be a **recorded step** in whatever
task selects the host (a task contract per `contracts/task-contract.
template.yaml`), not a documentation aspiration. **Required addition:**
host selection is not complete without this check appearing in that task's
evidence. Recorded here so Stage 4/later doesn't silently skip it.

## Attacking R3 (C3 deletion)

**ATTACK:** "Deleting C3 outright removes any explicit guard against
future dynamic-data creep — what stops a page from quietly growing a
server-rendered dependency nobody planned for?"

**Survives.** The protective intent moves to C2's own scope ("form
submission is a runtime call, never a build-time-only integration") plus
the ordinary re-planning trigger for "a change to routing/rendering mode,"
already listed in `ARCHITECTURE-PROPOSAL-V2.md`'s re-planning conditions.
C3 as originally worded protected nothing C2 doesn't already cover, and its
literal wording actively broke the thing A05 chose (build-time rendering).

## Attacking R9 (Biome)

**ATTACK:** "Is Biome the objectively correct choice, or a preference
dressed as a decision?"

**Acknowledged as a preference, not a proof — and that's fine.** Stage 2
already said either tool is defensible; what mattered was picking one so
`REVERSAL_CONDITION` is expressible. Biome is chosen for one config file and
less setup surface for a small team. **This is a cheap, reversible decision**
(swapping lint tooling later costs a config migration, not a rewrite) —
correctly weighted as `LOW` severity in the original revision list.

## Attacking the visual-toolchain deferrals (Style Dictionary, Sharp, Argos/Percy, Storybook)

**ATTACK (Argos/Percy specifically):** "What if a distributed team
genuinely needs a shared UI to review visual diffs, and local Playwright
screenshots don't serve that?"

**A real operational question, not a contradiction.** No such need is
demonstrated yet — UKBT has no components, no team of visual reviewers, no
established review workflow. Per `DR-006` (don't architect hypothetical
features prematurely), this is exactly the case where "useful later" stays
distinct from "necessary now." **If** that need materializes, it is a
re-planning trigger, evaluated against the security cost (uploading
Adelux-derived screenshots to a third party while `BL-02` is open) at that
time — not decided defensively now.

**ATTACK (Style Dictionary):** "What if UKBT later needs tokens on a second
platform (a mobile app, a partner's site)?"

**Exactly why the DTCG format is kept even though the compiler is
deferred** — the data survives the tool choice. Adopting Style Dictionary
later costs adding one build step, not re-authoring the tokens.

## Attacking the three new decisions (A21–A23)

**A21 (routing):** trivial, no counterargument found — Astro's file-based
routing is the default behavior of the already-chosen framework, not a new
dependency or pattern.

**A22 (security):** **ATTACK:** "Is 'CSP appropriate for a static site' specific
enough to be a real decision, or vague enough to mean nothing?" **Partially
survives:** the *requirement* (no inline scripts, so a strict CSP is
achievable) is real and falls out of A01's zero-JS-by-default default. The
*exact CSP header value* is correctly left to Stage 4 implementation, not
specified here — over-specifying it now would be exactly the kind of
premature lock-in `INV-010` (every boundary must have a reason) warns
against.

**A23 (performance):** **ATTACK:** "What Lighthouse score, specifically?"
**Deliberately not numbered here** — a specific threshold is an
implementation-time calibration (Stage 4/CI setup), not an architecture
decision. What *is* an architecture decision, correctly scoped to this
document, is that a budget is checked in CI at all, alongside the existing
accessibility gate.

---

## Verdict

All 15 revisions verified to resolve their originating finding. Two
revisions (R1/R2's gate mechanism, R6's host-check) needed one additional
clarification each to fully close — both applied above, not left as new
open findings. No revision introduces a problem it doesn't also close. The
three newly-added decisions (A21–A23) are appropriately scoped: real
requirements stated, specific calibration correctly deferred to
implementation.

**No Adelux-derived visual expression was consulted to reach this verdict** —
confirmed by the fact that nothing above references any Track A finding.

```
ARCHITECTURE_VERDICT = PASS
DECISIONS_REVISED_AND_VERIFIED = 15/15
NEW_DECISIONS_ADDED_AND_VERIFIED = 3/3 (A21, A22, A23)
NEW_FINDINGS_REQUIRING_FURTHER_REVISION = 0
CARRIED_FORWARD_UNCHANGED = 14 (A01-A03, A05, A07, A09-A12, A14-A15, A17-A18, A20)
NO_APPLICATION_CODE_CHANGED = TRUE
```

**Gate status: Stage 2 is now `PASS`.** Per `docs/10-fresh-repo-pipeline.md`,
Stage 3 (freezing `contracts/REPOSITORY-CONTRACT.md`) may now run — that is
the natural next gate for Track C, not performed in this pass.

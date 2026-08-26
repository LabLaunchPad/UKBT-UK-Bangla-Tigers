# Contract Audit — Governance Policy Repair

**Date:** 2026-08-26 · **Trigger:** the requester caught a real contradiction —
`knowledge/06-TEMPLATE-BOUNDARY.yaml` carried two different, disagreeing
rights-boundary structures written on different turns of the same session:
an early `allowed_now`/`not_allowed_now`/`allowed_when_verified` block that
forbade `extract_design_patterns`/`adapt_tokens` outright, and a later
`lifecycle_states` block that explicitly permitted `css_ast_parsing`/
`computed_style_extraction`/`token_candidate_extraction`. **Scope of this
audit, per the requester's explicit instruction: governance repair only. No
application code changed.**

---

## Method

1. Read every file in `knowledge/` in full (not spot-checked).
2. Grepped the entire repository for the specific terms named in the
   instruction: `FORENSIC_ANALYSIS`, `extract_css_values`,
   `extract_computed_styles`, `BL-02`, `ADELUX_LICENSE`, `TEMPLATE_BOUNDARY`,
   `RIGHTS_GATED`, `NOT_VERIFIED`, `REDISTRIBUTION`.
3. For every file that matched, read enough surrounding context to determine
   whether it *defines* a rule (candidate for contradiction) or merely
   *cites* one (not a contradiction risk by itself).
4. Cross-checked `prompts/16-reference-analysis.md` and
   `docs/10-fresh-repo-pipeline.md` (Stage 6 definition) against the new
   model, since both define gate language that touches the same subject.
5. Ran ten targeted greps against the repaired state to confirm no
   contradiction, no orphaned old vocabulary, and no accidental scope
   creep (no application code, no Adelux asset, no `REDISTRIBUTION_ALLOWED`
   flip) entered the repository during the repair.

---

## Contradictions found

| # | File | Rule | Conflict | Resolution |
|---|---|---|---|---|
| 1 | `knowledge/06-TEMPLATE-BOUNDARY.yaml` | `not_allowed_now: [extract_design_patterns, adapt_layout, adapt_components, adapt_tokens, ...]` (written first) | Directly contradicted by the same file's own `lifecycle_states.FORENSIC_ANALYSIS.permits: [..., css_ast_parsing, computed_style_extraction, token_candidate_extraction, component_candidate_discovery, ...]` (written later, after explicit requester authorization) — two competing definitions of the same boundary, in the same file | **Both blocks replaced** by a single `rights_states` (four explicit states, not booleans) + `operation_classes` (five classes: `READ_ONLY_FORENSICS`, `DERIVED_ANALYSIS`, `UKBT_IMPLEMENTATION`, `PRODUCTION`, `REDISTRIBUTION`) structure. `extract_css_values`/`extract_computed_styles` now appear exactly once, as `DERIVED_ANALYSIS` examples, in no forbid list anywhere. |
| 2 | `prompts/16-reference-analysis.md` / `docs/10-fresh-repo-pipeline.md` | Stage 6's gate ("do not run this stage until the reference's licence is verified") | Not a direct contradiction, but an unclarified overlap: this session already performed `DERIVED_ANALYSIS`-class work (CSS AST, cascade tracing, computed styles) that reads, superficially, like "reference analysis" — risking the appearance that Stage 6 had silently run, or that its gate had been silently bypassed | Added a scope note to `prompts/16-reference-analysis.md` and a `relationship_to_pipeline_stage_6` section to `knowledge/06-TEMPLATE-BOUNDARY.yaml`, both stating explicitly: Stage 6 produces `UKBT_IMPLEMENTATION`-class adaptation *decisions* and stays gated on BL-02; the forensic work already done is the narrower, explicitly-authorized `DERIVED_ANALYSIS` class, which precedes and feeds Stage 6 without substituting for it. |

**No other file redefined a conflicting rule.** Files that mention `BL-02`,
`RIGHTS_GATED`, `ADELUX_LICENSE_VERDICT`, or `REDISTRIBUTION` elsewhere in the
repository (`knowledge/01-VERIFIED-FACTS.yaml`,
`artifacts/bootstrap/UNKNOWN-EVIDENCE.md`, `artifacts/design/
ADELUX-PAGE-INVENTORY.md`, `artifacts/evidence/*.yaml`,
`artifacts/verification/ARCHITECTURE-REDTEAM-ADDENDUM-VISUAL-TOOLCHAIN.md`)
all *cite* the same status (`OPEN` / `STATED_BUT_UNVERIFIED` /
`RIGHTS_GATED`) consistently — none asserts a competing value.

---

## What else was added, per the requester's explicit instruction

Each placed in the file where the concept already lives, to avoid creating a
sixth place a future reader would have to check:

| Addition | File | Reason for placement |
|---|---|---|
| Framework-translation invariant (INV-015) — a framework change must not silently alter visual hierarchy/spacing/typography/responsive/interaction/image treatment/dimensions/alignment/density; forced changes get `FRAMEWORK_CONSTRAINT → VISUAL_IMPACT → DECISION → VALIDATION` | `knowledge/03-ARCHITECTURE-INVARIANTS.yaml` | Architecture-level constraint, same file as every other INV |
| Single-site scope invariant (INV-016) — no reusable Adelux framework/marketplace product/multi-client template; UKBT-internal component reuse is fine | `knowledge/03-ARCHITECTURE-INVARIANTS.yaml` | Same — also cross-referenced from `06`'s `REDISTRIBUTION_ALLOWED: FALSE` |
| Visual fidelity as a first-class acceptance gate + anti-vacuity list (never accept "looks identical" / "tokens match" / "CSS was migrated" as visual proof) | `knowledge/08-VALIDATION-POLICY.yaml` | This file already owns validation states and the general anti-vacuity list; visual-specific vacuity is a natural extension, not a new file |
| Evidence-reuse / no-evidence-loop rule — check existing artifacts first, cite `EVIDENCE_REUSED`, only gather new evidence for five named reasons, state all four (what/why/blocks/why-not-answerable) when requesting more | `knowledge/05-UNKNOWN-BLOCKER-POLICY.yaml` | This file already owns the `anti_overblocking`/`anti_underblocking` scoping discipline; evidence reuse is the same discipline applied to re-investigation instead of blocking |
| Source-side vs. destination-side operation split; explicit non-boolean four-state model (`FORENSIC_ALLOWED` / `IMPLEMENTATION_ALLOWED` / `PRODUCTION_ALLOWED` / `REDISTRIBUTION_ALLOWED`); framework-translation vs. legal-clearance separation with an explicit anti-inference statement | `knowledge/06-TEMPLATE-BOUNDARY.yaml` | Core rewrite target |

---

## Verification performed

```
1. grep for old vocabulary (not_allowed_now / allowed_when_verified)  → only in 06's own repair-history comment
2. grep for FORENSIC_ANALYSIS / FORENSIC_ALLOWED consistency          → consistent (06 defines, prompts/16 cites)
3. grep for a live duplicate lifecycle_states block                   → none (old block fully removed)
4. grep for extract_css_values / extract_computed_styles in any forbid → none; both appear only as DERIVED_ANALYSIS examples
5. grep for BL-02 status across every file that states it              → OPEN everywhere, no divergence
6. grep for RIGHTS_GATED usage                                         → consistent with the new model everywhere it appears
7. grep for REDISTRIBUTION_ALLOWED=true or equivalent                  → none found
8. grep for orphaned references to the old file structure              → only inside 06's own documented history
9. find for application code / Adelux binary assets entered this pass  → 0
10. yaml.safe_load over every knowledge/*.yaml file                    → all 10 valid
```

---

## Final status

```
POLICY_REPAIR = PASS
CONTRACT_AUDIT = PASS
FORENSIC_ANALYSIS_ALLOWED = TRUE
CSS_EXTRACTION_ALLOWED = TRUE
COMPUTED_STYLE_EXTRACTION_ALLOWED = TRUE
VISUAL_CAPTURE_ALLOWED = TRUE (transient only — never persisted into this repository while BL-02 is open, per golden_reference_rule)
UKBT_IMPLEMENTATION_STATUS = CONDITIONAL / GOVERNED
PRODUCTION_STATUS = NOT_VERIFIED
REDISTRIBUTION_STATUS = FALSE
BL-02_STATUS = OPEN — STATED_BUT_UNVERIFIED (unchanged by this repair)
APPLICATION_CODE_CHANGED = FALSE
```

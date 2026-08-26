# Contract Audit 2 — Five-Stage Pipeline Refinement

**Date:** 2026-08-26 · **Trigger:** review of `CONTRACT-AUDIT.md`'s repair
found it still correct in substance but structurally conflating three
different concepts under one flat set of states: understanding the source,
building the UKBT implementation from that understanding, and obtaining
production/redistribution clearance. **Scope: governance correction only. No
application code changed.**

---

## What changed

`knowledge/06-TEMPLATE-BOUNDARY.yaml` restructured into two explicit layers:

- **`permission_facts`** (4, renamed from repair 1's `rights_states` to the
  precise terms specified this round): `FORENSIC_PERMISSION`,
  `IMPLEMENTATION_PERMISSION`, `PRODUCTION_CLEARANCE`,
  `REDISTRIBUTION_PERMISSION`.
- **`pipeline_stages`** (5, new — this is what repair 1 was missing):
  `1_FORENSIC_ANALYSIS` → `2_DESIGN_EXTRACTION` → `3_UKBT_ADAPTATION` →
  `4_UKBT_IMPLEMENTATION` → `5_PRODUCTION_RELEASE`, each gated by one of the
  four permission facts and carrying its own explicit permitted-action list.

The prior `operation_classes` key is retired (its content folded into the
five stages) so there are two layers, not three, and they cannot drift out
of agreement with each other the way the two competing blocks did in repair
1.

Also restored `template.status: NOT_ADMITTED` and
`template.license_status: STATED_BUT_UNVERIFIED` as literal fields (repair 1
had replaced them with equivalent-but-differently-named concepts elsewhere
in the file; this round keeps both the historic field names and the new
model, per explicit instruction not to change them).

Added: `token_lifecycle` (RAW → CANDIDATE → ADAPTED → APPROVED, inserting
ADAPTED to correspond to pipeline stage 3); `reference_screenshot_storage`
(replacing the prior absolute prohibition on committing a screenshot with a
three-tier `transient_comparison: ALLOWED` / `repository_commit: GOVERNED` /
`redistribution: NOT_ALLOWED_UNLESS_CLEARED` — governed, not blocked, but
still requiring recorded rights status and provenance if ever committed);
`visual_regression` (mandatory, cross-referenced to
`08-VALIDATION-POLICY.yaml`); `third_party_software` / `third_party_fonts`
(split from the single prior `third_party_rights` block); `asset_policy`;
`brand_boundary`; `single_site_scope`; `license_state`.

`knowledge/05-UNKNOWN-BLOCKER-POLICY.yaml`'s evidence-reuse field names
aligned to the exact terms given this round: `MISSING_FACT`, `WHY_NEEDED`,
`DECISION_BLOCKED`, `WHY_EXISTING_EVIDENCE_IS_INSUFFICIENT`.

---

## Contradictions found and fixed this round

| # | File | Rule | Conflict | Resolution |
|---|---|---|---|---|
| 1 | `knowledge/03-ARCHITECTURE-INVARIANTS.yaml` (INV-016) | `control:` field cited `knowledge/06-TEMPLATE-BOUNDARY.yaml rights_states.REDISTRIBUTION_ALLOWED = FALSE` | That key no longer exists after this round's rename | Updated to `permission_facts.REDISTRIBUTION_PERMISSION = NOT_ALLOWED` |
| 2 | `prompts/16-reference-analysis.md` | Scope note cited `DERIVED_ANALYSIS work` and the `FORENSIC_ALLOWED` state | Both names retired this round (folded into `pipeline_stages`; renamed to `FORENSIC_PERMISSION`) | Updated to cite pipeline stages 1/2 (`FORENSIC_ANALYSIS`, `DESIGN_EXTRACTION`) by their new names and `FORENSIC_PERMISSION: ALLOWED` |

Both were stale cross-references left behind by *this session's own prior
repair*, not new contradictions introduced by a different author — exactly
the kind of drift a rename creates if only the renamed file is checked.
Caught by re-running the full grep sweep rather than assuming a single-file
edit was self-contained.

**No other file redefined a conflicting rule.** Citations of `BL-02`,
`RIGHTS_GATED`, `ADELUX_LICENSE_VERDICT` elsewhere in the repository remain
consistent with `STATED_BUT_UNVERIFIED` / `OPEN`.

---

## Verification performed

```
1. grep for retired vocabulary (rights_states./operation_classes:/FORENSIC_ALLOWED/
   IMPLEMENTATION_ALLOWED/PRODUCTION_ALLOWED/REDISTRIBUTION_ALLOWED/DERIVED_ANALYSIS)
   outside documented repair-history comments                    → clean after fixes 1-2
2. permission_facts + pipeline_stages present and referenced       → both present, 7 hits
3. token_lifecycle states                                          → [RAW, CANDIDATE, ADAPTED, APPROVED] exact match
4. reference_screenshot_storage                                    → matches spec exactly
5. third_party_software / third_party_fonts split                  → matches spec exactly
6. template.status / template.license_status literal fields        → NOT_ADMITTED / STATED_BUT_UNVERIFIED, both present
7. application code / Adelux binary assets entered this round      → 0
8. yaml.safe_load over every knowledge/*.yaml                      → all 10 valid
```

---

## Final status

```
CONTRACT_AUDIT = PASS

LICENSE_STATE       = STATED_BUT_UNVERIFIED (unchanged)
FORENSIC_ANALYSIS   = ALLOWED
DESIGN_EXTRACTION   = ALLOWED
UKBT_ADAPTATION     = GOVERNED
UKBT_IMPLEMENTATION = GOVERNED
PRODUCTION_RELEASE  = NOT_CLEARED
REDISTRIBUTION      = BLOCKED

CONTRADICTIONS_FOUND    = 2 (both stale cross-references from this session's own repair 1, caught by full re-sweep)
CONTRADICTIONS_RESOLVED = 2
APPLICATION_CODE_CHANGED = FALSE
```

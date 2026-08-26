# PROMPT 16 — REFERENCE ANALYSIS (Stage 6)

**Gate:** do not run this stage until the reference's licence is verified and
recorded as evidence. See `artifacts/bootstrap/UNKNOWN-EVIDENCE.md` (BL-02 / G21).

I am providing a reference design/template. Treat the reference as **VISUAL
EVIDENCE, not as application architecture.**

Analyze it for: layout grammar · typography hierarchy · spacing rhythm ·
component composition · navigation behavior · hero composition · cards · section
transitions · imagery · responsive behavior · interaction states · visual
hierarchy · accessibility implications.

Do NOT copy content. Do NOT copy organization-specific facts. Do NOT blindly
copy dependencies. Do NOT blindly copy architecture. Do NOT blindly copy code.

Create `artifacts/ui/REFERENCE-ANALYSIS.md`, separating:

```
OBSERVED_FROM_REFERENCE   — what the reference measurably does
DERIVED_DESIGN_RULE       — the rule that behavior implies
PROPOSED_UKBT_ADAPTATION  — what UKBT should do instead/likewise
UNKNOWN                   — what the reference cannot tell us
```

Then identify exactly which parts should become reusable UKBT components and
which parts should NOT be copied — and say why for each.

The critical separation is:

```
reference → visual grammar        ✅
reference → cloned website        ❌
```

Do not implement yet.

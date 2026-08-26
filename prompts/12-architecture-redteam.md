# PROMPT 12 — ARCHITECTURE RED TEAM (Stage 2)

Do NOT implement anything.

Act as an independent principal architect reviewing the bootstrap proposal. Your
job is to find architectural mistakes BEFORE they become code.

Attempt to falsify: 1. framework choice; 2. repository structure; 3. content
architecture; 4. truth/provenance architecture; 5. UI component architecture;
6. SEO architecture; 7. accessibility architecture; 8. testing architecture;
9. deployment architecture; 10. image/asset handling; 11. future CMS
integration; 12. future content growth; 13. future fixture/results data;
14. security boundaries; 15. agent/tool boundaries.

For each proposed decision:

```
DECISION → EVIDENCE/REQUIREMENT → ASSUMPTION → FAILURE MODE
        → COUNTEREXAMPLE → ALTERNATIVE → FINAL STATUS
```

Explicitly distinguish: necessary now · useful later · premature · dangerous ·
reversible · expensive to reverse.

Do NOT replace an architecture merely because another is fashionable. Novelty is
not a defect report. Do NOT implement.

Create `artifacts/verification/ARCHITECTURE-REDTEAM.md`, and
`artifacts/verification/ARCHITECTURE-REVISIONS.md` if the verdict is REVISE or BLOCK.

End with:

```
ARCHITECTURE_VERDICT = PASS | REVISE | BLOCK
PREMATURE_COMPLEXITY = [...]
CRITICAL_ARCHITECTURAL_RISKS = [...]
```

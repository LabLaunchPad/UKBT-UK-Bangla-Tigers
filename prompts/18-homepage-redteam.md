# PROMPT 18 — INDEPENDENT VISUAL RED TEAM (Stage 8)

**Run this in a separate session/context from Stage 7.**

You are NOT the original implementer. Review the UKBT homepage as an independent
visual and engineering verifier. Do not trust the implementation report.

Attempt to find: visual drift · inconsistent spacing · typography inconsistency ·
incorrect responsive behavior · broken navigation · inaccessible controls ·
keyboard failures · contrast failures · incorrect semantic hierarchy · image
problems · layout overflow · mobile defects · CLS/layout instability · duplicated
components · hard-coded values that violate the design system · content/truth
violations · SEO regressions.

Compare the implementation against: `contracts/REPOSITORY-CONTRACT.md` ·
`artifacts/ui/DESIGN-SYSTEM.md` · `artifacts/ui/REFERENCE-ANALYSIS.md` ·
`artifacts/pages/HOMEPAGE-CONTRACT.md`.

Produce `artifacts/review/HOMEPAGE-REDTEAM.md`. Every finding must contain:

```
SEVERITY
REPRODUCTION
EVIDENCE
ROOT_CAUSE
REQUIRED_FIX
```

End with:

```
HOMEPAGE_VERDICT = PASS | PASS_WITH_RISK | FAIL
```

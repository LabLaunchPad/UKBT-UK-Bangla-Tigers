# Fresh-Repository Pipeline

The scaffold's original execution order (`docs/00-scaffold-overview.md`) assumes
an existing codebase. This is the order that actually applies here.

Each stage is planning-and-verification only until Stage 6. **Stages 1–5 write no
application code.** That is deliberate: it buys a clean architectural checkpoint
before hundreds of files make wrong assumptions expensive to undo.

| # | Stage | Prompt | Primary artifact | Gate to pass |
|---|---|---|---|---|
| 1 | Bootstrap discovery | `prompts/11-bootstrap-discovery.md` | `artifacts/bootstrap/REPOSITORY-BOOTSTRAP.md` + 4 more | `BOOTSTRAP_STATUS = READY` |
| 2 | Architecture red team | `prompts/12-architecture-redteam.md` | `artifacts/verification/ARCHITECTURE-REDTEAM.md` | `ARCHITECTURE_VERDICT = PASS` |
| 3 | Freeze the foundation | `prompts/13-contract-freeze.md` | `contracts/REPOSITORY-CONTRACT.md` | `CONTRACT_STATUS = FROZEN` |
| 4 | Foundation build | `prompts/14-foundation.md` | `artifacts/receipts/FOUNDATION.md` | `FOUNDATION_STATUS = PASS` |
| 5 | Design system | `prompts/15-design-system.md` | `artifacts/ui/DESIGN-SYSTEM.md` (+ verification) | all checks green |
| 6 | Reference analysis | `prompts/16-reference-analysis.md` | `artifacts/ui/REFERENCE-ANALYSIS.md` | licence cleared first |
| 7 | Homepage | `prompts/17-homepage.md` | `artifacts/pages/HOMEPAGE-CONTRACT.md`, `artifacts/receipts/HOMEPAGE.md` | verification passes |
| 8 | Independent visual red team | `prompts/18-homepage-redteam.md` | `artifacts/review/HOMEPAGE-REDTEAM.md` | `HOMEPAGE_VERDICT = PASS` |
| 9 | Scale to remaining pages | `prompts/19-site-scale.md` | route/content matrix + per-page receipts | per page: PLAN→IMPLEMENT→VERIFY→RECEIPT |
| 10 | Full-site verification & release | `prompts/06-release-gate.md` | release receipt | all gates pass |
| 11 | Adaptive learning + replay | `prompts/07`, `prompts/08` | learning + replay records | replayed against `adversarial/` |

## Rules that bind the pipeline

1. **No stage skipping.** A stage that has not produced its artifact has not run.
2. **No stage jumping backwards silently.** A failure moves to DIAGNOSE
   (`CLAUDE.md § State machine`), not straight to another edit.
3. **Stage 3 is the only place architecture gets frozen.** Stages 1–2 produce
   `PROPOSED` decisions and attacks on them. Writing a frozen contract earlier
   pre-empts the red team and defeats the point of having one.
4. **Stage 6 is gated on licence evidence**, not on the reference being available.
   See `artifacts/bootstrap/UNKNOWN-EVIDENCE.md`.
5. **Stage 8 runs in a separate session** from Stage 7.
6. **Pages are never batch-built.** Stage 9 is per-page PLAN → IMPLEMENT →
   VERIFY → RECEIPT. Implementing all pages and verifying later is prohibited.
7. **A page whose required organization-specific evidence does not exist is not
   implemented.** It is listed in the route matrix as blocked on evidence.

## Machine-readable status

Every stage ends with a status block. A `PASS` that cannot show its evidence is
treated as a `FAIL`. Minimum shape:

```
STATUS = PASS | FAIL | BLOCKED
EVIDENCE = <count>
UNKNOWN = <count>
BLOCKERS = <count>
FILES_CHANGED = <count>
TESTS_RUN = <count>
TESTS_PASSED = <count>
TESTS_FAILED = <count>
```

Counts must be derivable from the receipt. Stage-specific blocks (e.g.
`BOOTSTRAP_STATUS`, `ARCHITECTURE_VERDICT`) are defined in each prompt.

## Prohibited shortcut

Going from a delivered template ZIP directly to "build the UKBT website". The
reference is visual evidence. It is not architecture, not content, and not a
site to clone.

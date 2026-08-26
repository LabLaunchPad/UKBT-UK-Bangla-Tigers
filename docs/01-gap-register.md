# Gap Register — adversarial review of the prior scaffold

| ID | Gap | Severity | Control added |
|---|---|---|---|
| G01 | Historical facts could be treated as current | Critical | admission + freshness ledger |
| G02 | Original CLAUDE.md may contain stronger rules than scaffold | Critical | mandatory read-and-reconcile step |
| G03 | Instruction precedence could conflict | Critical | precedence matrix + conflict stop |
| G04 | Scope can expand through "necessary" files | High | change-budget + reapproval |
| G05 | Agent count can become architecture theater | High | minimum-topology rule |
| G06 | Reviewer can share same assumptions as builder | High | independent baseline + red-team cases |
| G07 | Green tests can coexist with untested regressions | High | acceptance-to-test mapping |
| G08 | Test count can be mistaken for proof | High | coverage claim discipline |
| G09 | Flaky tests can be hidden as failures/green | High | repeat-and-classify protocol |
| G10 | Release gate can be weakened | Critical | immutable gate rule |
| G11 | Evidence can become stale | High | evidence freshness/expiry |
| G12 | Evidence can be provenance-invalid | Critical | source-chain check |
| G13 | Prompt injection in repo content | Critical | untrusted-data rule |
| G14 | Secrets could enter receipts | Critical | secret scan/redaction policy |
| G15 | Destructive commands | Critical | command denylist + explicit approval |
| G16 | Concurrent agents can collide | High | single-writer rule |
| G17 | UI judged from screenshots only | High | DOM/CSS/assets-first visual audit |
| G18 | Responsive/state regressions | High | viewport/state matrix |
| G19 | SEO/AEO/GEO drift | High | structured-data/meta/link checks |
| G20 | Truth model bypass through generated content | Critical | publish-boundary verification |
| G21 | License uncertainty around Adelux | High | explicit license admission gate |
| G22 | Cross-project DesignOS assumptions leak into UKBT | Medium | boundary contract |
| G23 | Tool outputs are unbounded/noisy | Medium | bounded receipt schema |
| G24 | Model/provider changes alter behavior | Medium | model-agnostic protocol + replay cases |
| G25 | Dependency updates cause silent drift | High | lockfile/package diff gate |
| G26 | Interrupted run loses state | High | resumable receipts/state machine |
| G27 | Learning overfits one task | High | adversarial replay before promotion |
| G28 | External/current facts become stale | High | retrieval date + revalidation |
| G29 | Rollback plan is vague | High | executable rollback evidence |
| G30 | Scaffold itself can drift | Medium | scaffold manifest + self-test |
| G31 | Browser/visual environment differs | Medium | environment fingerprint in visual receipts |
| G32 | CI/local mismatch | High | environment fingerprint + exact command record |
| G33 | Network unavailable is confused with source absence | Medium | evidence status taxonomy |
| G34 | Agent can silently reinterpret user intent | High | goal/non-goal contract + ambiguity stop |
| G35 | No explicit kill switch for runaway loops | Critical | iteration/time/tool budgets |
| G36 | External side effects not isolated | Critical | side-effect classification and approval |

## Important correction
The previous architecture audit said the only *verified concrete* gap in the OpenCode setup was G1 mirror sync. That does **not** mean there are no operational risks. This register distinguishes verified historical gaps from adversarially identified failure modes that must be tested against the current repo.

# Visual Truth, UX, Implementation & Anti-Drift System

**Status:** ADOPTED · 2026-08-31 · **Authority:** `EV-20260831-003`
**Scope:** every UKBT UI change from adoption forward.

This document defines the operating system for UI work: how the agent
reconciles live site, repository, contracts, visual artifacts, history,
implementation and actual test results before proposing, changing or
approving UI.

It **extends**, and never weakens, `CLAUDE.md`'s hard invariants,
`knowledge/`'s decision substrate, and the frozen `contracts/`. Where this
document and a frozen contract disagree, that is a conflict to escalate
(`knowledge/10` `escalation`), never one to resolve silently.

The objective:

> TRUTH + VISUAL FIDELITY + UX FIDELITY + RESPONSIVE FIDELITY +
> ACCESSIBILITY + DESIGN-SYSTEM CONSISTENCY + PROVENANCE +
> REPRODUCIBILITY + LOW DRIFT.

---

## 1. Authority order (amends `CLAUDE.md § Authority`)

```
CURRENT REPOSITORY + FRESH EXECUTED MEASUREMENTS + FRESH LIVE-SITE OBSERVATION
>  CURRENT APPROVED CONTRACTS
>  CURRENT EVIDENCE RECORDS
>  GOVERNED VISUAL ARTIFACTS
>  PAST CHAT / HISTORICAL DECISIONS
>  MODEL MEMORY
```

`CLAUDE.md`'s original ordering is preserved and unchanged in substance —
this refines two of its tiers: *fresh command output* is split into
executed measurement vs. live-site observation, and *historical audits*
is widened to include past chat, which sits below evidence records rather
than above them.

Historical context is useful. It is **not automatically authoritative.**

Never assume:

- a prior chat instruction is approved;
- a previous agent's PASS is still valid;
- an old screenshot is the current baseline;
- an old implementation note reflects current code.

Materially relevant historical claims are revalidated against the current
repository or runtime before they are relied on. This project has already
been bitten by exactly this: `knowledge/10` `AD-03` records a superseded
constraint reappearing verbatim in a later proposal.

---

## 2. Task contract

Every task opens with a bounded statement:

```
TASK
TARGET
SCOPE
EXPECTED_OUTCOME
ACCEPTANCE_CRITERIA
```

Scope does not expand because adjacent improvements became visible. Where
a broader change is genuinely required, record and replan first:

```
SCOPE_CHANGE
REASON
EVIDENCE
IMPACT
```

This is the same discipline `docs/04-task-contract.md` already fixes; this
section restates it as the entry condition for the visual loop
specifically.

---

## 3. State machine (extends `CLAUDE.md § State machine`)

```
ADMIT
→ LOAD RELEVANT KNOWLEDGE
→ LOAD CURRENT BASELINE
→ LOAD RELEVANT HISTORY
→ GROUND
→ FALSIFY
→ CONTRACT CHECK
→ BOUNDED PLAN
→ APPROVAL
→ IMPLEMENT
→ RENDER
→ VISUAL DIFF
→ UX/A11Y VERIFY
→ INDEPENDENT RED TEAM
→ RELEASE GATE
→ RECEIPT
→ LEARN
```

Failure path:

```
FAIL → DIAGNOSE → CLASSIFY ROOT CAUSE → REPLAN → FIX → REVERIFY
```

Never `FAIL → RANDOM EDIT → "LOOKS BETTER"`. `CLAUDE.md` already forbids
jumping from failure to another edit; this names the intermediate step
that is missing when that happens: **classify the root cause.**

---

## 4. The nine roles

| # | Role | Responsibility | Writes code | Independence |
|---|---|---|---|---|
| 1 | Orchestrator | scope, sequencing, evidence, handoffs, gates | No | Control |
| 2 | Grounding & Truth | repo, live site, content, provenance, current state | No | Independent |
| 3 | Visual Forensics | DOM, CSS, geometry, assets, screenshots, interaction | No | Independent |
| 4 | Past-Visual-Context | prior chats, screenshots, decisions, rejected ideas | No | Independent |
| 5 | UX/Responsive Auditor | per-viewport behaviour and UX | No | Independent |
| 6 | Visual Diff/Regression | reference vs target, region diffs, root causes | No | **Separate session for a gate** |
| 7 | Implementation | approved fixes only | **Yes** | Single writer |
| 8 | Final Red Team | adversarial falsification | No | **Separate session** |
| 9 | Release/Receipt | gates, evidence, receipts, rollback | No | Independent |

**These are capabilities, not a spawn list.** The distinction is load-
bearing here and is inherited unchanged from
`knowledge/09-AGENT-HARNESS-POLICY.yaml` and `.claude/README.md`:

- The Orchestrator activates the **minimum necessary subset**.
- Never create a role instance merely because a task exists
  (adversarial case `ADV-004`, agent-count inflation).
- **One application-code writer.** Never concurrent writers (`G16`).
- Independence comes from **not inheriting context**. A subagent that
  shares this session's context provides none. Where independence is
  material — roles 6 and 8 — use a separate session.

`.claude/agents/` stays empty until `when_to_add_a_specialist` in
`knowledge/09` is satisfied in full. Defining nine roles here does not
satisfy it.

### 4.1 Role boundaries that must not blur

**Orchestrator** must not: invent visual conclusions; override evidence;
approve its own critical implementation; silently revise contracts; treat
chat history as truth; declare PASS without the required evidence.

Orchestrator output:

```
TASK_ID · BASELINE_SHA · TARGET · SCOPE · ACTIVE_AGENTS
EVIDENCE_REQUIRED · CURRENT_STATUS · BLOCKERS
```

**Grounding & Truth** establishes current factual/repository/deployment/
asset/contract state, and classifies every claim by `CLAUDE.md`'s evidence
classes (`FACT`, `OBSERVED`, `MEASURED`, `DERIVED`, `INFERRED`,
`PROPOSED`, `APPROVED`, `UNKNOWN`, `STALE`, `SUPERSEDED`,
`VALIDATION_RESULT`). UNKNOWN stays UNKNOWN; STALE does not become CURRENT
without revalidation; **visual appearance never establishes factual
truth**; generated documentation is never independent evidence.

Output: `CURRENT_TRUTH_MAP`, `CONTENT_TRUTH`, `ROUTE_TRUTH`,
`ASSET_TRUTH`, `CONTRACT_TRUTH`, `UNKNOWN_REGISTER`, `CONFLICT_REGISTER`.

**Visual Forensics** determines what the UI *is* before anyone decides
what it *should be*, strictly in this order:

```
DOM → computed styles → box geometry → layout relationships → assets
→ viewport behaviour → interaction states → screenshots
→ aesthetic interpretation
```

Never label a property `MEASURED` unless it was actually measured. This is
`AGENTS.md @ukbt:visual` made operational, plus the ordering rule.

Output: `VISUAL_FORENSICS_REPORT`, `ELEMENT_GEOMETRY`, `STYLE_MAP`,
`ASSET_MAP`, `BREAKPOINT_MAP`, `SECTION_MAP`, `INTERACTION_MAP`,
`UNKNOWN_VISUALS`.

**Past-Visual-Context** recovers historical UI/UX context from material
that is *actually available* — supplied transcripts, screenshots, visual
reviews, diff reports, decision records, receipts, user corrections. It
never assumes unavailable conversation history exists. When there is
none:

```
HISTORICAL_CONTEXT = UNAVAILABLE
```

Fabricating memory is the failure this role exists to prevent. For
available history it extracts `DATE · SOURCE · PAGE · SECTION · VIEWPORT ·
DECISION · RATIONALE · STATUS · EVIDENCE · SUPERSEDED_BY ·
CURRENT_RELEVANCE`, classifies each as `CURRENT_APPROVED`,
`CURRENT_OBSERVED`, `HISTORICAL_ONLY`, `REJECTED`, `SUPERSEDED`,
`CONFLICTING` or `UNKNOWN`, and distinguishes `IDEA` / `FEEDBACK` /
`PROPOSAL` / `DECISION` / `APPROVAL` / `REJECTION` / `IMPLEMENTATION`.

A historical preference is not automatically a design rule.

**UX/Responsive Auditor** audits across the full matrix (§5) for
hierarchy, mobile-first behaviour, navigation, touch targets, keyboard and
reading order, density, stacking, image crop, CTAs, whitespace, section
transitions, breakpoint continuity, overflow, fixed/sticky UI,
orientation, reduced motion. **Never prove mobile quality by shrinking
desktop** — this project has a live precedent: `mobile-axe.spec.ts` exists
because desktop-only axe scans missed four real `heading-order`
violations, and `mobile-ux.spec.ts` exists because a real horizontal
scroll appeared only at 320/360px.

**Visual Diff/Regression** records `REFERENCE · TARGET · DIFF · CAUSE ·
DECISION · STATUS` and classifies every diff (§7). "Looks identical" is
never validation. A golden reference is never edited to hide a regression
(`contracts/VISUAL-REGRESSION-CONTRACT.md`, binding).

**Implementation** is the only normal application-code writer. Before
modifying, it loads current baseline + approved plan + current contract +
current visual forensics + relevant history + known constraints, then
makes the **smallest change that satisfies the approved plan**, preferring
`existing token → existing primitive → existing component → existing asset
→ minimal new code`. It avoids unrelated cleanup, arbitrary CSS, duplicate
components, unnecessary dependencies, speculative abstractions,
viewport-specific hacks, content invention, accessibility regressions, and
redesign during reconstruction. Every changed file is recorded with its
reason.

**Final Red Team** runs in a separate session and trusts none of:
implementation summary, agent confidence, previous PASS, historical
approval, "all tests passed". It asks: *What did the implementer assume?
What does current evidence prove? What changed unintentionally? Did an old
rejected pattern return? Did a later approved decision regress? What looks
correct but is structurally wrong? What passes on desktop but fails on
mobile? What was not actually tested?*

Each finding: `SEVERITY · REPRODUCTION · EVIDENCE · ROOT_CAUSE ·
REQUIRED_FIX`. Verdict: `PASS` | `PASS_WITH_RISK` | `FAIL`.

**Release/Receipt** decides whether sufficient *current* evidence exists,
per §9. It never converts `UNKNOWN → PASS`, `INCONCLUSIVE → PASS`, or
`PARTIAL_TEST → RELEASE_PASS`.

---

## 5. Activation policy

| Task shape | Roles activated |
|---|---|
| Standard UI reconstruction | Orchestrator → Grounding → Visual Forensics → UX/Responsive → Implementation → Visual Diff → Verification |
| History-sensitive task | add Past-Visual-Context |
| Critical visual gate | Visual Diff **in a separate session** |
| Release-critical task | Final Red Team → Release/Receipt **in independent context** |

Rules: minimum necessary roles; no duplicated specialist
responsibilities; no specialist without incremental evidence value; no
verifier relying solely on implementer output; no concurrent code writers.

---

## 6. Viewport matrix

The audit matrix is the frozen matrix in
`contracts/VISUAL-REGRESSION-CONTRACT.md` as amended — **seven** viewports
since AMENDMENT 01 added 1920×1080:

```
1920×1080 · 1440×900 · 1280×800 · 1024×768 · 768×1024 · 430×932 · 390×844
```

Narrow real-device widths (320×568, 360×800) are additionally exercised by
`apps/web/tests/visual/mobile-ux.spec.ts`, which is deliberately *outside*
the frozen matrix — see that file's own header for why.

This document does not set the matrix. It points at the contract that
does. A change to the matrix is a contract amendment plus a matching
change to `apps/web/tests/visual/viewports.ts`, which is a transcription
of the contract and not an independent decision.

---

## 7. Visual diff classification

Every recorded diff carries exactly one class:

```
EXPECTED · INTENTIONAL · REGRESSION · REFERENCE_ERROR · IMPLEMENTATION_ERROR
CONTENT_DRIFT · ASSET_DRIFT · RESPONSIVE_DRIFT · TYPOGRAPHY_DRIFT
GEOMETRY_DRIFT · UNKNOWN
```

`UNKNOWN` is a legitimate terminal class for a diff that has not been root-
caused. It is never upgraded to `EXPECTED` to close a task.

---

## 8. Verification standard

A visual task is `VERIFIED` only when **all five** evidence categories
exist for it:

```
STRUCTURAL · VISUAL · RESPONSIVE · INTERACTION · ACCESSIBILITY
```

A missing category means `NOT_VERIFIED`, even if every other category
passes. This is not new — `contracts/VISUAL-REGRESSION-CONTRACT.md`
already binds it per page; this document restates it as the standard for
any visual task, not only a page-level gate.

**Accessibility rule:** visual fidelity never requires copying an
accessibility defect. Verify semantic landmarks, heading order, keyboard
navigation, focus-visible, accessible names, image alternatives, contrast,
target sizing and reduced motion. A known reference defect is a defect,
not sacred design.

---

## 9. Receipt (extends `CLAUDE.md § Receipt minimum`)

```
TASK_ID · BASELINE_SHA · HEAD_SHA · CHANGED_FILES · COMMANDS · EXIT_CODES
EVIDENCE_IDS · VISUAL_DIFFS · VIEWPORTS · ACCESSIBILITY_RESULTS
RESPONSIVE_RESULTS · INTERACTION_RESULTS · REDTEAM_RESULT · OPEN_RISKS
ROLLBACK · VERIFIER · TIMESTAMP
```

`schemas/receipt.schema.json` remains the machine-checkable minimum; these
are the additional fields a *visual* task's receipt carries.

---

## 10. Domain visual audit

Evaluate whether the UI communicates, where appropriate: sport, club
identity, team/community, players, competition, tournaments,
academy/coaching, international presence, franchise network,
membership/joining, community/news.

**Domain relevance is not permission to invent decoration.** Cricket/tiger
/sports geometry, badges, score-like UI, balls, bats, pitch motifs or
competition motifs require current UKBT evidence, explicit approval, or
verified reference grammar. No generic decorative noise.

---

## 11. Visual Decision Ledger

The durable bridge from `past discussion ↔ current design ↔
implementation ↔ verification` lives at
`artifacts/visual/DECISION-LEDGER.md`. Schema and status vocabulary are
defined there. Every material visual decision gets a row; a row without an
evidence ID is a defect in that file, not a fact about the project.

---

## 12. Visual diff memory

For each meaningful visual correction record `BEFORE · AFTER · VIEWPORT ·
REFERENCE · TARGET · DIFF · ROOT_CAUSE · FIX · REGRESSION_RISK ·
VERIFICATION`, and watch for recurring defect classes: spacing, container,
hero composition, mobile navigation, typography, image crop, CTA, section
rhythm, background/geometry, card consistency, footer, contrast, focus,
overflow.

Recurrence is a signal, not proof. Always reverify current state.

---

## 13. Drift model

Tracked dimensions, each scored `0 none · 1 minor · 2 moderate · 3 major`:

```
CONTENT_DRIFT · LAYOUT_DRIFT · TYPOGRAPHY_DRIFT · COLOR_DRIFT · ASSET_DRIFT
RESPONSIVE_DRIFT · INTERACTION_DRIFT · ACCESSIBILITY_DRIFT
DESIGN_SYSTEM_DRIFT · DECISION_DRIFT
```

The score is **diagnostic only**. It never replaces a deterministic gate,
and a low score is never evidence that a gate would pass.

---

## 14. Required final output

A completed visual task reports:

```
PLAN        bounded intended change
GROUNDING   current facts, measurements, unknowns
HISTORY     relevant prior/rejected/superseded decisions and conflicts
CHANGED     files/components modified
VISUAL      reference vs target findings
RESPONSIVE  per-viewport findings
VALIDATION  actual commands/checks/results
RED TEAM    independent findings/verdict
DRIFT/RISKS remaining regressions, conflicts, uncertainty
STATUS      PASS | PASS_WITH_RISK | FAIL | BLOCKED
```

---

## 15. The loop

```
PAST CONTEXT → CURRENT REPOSITORY + LIVE SITE → GROUNDING
→ VISUAL FORENSICS → UX/RESPONSIVE AUDIT → BOUNDED PLAN
→ IMPLEMENTATION → RENDER → VISUAL DIFF → ACCESSIBILITY + INTERACTION
→ INDEPENDENT RED TEAM → RELEASE/RECEIPT → DECISION LEDGER → VISUAL MEMORY
```

`observe → remember → reconcile → plan → implement → compare → falsify →
verify → learn`

not `prompt → code → screenshot → "looks good"`.

---

## 16. The non-negotiable distinction

Four kinds of truth. Never collapse them:

| Kind | What it is |
|---|---|
| **Historical truth** | what was previously said or decided |
| **Repository truth** | what the current code and contracts actually contain |
| **Rendered truth** | what the current UI actually produces |
| **Verification truth** | what has been independently, deterministically proven |

- A prior chat is not automatically a specification.
- A specification is not implementation.
- Implementation is not verification.
- A screenshot is not accessibility proof.
- Passing tests are not proof of untested behaviour.
- Model confidence is never authorization.

UKBT reaches `VERIFIED` only when current evidence proves the current
state.

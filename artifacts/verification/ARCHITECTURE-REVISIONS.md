# Architecture Revisions Required Before Freeze

**Source:** `artifacts/verification/ARCHITECTURE-REDTEAM.md` ·
**Verdict:** `ARCHITECTURE_VERDICT = REVISE` · **Date:** 2026-08-26

Ten revisions. **None is implemented here** — this is the input to Stage 3
(`prompts/13-contract-freeze.md`), not a change to the architecture. Stage 3 must
apply or explicitly reject each one, with a recorded reason for any rejection.

Ordered by severity.

---

## R1 — Truth gate must check publishability, not presence · **CRITICAL**

**Finding:** F1. **Decisions:** A08, A19.

`sources: ["https://example.com"]` currently satisfies every stated rule. That is
"field exists", not "field has acceptable provenance."

**Apply at Stage 3, enforce at Stage 4:**

| | Check |
|---|---|
| T2 | `sources[]` holds **registry IDs**, not free strings. Unresolvable ID → build fails |
| T3 | Registry entries carry a tier; **T4/T5 sources rejected at the gate**, not discouraged in prose |
| T4 | `validUntil` must be in the future **at build time**. Expired → fails. This is what makes `STALE` mechanically real |
| T6 | `status: approved` requires a recorded **human approver identity**. No named approver → fails |
| T7 | Two-source rule enforced by **distinct registry IDs** — two references to one source is one source |
| T8 | Conflicting sources on one claim → fails. Never silent last-write-wins |
| — | Derived values (e.g. "matches played") inherit the **union** of input provenance and the **earliest** `validUntil` |

**Rejecting R1 means accepting that the gate can be satisfied without a real
source.** That would make A08 decorative, and A08 is the reason this repository's
process exists.

---

## R2 — Truth gate must fail closed · **CRITICAL**

**Finding:** F2. **Decision:** A08.

Nothing currently decides *which fields are organization facts*. If that is an
opt-in list per type, the first field added without registering it **publishes
unchecked, silently, in the publishing direction**.

**Apply:** every string field on an org-fact content type requires provenance
**by default**. Generic copy is explicitly registered as exempt. A new,
unannotated field fails the build.

Fail-closed is the whole difference between a gate and a convention.

---

## R3 — Delete C3; fold its intent into C2 · **HIGH**

**Finding:** F3. **Decision:** A05.

C3 ("no page may assume build-time-only data access"), read literally, forbids
build-time content rendering — which is what Astro content collections *are*,
what A05 chose, and what A01 was selected for. It pushes toward dynamic
rendering, degrading a11y/performance defaults and raising CLS risk against R9.

It also solves a non-problem: a static page can post to a serverless endpoint
with no coupling.

**Apply:** delete C3. If a residue is wanted, extend C2 to read: *"form submission
must be a runtime HTTP call to a configurable endpoint, never a build-time-only
integration."*

**C2 is preserved unchanged** — it is the only one of the three doing real work.

---

## R4 — Close the template → route leak path · **HIGH**

**Finding:** F4. **Decisions:** A07, plus Stage 6/9 ordering.

`artifacts/ui/REFERENCE-ANALYSIS.md` is readable by later stages. If Stage 9
derives its route matrix from it, the padel template's information architecture
becomes UKBT's — courts, coaching, membership tiers, booking — without any single
step looking like an invention.

**Apply:**

- **B1** — reference analysis informs **visual grammar only**; Stage 9's route
  matrix derives from UKBT evidence. Deriving a route from the reference is
  prohibited.
- **B2** — the TEMPLATE / UKBT-FACTS / THIRD-PARTY-ASSETS / PROJECT-CODE /
  CONTENT separation becomes a directory convention with a check, not prose.
- **B3** — no Adelux-derived file enters the repository while BL-02 is open.
  Already true; state it as a gate.
- **B4** — bundled libraries (Bootstrap, jQuery, Font Awesome, Flatpickr, Swiper)
  carry their own licences. The template's licence does not cover them. A10
  currently means none are needed.

---

## R5 — Reduce the workspace to two members · **HIGH**

**Finding:** F5. **Decision:** A06.

| Package | Action | Reason |
|---|---|---|
| `packages/config` | **REJECT** | shared config for one consumer; root-level config does the job |
| `packages/ui` | **DEFER** | extraction needs a second consumer; none exists. The discipline (A09/A10) is a rule, not a package |
| `packages/content` + `packages/truth` | **MERGE** | schema and provenance are one concern; splitting them manufactures a drift surface, against the no-duplication invariant |

**Result:** `apps/web` + one package co-locating content schemas and the truth
gate.

**Carry forward from A07** — schemas authored as plain Zod, importable without
Astro, so the gate runs under bare `vitest` with no site build. That constraint
delivers the isolation the package split was reaching for, more cheaply.

Extraction later costs ~1 hour. Five packages cost attention every day.

---

## R6 — Replace C1 with a decision-time check · **MEDIUM**

**Finding:** F6. **Decision:** A16.

C1 mandates serverless-function support, but `EV-20260826-001` sanctions **two**
routes and the third-party-service route needs none. As written, C1 excludes the
cheapest plausible host (e.g. GitHub Pages) for a capability only one route
requires. Softened to "functions *or* a third-party endpoint", it excludes
nothing and is vacuous.

**Apply:** when the host is chosen (U-11), record which of the two form routes it
supports. **If it supports neither, that is a blocker.** Do not pre-emptively
exclude hosts supporting only the service route.

---

## R7 — Add per-field evidence status to the route matrix · **MEDIUM**

**Finding:** F9. **Decision:** Stage 9 mechanics.

`STATUS = BLOCKED_ON_EVIDENCE` is per-page. Real pages are *partially* blocked —
an About page with sound layout and an unsourced founding date. With no
vocabulary for that, the likely failure is the page shipping with its blocked
field quietly filled.

**Apply:** page status is per-field. The truth gate — not the matrix — enforces
it. The matrix reports; the gate blocks.

---

## R8 — Add `WEAK_EVIDENCE` and reclassify Stage 1's heuristics · **MEDIUM**

**Finding:** F10. **Decision:** validation model.

Stage 1 reported six checks as `PASS`. The invented-fact and year-literal scans
are greps against a fixed word list — *"the club began life as…"* passes cleanly.
Reporting them with the same word as a deterministic integrity check flattens a
real difference in evidential strength.

**Apply:** add `WEAK_EVIDENCE` to the status vocabulary (`NOT_RUN` · `ABSENT` ·
`PASS` · `WEAK_EVIDENCE` · `FAIL` · `UNKNOWN` · `BLOCKED`) and reclassify those
three. Real assurance comes from R1/R2, not from grep.

---

## R9 — Pick one lint toolchain · **LOW**

**Finding:** F7. **Decision:** A13.

"ESLint+Prettier *or* Biome" is a deferred choice in the grammar of a decision. A
contract item whose value is a disjunction has no `REVERSAL_CONDITION` because it
has no position, and Stage 3 cannot freeze it.

**Apply:** name one, or move A13 out of the register into open questions.
*Recommendation, offered as such:* Biome — one tool, one config, less setup
surface for a small team. Either is defensible; the requirement is that one is
chosen.

---

## R10 — Stop deriving the engine bound from container evidence · **LOW**

**Finding:** F8. **Decision:** A04.

Stage 1 declared the container fingerprint non-transferable and expiring at
session end, then derived `>=22.11 <23` from it. The hard upper bound breaks the
install the first time anyone moves to the next LTS.

**Apply:** `>=22.11`, no speculative upper bound; pin the development version via
`.nvmrc` / `packageManager`; let the Stage 4 CI matrix produce real compatibility
evidence.

---

## Also carried into Stage 3 (not numbered revisions)

- **Elevate to `REQUIRED`:** content stays Markdown/YAML with a typed schema.
  This is what keeps every CMS option open at near-zero cost, and it is the
  constraint most likely to be violated silently.
- **Make deliberate:** the Stage 5 → Stage 6 ordering protects the design system
  from an unlicensed reference. Stage 1 got this benefit by accident; Stage 3
  should state it as intent.
- **Zero-cost i18n hygiene (not i18n):** user-facing copy lives in content/data,
  not as string literals in components. Good practice for a content-first site
  regardless, and the largest driver of localisation cost if violated.
- **Register:** U-22 (source-registry ownership and admissibility), U-23 (named
  human approver for org facts), U-24 (which form route, and host support).

# Architecture Red Team — Stage 2

**Prompt:** `prompts/12-architecture-redteam.md` · **Date:** 2026-08-26
**Head under attack:** `8684938` · **Object:** all Stage-1 artifacts, the 20
decisions, constraints C1–C3, the four evidence records, and the proposed
five-package workspace.

**Posture:** the Stage-1 proposal is assumed wrong until it survives attack.
Plausibility is not a `PASS`. No application code was changed; nothing was frozen;
no `UNKNOWN` was resolved; no unanswered question was read as approval.

---

## 1. Decision-by-decision attack (20/20)

### A01 — Framework: Astro 5.x · **PASS**

- **EVIDENCE** — content-first requirement (`REQUIREMENT`), WCAG 2.2 AA (A15),
  strong SEO/AEO (R1–R14), JS/TS-comfortable maintainers (`EV-…-003`).
- **ASSUMPTIONS** — that zero-JS-by-default meaningfully helps a11y/perf; that
  Astro's adapter story makes A05's hedge cheap.
- **COUNTEREXAMPLE ATTEMPTED** — *"Eleventy is simpler and has less churn."* True,
  but Eleventy has no component model, and A09/A10 require reusable typed
  primitives with token discipline. *"Next.js is more general."* Generality is
  the cost here, not the benefit: it defaults to a server runtime the project
  does not want and would have to be configured away from.
- **FAILURE MODE** — Astro major-version churn breaking the build annually.
  Mitigated by lockfile + CI, not by framework choice.
- **REVERSIBILITY** — Expensive (pages, layouts, build). Mitigated by keeping
  content portable and framework-free (see A06/A07 revision).
- **VERDICT: PASS.** Survived. The maintainer-fit objection, which was Stage 1's
  own stated largest risk, is closed by `EV-…-003`.

### A02 — TypeScript `strict: true` · **PASS**
Nothing to attack. `strict` is cheaper at line 0 than at line 10,000, and
`EV-…-003` confirms maintainer capability. **PASS.**

### A03 — pnpm, pinned via `packageManager` · **PASS**
- **COUNTEREXAMPLE ATTEMPTED** — *"pnpm's value is workspaces; if A06 collapses to
  two members or one, npm would do."* Partially lands. But `packageManager`
  pinning, strict node-linking (which catches phantom dependencies), and cheap
  workspace support if we ever want it, all hold at any size. Cost of choosing
  pnpm and not needing workspaces ≈ zero. **PASS.**

### A04 — Node engine `>=22.11 <23` · **REVISE**
- **CIRCULAR REASONING FOUND.** `contracts/`-adjacent Stage-1 text states the
  container fingerprint is "not evidence about any developer or CI machine" and
  expires at session end — and then A04 derives a pinned engine range from that
  same fingerprint (`v22.22.2`). Stage 1 declared its evidence `STALE` and used
  it anyway.
- **FAILURE MODE** — the hard upper bound `<23` fails the install the moment a
  contributor or runner moves to the next LTS. An engine bound is a *support*
  statement; here it is an accident of which container ran Stage 1.
- **REQUIRED REVISION** — express as `>=22.11` with no speculative upper bound;
  pin the *development* version via `.nvmrc` / `packageManager`; let the CI
  matrix (Stage 4) produce the real compatibility evidence.
- **SEVERITY** — Low impact, but it is a clean instance of using evidence one has
  already classified as non-transferable. **VERDICT: REVISE.**

### A05 — Static-first with preserved forms escape hatch · **PASS**
Attacked in full at §3 and §4. The decision survives; two of its three
constraints do not. **VERDICT: PASS** (decision), constraints revised separately.

### A06 — Five-package pnpm workspace · **REVISE (five-package shape REJECTED)**
Full analysis at §2. **VERDICT: REVISE.**

### A07 — Astro content collections, Zod-typed · **PASS (coupled to A06)**
- **COUNTEREXAMPLE ATTEMPTED** — *"Content collections are framework-specific;
  they lock content to Astro."* Lands partially, and it matters because A01's
  reversibility mitigation depends on content being portable. But the *data* stays
  Markdown/YAML on disk; only the loader and schema binding are Astro-shaped.
  Migration cost is the schema layer, not the corpus.
- **REQUIRED CONSTRAINT (carried into Stage 3)** — Zod schemas must be authored as
  plain Zod, importable without Astro, so the truth gate can validate the corpus
  in a bare `vitest` run with no site build. This is what makes the gate testable
  in isolation, and it is a stronger guarantee than a package boundary.
- **VERDICT: PASS**, conditional on that constraint.

### A08 — Truth layer, provenance per publishable claim · **REVISE**
The requirement is right; the specification is vacuous. Full attack at §9.
**VERDICT: REVISE.**

### A09 — CSS custom-property tokens + scoped component CSS · **PASS**
- **COUNTEREXAMPLE ATTEMPTED** — *"Tailwind would be faster and is well-known."*
  It would also import a spacing/type scale that must later be reconciled with
  real brand evidence (U-05), and A10 exists precisely to avoid that. Custom
  properties also make the "swap when brand arrives" story a single-file diff,
  which is the stated goal. **PASS.**

### A10 — Local primitives, no third-party UI library · **PASS**
Directly serves U-05 remaining open. Note for Stage 6: reading the reference's
grammar does **not** license adopting its Bootstrap dependency. **PASS.**

### A11 — Vitest · **PASS**
Standard, fast, and — with the A07 constraint above — able to test the truth gate
without a site build. **PASS.**

### A12 — Playwright + `@axe-core/playwright` · **PASS**
- **ATTACKED** — *"axe is automated a11y theatre; it catches ~a third of issues."*
  Correct, and Stage 1 already says so explicitly and requires manual keyboard
  traversal alongside it. The claim being made is appropriately narrow. **PASS.**

### A13 — "ESLint+Prettier *or* Biome — not both" · **REVISE**
- **THIS IS NOT A DECISION.** It is a deferred choice written in the grammar of a
  decision. Stage 3 cannot freeze "either/or"; a contract item whose value is a
  disjunction has no `REVERSAL_CONDITION` because it has no position.
- **REQUIRED REVISION** — pick one at Stage 3, or move A13 out of the decision
  register and into the open-questions list. Recommendation, stated as a
  recommendation and not a finding: Biome, on the grounds of one tool, one
  config, and materially less setup surface for a small team — but either is
  defensible and the point is that *one* must be named.
- **VERDICT: REVISE.**

### A14 — JSON-LD emitted only from truth-gated typed content · **PASS**
The single strongest decision in the register. It closes the highest-leverage
bypass: hand-authored structured data would let an unsourced claim reach search
and answer engines without ever meeting the gate, and machine-read output is the
least likely to be caught by human review. **PASS — preserve verbatim.**

### A15 — WCAG 2.2 AA · **PASS**
- **ATTACKED** — *"U-08 says nobody asked for this; it is an invented requirement."*
  Sharp, and worth answering precisely: A15 is not presented as a client fact, it
  is presented as a proposed standard, and U-08 correctly records that no client
  confirmed it. Treating it as binding under an unconfirmed requirement is
  justified by asymmetry — retrofitting a11y costs far more than building to it,
  and the downside of over-delivering is small. **PASS**, with U-08 staying open.

### A16 — Hosting: static + preview deploys + function support · **REVISE**
C1 over-constrains. Full attack at §3. **VERDICT: REVISE.**

### A17 — GitHub Actions, full gate set per PR · **PASS**
Repo is already on GitHub; no competing evidence. Note this is `PROPOSED` and
currently `ABSENT`, not passing — see §11. **PASS** as a decision.

### A18 — No CMS initially, Git-based authoring · **PASS (decision) / UNKNOWN (need)**
Full attack at §6. **VERDICT: PASS**, with the underlying need explicitly
`UNKNOWN`.

### A19 — Images: build-time optimisation, dimensions, licence per asset · **REVISE**
- **VACUITY FOUND, same class as A08.** "Licence recorded per asset" has no
  mechanism. A frontmatter field `licence: "ok"` satisfies it. Without a
  registry and a gate, this is a comment, not a control.
- **REQUIRED REVISION** — asset licence must resolve against the same source
  registry as textual provenance, and the build must fail on an asset whose
  licence entry is missing, expired, or unresolvable. Photographs of identifiable
  people additionally require a consent record, which Stage 1 correctly
  identifies as an org fact rather than an asset attribute.
- **VERDICT: REVISE.**

### A20 — i18n: none, English only · **PASS**
Full attack at §5. The requester's decision stands and is not the red team's to
overturn. One zero-cost hygiene item is separated out from it. **VERDICT: PASS.**

---

## 2. The five-package workspace — **REJECTED**

Proposed: `apps/web` · `packages/content` · `packages/truth` · `packages/ui` ·
`packages/config`.

### Consumer analysis — the decisive test

| Package | Actual consumers today | Independent release cadence | Independently useful |
|---|---|---|---|
| `packages/content` | 1 (`apps/web`) | no | no |
| `packages/truth` | 1 (`apps/web`) + CI | no | **yes** (gate runs standalone) |
| `packages/ui` | 1 (`apps/web`) | no | no |
| `packages/config` | 1 (`apps/web`) | no | no |

**A package with exactly one consumer and no independent release cadence is a
directory with extra ceremony.** Four of the five qualify.

### The Stage-1 justification is partly circular

Stage 1 argued: *"buried inside `apps/web`, provenance becomes a lint rule someone
disables under deadline pressure rather than a gate that fails the build."*

That does not follow. **The gate's enforcement power comes from being wired into
`build` and CI, not from its package boundary.** A `src/truth/` module invoked by
the build script fails exactly as hard as `packages/truth`. Nothing about a
package boundary prevents someone deleting a build step — and deleting a build
step is the actual feared action. The argument attributes to package structure a
property that comes from build wiring.

**What a package boundary *does* buy, genuinely:** mechanically-enforced
dependency direction. `packages/truth` *cannot* import from `apps/web`; the
resolver forbids it. That prevents the real failure where the gate grows a
dependency on page internals and stops being testable in isolation.

**But that benefit is also available more cheaply** — an ESLint
`import/no-restricted-paths` rule, or simply the A07 constraint (schemas authored
as plain Zod, importable without Astro), gets the same isolation guarantee inside
a single package.

### `content` and `truth` as separate packages is actively harmful

This is the finding that matters most, and Stage 1 got it backwards.

Provenance is not adjacent to the content schema — `sources[]`, `lastVerified`,
`validUntil` and `status` are **fields on every content type**. Schema and
provenance rules must co-evolve on every change. Splitting them across two
packages creates two places to edit one concern, which is precisely the
*"second competing source of truth"* that `prompts/02-contract-freeze.md` and
`CLAUDE.md`'s no-duplication invariant prohibit.

**Splitting `content` from `truth` does not enforce the boundary. It creates a
drift surface.**

### Option comparison

| | **A** = `apps/web` + one content-and-truth package | **B** = A + `packages/ui` | **C** = five packages |
|---|---|---|---|
| Consumers justifying the split | 1 real (gate isolation) | still 1 app | still 1 app |
| Dependency direction enforced | ✅ where it matters | ✅ | ✅ everywhere, mostly pointlessly |
| TS project-reference complexity | low | medium | **high** — 5 tsconfigs, build ordering |
| Build orchestration | one graph edge | two | four, with ordering constraints |
| Test complexity | gate tests run standalone | same | same, plus 5 test configs |
| Deployment complexity | unchanged | unchanged | unchanged |
| Cognitive load | low | medium | **high for a site with zero pages** |
| Duplication risk | **low** — schema+provenance co-located | low | **high** — content/truth drift |
| Future extraction cost | ~1 hour per extraction | ~1 hour | already paid, cannot un-pay |
| Premature abstraction | no | borderline | **yes** |

### Verdict

**A is sufficient. Say it plainly: A is sufficient.**

- **`packages/config` — REJECT.** Shared configuration for one consumer is pure
  ceremony. Root-level `tsconfig.json` / lint config does the same job.
- **`packages/ui` — DEFER.** Extraction is justified when a second consumer
  exists (a docs site, a Storybook target, a second app). None does. Note the
  design-system discipline (A09/A10, tokens never hard-coded) delivers the actual
  goal, and it is a *rule*, not a package.
- **`packages/content` + `packages/truth` — MERGE INTO ONE.** For the reason
  above: they are one concern, and separating them manufactures drift.
- **`apps/web` + one content/truth package = the minimum defensible architecture.**

**Extraction cost if we are wrong is ~1 hour** (directory move, tsconfig path,
`package.json`). The cost of being wrong in the other direction — five packages
that must all be maintained, ordered, and understood before the first page
exists — is paid every day and cannot be refunded. Asymmetry favours A.

Naming is not the red team's call; co-location is. Either name works provided
schemas and provenance live together.

**FIVE_PACKAGE_VERDICT = REJECTED. MINIMUM_DEFENSIBLE_ARCHITECTURE = A.**

---

## 3. The three form constraints

### C1 — "Host must support serverless functions" · **REVISE**

- **Is it required now?** No. No form exists.
- **THE FALSIFICATION LANDS.** `EV-…-001` records the requester's route as
  *"a service **or** serverless functions."* The third-party-service route needs
  **no** function support — a static page posting to Formspree works on any host,
  including GitHub Pages. C1 as written mandates a capability that only one of
  the two sanctioned routes requires, and in doing so eliminates the cheapest
  plausible host for a community club on no budget.
- **AND IT IS SIMULTANEOUSLY VACUOUS if softened.** "Supports functions *or*
  allows posting to a third party" constrains nothing, because every host allows
  the latter. A constraint that excludes no option is not a constraint.
- **REQUIRED REVISION** — replace the standing constraint with a decision-time
  check, which is non-vacuous and honest: *when the host is chosen (U-11), record
  which of the two form routes it supports. If it supports neither, that is a
  blocker. Do not pre-emptively exclude hosts that support only the service
  route.*
- **VERDICT: REVISE.**

### C2 — "Forms sit behind an adapter boundary" · **PASS**

- **ATTACKED as unnecessary abstraction.** *"An adapter for one form, with one
  implementation, that may never be swapped, is speculative generality."* This is
  the strongest available objection and it does not survive contact with the
  actual cost: the adapter here is **one module exporting one function** —
  `submitForm(payload): Promise<Result>`. That is not an abstraction layer, it is
  a named function. The alternative — a `fetch()` with a hard-coded vendor URL
  inlined in a component — is not simpler in any meaningful sense and is exactly
  what makes the swap expensive.
- **AND IT IS THE ONLY CONSTRAINT DOING REAL WORK.** C2 alone delivers what
  `EV-…-001` actually asked for: service-vs-function becomes a configuration
  change. **VERDICT: PASS — preserve.**

### C3 — "No page may assume build-time-only data access" · **REVISE (near-reject)**

- **THIS CONSTRAINT IS HARMFUL AS WRITTEN.** Read literally, it forbids pages
  from reading content at build time — which is precisely what a static site
  *should* do and exactly what Astro content collections *are*. Complied with
  literally, C3 pushes toward client-side or server-side fetching, which
  **contradicts A05**, degrades the performance and a11y defaults A01 was chosen
  for, and increases CLS risk against R9.
- **AND IT SOLVES A NON-PROBLEM.** Form endpoints are orthogonal to page data
  access. A fully static, build-time-rendered page can post to a serverless
  endpoint with no coupling whatsoever. There is no mechanism by which build-time
  content rendering forecloses adding a form handler later.
- **DIAGNOSIS** — C3 is C2 restated imprecisely, and the imprecision inverts its
  effect.
- **REQUIRED REVISION** — delete C3. If a residue is wanted, fold it into C2:
  *"form submission must be a runtime HTTP call to a configurable endpoint, never
  a build-time-only integration."* That is true, narrow, and does not touch page
  rendering.
- **VERDICT: REVISE.**

**FORM_CONSTRAINT_VERDICT = C1 REVISE · C2 PASS · C3 REVISE (fold into C2).**

---

## 4. Static-first — **PASS**

*"Static-first" is not "static-only"*, and the architecture is tested against
that reading.

| Future capability | Supported without rewrite? | Route |
|---|---|---|
| Contact / newsletter forms | ✅ | C2 adapter → service or function |
| Serverless handlers | ✅ | Astro adapter, added incrementally |
| External API consumption | ✅ | build-time fetch, or client island |
| CMS / content editing | ✅ | Git-backed CMS mounts on Markdown/YAML (A18) |
| Dynamic data (fixtures feed) | ✅ | scheduled rebuild, or a client island |
| **Authenticated / admin functionality** | ❌ **rewrite** | would require a server runtime |

**The last row is the honest one.** Login/booking/payments *were* offered and
declined (`EV-…-001`). If they arrive, this is a rewrite. That is an accepted,
recorded risk — not an oversight — and the red team's job is to keep it visible
rather than to relitigate it.

**Counter-attack — are we designing for hypotheticals?** Partly, and that is what
C1 and C3 were: architecture for features nobody has asked for. C2 survives
because its cost is one function. C1 and C3 do not, and are revised above. The
remaining design is not speculative.

**STATIC_FIRST_VERDICT = PASS.**

---

## 5. English-only — **PASS**, with one zero-cost separation

**Reversal cost, quantified** (the red team's actual job here):

| Route | Cost now | Cost to reach bilingual later |
|---|---|---|
| **English-only (chosen)** | 0 | routing rework + `lang` field migration across every content entry + typeface re-evaluation + copy extraction from components |
| i18n-shaped routing now | ~half a day | routing already shaped; content migration + translation remain |
| Full i18n now | days, plus doubled sourcing | n/a |

**Does the current architecture accidentally make localisation
disproportionately expensive? Not yet — but Stage 4 could make it so**, and
that is a finding rather than a hypothetical:

- **The expensive part is not routing. It is content-entry migration.** Adding a
  `lang` field to a populated corpus means touching every entry.
- **There is a zero-cost subset of i18n-readiness that is not i18n**, and
  declining i18n should not be read as declining it: *user-facing copy lives in
  content/data, not as string literals inside components.* This costs nothing,
  is good practice for a content-first site regardless, and is the single
  largest driver of localisation cost if violated.

**Recorded as a Stage-4 hygiene rule, not as an i18n implementation.** No i18n
was implemented, proposed, or scaffolded. The requester's decision stands.

**I18N_VERDICT = PASS** (decision upheld; reversal cost quantified; one
zero-cost hygiene item separated out).

---

## 6. CMS — **UNKNOWN**

Evaluated on available evidence only:

| Option | Evidence for | Verdict |
|---|---|---|
| **No CMS** | no named editor exists (U-12 open) | **correct for now** |
| Git + content collections | matches A07; authoring by JS/TS-comfortable maintainers (`EV-…-003`) | **chosen by default, not by preference** |
| Headless CMS | none | premature |
| Hybrid | none | premature |

**The prompt's caution is correct and worth restating:** the possible existence of
a non-technical editor is evidence for *investigation*, not evidence for a CMS.
U-12 asks whether such a person exists; even a "yes" would then need a second
question — how often they edit, and whether a PR-based flow is genuinely
unworkable for them.

**Elevate to `REQUIRED` at Stage 3:** content stays Markdown/YAML with a typed
schema. This is what keeps every CMS option open at near-zero cost, and it is
also the constraint that would be silently violated first.

**Non-negotiable if a CMS ever arrives:** it submits to the same gate. A CMS that
can publish an unsourced claim has defeated A08 entirely.

**CMS_VERDICT = UNKNOWN** (no CMS now; need unevidenced; reversibility preserved).

---

## 7. Licence dependencies (BL-02 stays OPEN)

BL-02 was **not** resolved from the requester's stated intent to supply a record,
from marketplace assumptions, from memory, or from generic ThemeForest licensing
knowledge. `EV-20260826-004` is classified `UNKNOWN` and stays that way.

**Can proceed without BL-02** — A01–A05, A06 (as revised), A07, A08, A11–A15,
A17–A20; Stage 3 (contract freeze) in full; Stage 4 (foundation) in full.

**Blocked by BL-02** — Stage 6 (reference analysis) entirely; any use of Adelux
markup, CSS, JS, fonts, or image assets; any derivative of its visual design.

**Deliberately not blocked** — Stage 5 (design system). Tokens and primitives
derived from first principles need no licence. **The pipeline ordering that runs
Stage 5 before Stage 6 is protective and should be preserved**: it means the
design system cannot be contaminated by an unlicensed reference, because it is
built before the reference is ever opened. Stage 1 did not claim this benefit;
it appears to be accidental, and it should be made deliberate in Stage 3.

**One caution:** Stage 5 must not be *verified as complete against brand*, since
U-05 (brand assets) is open. It can be complete as a *system* with replaceable
placeholder values. That is A10's entire purpose.

**LICENCE_DEPENDENCIES = Stage 6 + all Adelux-derived material. Nothing else.**

---

## 8. Organization-fact handling (BL-01 stays OPEN) — **PASS**

Tested: can the architecture be built without inventing club history, players,
fixtures, results, trophies, sponsors, leadership, statistics, claims, or contact
information?

**Yes.** Every structural decision (A01–A07, A09–A13, A16–A20) is independent of
any UKBT fact. The gate (A08), the token system (A09/A10), the test layers
(A11/A12), and the route mechanics are all buildable against an empty corpus.

**`UNKNOWN` is first-class in the design:** it is a classification in the evidence
schema, a `status` value on every content entry, and — critically — the *default*
under the fail-closed revision at §9.

**Blocked by BL-01** — Stage 7 content, Stage 9 pages, A14 with real data, and
brand values within Stage 5 (U-05).

**One structural finding.** Stage 9's route matrix has `STATUS = BLOCKED_ON_EVIDENCE`,
which is right. But a page can also be *partially* blocked — an About page whose
layout is fine and whose founding date is unsourced. The matrix has no vocabulary
for that, and the likely failure is a page shipping with its blocked field quietly
filled. **Required revision:** page status must be per-field, not per-page, and
the truth gate — not the matrix — is what enforces it.

**ORGANIZATION_FACT_DEPENDENCIES = all content; no structure.**

---

## 9. Truth / content architecture — **REVISE** (most serious finding)

The requirement is correct. **The specification is vacuous**, in exactly the way
the prompt names.

### The vacuity

Stage 1 requires every content type to carry `sources[]`, `lastVerified`,
`validUntil`, `status`. A Zod schema enforcing `sources: z.array(...).min(1)`
proves **only that a non-empty array exists**. This passes:

```yaml
sources: ["https://example.com"]
status: approved
```

That is "field exists", not "field has acceptable provenance and publishability."
An agent under deadline pressure — or a careless human — satisfies it in seconds.

### The worse trap: how does the gate know which fields are org facts?

Unaddressed in Stage 1. If org-fact fields are an **opt-in list per type**, then
the first time someone adds a field and forgets to register it, that field
publishes **unchecked** — and nothing fails. The gate defaults to permitting.

**This is the single most dangerous property in the proposal**, because it fails
silently and in the publishing direction.

### Required revisions

| # | Revision | Class of check |
|---|---|---|
| T1 | **Fail closed.** Every string field on an org-fact content type requires provenance *by default*; generic copy must be explicitly registered as exempt. Adding a field with no annotation → build fails | non-vacuous |
| T2 | `sources[]` entries resolve to IDs in a **source registry** carrying tier (T1–T5) and URL — not free-text strings. Unresolvable ID → fail | non-vacuous |
| T3 | T4/T5-tier sources are **rejected at the gate**, not merely discouraged in prose | non-vacuous |
| T4 | `validUntil` must be in the future **at build time**. Expired → fail. This is what makes `STALE` mechanically real rather than aspirational | non-vacuous |
| T5 | Placeholder sentinel absent from production builds | non-vacuous |
| T6 | `status: approved` requires a recorded **human approver identity**. An entry approved with no named approver → fail | non-vacuous |
| T7 | Two-source rule (founding facts, honours, headline statistics) enforced by count **and** by distinct registry IDs — two references to the same source is one source | non-vacuous |
| T8 | Conflicting sources on one claim → fail, never silent last-write-wins | non-vacuous |

### Also tested

- **Template content leaking into UKBT content** — see §10.
- **Provenance loss through transformation** — a derived value (e.g. "matches
  played", computed from fixtures) must inherit the union of its inputs'
  provenance and the *earliest* `validUntil`. Not specified in Stage 1. Add.

**TRUTH_MODEL_VERDICT = REVISE.** The requirement stands; the mechanism must be
rebuilt to check publishability rather than presence, and must fail closed.

---

## 10. Template boundaries — **REVISE**

The four-way separation the prompt asks for — TEMPLATE MATERIAL · UKBT FACTS ·
THIRD-PARTY ASSETS · PROJECT CODE · CONTENT — **is currently expressed nowhere as
a directory rule or a gate.** It exists only as prose intent. That is not a
boundary.

**The leak path nobody has closed.** Stage 6 produces
`artifacts/ui/REFERENCE-ANALYSIS.md`. That is an artifact, and artifacts are
readable by later stages. If Stage 9 derives its route/content matrix from that
analysis, **the padel template's information architecture becomes UKBT's** —
courts, coaching, membership tiers, booking — without any single step ever
looking like an invention.

Stage 1 avoided this correctly in its own content model (it explicitly refused
the template's section names). But nothing *prevents* a later stage from doing
what Stage 1 declined to do.

**Required revisions:**

| # | Revision |
|---|---|
| B1 | Reference analysis informs **visual grammar only**. Stage 9's route matrix must derive from UKBT evidence; deriving a route from the reference is prohibited |
| B2 | The four-way separation becomes a directory convention with a check, not prose |
| B3 | No Adelux-derived file enters the repository while BL-02 is open — already holding, now stated as a gate rather than a decision |
| B4 | Bundled third-party libraries (Bootstrap, jQuery, Font Awesome, Flatpickr, Swiper) each carry their own licence. If any is ever adopted, it is recorded independently — the template's licence does not cover them, and A10 currently means none are needed |

**The template must never be a source of UKBT factual truth.** Currently true;
not currently *enforced*.

---

## 11. Validation — **REVISE**

**No CI workflow exists. That is `ABSENT`, and it is not being called `PASS`.**

| Gate | Now | Belongs | Evidence required |
|---|---|---|---|
| Scaffold self-test | **PASS** (ran, exit 0) | local + CI | command + exit code |
| Install / lockfile | `ABSENT` | CI (Stage 4) | frozen-lockfile install |
| Typecheck, lint, unit | `ABSENT` | local + CI | exit codes |
| Content schema, truth gate, placeholder | `ABSENT` | local + CI | exit codes + failing-case proof |
| Build, routes, links, SEO | `ABSENT` | CI | exit codes |
| a11y, E2E | `ABSENT` | CI | per-route results |
| Secret scan | `ABSENT` (heuristic run once) | CI | tool + version |

### Self-critical finding on Stage 1's own receipt

Stage 1 reported six checks as `PASS`. **Three of those overstate their power.**
The invented-fact scan and year-literal scan are greps against a fixed word list.
A grep for `"founded in"` proves nothing about a fact invented with different
phrasing — *"the club began life as…"* passes cleanly.

These are **weak heuristics reported with the same word as a deterministic
integrity check**, which flattens a real difference in evidential strength. They
should be recorded as `PASS (heuristic, low power)`, and the underlying assurance
should come from T1's fail-closed gate once it exists — not from grep.

This is Stage 1 marking its own homework with a tool that cannot fail in the
interesting case. It is not fabrication — the commands ran and the exit codes are
real — but the *classification* is generous.

**Required revision:** add `WEAK_EVIDENCE` alongside `NOT_RUN` / `ABSENT` /
`PASS` / `FAIL` / `UNKNOWN` / `BLOCKED`, and reclassify those three.

**VALIDATION_MODEL_VERDICT = REVISE.**

---

## 12. Agent / harness complexity — **PASS**

| Role | Separate agent justified? | Reasoning |
|---|---|---|
| IMPLEMENTER | — | baseline |
| VERIFIER | **separate *session*, not a subagent** | the value is context non-inheritance; a subagent sharing this context delivers none of it |
| VISUAL VERIFIER | **no** | same verifier role with different tools. Splitting it creates a handoff, not an independence gain |

**One session per stage; two sessions at the homepage gate (Stage 8). Zero
subagents.** `.claude/agents/` empty is correct and should stay correct.

Attacked in the other direction — *"is one agent too few for Stage 9's many
pages?"* No. Stage 9 is per-page PLAN→IMPLEMENT→VERIFY→RECEIPT; parallelism there
would multiply concurrent writers, which G16's single-writer rule prohibits.

**The harness is currently reducing drift rather than becoming its own
architecture problem.** The 12 slash commands map 1:1 to prompts with no added
indirection. **HARNESS_VERDICT = PASS.**

---

## 13. Adversarial sweep — what else broke

| Finding | Severity |
|---|---|
| **Circular evidence** — A04 pins an engine range from a fingerprint Stage 1 itself declared non-transferable | Low |
| **Circular reasoning** — A06 attributes to package boundaries an enforcement property that comes from build wiring | Medium |
| **Vacuous validation** — A08 `sources[]` and A19 asset licence both check presence, not publishability | **Critical** |
| **Fail-open default** — no mechanism decides which fields are org facts; unregistered fields publish unchecked | **Critical** |
| **Constraint that inverts its own goal** — C3 pushes toward dynamic rendering while claiming to protect static-first | High |
| **Non-decision in a decision register** — A13 freezes a disjunction | Low |
| **Unenforced boundary** — template/fact/asset/code separation is prose only; Stage 6→Stage 9 leak path open | High |
| **Missing vocabulary** — page status is per-page; partial evidence blocks have no representation | Medium |
| **Generous self-assessment** — heuristic greps reported as `PASS` alongside deterministic checks | Medium |
| **Unspecified derived provenance** — computed values inherit no provenance rule | Medium |

**Checked and found sound:** no unsupported legal claim (BL-02 held open against
a stated intent to supply); no unsupported organization claim (0 invented facts,
independently re-verified); no dependency trap (zero dependencies exist); no
deployment trap beyond C1, revised; no SEO trap — A14 is the strongest control in
the register; no a11y trap — A15's automation limits are stated honestly.

---

## New unknowns raised by this review

| ID | Unknown | Arises from |
|---|---|---|
| U-22 | Who maintains the **source registry**, and what makes a source admissible to it? | T2 |
| U-23 | **Who is the named human approver** for organization facts? `CONTENT-TRUTH-MODEL.md` forbids an agent from signing but never says who does | T6 |
| U-24 | Which of the two form routes will be used, and does the eventual host support it? | C1 revision |

**NEW_BLOCKERS = none.** All ten findings are correctable inside Stage 3; none
prevents Stage 3 from running.

---

## Verdict

```
ARCHITECTURE_VERDICT = REVISE

DECISIONS_TESTED: 20/20
DECISIONS_PASS:   14  (A01 A02 A03 A05 A07 A09 A10 A11 A12 A14 A15 A17 A18 A20)
DECISIONS_REVISE:  6  (A04 A06 A08 A13 A16 A19)
DECISIONS_BLOCK:   0

MINIMUM_DEFENSIBLE_ARCHITECTURE:
  apps/web + ONE package co-locating content schemas and the truth gate

FIVE_PACKAGE_VERDICT:     REJECTED
  packages/config         REJECT  — ceremony for one consumer
  packages/ui             DEFER   — no second consumer exists
  packages/content        MERGE   — splitting it from truth manufactures drift
  packages/truth          KEEP    — as the merged package

FORM_CONSTRAINT_VERDICT:  C1 REVISE · C2 PASS · C3 REVISE (fold into C2)
STATIC_FIRST_VERDICT:     PASS  (auth/booking/payments remain a rewrite — accepted, recorded)
I18N_VERDICT:             PASS  (decision upheld; reversal cost quantified; one zero-cost hygiene item)
CMS_VERDICT:              UNKNOWN  (no CMS now; need unevidenced; reversibility preserved)

LICENCE_DEPENDENCIES:            Stage 6 + all Adelux-derived material. Nothing else.
ORGANIZATION_FACT_DEPENDENCIES:  all content. No structural decision.

TRUTH_MODEL_VERDICT:      REVISE  (vacuous checks; fails open)
VALIDATION_MODEL_VERDICT: REVISE  (heuristics classified as PASS)
HARNESS_VERDICT:          PASS

CRITICAL_FINDINGS:
  F1  Truth gate checks presence, not publishability (A08, A19)
  F2  Truth gate fails OPEN — unregistered fields publish unchecked

NON_CRITICAL_FINDINGS:
  F3  C3 inverts its own goal; pushes toward dynamic rendering
  F4  Template→route leak path open between Stage 6 and Stage 9
  F5  A06 justification is circular
  F6  C1 over-constrains one route and is vacuous if softened
  F7  A13 is a deferred choice written as a decision
  F8  A04 derives an engine bound from evidence declared non-transferable
  F9  Page status is per-page; partial evidence blocks unrepresentable
  F10 Heuristic greps reported as PASS alongside deterministic checks

REQUIRED_REVISIONS:  10  (see ARCHITECTURE-REVISIONS.md)
NEW_UNKNOWN_COUNT:    3  (U-22, U-23, U-24)
NEW_BLOCKERS:         none
NO_APPLICATION_CODE_CHANGED: TRUE
```

**Gate:** verdict is `REVISE`. Per `prompts/12`, Stage 2 is **not** complete,
architecture is **not** frozen, and Stage 3 does **not** start. Stopping here.

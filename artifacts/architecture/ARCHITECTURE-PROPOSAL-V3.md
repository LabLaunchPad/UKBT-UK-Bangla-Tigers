# Architecture Proposal v3 — Minimum Defensible Production Architecture

**Date:** 2026-08-26 · **Supersedes:** v2 (`ARCHITECTURE-PROPOSAL-V2.md`,
`ARCHITECTURE_VERDICT = PASS`), which remains valid background — v3 does not
discard it, it deepens the decisions the requester asked to see justified on
merit and incorporates one new requirement (Cloudflare deployment,
`EV-20260826-018`). **No Adelux-derived visual expression (no CSS value,
token, or component finding from Track A) was used to make any decision
below** — verified by inspection.

Every decision below carries `DECISION → WHY → ALTERNATIVES → EVIDENCE →
REVERSIBILITY → RISK → CONSEQUENCE`, per the requester's explicit format.
Decisions not re-litigated here (A02 TypeScript, A09/A10 tokens/no-UI-lib,
A11/A12 testing tools, A14 JSON-LD-only, A15 WCAG AA, A17 CI, A20 i18n)
carried `PASS` unchanged through v2 and are not reopened — reopening a
decision nobody attacked would itself be a form of drift.

---

## 1. Framework — evaluated on merit, not carried forward by default

**DECISION:** Astro 5.x, static output, with the official `@astrojs/
cloudflare` adapter for the forms escape hatch.

**WHY:** The only durable, evidenced requirements are: content-first pages
(`REQUIREMENT`), WCAG 2.2 AA (`REQUIREMENT`, `A15`), strong SEO/AEO
(`REQUIREMENT`, `A14`), a hard truth gate (`REQUIREMENT`, `A08`), JS/TS-
comfortable maintainers (`EV-…-003`), static-first with a forms hedge
(`EV-…-001`), and now Cloudflare deployment (`EV-…-018`). Astro's
zero-JS-by-default model makes the accessibility and performance
requirements the *default* output rather than something recovered later.
Astro ships an **official, first-party Cloudflare adapter** supporting both
static output and Cloudflare Pages Functions from the same codebase — this
is new, concrete evidence in Astro's favor that v1/v2 did not have, because
the deployment target wasn't known then.

**ALTERNATIVES, evaluated against the same requirements:**

| Alternative | Against Cloudflare + the stated requirements |
|---|---|
| Next.js | Defaults to a server-rendering runtime the requirements don't ask for; Cloudflare's Next.js support (`@cloudflare/next-on-pages`) is a community-maintained compatibility layer, not first-party — a materially different reversibility/risk profile than Astro's official adapter |
| SvelteKit | Has a Cloudflare adapter (`@sveltejs/adapter-cloudflare`), also reasonably strong; loses to Astro specifically on the JS/TS-comfortable-maintainer evidence being unspecific to Svelte, and on zero-JS-by-default being Astro's explicit design center rather than an opt-in |
| Eleventy | No official Cloudflare adapter; would need a hand-rolled Functions setup for the forms hedge, increasing bespoke maintenance surface for no stated benefit |
| Plain HTML + Vite | Simplest possible option; no component model, which A09/A10's token-driven, reusable-primitive design system needs |

**EVIDENCE:** `EV-…-001` (static-first + forms hedge), `EV-…-003`
(maintainer capability), `EV-…-018` (Cloudflare), `A14`/`A15`
(SEO/accessibility requirements), Astro's own published adapter
documentation for `@astrojs/cloudflare` (first-party, actively maintained).

**REVERSIBILITY:** Expensive if wrong — pages, layouts, and the build
pipeline would need rewriting. Mitigated exactly as v1 proposed: content
stays portable Markdown/YAML, framework-specific logic stays out of the
truth-gate package (§4 below), so a future migration's cost is bounded to
the presentation layer.

**RISK:** Astro major-version churn; mitigated by lockfile + CI, not by
framework choice. Cloudflare's edge runtime has some Node API
incompatibilities (documented by Cloudflare/Astro) that could affect a
future serverless function's implementation — a Stage-4-time risk to verify
against the actual form-handling code once written, not an architecture
blocker now, since the current requirement is only that the *adapter path
exists*, not that a function is implemented yet.

**CONSEQUENCE of choosing wrong:** a full rewrite of the presentation layer;
content and truth-gate logic survive because they're framework-independent
by construction (§4).

```
FRAMEWORK = Astro
VERSION = 5.x (latest stable at Stage 4 implementation time — not pinned to
          a specific patch now, since pinning today would go stale before
          Stage 4 runs; the engines/packageManager fields pin the toolchain,
          not the exact Astro patch)
BUILD_MODEL = static output (`output: 'static'`), Cloudflare adapter
              available but not activated until a form is actually built
DEPLOYMENT_MODEL = Cloudflare Pages, static asset deployment, Pages
                   Functions available under the same adapter for C1/C2
CONTENT_MODEL = Astro content collections, Zod schemas, plain-Zod-importable
                (§4's constraint, unchanged from v2)
FORM_MODEL = UI → application interface → Cloudflare Pages Functions
             adapter (§7 below) — not implemented yet, per the gate
ASSET_MODEL = Astro `<Image>` (Sharp-backed internally, §9), self-hosted
              fonts (§6)
TEST_MODEL = Vitest (unit/integration) + Playwright (E2E/visual/a11y),
             unchanged from v1/v2
```

---

## 2. Repository shape — smallest defensible, proof required for anything larger

**DECISION:** `apps/web` + `packages/truth`. **No third package.**

**WHY:** Stage 2's finding stands and is not re-argued here: every one of
the original five packages had exactly one consumer and no independent
release boundary; `content` and `truth` specifically must stay together
because their fields (`sources[]`, `lastVerified`, `validUntil`) co-evolve —
splitting them creates a second source of truth for one concern. v2's name
for the merged package (`packages/core`) is renamed to `packages/truth`
here for clarity of purpose (it is not a general-purpose "core" grab-bag —
its scope is explicitly bounded to content schemas + the truth gate, per
v2's own boundary note).

**ALTERNATIVES:**

| Alternative | Why not, yet |
|---|---|
| Single `apps/web`, no package split at all | Loses the mechanically-enforced dependency direction (the truth gate cannot import page internals) that a package boundary — not a lint rule — actually guarantees. This is the one place a package genuinely earns its keep. |
| Five packages (original v1 proposal) | Rejected at Stage 2 for lack of independent consumers; not revisited, since nothing since has changed that fact |
| `apps/web` + `packages/truth` + `packages/ui` | `packages/ui` deferred at Stage 2 pending a second consumer; still none exists |

**EVIDENCE:** `ARCHITECTURE-REDTEAM.md` (Stage 2's original finding),
`ARCHITECTURE-REDTEAM-V2.md` (verified the merge holds).

**REVERSIBILITY:** Cheap. Extracting `packages/ui` or splitting `content`
back out later costs a directory move and a `tsconfig` path — proven
Stage-2 estimate, unchanged: roughly an hour either direction.

**RISK:** `packages/truth` could still become a dumping ground if its scope
isn't policed. **Mitigation, stated explicitly:** it contains *only*
content schemas and the truth-gate logic. Anything else (UI primitives,
shared lint config, site-specific logic) stays in `apps/web` until a real
second consumer justifies its own package.

**CONSEQUENCE if wrong:** under-splitting costs an hour later; over-splitting
(the original five-package proposal) costs ongoing attention every day
across every package boundary that was never earning it. The asymmetry is
why smaller is preferred absent proof otherwise — and no proof for a third
package exists.

**Monorepo tooling:** pnpm workspaces (unchanged, `A03`) — the workspace
mechanism itself is nearly free (a `pnpm-workspace.yaml` file); the
over-engineering risk was always about *package count*, not the workspace
tool, and two packages does not justify abandoning pnpm workspaces for
anything simpler.

---

## 3. Design-system architecture — ten layers, none collapsed

**DECISION:** the ten layers the requester specifies are adopted verbatim
as the architecture's own layering, each with an explicit location:

| # | Layer | Where it lives | Current state |
|---|---|---|---|
| 1 | Source evidence | `artifacts/extraction/`, `artifacts/source/` (this repo's governance area, **not** `apps/web`) | Frozen (Track A) |
| 2 | Raw tokens | `artifacts/extraction/token-candidates.json` | 61, frozen |
| 3 | Candidate tokens | same file | 20, frozen |
| 4 | Adapted tokens | `packages/truth/tokens/adapted/` (future — Track B) | **0, not created — Track B gated** |
| 5 | Approved tokens | `packages/truth/tokens/approved/` (future — Track B) | **0, not created — Track B gated** |
| 6 | Framework-neutral component contracts | `packages/truth/contracts/` (future — Track B) | **0, not created — component candidates documented, not yet contracted** |
| 7 | Framework adapter | `apps/web/src/components/` (Astro components consuming the contracts) | Not created — depends on layer 6 |
| 8 | UKBT content/truth | `packages/truth/content/` + the truth gate itself | Schema not yet written (Stage 4); zero UKBT facts exist (`BL-01`) |
| 9 | Rendered implementation | `apps/web` build output | Not started |
| 10 | Visual verification | Playwright suite, `apps/web/tests/visual/` (future) | Fingerprint recorded (`RENDER-FINGERPRINT.md`); suite not built |

**WHY this exact boundary between layers 1–3 (repo-root `artifacts/`) and
4–10 (inside the `apps/web`/`packages/truth` application tree):** layers
1–3 are **evidence about Adelux** — they must never be mistaken for UKBT's
own design system, so they live outside the application tree entirely,
in the same governance area as every other evidence record this session
produced. Layers 4 onward are **UKBT's own artifacts**, informed by 1–3 but
not identical to them — this is the literal architectural expression of
"the Adelux extraction is evidence, not automatically the design system."

**ALTERNATIVES:** collapsing layers 1–3 into the application tree (e.g., a
`design-tokens-raw/` folder inside `apps/web`) was considered and rejected —
it would make Adelux-derived evidence indistinguishable at a glance from
UKBT's own approved output, which is exactly the collapse the requester's
instruction prohibits.

**EVIDENCE:** the requester's explicit ten-layer specification;
`knowledge/06-TEMPLATE-BOUNDARY.yaml`'s `token_lifecycle` (RAW → CANDIDATE →
ADAPTED → APPROVED) and `pipeline_stages` (already matches layers 1–3 to
stages 1–2, and 4–10 to stages 3–5).

**REVERSIBILITY:** high — this is a directory convention, not a technology
choice. Moving files between `artifacts/` and `packages/truth/` later is
cheap.

**RISK:** without an enforced rule, someone could still import directly
from `artifacts/extraction/*.json` into `apps/web` at build time, silently
collapsing layers 1–3 into 9. **Mitigation:** a lint/CI rule (Stage 4
implementation detail, named here as a requirement) forbidding any import
from outside `apps/web`/`packages/truth` into the application build.

**CONSEQUENCE if collapsed:** exactly the failure mode Track B exists to
prevent — Adelux's specific values would ship as if they were UKBT's own,
without ever passing through an adaptation decision.

**Honest limitation, stated by the v3 red team:** layers 6 (framework-
neutral component contracts) and 7 (framework adapter) are a **design
intent, not yet proven in code** — zero contracts exist yet (`BL-03`
addresses the architecture; it does not itself build a contract). Whether
"framework-neutral" holds up in practice, or whether Astro-specific
patterns (slots, props typing) inevitably leak into what's supposed to be a
neutral contract, is **unverified until the first real contract is
written** (Track B, once unlocked). This is named honestly rather than
asserted as proven — the architecture *intends* neutrality; Stage 4/Track B
implementation is where that intent is tested.

---

## 4. Truth/content architecture — unchanged from v2, restated for completeness

**DECISION:** `packages/truth` owns both content schemas and the truth
gate; the gate fails closed by default (v2's Truth Gate Mechanism, R1/R2,
unchanged).

**DESIGN_SOURCE ≠ UKBT_TRUTH, enforced structurally:** Adelux's demo content
never enters `packages/truth/content/` at any point — the truth gate has no
input path that reads from `artifacts/extraction/` or the Adelux source at
all. The only inputs the gate accepts are UKBT-authored content files with
registry-ID-backed `sources[]`. This is not a policy statement layered on
top of an otherwise-permissive system; it is the absence of a code path,
which is a stronger guarantee than a rule someone could disable.

**Explicit leak-path closure (per the requester's list — routes, metadata,
SEO, schema.org, components, fixtures, CMS content, structured data,
tests):**

| Surface | How the boundary holds |
|---|---|
| Routes | Stage 9's route matrix derives from UKBT evidence only (`INV-014`); a route cannot exist without a corresponding content entry that passed the gate |
| Metadata/SEO/structured data | `A14` — JSON-LD emitted *only* from typed content that passed the gate; no hand-authored JSON-LD path exists |
| Components | Framework-neutral contracts (layer 6) take *props*, not literal facts — a component cannot render a hard-coded Adelux fact because it has no fact to hard-code; content is always passed in from layer 8 |
| Fixtures/tests | Test fixtures use `__PLACEHOLDER__`-sentinel data (per `CONTENT-TRUTH-MODEL.md`'s placeholder discipline), never real-looking Adelux demo content — a CI check greps for the sentinel's *absence* in production builds and its *presence* in test fixtures where expected |
| CMS content | See §8 — no CMS exists yet; when one does, it submits to the same gate, no exception |

**EVIDENCE:** `CONTENT-TRUTH-MODEL.md`, `knowledge/07-CONTENT-TRUTH-POLICY.yaml`,
`ARCHITECTURE-PROPOSAL-V2.md`'s Truth Gate Mechanism.

**REVERSIBILITY / RISK / CONSEQUENCE:** unchanged from v2 — not re-argued.

---

## 5. CSS architecture — DTCG → Style Dictionary → CSS custom properties

**DECISION, REVERSED from v2:** adopt Style Dictionary as the token
compiler, not a bespoke script. **v2 deferred Style Dictionary; this
supersedes that, on the requester's explicit direction, recorded rather
than silently flipped.**

**WHY the reversal is legitimate and not just compliance-by-default:** v2's
objection was that a multi-platform compiler is unneeded complexity for a
single-platform (web) output. That's still true narrowly, but two things
changed the calculus: (1) the *pipeline shape* — DTCG format flowing through
a compiler into CSS — is identical whether the compiler is Style Dictionary
or a bespoke script, so the "premature complexity" cost is smaller than v2
estimated; a bespoke script is not zero-maintenance, it is *unmaintained-by-
anyone-else* maintenance. (2) Style Dictionary is the de facto standard tool
for exactly this DTCG-format-to-CSS-custom-properties pipeline, which lowers
onboarding cost for the JS/TS-comfortable maintainers (`EV-…-003`) relative
to a one-off script only this project understands.

**Pipeline, exactly as specified:**

```
DTCG-compatible token source (tokens/raw/, tokens/candidate/, tokens/adapted/, tokens/approved/)
        ↓
Style Dictionary (compiles tokens/approved/** ONLY — fail-closed, per the
        token-pipeline rule already established in ARCHITECTURE-PROPOSAL-V2.md)
        ↓
CSS custom properties (--ukbt-color-*, --ukbt-space-*, --ukbt-font-*, etc.)
        ↓
semantic CSS (component-scoped stylesheets consuming the custom properties)
        ↓
framework components (Astro components, layer 7)
```

**ALTERNATIVES:** Tailwind utility classes — explicitly rejected, unchanged
from `A10`/`A09`: importing Tailwind's own spacing/color scale would need
reconciling against real UKBT brand evidence later, which is exactly the
churn the token-driven approach exists to avoid.

**EVIDENCE:** requester's explicit pipeline specification;
`ARCHITECTURE-REDTEAM-ADDENDUM-VISUAL-TOOLCHAIN.md`'s DTCG-format finding
(kept, unchanged — only the compiler choice reversed).

**REVERSIBILITY:** moderate — Style Dictionary's config is itself
data-driven; swapping it for a different compiler later means rewriting one
config file, not the token data.

**RISK:** Style Dictionary is a real dependency with its own upgrade
cadence — accepted, since it's a build-time devDependency with no
production runtime exposure.

**CONSEQUENCE:** none material either way; this was correctly identified in
v2 as a low-stakes decision, which is exactly why the reversal here is
low-risk.

**Cascade preservation, unchanged from the requester's instruction:**
authored CSS relationships are preserved where required for fidelity; no
CSS is modernized or normalized before visual parity is achieved (Track B
work, not yet started).

**Required clarification (added by the v3 red team, §5 finding):**
"fidelity" binds to **visual outcome and cascade behavior**, not to literal
selector structure. Track A found genuinely deep selector nesting in the
source (e.g. `.card-blog.card-blog-post .image-container img`, a 4-level
descendant chain — `CSS-EVIDENCE-GRAPH.md`). Reproducing that exact
selector shape inside UKBT's semantic CSS would import Adelux's
specificity patterns wholesale, which is a real path to the "CSS becomes
unmaintainable" failure mode. **UKBT's semantic CSS may achieve the same
rendered outcome via flatter, more maintainable selectors** (e.g. a
BEM-style class per element) as long as the computed visual result matches
the frozen reference at parity time — the parity gate (§10) checks
*rendered output*, never selector text, so this freedom does not weaken
fidelity.

---

## 6. Fonts and assets

**DECISION:** self-host Lato/Montserrat (or their eventual UKBT
replacements) under their OFL terms; do not depend on `fonts.gstatic.com`.
Astro `<Image>` for all imagery (internally Sharp-backed — no direct Sharp
dependency in `apps/web`, per v2's re-scoping, unchanged).

**WHY:** already established, `ADELUX-CROSS-FRAMEWORK-VERIFICATION.md` Part
9 — resolves the GDPR/third-party-request concern (`U-18`) with no licence
cost (OFL explicitly permits self-hosting) and no dependency added.

**EVIDENCE / REVERSIBILITY / RISK / CONSEQUENCE:** unchanged from that
prior finding; not re-argued.

---

## 7. Forms architecture

**DECISION:** `UI/form → application interface → Cloudflare Pages
Functions adapter`, exactly the layering the requester specifies, now with
a concrete target (Cloudflare) instead of an abstract "serverless function."

**WHY:** `EV-…-001` (C2, unchanged, the one constraint from the original
three that Stage 2 found does real work) plus `EV-…-018` (Cloudflare)
together specify exactly this. The "application interface" layer is the
concrete implementation of C2's "one module, one function" adapter —
`submitForm(payload): Promise<Result>` — that the UI calls, never touching
the Functions API directly.

**ALTERNATIVES:** a third-party form service (Formspree etc., the other
route `EV-…-001` sanctioned) remains available and is a config change under
this same adapter boundary, not a different architecture.

**EVIDENCE:** `EV-…-001`, `EV-…-018`, `ARCHITECTURE-REDTEAM-V2.md`'s R6
finding (host-capability check must be a recorded step) — now moot for
Cloudflare specifically, since Cloudflare Pages Functions is confirmed
available; R6's general principle (verify at host-selection time) stays
correct practice for any future host reconsideration.

**REVERSIBILITY:** high, by construction — this is C2's entire purpose.

**RISK, sharpened by the v3 red team:** the C2 adapter boundary protects
the **UI** from rewrite if the backend changes. It does **not** guarantee
Cloudflare's edge runtime can do whatever a future form eventually needs —
if a real requirement turns out to need a Node API genuinely unavailable at
the edge, the *adapter implementation* changes (e.g., to an external
service reachable via the same interface), not the UI, and not this
architecture. This is the honest limit of what C2 buys: rewrite-avoidance
for the UI, not a guarantee that Cloudflare Functions can do anything ever
asked of it. Accepted as a residual risk, not eliminated by the adapter.

**CONSEQUENCE if this boundary is skipped:** exactly what C2 exists to
prevent — a UI hard-wired to one backend, expensive to change later.

**Explicit, per the gate:** no form is implemented this pass. This section
establishes the boundary a future form will sit behind, nothing more.

---

## 8. CMS boundary

**DECISION, unchanged from v1/v2:** no CMS. Content stays Markdown/YAML
with a typed Zod schema, elevated to `REQUIRED` (not merely implied).

**WHY:** No editorial requirement has been evidenced (`U-12`, still open —
whether a named non-technical editor exists). Adopting a CMS before that
question is answered would be architecture serving a hypothetical user,
exactly what `DR-006` prohibits.

**ALTERNATIVES:** Git-backed CMS (Decap, Tina, Keystatic) — explicitly kept
*available* by the Markdown/YAML + typed-schema choice; a database-backed
CMS is not, and is not being kept available, since it would require
restructuring content storage entirely.

**EVIDENCE:** `ARCHITECTURE-PROPOSAL.md` §13 (unchanged reasoning).

**REVERSIBILITY:** a Git-backed CMS mounts onto exactly this content shape
later, cheaply. A database-backed CMS would not — this is why the content
shape is chosen to keep that door open without walking through it.

**RISK:** if a non-technical editor turns out to be needed urgently, there
is a gap until a CMS is added. **Accepted** — the alternative (guessing a
CMS is needed now) risks building the wrong one.

**CONSEQUENCE:** none currently, since no CMS need has been demonstrated.

**Binding condition, unchanged:** whenever a CMS is added, it submits to
the same truth gate as any other content source — no exception.

---

## 9. Accessibility architecture

**DECISION:** axe-core in CI on every route (`A12`, unchanged) + explicit
keyboard-navigation Playwright tests (automated a11y checks alone catch
roughly a third of real defects, stated plainly in `VALIDATION-MODEL.md`,
not overclaimed here either) + a recorded, binding rule for source defects.

**Source-defect rule, newly formalized per this session's finding:**

> `VISUAL_FIDELITY ≠ BLIND_REPRODUCTION_OF_ACCESSIBILITY_DEFECTS.`
>
> Where Track A finds a source behavior that conflicts with an
> accessibility requirement (e.g. the `.btn-accent` invisible-focus-outline
> `SOURCE_DEFECT`, `INTERACTION-FORENSICS.md`), the source behavior is
> **recorded**, never silently inherited. The Track B adaptation decision
> for that element must explicitly choose preserve-vs-repair and record
> which, with a reason. **The default, absent an explicit reason to
> preserve, is repair** — WCAG 2.2 AA (`A15`, `REQUIREMENT`) outranks visual
> fidelity to a defect.

**EVIDENCE:** `VALIDATION-MODEL.md` (automation-limits honesty),
`INTERACTION-FORENSICS.md` (the concrete `SOURCE_DEFECT` instance).

**REVERSIBILITY/RISK/CONSEQUENCE:** low-risk either way; the rule exists
precisely so this decision is never made by default/accident.

---

## 10. Visual verification architecture

**DECISION:** Playwright mandatory baseline, full 6-viewport matrix
(1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844), pinned
rendering environment (extending `RENDER-FINGERPRINT.md`'s existing
Chromium/Playwright pin to cover locale/timezone/device-scale-factor once
Stage 4 builds the actual suite).

**Required passes, all five, before any page is considered complete:**
structural, visual, responsive, interaction, accessibility — matching the
requester's list exactly.

**Required addition — determinism (v3 red team finding):** visual
regression comparisons run **only CI-vs-CI**, never local-vs-CI. Font
rendering, sub-pixel anti-aliasing, and OS-level hinting differ across
operating systems in ways that produce spurious diffs unrelated to any
real regression — the classic cause of "flaky" visual tests. The CI
runner's OS image is pinned to an exact version (e.g. `ubuntu-24.04`, never
a `-latest` tag that can silently update under the project), and a
reference render is only ever compared against another render from that
same pinned image.

**Anti-vacuity, already established and restated here as binding:**
"looks identical," "tokens match," and "CSS was migrated" are explicitly
**not** visual parity per `knowledge/08-VALIDATION-POLICY.yaml`'s
`visual_fidelity_gate`. **Baselines are never updated to hide a
regression** — a diff is investigated to root cause (token → component →
minimal fix → re-render), never silently accepted by moving the baseline.

**EVIDENCE:** `RENDER-FINGERPRINT.md`, `knowledge/08-VALIDATION-POLICY.yaml`.

**REVERSIBILITY/RISK/CONSEQUENCE:** the suite itself is Stage-4+
implementation; the architecture commitment here is that it is mandatory
and gates page completion, not optional polish.

---

## 11. Third-party dependency boundary

**Unchanged from `THIRD-PARTY-DISPOSITION.md`**, restated as an
architecture-binding rule rather than only a Track A finding: Isotope and
animate.css stay `DO_NOT_ADOPT`. Every other dependency requires individual
disposition before adoption — none is inherited automatically from Adelux,
and Adelux's own rights status (whatever it resolves to) never
retroactively clears a bundled library's *separate* licence (`DR-019`).

**Required addition — enforcement, not just policy (v3 red team finding):**
a documented `DO_NOT_ADOPT` decision is not self-enforcing; a future
contributor could `pnpm add isotope` without reading this document. **CI
must run a dependency-allowlist check** — `package.json` dependencies are
checked against an explicit allowed list, and the build fails on anything
not on it. This turns the policy into a gate, consistent with this
project's own rule that presence of a policy is not the same as
enforcement of one (`DR-018`, applied here to dependencies rather than
content).

---

## 12. Deployment model

**DECISION:** Cloudflare Pages. Static asset deployment from `apps/web`'s
build output; Pages Functions available under the same project for the
forms adapter (§7), not activated until a form exists.

**WHY / EVIDENCE:** `EV-…-018`.

**CI integration:** GitHub Actions (`A17`, unchanged) builds and runs the
full gate set (§ below) on every PR; Cloudflare Pages preview deployments
per PR, production deployment on merge to the default branch — standard
Cloudflare Pages behavior, not a bespoke pipeline.

**REVERSIBILITY:** static output is portable to any static host; the
Cloudflare-specific piece is the Functions adapter for forms, which sits
behind the adapter boundary (§7) precisely so *that* piece — and only that
piece — would need to change if the host ever did.

---

## Gate set (restated, unchanged from v1/v2, now cross-referenced to this document)

Install/lockfile · typecheck · lint (Biome, `A13`) · unit/integration
(Vitest) · content schema · truth gate (§4) · placeholder detection ·
build · route/link integrity · SEO metadata completeness (`A14`) ·
**accessibility (§9) — merge-blocking, not informational** · E2E (§10) ·
secret scan · git cleanliness · **dependency allowlist (§11, new)**. Never
weakened to obtain `PASS` (`knowledge/08-VALIDATION-POLICY.yaml`,
unchanged).

**Explicit per the v3 red team:** "the a11y gate runs" and "the a11y gate
blocks merge on failure" are different claims. This gate set adopts the
second, for accessibility and for every gate listed — a check that cannot
fail the build is decorative (`DR-010`).

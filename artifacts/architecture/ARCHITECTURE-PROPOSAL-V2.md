# Architecture Proposal v2 — Revisions Applied

**Date:** 2026-08-26 · **Input:** `ARCHITECTURE-PROPOSAL.md` (v1) +
`ARCHITECTURE-REVISIONS.md` (10 items) + `ARCHITECTURE-REDTEAM-ADDENDUM-
VISUAL-TOOLCHAIN.md` (5 items) = **15 outstanding revisions from Stage 2.**
Every one is applied or explicitly rejected below, with the reason. None is
silently dropped.

**This does not use any Adelux-derived visual expression to make a
decision** — the framework, workspace shape, and gates below are chosen on
engineering merit, independent of Track A's findings, per the requester's
explicit instruction.

---

## Decision register v2

| # | Decision | v1 value | v2 value | Revision applied |
|---|---|---|---|---|
| A01 | Framework | Astro 5.x | **unchanged** — Astro 5.x | PASS at Stage 2, not revised |
| A02 | Language | TypeScript strict | **unchanged** | PASS |
| A03 | Package manager | pnpm | **unchanged** | PASS |
| A04 | Node engine | `>=22.11 <23` | **`>=22.11`, no upper bound** | R10 — the upper bound was derived from this session's own container fingerprint, which the project's own evidence policy already declared non-transferable |
| A05 | Rendering | static-first + forms hedge | **unchanged**, C2 preserved, **C1 and C3 revised below** | PASS (decision); constraints revised separately |
| A06 | Workspace shape | 5 packages | **`apps/web` + one `packages/core` module co-locating content schemas and the truth gate** | R5 — each of the 5 packages had exactly one consumer and no independent boundary; splitting content from truth manufactured a drift surface (schema and provenance are one concern) |
| A07 | Content source | Astro content collections, Zod | **unchanged**, with the explicit constraint that schemas are plain Zod, importable without Astro | carried forward from Stage 2's conditional PASS — this is what makes the gate testable via bare `vitest`, no site build required |
| A08 | Truth layer | provenance required | **unchanged as a requirement; mechanism rebuilt** — see Truth Gate Mechanism below | R1 + R2 — the mechanism checked presence, not publishability, and failed open |
| A09 | Styling | CSS custom-property tokens | **unchanged** | PASS |
| A10 | Components | no third-party UI library | **unchanged** | PASS |
| A11 | Unit/integration tests | Vitest | **unchanged** | PASS |
| A12 | E2E/a11y/visual | Playwright + axe | **unchanged** | PASS |
| A13 | Lint/format | "ESLint+Prettier *or* Biome" | **Biome — a single, named choice** | R9 — a disjunction is not a decision and has no `REVERSAL_CONDITION` |
| A14 | Structured data | JSON-LD from typed content only | **unchanged** | PASS — the strongest single control in the register, per Stage 2 |
| A15 | Accessibility | WCAG 2.2 AA | **unchanged** | PASS |
| A16 | Hosting | static + preview + serverless-function support | **static + preview deploys; function support becomes a decision-time check at host selection, not a standing constraint** | R6 — C1 excluded hosts (e.g. GitHub Pages) that support only the service-based form route, which `EV-…-001` also sanctions |
| A17 | CI | GitHub Actions | **unchanged** | PASS |
| A18 | CMS | none initially, Git-based | **unchanged**, elevated: content stays Markdown/YAML with a typed schema is now `REQUIRED`, not merely implied | carried forward from Stage 2 |
| A19 | Images | Astro `<Image>`, dimensions, licence per asset | **unchanged requirement; licence mechanism rebuilt to match Truth Gate Mechanism** (registry IDs, not free text) | R1, applied to assets as well as content |
| A20 | i18n | none, English only | **unchanged** — `APPROVED`, `EV-…-002` | — |
| A21 | Routing | (implicit in A01) | **Astro file-based routing** — one file/directory per route, matching the Stage 9 route/content matrix. No custom router. | New this pass — closes a gap the requester's evaluation list named (routing) that v1 left implicit |
| A22 | Security | (not previously a named decision) | **No secrets committed** (already enforced, `.claude/settings.json` deny-list); **CSP appropriate for a static site with no inline scripts**; **`npm audit`/dependency scanning in CI** (A17) | New this pass — closes a named gap. Minimal by design: no new infrastructure, just naming what a static-first, framework-minimal site already gets close to for free |
| A23 | Performance | (implicit in static-first) | **Lighthouse/Core Web Vitals budget checked in CI**, alongside the existing a11y gate (A15/A12) | New this pass — quantifies what A01/A05's zero-JS-by-default choice already implies, so it's a checked budget, not an assumption |

### Constraints C1–C3 (A05's form-route hedge)

| # | v1 | v2 | Revision |
|---|---|---|---|
| C1 | Host must support serverless functions | **Retired as a standing constraint.** Replaced by a decision-time check: when the host is chosen, record which of the two sanctioned form routes (third-party service, or serverless function) it supports; if neither, that is a blocker at that time | R6 |
| C2 | Form submission behind an adapter boundary (one module, one function) | **Unchanged — kept exactly as written.** This is the one constraint doing real work | Stage 2 PASS, preserved |
| C3 | No page may assume build-time-only data access | **Deleted.** | R3 — read literally, forbids the build-time content rendering that A05 itself chose, inverting its own goal |

---

## Truth Gate Mechanism (replaces the vacuous version — R1, R2)

The v1 mechanism said "provenance is required." It did not say how a build
could fail on missing provenance, which meant `sources: ["https://
example.com"]` satisfied every stated rule. v2 specifies the actual
mechanism:

| Rule | Mechanism |
|---|---|
| **Fail closed** (R2) | Every string field on an org-fact content type requires provenance **by default**. A field added without registering it as exempt **fails the build**. |
| **Registry IDs, not free text** (R1/T2) | `sources[]` holds IDs resolving against a source registry (owner: `U-22`, still open). An unresolvable ID fails the build. |
| **Tier enforcement** (R1/T3) | The registry records each source's tier (T1–T5, `CONTENT-TRUTH-MODEL.md`). T4/T5 sources are **rejected at the gate**. |
| **Freshness is real** (R1/T4) | `validUntil` must be in the future **at build time**, checked programmatically, not just documented. |
| **Named approver** (R1/T6) | `status: approved` requires a recorded approver identity (a person — `U-23`, still open, names *who*). An agent never signs this. |
| **Two distinct sources** (R1/T7) | Founding facts, honours, and headline statistics require two **distinct registry IDs** — two citations of one source count as one. |
| **Conflict fails** (R1/T8) | Conflicting sources on one claim fail the build. Never silent last-write-wins. |
| **Derived provenance** | A computed value inherits the union of its inputs' provenance and the earliest `validUntil`. |
| **Applies to assets too** (extends R1 to A19) | An image's licence entry resolves against the same registry. Missing/expired/unresolvable fails the build, same as a content fact. |

**Two named unknowns remain genuinely open and are not fabricated here:**
`U-22` (who owns/maintains the source registry) and `U-23` (who is the named
human approver). Both are organizational decisions, not architecture ones —
they don't block Stage 3 from freezing, but they do block the gate from
ever actually approving a real fact.

---

## Token-pipeline fail-closed rule (closes the visual-toolchain addendum's gap)

The same fail-closed discipline extends to design tokens, not just content:
the production build can only include `tokens/approved/**`. `raw/` and
`candidate/` directories are excluded from the build **mechanically**, not
by convention — mirroring T1–T8 above, applied to a second domain.

---

## Tooling decisions from the visual-toolchain addendum

| Item | v1 (implicit, from the visual-fidelity protocol) | v2 |
|---|---|---|
| Style Dictionary | assumed | **Deferred.** A single-platform (web-only) site doesn't need a multi-platform token compiler. A plain script compiling `tokens/approved/*.json` into one CSS file of custom properties is cheaper and equally reversible. The **DTCG token format is kept** regardless — the format is decoupled from the compiler. |
| Sharp | assumed as a site dependency | **Not a site dependency.** Astro's `<Image>` already uses Sharp internally — adding it directly duplicates that. If needed for QA-tooling image diffing, it is a devDependency scoped to the testing workspace, never the site's runtime deps. |
| Argos / Percy | assumed optional | **Rejected.** Third-party SaaS visual-diff tools require uploading screenshots to an external service — while `BL-02` is open, that means transmitting reproductions of rights-sensitive Adelux visual output off-project, a materially worse exposure than storing them locally and not committing them. Playwright's own screenshot comparison suffices. |
| Storybook | assumed optional | **Deferred.** Zero UKBT components exist yet — no demonstrated reuse boundary to document. Revisit at Stage 9 if it becomes real friction, not before. |
| CSSTree / PostCSS / postcss-selector-parser | assumed | **Kept** — dev-only, MIT-licensed, no production exposure, each doing a distinct job (already in use this session for the AST work). |

---

## Prohibited-shortcuts and re-planning triggers (formalized for Stage 3)

**Prohibited shortcuts:**
- weakening, skipping, or narrowing a gate to obtain `PASS`;
- promoting a token or content fact past its current lifecycle state without the recorded step;
- adding a dependency because Adelux used it, without a demonstrated UKBT requirement;
- deriving an engine/tooling constraint from this session's container fingerprint.

**Conditions requiring re-planning (not a unilateral edit):**
- a new package, workspace member, or route;
- a new external dependency;
- a change to the truth-gate mechanism;
- BL-02 resolving (in either direction) — the resulting change to Track B status is itself a re-planning trigger, not a silent update.

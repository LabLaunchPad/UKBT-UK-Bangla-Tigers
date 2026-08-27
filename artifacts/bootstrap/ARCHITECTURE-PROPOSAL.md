# Architecture Proposal

**Stage:** 1 · **Status:** every decision below is `PROPOSED` unless marked
`REQUIREMENT` · **Not approved. Not authorization to build.**

Covers discovery items 3, 4, 7, 10, 11, 12. Stage 2
(`prompts/12-architecture-redteam.md`) must attack this before Stage 3 freezes
anything.

---

## Decision register

| # | Decision | Value | Class |
|---|---|---|---|
| A01 | Framework | Astro 5.x | `PROPOSED` (maintainer-fit risk closed by `EV-…-003`) |
| A02 | Language | TypeScript, `strict: true` | `PROPOSED` |
| A03 | Package manager | pnpm, pinned via `packageManager` field | `PROPOSED` |
| A04 | Node engine | `>=22.11 <23` | `PROPOSED` |
| A05 | Rendering | static-first, with a preserved forms escape hatch | **`APPROVED`** `EV-…-001` |
| A06 | Repo shape | pnpm workspace, 5 packages | `PROPOSED` — flagged premature |
| A07 | Content source | Astro content collections, Zod-typed | `PROPOSED` |
| A08 | Truth layer | provenance record required per publishable org claim | **`REQUIREMENT`** |
| A09 | Styling | CSS custom-property tokens + scoped component CSS | `PROPOSED` |
| A10 | Components | local primitives; no third-party UI library | `PROPOSED` |
| A11 | Unit/integration tests | Vitest | `PROPOSED` |
| A12 | E2E / a11y / visual | Playwright + `@axe-core/playwright` | `PROPOSED` |
| A13 | Lint / format | one of ESLint+Prettier *or* Biome — **not both** | `PROPOSED` |
| A14 | Structured data | schema.org JSON-LD emitted from typed content only | **`REQUIREMENT`** |
| A15 | Accessibility target | WCAG 2.2 AA | **`REQUIREMENT`** |
| A16 | Hosting | static host with preview deploys **and serverless-function support**; vendor undecided | `PROPOSED` (constraint `APPROVED`) |
| A17 | CI | GitHub Actions, full gate set per PR | `PROPOSED` |
| A18 | CMS | none initially; Git-based authoring | `PROPOSED` |
| A19 | Images | build-time optimisation, explicit dimensions, licence per asset | **`REQUIREMENT`** |
| A20 | i18n | none — English only | **`APPROVED`** `EV-…-002` |

---

## 3. Framework — A01 `PROPOSED`: Astro + TypeScript

**Why it fits what we actually know.** The only durable requirements evidenced so
far are: content-first pages, strong SEO/AEO, WCAG 2.2 AA, and a hard truth gate.
Astro's model — ship zero JS by default, opt into islands — makes the
accessibility and performance targets the *default* rather than something
recovered later through optimisation work.

**What it is not chosen for:** popularity. If the red team finds a requirement
Astro handles worse than the alternatives, that requirement wins.

**Alternatives, with the condition under which each becomes correct:**

| Alternative | Becomes the right choice if… |
|---|---|
| Eleventy | the team wants zero build-framework churn and no component-model needs |
| Next.js | authenticated areas, ticketing, or server-rendered personalisation are confirmed |
| SvelteKit / Nuxt | the maintaining team already has that expertise (**`UNKNOWN` — U-10**) |
| Plain HTML + Bootstrap (as the reference ships) | the site stays under ~10 hand-maintained pages forever |

**The honest risk on A01:** the biggest input to "right framework" is *who
maintains this after handover*, and that is `UNKNOWN` (U-10). A technically
superior stack that the maintainers cannot operate is the wrong stack. This is
flagged as the single most consequential open question in the proposal.

## A05 **`APPROVED`**: static-first, with a preserved escape hatch

Resolved by requester decision `EV-20260826-001`: **static at launch, but the
architecture must not foreclose adding forms later** — via a third-party form
service or serverless functions.

That phrasing is load-bearing. It is not "static forever", so three constraints
follow and are binding, not optional:

| # | Constraint | Why |
|---|---|---|
| C1 | The host must support serverless functions, or at minimum not preclude them | Narrows A16. A pure object-storage deploy with no function path would foreclose the stated future |
| C2 | Form submission sits behind an **adapter boundary** — one module, one interface | Makes service-vs-function a configuration change rather than a rewrite. This is the whole point of the hedge |
| C3 | No page may assume build-time-only data access | Prevents a design that quietly makes C1 and C2 unusable |

Astro suits this well: the site builds fully static today, and adding an adapter
for a single endpoint later is genuinely incremental rather than a migration.
That is a real point in A01's favour and the red team should test it.

**Two consequences worth stating plainly.** The reference template's bundled PHP
handlers (`assets/php/form-contact.php`, `form-newsletter.php`) are not usable
and are not a migration target. And **U-18 (UK GDPR) moves onto the critical
path**: any contact form collects personal data, so a privacy policy, a lawful
basis, and a retention position are needed *before* the first form ships, not
after.

## 4. Workspace structure — A06 `PROPOSED`, self-flagged as possibly premature

```
apps/web/          Astro site
packages/content/  collections, Zod schemas, data
packages/truth/    provenance records, source registry, publication gate
packages/ui/       tokens + primitives
packages/config/   shared tsconfig / lint / test config
```

**Argument for:** the truth gate should be an independently testable unit the
build depends on. Buried inside `apps/web`, provenance becomes a lint rule
someone disables under deadline pressure rather than a gate that fails the build.

**Argument against, and it is a real one:** five packages for a site with zero
pages is architecture ahead of evidence. A single `apps/web` with `src/content`,
`src/truth`, `src/ui` would ship sooner and split cleanly later, because the
module boundary — not the package boundary — is what actually enforces the gate.

**Recommendation to the red team:** the minimum defensible split is
`apps/web` + `packages/truth`. `content`, `ui`, and `config` as separate packages
should be justified or deferred. Reversibility: splitting a module into a package
later is cheap; merging packages back is cheap too. **A06 is low-stakes either
way** — which is itself the reason not to spend the day-one complexity budget on
it.

## 7. UI / design-system model — A09, A10 `PROPOSED`

Tokens as CSS custom properties in one place: typography, type scale, spacing
scale, container widths, grid, breakpoints, color, surface hierarchy, borders,
radii, shadows, motion, focus states, and component states.

**Binding rule (A10):** components consume tokens; components never hard-code
values. This exists so that when authoritative brand evidence arrives, adopting
it is a token diff rather than a site-wide refactor.

**`UNKNOWN` — the whole palette.** UKBT's brand colours, typefaces, crest, and
logo files are not in evidence (U-05). Every visual value at Stage 5 is therefore
`PROPOSED` and centrally replaceable. **No brand colour may be invented**, and a
colour picked off a photograph or a social-media avatar is not brand evidence.

No third-party component library: Bootstrap/Tailwind/MUI would each import an
opinionated design grammar that then has to be fought when real brand evidence
lands. Note the reference template *is* Bootstrap-based — reading its grammar
(Stage 6) does not mean adopting its dependency.

## 10. Testing strategy — A11, A12 `PROPOSED`

| Layer | Tool | Proves |
|---|---|---|
| Unit | Vitest | schema validation, truth-gate logic, utilities |
| Integration | Vitest | content collections build; provenance resolves |
| E2E | Playwright | routes render, navigation, keyboard paths |
| Accessibility | `@axe-core/playwright` | WCAG 2.2 AA on every route |
| Visual | Playwright measurements + screenshots | DOM/CSS first, screenshots second |
| Link/route | link checker in CI | no broken internal links |
| Truth | custom gate | **the gate that can fail a build for content** |

**Discipline (`AGENTS.md @ukbt:verification`):** test count is not proof. A suite
is evidence for covered behaviour only. Coverage claims must name what is
covered, not report a number.

**Flaky tests** are reproduced and classified per `prompts/06`, never converted
to pass/fail by preference.

## 11. Build / deployment — A16, A17 `PROPOSED`; vendor `UNKNOWN`

Requirements that hold regardless of vendor: static output; preview deploy per
PR; deploys blocked on the full gate set; rollback by redeploying a previous
build. **Vendor is `UNKNOWN` (U-11)** — domain, DNS control, existing hosting,
and budget are all unevidenced. Committing to vendor-specific primitives (edge
middleware, image CDN, redirects syntax) before that is known is avoidable
lock-in; A16 deliberately specifies only the capability.

## 12. Image / asset strategy — A19 `REQUIREMENT` + `PROPOSED` mechanics

`REQUIREMENT`: every image ships with recorded provenance and licence, explicit
dimensions (CLS), and meaningful `alt` — decorative images get `alt=""`
deliberately, not by omission.

**A photograph of an identifiable person is both an asset and an organization
fact.** It needs licence *and* permission before publication — this sits inside
the truth model, not beside it.

`PROPOSED`: AVIF/WebP with fallback, build-time optimisation, responsive
`srcset`, lazy-loading below the fold.

## A20 **`APPROVED`**: no i18n — English only

Resolved by requester decision `EV-20260826-002`. No locale routing, no language
switcher, no bilingual content pipeline. Typeface selection is not constrained by
Bengali script coverage.

**Recorded honestly:** the requester was offered the "English now, Bengali later"
hedge — i18n-shaped routing at small cost — and chose English only. The hedge is
therefore deliberately **not** built. Reversal is expensive: it touches routing,
layout, typography, and every content file. That cost was stated before the
decision was taken, which is what makes this a decision rather than an oversight.

`lang="en"` is still declared on every page per accessibility rule A8.

## 13. CMS — A18 `PROPOSED`: none yet

Git-based authoring until a **named** non-technical editor exists (U-12). A CMS
added before that is complexity serving a hypothetical user.

**The constraint that keeps this reversible:** content stays as Markdown/YAML
with a typed schema. Git-backed CMSs (Decap, Tina, Keystatic) mount onto exactly
that shape later. A database-backed CMS would not — which is precisely why we do
not start with one.

**Non-negotiable when a CMS does arrive:** it must submit to the same truth gate.
A CMS that lets an editor publish an unsourced claim has defeated A08.

---

## Adversarial self-review

### What am I assuming?

1. That UKBT wants a public marketing/content site. Nobody has confirmed the
   purpose, audience, or success criteria (U-01).
2. That "UK Bangla Tigers" is a sports club. Inferred from the delivered
   reference (a padel-club template) and the pipeline's mention of players and
   fixtures — **inference, not evidence** (U-02).
3. That static-first suffices — i.e. no login, ticketing, or live scores (U-14).
4. ~~That a maintaining team can operate a TypeScript/pnpm/Astro stack.~~
   **No longer an assumption** — confirmed, `EV-20260826-003`.
5. ~~That English-only is acceptable.~~ **No longer an assumption** — decided
   with the retrofit cost stated, `EV-20260826-002`.
6. That the container's toolchain resembles CI and developer machines.

Assumptions **1 and 2 remain the ones that would invalidate real work if wrong**,
and both are still unevidenced. Everything in the content model rests on what
UKBT actually is and does, and nobody has told us. Note the asymmetry: three
architecture assumptions were closed by four questions, while every
organization-fact unknown remains open — architecture is cheap to ask about,
and evidence is not.

### What did I invent?

**Zero organization-specific facts.** No name, date, fixture, result, statistic,
person, sponsor, honour, venue, or brand value appears anywhere in this bootstrap.
Searched and verified — see `VALIDATION-MODEL.md § Bootstrap self-check`.

What I *did* author, and should be read as authored rather than discovered:

- the architecture opinions above (labelled `PROPOSED` throughout);
- the pipeline stage list in `docs/10-fresh-repo-pipeline.md`;
- the content type names in `CONTENT-TRUTH-MODEL.md` — shapes, holding no data;
- the permission deny-list in `.claude/settings.json`.

The reference template is a **padel club** template. UKBT is not, as far as any
evidence here shows, a padel club. Nothing about padel, courts, coaching, or
membership has been carried into UKBT's content model. Section names in the
template are template facts, not UKBT facts.

### Which decisions are reversible?

**Cheap (hours):** A03 package manager · A04 engine range · A06 workspace split ·
A11 test runner · A13 lint toolchain · A17 CI provider · A19 image mechanics ·
A12 a11y tooling.

**Now decided, and deliberately not hedged:** A20 (English only) is *expensive*
to reverse and was chosen over the cheap hedge with that cost on the table. A05
is the opposite — decided *with* its hedge (C1–C3), so adding forms stays cheap.

**Moderate (days):** A09/A10 tokens and primitives — cheap *if* the no-hard-coded-
values rule held, expensive if it did not. This is exactly why A10 is a rule
rather than a preference.

### Which decisions could cause architectural lock-in?

| Decision | Lock-in risk | Mitigation in this proposal |
|---|---|---|
| A01 framework | **High** — rewriting pages, layouts, build | keep content as portable Markdown/YAML; keep framework-specific logic out of `packages/content` and `packages/truth` |
| A05 static-first | **Reduced to Medium** — constraints C1–C3 keep the forms path open | U-14 resolved; login/booking/payments would still force a rewrite, and were declined |
| A07 content shape | **High** — schema changes cascade into every page and the CMS | keep schemas narrow; add fields, avoid reshaping |
| A16 vendor primitives | **Medium** | specify capability, not vendor, until U-11 resolves — now including function support (C1) |
| A18 CMS choice | **Medium→High** if a DB-backed CMS is adopted | require Git-backed, require truth-gate submission |
| Reference template | **High legal risk** | excluded from the repo until licence is verified — BL-02 |

### Which requirements have no evidence?

Every organization-specific one. There is no verified UKBT fact of any kind in
this repository. Also unevidenced: the SEO/AEO priority, the accessibility target
as a *client* requirement (AA is proposed as good practice, not because anyone
asked), the launch date, and the content volume. All registered in
`UNKNOWN-EVIDENCE.md`.

### Which future changes would be expensive if we choose incorrectly?

Ranked by cost × likelihood:

1. **Discovering the site needs dynamic/authenticated features after committing
   to static-first** (A05 × U-14). Cost: architectural rewrite.
2. **Reshaping the content schema after pages and content exist** (A07). Cost
   compounds with every page written.
3. **Discovering the reference template is unlicensed after building the design
   system from it** (BL-02). Cost: legal exposure plus a visual redesign. Which
   is why Stage 6 is gated on licence evidence, not on the ZIP existing.
4. **Adding Bengali after building an English-only site.** Now an *accepted*
   risk rather than an unknown one — decided at `EV-20260826-002` with the cost
   stated. It stays on this list because accepting a risk does not remove it.
5. ~~Handing over to a team that cannot operate the stack.~~ **Closed** —
   `EV-20260826-003`.

Items 1, 3, 4 and 5 were resolvable by **asking a human** rather than by more
analysis, and four questions closed three of them. Item 1 is now bounded by
constraints C1–C3; item 3 (the licence) is the one that remains genuinely open,
and it gates Stage 6 alone.

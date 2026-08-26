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
| A01 | Framework | Astro 5.x | `PROPOSED` |
| A02 | Language | TypeScript, `strict: true` | `PROPOSED` |
| A03 | Package manager | pnpm, pinned via `packageManager` field | `PROPOSED` |
| A04 | Node engine | `>=22.11 <23` | `PROPOSED` |
| A05 | Rendering | static-first (`output: 'static'`) | `PROPOSED` |
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
| A16 | Hosting | a static host with preview deploys; vendor undecided | `PROPOSED` |
| A17 | CI | GitHub Actions, full gate set per PR | `PROPOSED` |
| A18 | CMS | none initially; Git-based authoring | `PROPOSED` |
| A19 | Images | build-time optimisation, explicit dimensions, licence per asset | **`REQUIREMENT`** |
| A20 | i18n | English only until a Bengali requirement is confirmed | `UNKNOWN` |

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

## A05 `PROPOSED`: static-first

`DERIVED` from A01 + a content-first site. Every page renders at build time;
interactivity is added per component, never per page.

**Failure mode this creates:** the reference template ships PHP form handlers.
Static hosting cannot run them. Contact and newsletter forms will need either a
form service, a serverless function, or removal. **That is a decision, not a
detail** — deciding it at homepage time means retrofitting a runtime. Registered
as U-14.

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
4. That a maintaining team can operate a TypeScript/pnpm/Astro stack (U-10).
5. That English-only is acceptable for a British-Bangladeshi organization (U-13).
   This one may be materially wrong.
6. That the container's toolchain resembles CI and developer machines.

Assumptions 1, 2 and 5 are the ones that would invalidate real work if wrong.

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

**Moderate (days):** A09/A10 tokens and primitives — cheap *if* the no-hard-coded-
values rule held, expensive if it did not. This is exactly why A10 is a rule
rather than a preference.

### Which decisions could cause architectural lock-in?

| Decision | Lock-in risk | Mitigation in this proposal |
|---|---|---|
| A01 framework | **High** — rewriting pages, layouts, build | keep content as portable Markdown/YAML; keep framework-specific logic out of `packages/content` and `packages/truth` |
| A05 static-first | **High** if auth/dynamic features later appear | resolve U-14 before Stage 3 freezes it |
| A07 content shape | **High** — schema changes cascade into every page and the CMS | keep schemas narrow; add fields, avoid reshaping |
| A16 vendor primitives | **Medium** | specify capability, not vendor, until U-11 resolves |
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
4. **Adding Bengali after building an English-only site** (U-13). Retrofitting
   i18n touches routing, layout, typography, and every content file.
5. **Handing over to a team that cannot operate the stack** (U-10). Cost: the
   site rots, which is the worst outcome and the least visible in a receipt.

Items 1, 3, 4 and 5 are all resolvable by **asking a human**, not by more
analysis. They are the questions that block Stage 3.

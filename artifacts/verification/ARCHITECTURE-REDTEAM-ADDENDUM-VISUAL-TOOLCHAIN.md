# Architecture Red Team — Addendum: Visual-Fidelity Toolchain

**Date:** 2026-08-26 · **Relationship to Stage 2:** this is an *addendum*, not
a re-run. Stage 2 (`ARCHITECTURE-REDTEAM.md`, head `0cd3129`) already tested
all 20 original decisions (A01–A20) and C1–C3 in full, returning
`ARCHITECTURE_VERDICT = REVISE` with 10 required revisions
(`ARCHITECTURE-REVISIONS.md`), **none of which have been applied yet** — Stage
3 has not run. Re-running that pass now, unchanged, would duplicate work and
risks producing a second, potentially inconsistent verdict on inputs that
have not changed. It is not repeated here.

**What has changed since Stage 2** is that this session's visual-fidelity
protocol proposes a substantial *new* toolchain — Playwright (already
reviewed as A12, `PASS`), plus CSSTree, PostCSS, postcss-selector-parser,
Style Dictionary, a DTCG token format, Stylelint, Sharp, and optionally
Argos/Percy/Storybook — none of which existed at Stage 1 or Stage 2. That is
genuinely new and gets a genuine adversarial pass here.

---

## Decision-by-decision attack

### CSSTree, PostCSS, postcss-selector-parser · **PASS**

Dev-only tooling, MIT-licensed, never shipped to production. No end-product
exposure, no runtime cost. **COUNTEREXAMPLE ATTEMPTED** — *"Why three parsing
libraries instead of one?"* They do different jobs (CSSTree: rule/media-query
structure; PostCSS: transform pipeline; postcss-selector-parser: selector
relationship analysis) and none substitutes for another. **PASS.**

### Style Dictionary · **REVISE — defer**

**COUNTEREXAMPLE.** Style Dictionary exists to compile one token source into
*multiple platform targets* (iOS, Android, web, etc.). UKBT is a single static
web site. Adopting a multi-platform compiler for a single-platform output is
exactly the premature-abstraction pattern Stage 2 already rejected once for
the five-package workspace (DR-007: "future extensibility justified only when
migration cost materially threatens a stated requirement" — no such threat is
in evidence here).

**A plain build script that reads `tokens/approved/*.json` and emits one CSS
file of custom properties is cheaper, has zero new dependencies, and is
exactly as reversible** — swapping in Style Dictionary later, if a second
platform target ever materialises, costs about as much as adopting it now
would.

**REQUIRED REVISION:** defer Style Dictionary. Keep the **DTCG token format**
as the on-disk representation regardless (see next item) — the format is
decoupled from the compiler, so nothing is lost by deferring the tool while
keeping the shape.

### DTCG token format (as a data shape, not a tool) · **PASS**

A JSON schema convention, not a dependency with licensing or runtime
implications. **COUNTEREXAMPLE ATTEMPTED** — *"Why not just write CSS custom
properties directly and skip the intermediate JSON?"* Because the
RAW→CANDIDATE→APPROVED classification (Phase 6 of the protocol, and DR-002/
DR-018 in this repository's own knowledge substrate) needs a place to hold
*unpromoted* values that never reach CSS at all — a plain `.css` file has no
natural way to express "this value exists but is not yet approved." A typed
JSON intermediate does. **PASS**, decoupled from Style Dictionary per above.

### Stylelint · **PASS — clarifies, does not reopen, R9**

Stage 2's finding R9 required picking one JS/TS lint tool (ESLint+Prettier or
Biome — A13 was a deferred choice masquerading as a decision). Stylelint is a
**different, CSS-specific tool** and does not compete with that choice; it is
additive, not a reopening of R9. **PASS**, with the R9 requirement to name a
JS/TS tool still outstanding and unaffected.

**One timing constraint carried forward, per the protocol's own Phase 20:**
Stylelint's arbitrary-value rules must apply to *UKBT-authored* CSS only. The
protocol already says this correctly ("Do NOT enforce these rules against the
original legacy source") — flagged here only to confirm it survives red-team
scrutiny, because a rule that accidentally lints vendored/reference material
would produce noise that trains people to ignore the linter.

### Sharp (as a direct project dependency) · **REVISE — scope it correctly**

**COUNTEREXAMPLE.** A19/A01 already specify Astro's `<Image>` component for
production image optimisation, and Astro's image pipeline uses Sharp
*internally* as its default image service — adding Sharp as a **direct**
project dependency duplicates a capability the framework already provides,
for no stated reason.

**Where Sharp genuinely belongs:** the *visual-QA tooling* context (golden-
reference capture, pixel-diffing during Phase 18) is a different dependency
surface from the *site's runtime build*. Conflating them means a change to
testing tooling touches the same `package.json` section as a change to what
ships.

**REQUIRED REVISION:** if Sharp is needed for QA-tooling image diffing, it is
a devDependency scoped to the testing/tooling workspace, never a site
dependency. Do not add it to satisfy A19 — Astro already satisfies A19.

### Argos / Percy (optional) · **REVISE — do not adopt**

**COUNTEREXAMPLE ATTEMPTED** — *"A hosted visual-diff service saves engineering
time."* True, and also: both are commercial SaaS products with their own
licensing/pricing (a decision requiring business sign-off, not an engineering
default) and both require **uploading screenshots to a third party** — a
`NETWORK_WRITE` side effect requiring explicit authorization per
`docs/06-security-protocol.md`, and, while `BL-02` remains open, a materially
worse proposition: it would mean **transmitting reproductions of
rights-sensitive Adelux visual output to an external commercial service**,
which is a much larger exposure than storing them locally and not committing
them (per the golden-reference finding below).

**REQUIRED REVISION:** do not adopt. Playwright's own built-in screenshot
comparison (`toHaveScreenshot`) or a local `pixelmatch` diff satisfies Phase
18's requirement with no third party, no cost, and no additional exposure.
This is consistent with the Stage 2A dependency policy ("avoid unnecessary
commercial libraries").

### Storybook (optional) · **REVISE — defer**

**COUNTEREXAMPLE ATTEMPTED** — *"Component documentation pays for itself
quickly."* Possibly, once components exist. Zero UKBT components exist yet.
This is the same reasoning Stage 2 applied to premature packages (A06): no
demonstrated reuse boundary, no second consumer, nothing to document.
**REQUIRED REVISION:** defer until component count and team size justify the
overhead. Revisit at Stage 9 (page-by-page scale-out) if it becomes a real
friction point, not before.

### RAW → CANDIDATE → APPROVED token pipeline (as an architecture pattern) · **PASS, one gap closed**

Sound in principle — it directly implements DR-002 (unknown is not false) and
DR-018 (presence is not publishability) applied to design values instead of
content facts. **GAP FOUND:** nothing in the protocol states that `raw/` and
`candidate/` tiers must be *excluded from the production build*. Without an
explicit rule, an unvalidated candidate value could compile into shipped CSS
by accident — the same fail-open failure mode Stage 2 found in the content
truth gate (F2), now recurring in the token pipeline.

**REQUIRED REVISION:** the build must fail, or simply cannot physically
include, anything outside `tokens/approved/**`. This mirrors T1 (fail-closed)
from `knowledge/07-CONTENT-TRUTH-POLICY.yaml` — the same discipline, applied
to a second domain.

### Golden-reference / visual-regression architecture · **REVISE — rights question the protocol did not itself raise**

**This is the addendum's most important finding.** The protocol's Phase 3
instructs: *"Capture screenshot... Create golden references... DO NOT modify
the golden references to make UKBT pass."* Read plainly, this proposes
**persisting screenshots of the rendered Adelux site as committed artifacts**.

**A screenshot is a reproduction of the source's visual expression.** It is
not a *description* of Adelux (which `ADELUX-PAGE-INVENTORY.md` is, and which
is fine) — it is a copy of it, in a different file format. Committing that
into this repository while `BL-02 = STATED_BUT_UNVERIFIED` is committing
rights-sensitive Adelux-derived material, which is precisely what the
lifecycle model (`knowledge/06-TEMPLATE-BOUNDARY.yaml`, updated this pass)
forbids under `FORENSIC_ANALYSIS`.

**REQUIRED REVISION:** reference screenshots may be captured and used
**transiently**, in the same scratch location the source package itself
already lives in, for local visual comparison during analysis. **They are
never committed to this repository as "golden references."** If `BL-02`
clears, they become the same class of material as the source and inherit
whatever the cleared licence permits. Recorded in `knowledge/
06-TEMPLATE-BOUNDARY.yaml § golden_reference_rights_note` this pass.

This does not block Phase 2 (already completed, structural-only, no
screenshots involved) or the *comparison methodology* generally — only where
the reference-side images may live.

---

## Verdict

```
ARCHITECTURE_VERDICT = REVISE   (unchanged overall status — Stage 2's original
                                  10 revisions are still outstanding and Stage 3
                                  has not run; this addendum adds findings, it
                                  does not clear the prior ones)

NEW_DECISIONS_TESTED:  9  (CSSTree/PostCSS/selector-parser as one item, Style
                           Dictionary, DTCG format, Stylelint, Sharp, Argos/
                           Percy, Storybook, token-pipeline fail-closed gap,
                           golden-reference rights question)
NEW_PASS:               4  (parsing tools, DTCG format, Stylelint, token
                            pipeline pattern-in-principle)
NEW_REVISE:             5  (Style Dictionary defer, Sharp re-scope, Argos/
                            Percy reject, Storybook defer, golden-reference
                            storage location)
NEW_BLOCK:              0

CUMULATIVE_OUTSTANDING_REVISIONS: 10 (Stage 2, ARCHITECTURE-REVISIONS.md)
                                 + 5 (this addendum) = 15, all pending Stage 3

NO_APPLICATION_CODE_CHANGED: TRUE
```

**Gate, unchanged in effect:** verdict is `REVISE`. Astro implementation
(Phase 11 of the visual-fidelity protocol) does not start. Stage 3 is where
all 15 outstanding revisions — the original 10 plus these 5 — get applied or
explicitly rejected with a recorded reason, and the contract gets frozen.

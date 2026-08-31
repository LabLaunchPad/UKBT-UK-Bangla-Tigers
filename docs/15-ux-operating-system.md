# UX Operating System — page/section/component contracts for UKBT

**Status:** ADOPTED 2026-08-31 · **Authority:** `EV-20260831-010`
**Companion machine-readable file:** `knowledge/13-RESPONSIVE-UX-OPERATING-MODEL.yaml`
**Extends, does not replace:** `docs/13-visual-truth-system.md` (the
9-role visual verification topology), `docs/14-tool-selection-layer.md`
(which tool is authoritative for which fact), `knowledge/12-UI-SCALING-ANTI-SLOP-POLICY.yaml`
(per-property CSS rules), `contracts/COMPONENT-CONTRACT.md` and
`contracts/VISUAL-REGRESSION-CONTRACT.md` (both FROZEN — this document
works within their existing shape, and amends the latter additively via
its own AMENDMENT 03, never around it).

## 0. Why this document exists

`docs/13`/`docs/14` answer "how do we verify a render is correct?".
Nothing before this document answered a layer above that: "what is a
page/section/component *for*, and what is it allowed to do when the
available space changes?" Without that layer, every agent re-derives
responsive behavior from the screenshot in front of it — visual
guessing, not a system.

This document is that missing layer. It is deliberately **structured
data plus short rationale**, not prose alone — a component contract like
`packages/truth/src/contracts/card.contract.md (pre-existing, verified accurate)` should be something an agent parses
mechanically, not interprets.

## 1. The hierarchy

```
DESIGN SYSTEM               → contracts/CSS-CONTRACT.md, knowledge/12
        │
VIEWPORT CONTRACT           → knowledge/13 §3 (mapped onto the FROZEN
        │                       7-viewport matrix, VISUAL-REGRESSION-
        │                       CONTRACT.md AMENDMENT 01/03 — no new
        │                       matrix is introduced)
        │
PAGE CONTRACT                → docs/16-page-contracts/*.md
        │
SECTION CONTRACT             → embedded per-section inside each page contract
        │
COMPONENT CONTRACT           → packages/truth/src/contracts/*.contract.md
        │
STATE CONTRACT                → each component contract's own `states` field
        │
VALIDATION                    → VISUAL-REGRESSION-CONTRACT.md, ACCESSIBILITY-CONTRACT.md
```

Every layer's required fields are fixed by `knowledge/13`. An agent
writing or touching UI reads top-down before writing a line of CSS.

## 2. Responsive is "adapt to available space," not "device"

Do not reason in terms of `iPhone = mobile`. Reason in terms of the
CSS-pixel width (and height) actually available, because the same
browser window can move between size classes via resize, split-screen,
or zoom — this is also the model Android's own window-size-class
guidance and Apple's adaptive-layout guidance use, cited as general
background in `knowledge/13`, not as a UKBT-specific requirement.

UKBT's semantic classes (`knowledge/13 §3`) are **mapped onto the
existing frozen viewport matrix**, not a new one:

| Class | Width | Covered by (frozen) |
|---|---|---|
| Compact | 0–599px | 390×844, 430×932 |
| Medium | 600–839px | 768×1024 |
| Expanded | 840–1199px | 1024×768 |
| Large | 1200–1599px | 1280×800, 1440×900 |
| XL | 1600px+ | 1920×1080 |

A wider 11-viewport canonical list was proposed alongside this system
(`EV-20260831-010`). It is **not** adopted into the CI screenshot suite
as-is — `VISUAL-REGRESSION-CONTRACT.md`'s matrix is FROZEN and its own
text requires a contract amendment naming a real coverage gap, not a
preference for more rows. Every semantic class above already has at
least one frozen viewport measuring it; the specific extra pixel pairs
(360×800, 600×900, 834×1194, 1536×864) are a named, honest gap, not a
silent one — widen the matrix later only against an observed failure.

## 3. Responsive transformation vocabulary

Closed set — a section/component contract names exactly one of these
per viewport class, never leaves it implicit:

**INVARIANT** · **SCALE** · **STACK** · **COLLAPSE** · **REORDER** ·
**HIDE** · **SCROLL**

Full definitions and UKBT examples for each are in `knowledge/13 §2` —
several already describe existing, shipped behavior (`FranchiseTeaser`'s
grid-to-single-column collapse, `Header`'s nav toggle) rather than new
rules; the vocabulary's job is to make that existing behavior
*nameable*, not to invent new behavior.

**HIDE is the one to watch.** Never remove content solely because the
viewport shrank — only genuinely secondary/decorative content may
disappear, and the reason must be stated in the section contract, not
implied by a media query.

## 4. Component reuse before creation

Before writing a new `.astro` component:

1. Search `apps/web/src/components/*.astro` for an existing component
   with the same semantic responsibility.
2. Search for an existing **prop/variant** that could satisfy the need
   instead of a new file.
3. Only create a new component for a genuinely new semantic
   responsibility — not a new visual treatment of an existing one.
4. Document it in `packages/truth/src/contracts/<name>.contract.md` (the shape
   `contracts/COMPONENT-CONTRACT.md` already freezes) before it has more
   than one call site.

This guards specifically against `Card` / `FeatureCard` / `InfoCard` /
`ContentCard`-style duplication. Checked against this repo directly
(not assumed): today's component set is **not** already duplicated —
`Card.astro` is the one generic card, and `RosterGrid`, `TournamentCard`,
`LeadershipGrid` are genuinely different semantic responsibilities (a
roster entry, an event, a leader), confirmed by reading each one's
actual markup, per `EV-20260831-009`/`-010`.

## 5. Component/page contract shape

`knowledge/13 §4` fixes the required fields. Two are written as
demonstrated instances in this pass, both grounded in real shipped code
rather than invented:

- `packages/truth/src/contracts/card.contract.md (pre-existing, verified accurate)` — the shared card primitive.
- `docs/16-page-contracts/home.md` — the homepage, using its *real*
  section order read from `apps/web/src/pages/index.astro` (Header,
  Hero, ClubIntro, WhyChooseUs, AcademySection, TournamentGrid,
  CaptainSpotlight, FranchiseTeaser, AboutCTA, Footer). A first draft of
  this document assumed a different, invented section list before the
  real file was checked — recorded in `EV-20260831-010` finding 3 as a
  concrete example of exactly the drift this whole system exists to
  prevent.

Further contracts (for `RosterGrid`, `Hero`, `/about`, `/franchises`,
etc.) are written incrementally as future work actually touches those
components/pages — never spun up speculatively for code nobody has
re-read yet.

## 6. Container queries vs. viewport queries

Question to ask: **does this behavior depend on the viewport, or on the
space available to this specific component?**

- Page/global layout decisions → viewport media queries (what every
  UKBT component already uses: `@media screen and (max-width: 1025px)`
  etc.).
- A reusable component's own internal composition, independent of where
  it's placed → container queries would be the correct primitive.

**Repo state, checked directly:** no UKBT component uses container
queries today; every responsive rule is a viewport media query. This is
not flagged as a defect — no current component is dropped into
meaningfully different container widths on different pages (RosterGrid,
for instance, always spans a similar content column) — but it is the
right tool to reach for if that stops being true, rather than adding
more page-specific viewport breakpoints to a component that should
adapt to its container instead.

## 7. Source-of-truth layering (not a new Authority order)

`knowledge/13 §6` orders **design-system layers** (which layer wins a
styling conflict). This is a different axis from CLAUDE.md's existing
Authority order (which **evidence class** to trust) and from the
visual-truth addendum's extended Authority order (measurement
freshness). All three apply to different questions simultaneously —
see `EV-20260831-010` finding 2 for why this document does not restate
or compete with either existing order.

## 8. Truth classification, RULE_ID, admission gates (EV-20260831-011)

A refinement to this system, added in the same session, contributed
three more pieces — encoded in `knowledge/13` §7–9 rather than restated
here:

- **Truth classification** (`NORMATIVE`/`PLATFORM`/`PRODUCT`/`SYSTEM`/
  `PAGE`/`SECTION`/`COMPONENT`/`REFERENCE`/`INFERENCE`) — tags *where a
  UI decision's authority comes from*, so a screenshot observation is
  never cited as if it were a WCAG requirement. This is a different axis
  from CLAUDE.md's evidence classes (epistemic status of a claim) and
  knowledge/11's Authority order (measurement freshness) — all three
  apply to different questions.
- **`RULE_ID` micro-format** — an optional structured shape for
  documenting one narrow, testable UI decision (fields: `RULE_ID`,
  `AUTHORITY`, `SOURCE`, `SCOPE`, `REQUIREMENT`, `RATIONALE`,
  `IMPLEMENTATION`, `VALIDATION`, `CONFIDENCE`, `STATUS`). Not a
  replacement for a full page/component/section contract — for a single
  rule, not a whole component. `knowledge/12`'s existing `SLOP-01..07`
  entries already follow this shape informally; `knowledge/13` §8 gives
  the worked example.
- **Admission gates** for a new token/component/breakpoint/exception —
  each one restates an existing rule (`contracts/CSS-CONTRACT.md`'s
  APPROVED-only token rule, §4's component-reuse protocol) as a yes/no
  checklist, not a new requirement.

Two more transformation types were added to §3's vocabulary alongside
this: **REPLACE** (the interaction pattern itself changes, not just its
size) and **EXPAND** (more space adds genuine richness, never filler).
Neither is used by any current UKBT component — recorded for future use,
not retrofitted onto existing behavior that doesn't need it.

**Not adopted from this refinement:** a parallel `/design-system` file
tree (`design.md`, `responsive.md`, `interaction.md`,
`/tokens/*.json`, `/components/*.md`, `/patterns/*.md`, `/qa/*.md`).
This repository's real structure — `contracts/`, `knowledge/`,
`packages/truth/src/tokens/approved/**`, `packages/truth/src/contracts/`
— already serves every one of those responsibilities, and
`contracts/CSS-CONTRACT.md`/`REPOSITORY-CONTRACT.md` freeze where each
lives. A second, parallel tree would fork the source of truth rather
than extend it. The stress-test taxonomy (space/content/typography/
media/state/input/orientation/preference/localization/structure) and the
P0–P3 failure-severity scale are useful **thinking checklists** for a
human or agent doing visual QA — they are not encoded as new automated
gates here, because `contracts/VISUAL-REGRESSION-CONTRACT.md`'s five
required evidence kinds and `apps/web/tests/visual/*.spec.ts` are the
actual enforcement mechanism, and claiming a new automated check exists
without writing and running one would violate CLAUDE.md's "never claim a
check passed unless it was actually executed."

## 9. What this document deliberately does not do

- It does not add new CI screenshot viewports (§2).
- It does not write contracts for every existing component/page — two
  demonstrated instances only (§5).
- It does not introduce container queries where none are needed yet (§6).
- It does not restate `contracts/ACCESSIBILITY-CONTRACT.md`'s
  requirements — cross-references it as the binding accessibility gate.
- It does not treat the external standards it cites (WCAG 2.2, Apple
  HIG, Android window size classes, DTCG, ARIA APG) as independently
  re-verified in this pass — they are cited as general engineering
  background, the same way `docs/14-tool-selection-layer.md` cites
  platform documentation, not elevated to UKBT-VERIFIED-FACT status.

Widening any of the above is a future, separately-evidenced decision —
see `knowledge/10-ANTI-DRIFT-RULES.yaml`'s `VN-10` ("never widen scope
without replanning").

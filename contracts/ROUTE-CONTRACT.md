# Route Contract

**ID:** CONTRACT-ROUTE-01
**Status:** FROZEN · Stage 3 (Contract Freeze)
**Purpose:** Fix that UKBT's information architecture is derived from UKBT
evidence, never from Adelux's page structure — closing leak-path `LP-02`
(`knowledge/06`) at the contract level.

## The binding rule

> **The 13 renderable Adelux pages are reference evidence only. They are
> not an instruction to build 13 identical UKBT routes.**

Adelux's page inventory (`documentation-index` excluded; `index`, `about`,
`service`, `coaching`, `booking`, `membership`, `community`, `event`,
`blog`, `single-post`, `faq`, `contact`, `404-page` —
`artifacts/source/PAGE-INVENTORY.yaml`, `EV-20260826-…`) is a **padel-club
template's** information architecture. UKBT is a cricket club (per this
project's own stated identity, `AGENTS.md`). Its section names
(`courts`, `coaching`, `membership tiers`, `booking`) are Adelux-specific
facts, not UKBT requirements — deriving UKBT's routes from that list
directly would make the template a source of UKBT information architecture
without any single step looking like an invention (`LP-02`).

## Outputs / Route decision process (this contract fixes the *process*,
not a final route list — no UKBT route list exists yet, since it depends
on unresolved content facts, `U-01`)

1. UKBT's actual information needs are established from **UKBT evidence**
   (club identity, actual offerings, actual organizational structure) —
   never from Adelux's section names.
2. Adelux's page *types* (a homepage, an about/info page, a contact page,
   a news/blog listing) may inform **generic web-information-architecture
   patterns** that are not Adelux-specific (every club-type site plausibly
   needs a homepage and a contact page — this is a category-level
   observation, not a template-derived fact).
3. Any specific route name, section, or page that maps to an
   Adelux-specific concept not evidenced as a UKBT concept (`courts`,
   `booking`, `membership tiers` as Adelux defines them) is **not** carried
   over unless independently evidenced as a real UKBT need.
4. A route may only render content that has passed the truth gate
   (`TRUTH-CONTRACT.md`) or is explicitly UI-label/generic-copy content —
   `ARCHITECTURE-PROPOSAL-V3.md` §4's leak-path table: "a route cannot
   exist without a corresponding content entry that passed the gate."

## Invariants

- `INV-014`: reference analysis informs visual grammar only; route and
  content architecture derive from UKBT evidence, never from the
  reference.
- A route's *visual layout* (hero, card grid, section rhythm) may be
  informed by Track A/B design-system work; a route's *existence and
  name* may not be informed by Adelux's page list.

## Forbidden behavior

- Building a UKBT route named or scoped to match an Adelux page merely
  because Adelux has one (e.g. a `booking` route because Adelux has
  `booking.html`, absent an evidenced UKBT booking need).
- Treating the 13-page count as a UKBT page-count target.
- Rendering any route from content that has not passed the truth gate.

## Validation method

- A route/link-integrity CI check (`CI-CONTRACT.md`) verifies every route
  resolves and every internal link targets an existing route — this
  checks mechanical correctness, not the route-derivation rule above.
- The route-derivation rule itself is validated by inspection at Stage 9
  (per `prompts/16-reference-analysis.md`'s scope note): each proposed
  UKBT route must cite its UUKBT-evidence justification, not "Adelux has
  one."

## Owner

Track C. Route architecture is explicitly named as not gated by Track B
(`ARCHITECTURE-PROPOSAL-V3.md` §4) — though a route's *content* remains
gated by the truth gate per item, and a route's *visual layout*, if
adapted from Adelux, remains gated by Track B for that layout specifically.

## Dependency

`CONTENT-CONTRACT.md` (a route needs approved content to render).
`TRUTH-CONTRACT.md` (gate a route's content must pass).

## Change authority

Adding a UKBT route derived from an Adelux page name requires stating the
independent UKBT evidence for that route's existence — "Adelux has a page
like this" is not sufficient justification on its own.

## Evidence required

`artifacts/source/PAGE-INVENTORY.yaml` (`EV-20260826-…`, reused as the
reference-evidence input this contract explicitly does not treat as a
route list).

## Reversibility

REVERSIBLE. No route exists yet; this contract fixes the derivation
process a future route list must follow.

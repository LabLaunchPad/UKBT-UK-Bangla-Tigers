# F6 fix — shared Surface/Panel primitive

**Date:** 2026-08-27. Closes `artifacts/review/HOMEPAGE-REDTEAM.md` finding
F6 (LOW-MEDIUM). Owner decision this date: implement the shared primitive
now rather than defer it further.

## What shipped

`apps/web/src/components/Surface.astro` — a new, deliberately narrow
primitive that owns only the "box" (`background`/`foreground`/
`border-radius`/`padding`) of the dark/tinted rounded-panel pattern the
red team found duplicated across 4 components. It takes raw
`var(--ukbt-color-*)` token references for `background`/`foreground`
rather than a small fixed enum — the panels in use span
`surface-background`, `surface-alt`, `surface-inverse`, `brand-accent`,
and `brand-primary`, plus one conditional per-instance override
(`WhyChooseUs`'s single accent card), and an enum would either miss a
real pairing or force guessing between two visually-similar-but-
semantically-distinct tokens (`surface-background` vs `neutral-0`).
Content layout (flex direction, gaps, typography, hover/focus treatment,
per-instance `--ukbt-color-focus-ring` overrides) stays on each
consuming component's own class, unchanged — Surface does not also try
to own content structure, which is exactly the contract gap the red
team's root-cause analysis found in `Card.astro` and did not recommend
widening.

**Migrated:** `WhyChooseUs.astro` (1 card, 2 background variants),
`TournamentGrid.astro` (main event card + 2 "other event" cards + 1 CTA
card), `AboutCTA.astro` (2 panels), `FranchiseTeaser.astro` (1 panel,
needing an asymmetric radius — see below).

**Deliberately NOT migrated:** `NewsTeaser.astro`'s `.ukbt-news__card`.
It's an `<a>` element (Surface only renders a `<div>`), and its padding
lives entirely on an inner content box, not the panel itself (the panel
is a zero-padding media container with `justify-content: flex-end`).
Force-fitting it would mean either extending Surface to support `as="a"`
and a degenerate zero-padding case (defeating the point of centralizing
"the box"), or restructuring an unpublished, `CONTENT_STATUS = UNKNOWN`
shell component for no real benefit. Recorded as a reasoned exclusion,
not an oversight.

## Verified zero visual change

Every migrated panel's computed `background-color`, `color`,
`border-radius`, and `padding` were read directly (`getComputedStyle`)
before and after migration and matched exactly — e.g. the
`WhyChooseUs` accent card: `rgb(204, 164, 79)` / `rgb(0, 30, 58)` /
`20px` / `40px`, unchanged. `FranchiseTeaser`'s asymmetric radius
(`0 0 var(--ukbt-radius-lg) var(--ukbt-radius-lg)` — it sits directly
below an image, forming one visual card) is preserved via a raw
CSS-value escape hatch on Surface's `radius` prop, rather than being
silently normalized to a symmetric radius.

## A real regression, found and fixed before shipping

Migrating surfaced a genuine bug, not a hypothetical one. Every
consuming component had CSS rules like `.ukbt-franchise__cta a { color:
var(--ukbt-color-brand-accent); }` — a descendant selector whose
ancestor half now targets a `<div>` rendered by a *different* component
(`Surface.astro`). Astro's per-component style scoping stamps a scope
attribute only onto elements literally written in that component's own
template; the wrapper div, now written inside `Surface.astro`, carries
*Surface's* scope attribute, not the calling component's. The compiled
selector (`.ukbt-franchise__cta[data-cid-FRANCHISE] a[data-cid-FRANCHISE]`)
can never match, because the div lacks `data-cid-FRANCHISE` — silently,
with no build error.

This is the same root-cause family as the CSS-specificity bug fixed for
F3's footer social icons earlier this session (Astro's scoping mechanics
producing a surprising, silent selector mismatch) — but a different
failure mode: there, a rule *lost a specificity fight it should have
won*; here, a rule *can never match at all*. Caught by the full
Playwright suite, not assumed safe: `homepage.spec.ts`'s axe scan
reported a real `color-contrast` violation — the franchise link had
fallen back to browser-default link blue (`#0000ee`) against its navy
background — plus the same class of failure on 4 more tests (`axe.spec.ts`,
2 routes in `pages.spec.ts`, and the homepage focus-outline test).

**Fixed** by wrapping the ancestor half of every affected selector in
`:global(...)` — the same escape hatch already used elsewhere in this
codebase (`Hero.astro`'s `:global(.ukbt-button--primary)`) for the
mirror-image case (a child component's class needing to be reachable
from a parent's scoped stylesheet). Fixed in all 4 migrated components:
`FranchiseTeaser.astro` (`.ukbt-franchise__cta` + 2 descendants),
`TournamentGrid.astro` (`.ukbt-tournament-card`,
`.ukbt-tournament-card--main`, `.ukbt-tournament-cta` + 2 descendants),
`AboutCTA.astro` (`.ukbt-about-cta__content` + 2 descendants,
`.ukbt-about-cta__benefit`), `WhyChooseUs.astro`
(`.ukbt-chooseus__card`/`--accent` + 4 descendants).

## Regression protection

Added `tests/visual/homepage.spec.ts`'s "every Surface-wrapped panel
still applies its component-specific descendant styling" test — checks
the actual computed `color` on one descendant per migrated component
against browser-default link blue (the literal failure mode) and, for
the franchise link specifically, the exact expected gold value.

**Falsification-checked**, per `knowledge/08-VALIDATION-POLICY.yaml`
DR-010: reverted just the `FranchiseTeaser.astro` `:global()` fix, ran
both the pre-existing axe test and the new dedicated test — both failed,
with the new test's failure being immediately specific rather than a
generic axe violation dump. Restored the fix; both pass again.

## Gates run

| Command | Result |
|---|---|
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS — 0 errors |
| `pnpm test:unit` | PASS — 21/21 |
| `pnpm build` | PASS — 16 pages |
| `pnpm run check:links` | PASS — 524 links, 0 broken |
| `pnpm --filter @ukbt/web exec playwright test` | PASS — **249/250**, 1 env-gated skip (248 pre-existing + 1 new) |

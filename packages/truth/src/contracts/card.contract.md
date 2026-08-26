# Component Contract: Card

Framework-neutral, per `contracts/COMPONENT-CONTRACT.md`. **UKBT-original**
— not derived from Adelux's `.card-blog`/`.card-chooseus` candidates
(`artifacts/extraction/COMPONENT-CANDIDATES.md`); those remain Track A
evidence only, not yet adapted (Track B still `RIGHTS_GATED`). This is an
independently-designed primitive proving the design-system layer 6 → 7
pipeline for a second, structurally different component (surface +
elevation + optional-link semantics, vs. Button's single interactive
element).

| Field | Content |
|---|---|
| Purpose | A bounded content surface — heading + body text, optionally a whole-card link. |
| DOM structure | `<article>` (or `<a>` wrapping an `<article>`-equivalent when `href` is set) containing an `<h3>` heading and a `<p>` body. |
| Variants | none yet — a single visual treatment; variants are added only once a second, evidenced need exists (`DR-006`, no speculative variants). |
| States | default, `:hover` (only meaningful when `href` is set — a static card has no hover state), `:focus-visible` (only when `href` is set). |
| Responsive behavior | None required at the component level — a card's own layout does not change across the viewport matrix; responsive behavior belongs to whatever grid/list places multiple cards (not yet built). |
| Accessibility behavior | When `href` is set, the entire card is a single accessible link (one tab stop, one accessible name — the heading text) rather than a heading plus a separately-focusable link, avoiding duplicate/ambiguous tab stops. When `href` is absent, the card is non-interactive and carries no button/link semantics. |
| Token dependencies | `--ukbt-space-*`, `--ukbt-radius-lg`, `--ukbt-shadow-sm`/`--ukbt-shadow-md`, `--ukbt-color-surface-*`, `--ukbt-color-neutral-*`, `--ukbt-font-size-*`, `--ukbt-font-weight-*`, `--ukbt-motion-duration-base`. |
| Asset dependencies | None yet — an optional image slot is a plausible future need but is not built speculatively (`DR-006`). |
| Content dependencies | `heading: string`, `body: string` (both UI/generic copy, exempt from the truth gate per `contracts/CONTENT-CONTRACT.md` `not_organization_claims` — an org-fact use of this component, once one exists, supplies these from gated content, not literal props), `href?: string`. |
| Interaction requirements | None — no JS required; the whole-card-link pattern is pure HTML/CSS (an `<a>` wrapping block-level content). |

Implemented at `apps/web/src/components/Card.astro` (layer 7 adapter).

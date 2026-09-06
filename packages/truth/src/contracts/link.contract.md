# Component Contract: Link

Framework-neutral, per `contracts/COMPONENT-CONTRACT.md`. **UKBT-original**
— consolidates five divergent link treatments (FranchiseTeaser,
club-captain plain list, Footer inline link, PageBanner breadcrumb,
SocialLinks text row) into one tone-aware primitive. SocialLinks keeps
its own icon+label layout; every other text link composes this.

| Field | Content |
|---|---|
| Purpose | A single navigational text link, tone-aware for light/dark surfaces. |
| DOM structure | A single `<a>`, no wrapper. Text content only (no icon slot — that is SocialLinks/Button territory). |
| Variants | `tone`: `on-light` (navy, bold) / `on-dark` (inherits surface foreground); `underline`: `hover` / `always` / `none`; `external?` (new-tab + opener protection); `emphasis`: `normal` / `strong` (accent treatment on dark, e.g. footer contact link). |
| States | default, `:hover`, `:focus-visible`. `:focus-visible` MUST be perceivable on both tones — `on-dark` repaints `--ukbt-color-focus-ring` to accent; `on-light` inherits the global `CanvasText` ring (passes on light surfaces). |
| Responsive behavior | None required — `inline-flex`, wraps with surrounding text; `min-height` preserves the 24px WCAG 2.5.8 floor. |
| Accessibility behavior | Native `<a>` semantics; `external` sets `target="_blank" rel="noopener noreferrer"`; never remove the underline from `always` links (color alone must not carry meaning). |
| Token dependencies | `--ukbt-color-brand-primary`, `--ukbt-color-brand-accent`, `--ukbt-font-weight-bold`, `--ukbt-font-size-0`, `--ukbt-space-2` (all `APPROVED`, `packages/truth/src/tokens/approved/`). |
| Asset dependencies | None. |
| Content dependencies | `href: string`, children label (UI string — exempt from the truth gate per `contracts/CONTENT-CONTRACT.md`'s `not_organization_claims`). |
| Interaction requirements | None — no JS required. |

Implemented at `apps/web/src/components/Link.astro` (layer 7 adapter).

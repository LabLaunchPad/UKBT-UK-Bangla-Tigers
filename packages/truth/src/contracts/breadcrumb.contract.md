# Component Contract: Breadcrumb

Framework-neutral, per `contracts/COMPONENT-CONTRACT.md`. **UKBT-original**
— one breadcrumb model feeding visible navigation, `BreadcrumbList`
JSON-LD (via `apps/web/src/lib/seo.ts` crumb shape), and internal
linking. Replaces PageBanner's inline breadcrumb markup; `PageBanner`
keeps its `crumbs` prop and composes this component, so no page API
changes.

| Field | Content |
|---|---|
| Purpose | Hierarchical trail from Home to the current page. |
| DOM structure | `<nav aria-label="Breadcrumb"><ol><li>` per crumb; linked crumbs render the shared Link primitive, the current page renders `<span aria-current="page">`; separators are `aria-hidden`. |
| Variants | None — one treatment, inherits surrounding surface color. |
| States | normal, `:hover`, `:focus-visible` (via Link), `current` (non-interactive span, never a link). |
| Responsive behavior | Wraps (`flex-wrap`) at narrow widths instead of overflowing; separator spacing preserved. |
| Accessibility behavior | Landmark nav with accessible name; ordered list conveys hierarchy; current page never focusable. |
| Token dependencies | `--ukbt-font-size-0`, `--ukbt-space-2` (all `APPROVED`, `packages/truth/src/tokens/approved/`). Inherits text color (no color tokens of its own). |
| Asset dependencies | None. |
| Content dependencies | `crumbs: { label, href? }[]` — labels are UI strings; `href`s must be canonical app routes. |
| Interaction requirements | None — no JS required. |

Implemented at `apps/web/src/components/Breadcrumb.astro` (layer 7 adapter).

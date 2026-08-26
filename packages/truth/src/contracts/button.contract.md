# Component Contract: Button

Framework-neutral, per `contracts/COMPONENT-CONTRACT.md`. **UKBT-original**
— no Adelux-derived DOM shape, class name, or visual treatment. Written to
prove the layer 6 → layer 7 pipeline is executable during Foundation,
without any Track B dependency.

| Field | Content |
|---|---|
| Purpose | A clickable action trigger. |
| DOM structure | A single `<button>` (or `<a>` when `href` is provided), no wrapper. |
| Variants | `primary`, `secondary`. |
| States | default, `:hover`, `:focus-visible`, `:disabled`. `:focus-visible` MUST have a visible outline — no `SOURCE_DEFECT` is inherited here, since there is no source (`contracts/ACCESSIBILITY-CONTRACT.md`). |
| Responsive behavior | None required — a button's own size does not change across the viewport matrix. |
| Accessibility behavior | Native `<button>`/`<a>` semantics; `disabled` uses the native attribute, never an ARIA-only simulation; visible focus ring at every viewport. |
| Token dependencies | `--ukbt-space-*` (approved, `packages/truth/src/tokens/approved/spacing.json`). No color token yet — none is `APPROVED` (color remains an `organization_claims` item, `knowledge/07`, pending real UKBT brand evidence, `U-05`); the Astro implementation uses `currentColor`/`Canvas`/`CanvasText` system colors so no brand decision is made by this scaffolding component. |
| Asset dependencies | None. |
| Content dependencies | `label: string` (UI string — exempt from the truth gate per `contracts/CONTENT-CONTRACT.md`'s `not_organization_claims`), `variant`, `disabled`, `href?`. |
| Interaction requirements | None — no JS required; a native `<button>`/`<a>` is fully operable without it, consistent with Astro's zero-JS-by-default model. |

Implemented at `apps/web/src/components/Button.astro` (layer 7 adapter).

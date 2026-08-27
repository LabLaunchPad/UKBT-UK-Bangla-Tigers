# Component Contract: Button

Framework-neutral, per `contracts/COMPONENT-CONTRACT.md`. **UKBT-original**
— no Adelux-derived DOM shape, class name, or visual treatment. Written to
prove the layer 6 → layer 7 pipeline is executable during Foundation,
without any Track B dependency.

| Field | Content |
|---|---|
| Purpose | A clickable action trigger. |
| DOM structure | A single `<button>` (or `<a>` when `href` is provided), no wrapper. |
| Variants | `primary`, `secondary`, `danger`. |
| States | default, `:hover`, `:focus-visible`, `:disabled`. `:focus-visible` MUST have a visible outline — no `SOURCE_DEFECT` is inherited here, since there is no source (`contracts/ACCESSIBILITY-CONTRACT.md`). |
| Responsive behavior | None required — a button's own size does not change across the viewport matrix. |
| Accessibility behavior | Native `<button>`/`<a>` semantics; `disabled` uses the native attribute, never an ARIA-only simulation; visible focus ring at every viewport. |
| Token dependencies | `--ukbt-space-*`, `--ukbt-radius-md`, `--ukbt-font-weight-medium`, `--ukbt-motion-duration-base`/`--ukbt-motion-easing-standard`, `--ukbt-color-surface-*`, `--ukbt-color-neutral-*`, `--ukbt-color-feedback-danger` (all `APPROVED`, `packages/truth/src/tokens/approved/`). Color tokens are `PROPOSED` classification (`tokens/approved/README.md`) — no real UKBT brand evidence exists (`U-05`) — but are still real, compiled custom properties, not a scaffolding-only placeholder; a future brand-evidence update changes the token file, not this component. |
| Asset dependencies | None. |
| Content dependencies | `label: string` (UI string — exempt from the truth gate per `contracts/CONTENT-CONTRACT.md`'s `not_organization_claims`), `variant`, `disabled`, `href?`. |
| Interaction requirements | None — no JS required; a native `<button>`/`<a>` is fully operable without it, consistent with Astro's zero-JS-by-default model. |

Implemented at `apps/web/src/components/Button.astro` (layer 7 adapter).

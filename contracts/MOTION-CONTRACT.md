# Motion Contract

## Status

ACTIVE (2026-09-06). UKBT's motion language: premium sports editorial —
confident, smooth, deliberate. Never bouncy SaaS, gaming UI, or
scroll-jacking.

## Invariants

1. **Tokens first.** Every duration/easing/distance comes from
   `packages/truth/src/tokens/approved/motion.json`
   (`duration fast/base/slow`, `easing standard/enter/exit/emphasized`,
   `distance sm/md`). No literal `0.2s`/`ease`/`cubic-bezier` in
   component styles except justified micro-values with a comment.
2. **Content-first.** Everything renders visible without JS and without
   animation. Load/scroll motion only enhances (`backwards` fills,
   `.is-visible` gating, `html.ukbt-motion-js` arming).
3. **Reduced motion is a first-class mode.** The global kill-switch in
   `apps/web/src/styles/base.css` plus the explicit
   `::view-transition-*` kill apply to every present and future motion
   rule. New motion MUST resolve to static content under
   `prefers-reduced-motion`.
4. **One observer.** Scroll reveals go through the single
   IntersectionObserver in `BaseLayout.astro` (`data-motion="reveal"`,
   optional `data-motion-delay` capped at 300ms). No per-element
   observers, no scroll listeners with layout reads.
5. **Transform/opacity only** for high-frequency animation. No height
   animations, no `transition: all`, no layout-shifting motion.
6. **Page transitions** use Astro `ClientRouter` + `@view-transition
   { navigation: auto }` semantics with CSS old/new states
   (350–550ms). Unsupported browsers navigate normally; JS-disabled
   navigates normally. Motion is never a functional dependency.
7. **Restraint list (non-goals):** no parallax, no ambient loops, no
   count-up stats, no letter-by-letter headlines, no scroll-jacking, no
   LIVE pulse (no live events exist), no shared-element continuity
   without genuine same-element pairs, no springs/bounce/overshoot.

## Micro-interaction matrix (authoritative)

| Component | Hover | Focus | Press | Enter | Leave | Reduced motion |
|---|---|---|---|---|---|---|
| Button | surface + arrow shift | ring | scale(.98) | n/a | settle | instant (no eased movement) |
| Card (linked) | lift −4px + shadow | ring | — | n/a | settle | instant |
| Drawer | n/a | contained | n/a | slide + capped stagger | slide out | instant open/close |
| Dropdown | reveal (entry-only) | ring | n/a | fade+rise | instant | instant |
| Nav link | gold underline-reveal | ring | n/a | navigate | settle | instant |
| Breadcrumb | underline | ring | n/a | navigate | settle | instant |
| Hero | n/a | ring | n/a | staggered choreography | n/a | soft fade only |
| Banner | n/a | n/a | n/a | single fade-up | n/a | soft fade only |
| Section header/footer | n/a | n/a | n/a | grouped reveal | n/a | soft fade only |
| Page swap | n/a | n/a | n/a | VT fade+rise | VT settle | instant swap |

Reduced-motion model is two-tier: STATE changes (drawer, dropdowns,
hovers, presses, page swaps) resolve instantly — positional easing is
the vestibular trigger. Content ENTRANCES (hero, banner, reveals)
resolve as one short opacity fade (`ukbt-soft-fade`, no rise/scale/
stagger). Calm and finished, never frozen, never moving.

## Enforcement

`scripts/check-motion.mjs` (`MOTION_STATUS`) + `tests/visual/motion.spec.ts`,
both required in CI. Changing this contract is a re-approval event.

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
7. **Restraint list (non-goals):** no parallax, no ambient loops
   (sole exception: the hero background crossfade, Amendment 02 —
   opacity-only, 16s `duration-slideshow` token cycle, deterministic
   first frame, static under reduced motion), no count-up stats, no
   letter-by-letter headlines, no scroll-jacking, no LIVE pulse (no
   live events exist), no shared-element continuity without genuine
   same-element pairs, no springs/bounce/overshoot.

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
| Hero BG | crossfade (Amendment 02 only) | n/a | n/a | slide 1 static | n/a | static slide 1 |
| Banner | n/a | n/a | n/a | single fade-up | n/a | soft fade only |
| Section header/footer | n/a | n/a | n/a | grouped reveal | n/a | soft fade only |
| Page swap | n/a | n/a | n/a | VT fade+rise | VT settle | instant swap |

Reduced-motion model is two-tier: STATE changes (drawer, dropdowns,
hovers, presses, page swaps) resolve instantly — positional easing is
the vestibular trigger. Content ENTRANCES (hero, banner, reveals)
resolve as one short opacity fade (`ukbt-soft-fade`, no rise/scale/
stagger). Calm and finished, never frozen, never moving.

## First-visit logo intro (three-state system)

The crest animates exactly once per browser/storage context — arrival,
alignment, confidence; never showcase. States:

```text
FIRST_VISIT_INTRO: full document load + `ukbt-logo-intro-seen` absent
  → pre-paint head script arms `html.ukbt-logo-intro`, persists the flag
NORMAL_INITIAL_LOAD: full document load + flag present → nothing armed
CLIENT_NAVIGATION: no document load → `astro:before-swap` removes the
  class pre-paint, `astro:after-swap` re-asserts; never depends on
  head-script re-execution order
```

Rules: existing `.ukbt-header__brand` only (no splash duplicate);
transform/opacity only, `duration-intro` (700ms) + emphasized easing,
desktop −12px/1.03/.9, ≤430px −8px/1.02, ≤1px settle, end state
identical geometry; reduced motion = `animation: none` (final logo
immediately); storage failure and no-JS both land on the final logo;
listeners register once per document behind a `window` guard.

## Enforcement

`scripts/check-motion.mjs` (`MOTION_STATUS`) + `tests/visual/motion.spec.ts`,
both required in CI. Changing this contract is a re-approval event.

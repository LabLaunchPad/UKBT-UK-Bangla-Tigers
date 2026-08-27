# Mobile touch-target sweep — header drawer controls below the HIG/Material minimum

**Date:** 2026-08-27. Second follow-on UI/UX audit round this session, after
`MOBILE-AXE-HEADING-ORDER.md`. Same working pattern: measure in a real mobile
browser first, fix only what's a genuine, scoped finding, falsification-check,
run the full gate, ship.

## What this round measured, and what it found

A scratch script measured the bounding box of every `a`, `button`, `input`,
`[role="button"]`, and `summary` at 390×844 across all 16 routes, flagging
anything under 44×44 CSS px — the Apple HIG / Material Design recommended
minimum touch target (stricter than WCAG 2.5.8's own 24×24 floor, which
`tests/visual/mobile-ux.spec.ts`'s existing `TARGET_GROUPS` block already
enforces and which every route already passes).

284 elements came back under 44×44 across the 16 routes. The overwhelming
majority are a small number of repeated patterns — footer/drawer nav links,
social icons, inline "See more →" links — every one of them a **text link**
whose ~24px hitbox is its own line-height, already deliberately accepted at
the 24px WCAG floor (see the `TARGET_GROUPS` comment in `mobile-ux.spec.ts`,
written in an earlier session pass). Inflating every one of those to 44px
site-wide would mean touching spacing/line-height across every page's nav,
footer, and inline links — a design-system-level decision, not a scoped bug
fix, and explicitly out of scope for this pass (`CLAUDE.md`: "no scope
expansion without re-planning").

Two elements stood apart from that pattern: the header's nav-drawer
**toggle** (`#ukbt-nav-toggle`, measured 50×36) and **close**
(`#ukbt-nav-close`, measured 36×36) buttons. Unlike the text links, these are
icon-only buttons — no text label compensates for a small hitbox — and they
are the single most-used mobile interactive element on the site (every
mobile visitor touches the toggle to see the nav at all). That combination
(icon-only + highest-traffic control) is what made this pass fix them and
leave the rest as a documented, deliberately-not-fixed finding.

## Fix

- `.ukbt-header__toggle` (`Header.astro`): `padding: 10px 14px` →
  `14px 14px`. Width was already 50px; only height needed to grow
  (36px → 44px).
- `.ukbt-header__close`: `width`/`height` `36px` → `44px`.

Verified visually (a 390×844 screenshot with the drawer open) that neither
change disturbs the drawer's layout — both buttons sit exactly where they
did, just slightly larger.

## Deliberately NOT fixed

Every footer/drawer-nav/social/inline-CTA text link measured under 44px
(most at exactly ~24px, matching their line-height). These already pass the
WCAG 2.5.8 24px floor (`TARGET_GROUPS` in `mobile-ux.spec.ts`), and raising
them to 44px would require a site-wide link/spacing redesign, not a
component-local fix — an owner decision, not something to silently push
through this pass.

## Falsification-checked, per `knowledge/08-VALIDATION-POLICY.yaml` DR-010

- Reverted `.ukbt-header__close`'s `width`/`height` back to `36px` → the new
  `nav drawer close meets the 44x44 touch-target minimum` test correctly
  **failed**. Restored → passes again.
- Reverted `.ukbt-header__toggle`'s `padding` back to `10px 14px` → the new
  `nav drawer toggle meets the 44x44 touch-target minimum` test correctly
  **failed**. Restored → passes again.

## New regression test

Two tests added to the existing `tests/visual/mobile-ux.spec.ts` (same file
that already holds the 24px `TARGET_GROUPS` checks), rather than a new file —
this is the established home for mobile touch-target assertions in this
codebase.

## Gates run

| Command | Result |
|---|---|
| Touch-target sweep (all 16 routes, ad hoc script) | 0 undersized icon buttons after fix (text links unchanged, per the deliberate-exclusion above) |
| `pnpm exec playwright test tests/visual/mobile-ux.spec.ts -g "44x44"` | PASS — 2/2 |
| `pnpm exec playwright test` (full suite) | PASS — 267 passed, 1 skipped |
| `pnpm deploy:verify` | PASS (governance-scaffold, deps, lint, tokens:build, typecheck, test:unit, build, check:links) |

Regenerated visual-regression screenshots under `artifacts/ui/screenshots/`
and `artifacts/ui/delivery/` reflect the (very slightly larger) header
buttons at every viewport ≤1279px, consistent with how prior PRs in this
session (e.g. #12) have committed regenerated screenshots alongside a real
visual change.

# Page Contract: Home (`/`)

Framework-neutral, per `knowledge/13-RESPONSIVE-UX-OPERATING-MODEL.yaml` §4.
First demonstrated instance of a page contract (`EV-20260831-010`).
Section order and each section's responsive behavior below are read
directly from `apps/web/src/pages/index.astro` and each section
component's own `<style>` block — not assumed or copied from any
external reference mockup.

## Purpose

Introduce UK Bangla Tigers, establish credibility, and route visitors
toward the site's other content (tournaments, franchise, membership) and
social channels. `homepage-data.ts` supplies every fact rendered here —
this contract governs composition, not content truth (`CONTENT-CONTRACT.md`
governs that).

## Primary user action

Follow the club's social channels (`Hero`'s and `AboutCTA`'s social
links) or navigate deeper into the site via `Header`'s nav — there is no
membership/contact form live yet (`FORM-CONTRACT.md`: no backend exists),
so no "submit" action is a realistic primary goal today.

## Information hierarchy (real, from `index.astro`)

1. `Header` — brand + primary nav
2. `Hero` — tagline + social links
3. `ClubIntro` — tagline, founding stat, stat row
4. `WhyChooseUs` — reasons list
5. `AcademySection` — tagline + counters
6. `TournamentGrid` — main event + other events
7. `CaptainSpotlight` — captain name/role
8. `FranchiseTeaser` — sister-franchise summary
9. `AboutCTA` — social CTA
10. `Footer` — nav, secondary nav, social

This is the semantic order. It must not be silently reordered — a
change here is a page-contract change, not a local Astro edit.

## Section list

Each entry: purpose, priority, and its **actual** responsive
transformation (`knowledge/13` §2 vocabulary), read from the component's
own CSS, not assumed.

| Section | Purpose | Priority | Compact/Medium (≤767px / ≤1025px, per component) | Expanded+ |
|---|---|---|---|---|
| `Header` | Brand identity + navigation | Primary | **COLLAPSE** — nav-toggle (already covered by `mobile-ux.spec.ts`) | Full nav row |
| `Hero` | Primary proposition + social proof | Primary | **STACK** — row→column at ≤767px (own media query) | Row layout |
| `ClubIntro` | Founding facts, stat row | Primary | **STACK** — column-reverse at ≤1025px; stat grid 3-col→1-col at ≤767px | Row + 3-col stat grid |
| `WhyChooseUs` | Reasons to engage | Secondary | **STACK** — column at ≤1025px; 2-col→1-col grid at ≤767px | Row + 2-col grid |
| `AcademySection` | Coaching/academy proposition | Secondary | **STACK** — 3-col→1-col grid at ≤767px (no ≤1025px rule of its own) | 3-col grid |
| `TournamentGrid` | Event calendar teaser | Primary | **STACK** — main/other grids collapse to 1-col at ≤767px | 0.32fr/0.68fr split + 2-col other-events |
| `CaptainSpotlight` | Leadership proof point | Secondary | **STACK** — row→column at ≤767px | Row layout |
| `FranchiseTeaser` | Sister-franchise proposition | Secondary | **STACK** — 1fr/1fr grid→1-col at ≤1025px | 2-col grid |
| `AboutCTA` | Closing social CTA | Secondary | **STACK** — 5fr/7fr grid→1-col at ≤767px | 5fr/7fr grid |
| `Footer` | Nav + social, site-wide | Primary | **STACK** — column groups (existing behavior) | Multi-column |

No section on this page currently uses REORDER, HIDE, or SCROLL — every
transformation observed is STACK (grid/flex → single column) or, for
`Header`, COLLAPSE. This is recorded as the true current state, not a
constraint that those three are forbidden on this page — a future
section may need one, and should declare it explicitly here when added.

## Accessibility requirements

Governed by `contracts/ACCESSIBILITY-CONTRACT.md` in full — this
contract adds nothing beyond it. Heading levels on this page: `Header`
carries no heading; each section's own `h2`/`h3` levels are unchanged by
this document (verified compliant by the existing mobile axe-core sweep
referenced in several components' own code comments, e.g. `RosterGrid`'s
h3-promotion note — homepage itself was the origin of that sweep and has
no known heading-order gap).

## Required states

- `Header`'s nav toggle: expanded/collapsed (already implemented and
  tested).
- No loading/empty/error states on this page — every section renders
  from static build-time content (`homepage-data.ts`), no client-side
  data fetch exists.

## What this contract does not cover

- Any page other than `/` — see `docs/15-ux-operating-system.md` §5 for
  why further page contracts are written incrementally, not all at once.
- Content truth (what `homepage-data.ts` says) — `CONTENT-CONTRACT.md`
  and the truth gate govern that, not this document.

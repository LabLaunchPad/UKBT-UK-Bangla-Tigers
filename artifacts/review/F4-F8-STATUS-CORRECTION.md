# F4, F5, F7 status correction + F8 fix

**Date:** 2026-08-27. Continuation of the F1–F8 homepage red-team
findings from `artifacts/review/HOMEPAGE-REDTEAM.md`.

## Why this receipt exists

`docs/12-roadmap-and-open-items.md` had already been caught once this
session re-asserting a stale red-team claim as current fact (F1). Before
starting work on F4, the same current-state check was run for every
remaining OPEN finding first — and found that F4, F5, and F7 were
**already fixed**, by work this doc never reconciled. Only F8 needed new
work, and F6 remains a genuine, deliberately-deferred owner decision.

## F4 — heading-order (MEDIUM) — already fixed, re-verified

The red team's captured sequence was `h1 → h5 → h3 → h4 → h2 → h2 →
h4×4 → ...` with 4 skips. The current build's sequence, extracted the
same way (`grep -oE "<h[1-6]" dist/index.html`):

```
1 2 3 4 2 2 3 3 3 3 2 2 3 3 4 2 3 4 2 3 3 3 3 3 3 3 3
```

Zero skips (no jump greater than +1 from the previous heading level).
Confirmed by also actually running the axe scan: `homepage.spec.ts`'s
scan already includes `best-practice` in its tag list (which is what
makes `heading-order` visible — the exact gap F4 identified in the old,
narrower tag list) and passes with 0 violations.

## F5 — duplicate CTA (MEDIUM) — already fixed, re-verified

`grep -rn "Join the Club" src/` shows it in exactly two components now
(`Header.astro`, `Hero.astro` — the red team's own required fix said to
keep these two). `AboutCTA.astro`'s button was changed to "Follow on
{platform}", linking to the club's social profile — matching what that
section's own copy is actually asking for, per the required fix.

## F7 — missing foundingDate (LOW) — already fixed, re-verified

`index.astro`'s `structuredData` object already includes `foundingDate:
homepage.founded`. Confirmed in the actual built output, not just the
source: `dist/index.html`'s JSON-LD block reads
`"foundingDate":"2020"`.

## F8 — hard-coded rgba()/rgb() literals (LOW) — fixed, 3 of 4

Four literals found (none from F4-F7 refixing touched these):

| File | Literal | Disposition |
|---|---|---|
| `SubHeading.astro` | `rgb(255 255 255 / 8%)` | Converted to `color-mix(in srgb, var(--ukbt-color-neutral-0) 8%, transparent)` |
| `Footer.astro` (`__rule`) | `rgb(255 255 255 / 25%)` | Converted, same pattern, 25% |
| `Footer.astro` (`__copyright`) | `rgb(255 255 255 / 25%)` | Converted, same pattern, 25% |
| `Header.astro` (drawer overlay) | `rgb(0 0 0 / 53%)` | **Left as a literal, deliberately** |

The three white-based literals are exact restatements of
`--ukbt-color-neutral-0` (`#ffffff`) at a custom alpha — `color-mix`
lets them reference that token while keeping the opacity, with **zero
rendered color change**. Verified directly: `getComputedStyle` on the
converted elements reports `color(srgb 1 1 1 / 0.08)` /
`color(srgb 1 1 1 / 0.25)` — the exact same color as the literals they
replaced, just expressed via the token.

The fourth (a true-black modal-drawer scrim) was **not** converted. The
closest candidate token, `--ukbt-color-neutral-900` (`#17181c`), is not
true black — swapping it in would be a real, if small, visual shift, not
a same-color reference like the other three. Introducing a new "true
black" token to close this exactly would be a design-system addition,
which this fix does not make unilaterally. Recorded as a genuine,
remaining gap rather than closed with an inflated claim.

## F6 — hand-rolled panel pattern (LOW-MEDIUM) — left open, by design

Not touched. The red team's own verdict was explicit: "not urgent...
none of the seven currently disagrees visually" — the fix is to extract
a shared `Surface`/`Panel` primitive before an 8th ad hoc instance gets
added, which is a design-system shape decision (what props it exposes,
whether `Card.astro` itself gets rebuilt on top of it) rather than a
same-color token swap like F8. Deferred to the roadmap doc for an owner
decision, not decided here.

## Verification

Re-ran the full suite after the F8 change:

| Command | Result |
|---|---|
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS — 0 errors |
| `pnpm test:unit` | PASS — 21/21 |
| `pnpm build` | PASS — 16 pages |
| `pnpm run check:links` | PASS — 524 links, 0 broken |
| `pnpm --filter @ukbt/web exec playwright test` | PASS — 248/249, 1 env-gated skip |

## Net result

Of the eight Stage 8 red-team findings: **F1, F2, F3, F4, F5, F7 closed;
F8 closed for 3 of 4 instances with the 4th recorded as a genuine,
deliberate gap; only F6 remains open**, and it is explicitly an
owner-scoped refactor decision, not an outstanding bug.

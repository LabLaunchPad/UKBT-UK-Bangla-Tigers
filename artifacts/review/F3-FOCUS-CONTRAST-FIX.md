# F3 fix — focus-indicator contrast on dark-background elements

**Date:** 2026-08-27. Closes `artifacts/review/HOMEPAGE-REDTEAM.md` finding
F3 (HIGH). Owner decision this date was to fix F3 next, after F2.

## Re-verified against current code first

Per `CLAUDE.md`'s "historical evidence is not current evidence," the
red team's original 5-row table was re-measured against the code as it
stands today, not assumed still true:

| Element(s) | Red-team finding | Current state |
|---|---|---|
| `.ukbt-hero__social a` ×4 | 1.25:1 (black on navy) | **Already fixed** — `Hero.astro` sets `--ukbt-color-focus-ring: brand-accent` on `.ukbt-hero`. Measured 7.21:1. |
| `.ukbt-hero .ukbt-button` (hero CTA) | 1.25:1 (black on navy) | **Already fixed**, and confirmed genuinely fine on inspection (see below) — 7.21:1 against the gold card the ring actually renders over. |
| `.ukbt-franchise__cta a` | 1.25:1 (black on navy) | **Already fixed** — same `--ukbt-color-focus-ring` pattern in `FranchiseTeaser.astro`. 7.21:1. |
| `.ukbt-about-cta__benefit a` ×4 | 1.25:1 (black on navy) | **Already fixed** — same pattern in `AboutCTA.astro`. 7.21:1. |
| `.ukbt-footer__social a` ×4 | 1.00:1 (gold on gold) | **Still broken, for a different reason than believed** — see below. |

Four of five groups were already fixed by the time this session reached
F3 — evidently by earlier work this session (the mobile-QA pass touched
these same components) or a prior session, never reconciled back into
the roadmap doc. Only the footer social icons needed real work.

## The footer icon bug, and two dead ends before the real fix

`Footer.astro` already carried a fix attempt with the right idea and the
wrong result:

```css
a.ukbt-footer__social-icon:focus-visible {
  outline-color: var(--ukbt-color-brand-primary); /* navy */
}
```

Reading the CSSOM directly (`el.matches()` against both this selector and
the base `.ukbt-footer a:focus-visible` gold rule) showed why it never
applied: Astro's per-component scoping appends a `[data-astro-cid-*]`
attribute to **every compound selector** in a rule, not once per rule.
`.ukbt-footer a:focus-visible` scopes to
`.ukbt-footer[data-cid] a[data-cid]:focus-visible` — two scoping
attributes — while the unqualified override picked up only one,
under-specifying it despite coming later in source order. **Fix 1:**
qualify the override with the same `.ukbt-footer` ancestor so both rules
pick up the scoping attribute an equal number of times, leaving the
override's own extra class to decide it.

That alone was not enough. With the specificity fixed, a `pnpm exec
playwright test` run against the pre-existing contrast assertion in
`homepage.spec.ts` (positive default offset, ancestor-walk skipping the
element's own background) reported the navy ring at 1:1 — it was landing
in the ~2px gap between the tile and the footer's own navy, adjacent to
navy there, not to the tile's gold. Solving the WCAG contrast formula for
a single color X satisfying both `contrast(X, navy) >= 3` and
`contrast(X, gold) >= 3` simultaneously (navy's and gold's relative
luminances, 0.012 and 0.399, are far enough apart that the two
constraints' required-luminance ranges don't overlap) proves **no solid
ring color can pass both sides at once** — so no color choice alone
would ever fully close this. **Fix 2 (the real fix):** a negative
`outline-offset: -6px` keeps the ring entirely inside the 32-44px tile,
where the only adjacent color is ever the tile's own gold, at 7.21:1 on
every side. Verified with a 4×-scaled screenshot, pixel-sampled: the ring
sits fully surrounded by gold, never touching the outer navy.

### A dead end worth recording, so it isn't re-walked

Mid-investigation, `document.elementFromPoint()` was tried as a
geometry-exact way to ask "what color is actually behind the ring" —
sampling points at the ring's computed position and reading whatever
element hit-tested there. This does not work: CSS outlines are excluded
from hit-testing by spec, so `elementFromPoint` at a ring's coordinates
can never return the ring's own paint — only whatever box the layout
engine considers to occupy that point, which is a different question. It
produced contradictory readings against direct pixel sampling of real
screenshots on the same element, which is what exposed the mismatch.
Abandoned in favor of a simple, spec-guaranteed rule: a positive (or
zero) `outline-offset` always paints outside the border box (check the
ancestor, skipping the element's own background); a negative offset
always paints inside it (check the element's own background directly).
This needs no geometric guessing because it follows directly from what
`outline-offset`'s sign means, and was confirmed against zoomed,
pixel-sampled screenshots of both cases (footer icon: negative offset,
fully inset in gold; hero CTA: positive offset, ring rendered over the
gold card behind the button, not the button's own navy fill).

## What was NOT true, corrected

The original CSS comment (and this session's own early assumption)
treated the footer icon's rendered ring as **currently, visibly broken
(gold-on-gold, invisible)** in the code as found. A zoomed (4×),
pixel-sampled, focused-vs-unfocused comparison screenshot of the
unmodified code showed this was not accurate for the code as it stands
today: the small positive default offset happens to place the (gold,
due to the specificity bug) ring in the navy gap around the tile, which
is genuinely visible at 7.21:1 there. The specificity bug is real — the
code's own stated intent ("override back to navy") silently never took
effect — but it was not currently causing an invisible ring, contrary to
the stale red-team number this session almost re-asserted without
re-checking. The shipped fix is still the right thing to ship: it makes
the code's stated intent actually true, and is strictly more robust
(immune to a future spacing/gap change that could remove the accidental
navy-contrast safety net the old code was quietly relying on), but it is
not "fixing a currently-broken page" for this one element — it's closing
a latent risk. The `HOMEPAGE-REDTEAM.md` receipt is left as its own
historical record (per `CLAUDE.md`, historical evidence is not amended);
this receipt is the current-state correction.

## Test changes

`tests/visual/homepage.spec.ts`'s existing focus-contrast test needed one
change to keep validating both offset shapes correctly: it now branches
on `outline-offset`'s sign (documented inline, tied to the outline spec,
not to page-specific geometry) rather than always walking to the nearest
ancestor.

**Falsification-checked**, per `knowledge/08-VALIDATION-POLICY.yaml`
DR-010:
- Reverted only the `outline-offset: -6px` line (kept the navy color) →
  test correctly **failed** (ring escapes to the default positive offset,
  lands on navy).
- Restored the fix → test passes again.
- The pre-existing four other groups (hero social, hero CTA, franchise
  CTA, about-cta social) were re-run unchanged and still pass — this fix
  did not touch them.

## Gates run

| Command | Result |
|---|---|
| `pnpm exec playwright test tests/visual/homepage.spec.ts` | PASS — 7/7 |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm build` | PASS |

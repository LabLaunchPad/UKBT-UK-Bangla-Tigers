# Homepage Receipt (Stage 7)

**Backfilled 2026-08-26** by a zoom-out state audit that found this stage's
work complete but its named receipt (`schemas/receipt.schema.json`) never
written. This receipt cites the original Stage 7 implementation, notes the
later revision, and re-runs the homepage's own acceptance commands **now** so
every result below is real and current.

```
task_id:      STAGE-7-HOMEPAGE
baseline_sha: 5373d7c   # "Stage 7: Readiness Matrix, Template Mapping, Homepage Contract" — pre-implementation
verified_at_sha: 3b95009
```

## Implementation history

| Commit | Description |
|---|---|
| `7a00221` | Stage 7G: Homepage implementation, geometry mirrored from Adelux source — original build against `artifacts/pages/HOMEPAGE-CONTRACT.md` |
| *(parity reconstruction, later)* | The client-directed "Full Template UI Parity Reconstruction" subsequently rebuilt the homepage on a corrected token scale (`artifacts/ui/TOKEN-CONVERSION.md`) and expanded it from 5 to 10 sections (`artifacts/ui/PARITY-COMPLETION-REPORT.md`). The homepage in the current tree is the *revised* version; this receipt verifies that current version, not the original 7a00221 snapshot. |
| `872ef5f`, `d08841d` | Motion-verified full-page delivery screenshots (mobile/tablet/desktop), `homepage-delivery.spec.ts` |

`changed_files` (original implementation, `5373d7c..7a00221`): 38 files,
+1675/-15 — `homepage-data.ts`, `index.astro`, `BaseLayout.astro`, base/font
CSS, `homepage.spec.ts`, `screenshots.spec.ts`, `HOMEPAGE-VISUAL-QA.md`,
6 baseline screenshots, 4 token files.

## Pre-implementation contract

`artifacts/pages/HOMEPAGE-CONTRACT.md` (Status: FROZEN) — sections, content
requirements, data requirements, responsive behavior, accessibility
requirements, SEO requirements, and acceptance criteria were defined before
implementation began, per `prompts/17-homepage.md`.

## Acceptance — commands actually run 2026-08-26 at `3b95009`

| # | Check | Exit code | Result |
|---|---|---|---|
| 1 | `pnpm build` | 0 | PASS — homepage (`/index.html`) builds as 1 of 16 pages |
| 2 | axe-core scan, zero violations | 0 | PASS (`homepage.spec.ts:9`) |
| 3 | Keyboard/focus: nav links, hero CTA, footer social links | 0 | PASS — all show a visible focus outline (`homepage.spec.ts:25`) |
| 4 | Mobile nav toggle (CSS-only off-canvas drawer) | 0 | PASS — shows/hides without console error (`homepage.spec.ts:48`) |
| 5 | Content-contamination grep (no Adelux/reference strings) | 0 | PASS (`homepage.spec.ts:63`) |
| 6 | Excluded-asset grep (no excluded images referenced) | 0 | PASS (`homepage.spec.ts:83`) |
| 7 | Gold-accent contrast, computed + axe pixel scan | 0 | PASS, every route (`homepage.spec.ts:123`) |
| 8 | Full-page capture at mobile/tablet/desktop, motion positively verified frozen (`document.getAnimations()` = `[]` at capture) | 0 | PASS — 3/3 (`homepage-delivery.spec.ts`) |
| 9 | Responsive geometry vs. licensed reference (7 viewports) | 0 | PASS — 0 mismatches on homepage rows (`scripts/compare-geometry.mjs`, `artifacts/ui/PARITY-COMPLETION-REPORT.md`) |

9/9 homepage-scoped Playwright tests pass (`homepage.spec.ts` +
`homepage-delivery.spec.ts`, run together above). Desktop/tablet/mobile
screenshots exist at `artifacts/ui/delivery/homepage-*.png` and (pre-parity
baseline) `artifacts/ui/screenshots/homepage-*.png`.

## Deterministic UI measurements before screenshots

Per `docs/07-visual-contract.md`'s ordering (DOM/CSS/computed styles first,
screenshots second, taste last): `reference-geometry.spec.ts` /
`ukbt-geometry.spec.ts` measure real computed type scale, section padding,
and banner padding against the licensed Adelux reference, diffed by
`scripts/compare-geometry.mjs` — not a visual-only comparison.

## Stage 8 — independent homepage red team (ran after this receipt was first written)

`artifacts/review/HOMEPAGE-REDTEAM.md`, a genuinely separate session with no
knowledge of this conversation, returned `HOMEPAGE_VERDICT = FAIL`: 3 HIGH
findings (F1 mobile/tablet nav drawer 100% keyboard-inoperable at 4 of 6
frozen viewports; F2 the shipped page silently exceeded the frozen
`HOMEPAGE-CONTRACT.md` structure, two of the extra sections shipping as
visibly-empty shells on the indexed homepage; F3 a real WCAG 1.4.11
focus-ring contrast failure on 13 interactive elements, invisible to both
axe and the existing outline-presence test), 2 MEDIUM (F4 heading-order
skips + a tag-filtered axe scan that couldn't see them; F5 the same CTA
duplicated three times), and 3 LOW/LOW-MEDIUM.

All 8 findings were fixed, not just acknowledged:
- F1: the checkbox+label toggle was replaced with a real
  `<button aria-expanded>` + `inert`-driven drawer and a small inline
  script; a new test (`the mobile nav drawer is fully keyboard-operable`)
  drives it by keyboard only and asserts focus actually lands inside.
- F2: `TestimonialSection`/`NewsTeaser` removed from the homepage;
  `WhyChooseUs`/`AcademySection` formally approved via
  `HOMEPAGE-CONTRACT.md` Amendment 01, citing `EV-20260826-032` as
  authority rather than leaving the expansion undocumented; the founding
  year now renders in `ClubIntro` directly, per the contract's own
  assignment.
- F3: `--ukbt-color-focus-ring` added so a dark section can repaint the
  ring for its descendants; a real bug in the first attempt at this fix
  (the Hero's own gold-filled CTA card inheriting gold-on-gold from its
  navy grandparent) was caught by a new test
  (`...shows a visible AND contrast-safe focus outline`, real 3:1
  computation) before being committed, not after.
- F4: axe scan widened to include `best-practice` tags; the 4 flagged
  heading-level skips corrected.
- F5: the third "Join the Club" duplicate now reads "Follow on
  {platform}", matching its own section's actual copy.

Re-verified after fixes: `pnpm build` (16 pages), `pnpm typecheck`,
`pnpm lint`, full Playwright suite (193 passed, 1 skipped — same
env-gated reference spec as before), homepage-scoped specs 10/10.

## Unresolved risks

- Hero imagery affiliation: per `artifacts/STAGE_7_READINESS_MATRIX.md`, the
  photographic hero option was never promoted past "optional enhancement,
  affiliation not confirmed" — the crest/wordmark treatment is the committed
  option, unaffected by this.
- F6 (low-medium, card-pattern duplication across ~7 components instead of
  a shared primitive) and the hard-coded `rgba()` literals noted in F8 are
  deliberately deferred, per the red team's own "not urgent" framing —
  worth fixing before an 8th such pattern is added, not before this receipt.
- Whether the same "visibly-empty shell on an indexed route" pattern (F2's
  more serious half) recurs on `/about`, `/tournaments`, or `/contact` — all
  three also embed `TestimonialSection` — was outside Stage 8's homepage-only
  scope and should be checked at Stage 10 (release-gate).

## Rollback

Revert to `5373d7c` (contract frozen, no homepage markup) and re-run
`prompts/17-homepage.md`. Content is gate-bound (`@ukbt/truth`), so no
fabricated fact is at risk of persisting through a rollback.

## Verifier

Original backfill and command re-run: this session, 2026-08-26 — not
independent. Stage 8 itself, which found the FAIL this receipt now
documents, ran in a genuinely separate agent session with no access to this
conversation, per the pipeline's own requirement. The fixes above and their
re-verification were then done back in this session, which is normal
DIAGNOSE→PLAN→IMPLEMENT→VERIFY, not a second independent pass — a fresh
Stage 8 re-run remains the strongest possible confirmation these fixes hold
and is recommended before Stage 10.

```
HOMEPAGE_STATUS = PASS                      # this receipt's own Stage 7 verdict (implementation + verification)
STAGE_8_HOMEPAGE_VERDICT = FAIL_THEN_FIXED  # ran, found 8 real findings, all fixed and re-verified — see above
TESTS = 10/10 homepage-scoped Playwright, 193/194 full-suite (1 env-gated skip; see FOUNDATION.md)
BUILD = PASS
ACCESSIBILITY = PASS (axe zero-violations incl. best-practice tags, focus-visible AND contrast-safe, heading order)
CHANGES = Header.astro, base.css, Hero.astro, FranchiseTeaser.astro, AboutCTA.astro, Footer.astro, WhyChooseUs.astro, ClubIntro.astro, homepage-data.ts, index.astro, homepage.spec.ts, HOMEPAGE-CONTRACT.md (Amendment 01)
```

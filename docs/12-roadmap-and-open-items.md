# Roadmap & Open Items

**Status:** LIVING DOCUMENT — update in place as stages/items close, don't
fork a second copy. Last updated 2026-09-06.

**Purpose:** one place that answers "what's done, what's next, what's
blocked, and on whom" without re-deriving it from receipts scattered across
`artifacts/`. This document adds no new facts — every line below cites the
receipt, contract, or CI run it comes from. If something isn't cited, it's
a gap in this document, not a new claim.

Per `CLAUDE.md`: UNKNOWN stays UNKNOWN. No target date appears below unless
a real one was set by the site owner — there is currently no production
launch date, so none is invented here.

---

## 1. Pipeline stage status

Stages per `docs/10-fresh-repo-pipeline.md`. This table is the single
source of truth for "what stage are we at" — update it when a stage's
gate changes state, not the paragraph prose elsewhere.

| # | Stage | Status | Evidence |
|---|---|---|---|
| 1 | Bootstrap discovery | DONE | `artifacts/bootstrap/` |
| 2 | Architecture red team | DONE | `artifacts/verification/ARCHITECTURE-REDTEAM.md` |
| 3 | Contract freeze | DONE | `contracts/REPOSITORY-CONTRACT.md` + the rest of `contracts/` |
| 4 | Foundation build | DONE | `artifacts/receipts/FOUNDATION.md` |
| 5 | Design system | DONE | `artifacts/ui/DESIGN-SYSTEM.md` |
| 6 | Reference analysis | DONE (evidence-based, not live-template) | `artifacts/ui/REFERENCE-ANALYSIS.md`, `knowledge/06-TEMPLATE-BOUNDARY.yaml` |
| 7 | Homepage | DONE | `artifacts/pages/HOMEPAGE-CONTRACT.md`, `artifacts/receipts/HOMEPAGE.md` |
| 8 | Independent homepage red team | DONE, all 8 findings remediated (F8 has one deliberate, documented partial exception) | `artifacts/review/HOMEPAGE-REDTEAM.md` — see § 2.1 below |
| 9 | Scale to remaining pages | DONE for route count (16 routes exist under `apps/web/src/pages/`) — content completeness is a separate, **partially blocked** item, see § 3 | route list: `about, club-captain, coaching, community, contact, design-system, faq, franchises, index, join, membership, news(+[slug]), players, services, tournaments, 404` |
| 10 | Full-site verification & release | **PASS** (2026-08-27 re-run) | `artifacts/receipts/RELEASE.md` — `RELEASE_STATUS = PASS`; see § 2.2 |
| 11 | Adaptive learning + replay | NOT STARTED | Stage 10 now passes; this can start |

**Net position:** the site is built, deployable, and the release gate
passes cleanly as of the 2026-08-27 re-run (all three prior gaps closed:
content-schema drift, route/link integrity, SEO completeness). Two
non-blocking caveats remain, named honestly rather than silently
resolved: canonical URL is a genuine `UNKNOWN` pending a production-domain
decision, and branch protection on `main` is a repo-admin action outside
any code gate (§ 2.3). Client-content items are tracked separately in
§ 3 and don't block the release gate itself.

---

## 2. Open engineering to-dos (owner: this repo / whoever drives it next)

### 2.1 Homepage red-team findings — `artifacts/review/HOMEPAGE-REDTEAM.md`

Independently red-teamed in a separate session per pipeline rule 5. Eight
findings (F1–F8), severities as scored in that receipt:

| Finding | Severity | What | Status |
|---|---|---|---|
| F1 | HIGH | Mobile/tablet nav drawer is 100% keyboard-inoperable | **CLOSED** — was already fixed before this entry was written; listing it as OPEN was an error, corrected 2026-08-27. Verified empirically at 390×844 (`artifacts/review/MOBILE-VISUAL-QA.md`): toggle reachable on Tab #3, Enter opens, all 8 links tab-reachable, Escape closes and restores focus. Two *new* drawer defects found during that verification (no focus containment, no background scroll lock) were fixed in the same pass. |
| F2 | HIGH | Homepage silently expands beyond the frozen `HOMEPAGE-CONTRACT.md` structure (WhyChooseUs/AcademySection/AboutCTA present but not in the approved 8-section list) | **CLOSED** 2026-08-27 — owner decision: extend the contract rather than cut the sections. `HOMEPAGE-CONTRACT.md` Amendment 02 approves `AboutCTA` (Amendment 01 already covered `WhyChooseUs`/`AcademySection`) and replaces the "Structure" list with the 10-item structure that actually ships, closing the drift Amendment 01 left open. |
| F3 | HIGH | Focus-indicator contrast failure on every dark-background interactive element (real WCAG 1.4.11 failure, invisible to the existing outline-presence test) | **CLOSED** 2026-08-27 — see `artifacts/review/F3-FOCUS-CONTRAST-FIX.md`. Re-verified against current code first: 4 of 5 originally-flagged groups already carried a working per-surface `--ukbt-color-focus-ring` fix; only the footer social icons still failed, for a real reason the original fix comment got wrong (a CSS-specificity bug meant its override never applied). Fixed with an inset (negative-offset) ring, the only geometry where a single solid color can pass 3:1 against both the icon's gold tile and the page's navy at once (no such color exists for a ring that straddles both — proven by solving the WCAG formula for both constraints simultaneously). |
| F4 | MEDIUM | Heading hierarchy skips levels four times; the "0 axe violations" claim only holds for a filtered rule subset | **CLOSED** — re-verified 2026-08-27: current build's heading sequence (`grep -oE "<h[1-6]" dist/index.html`) has zero level-skips, and `homepage.spec.ts`'s axe scan already includes the `best-practice` tag (catches `heading-order`) and passes with 0 violations. Fixed by earlier work, never reconciled back into this doc. |
| F5 | MEDIUM | Identical primary CTA ("Join the Club" → `/contact`) duplicated three times on one page | **CLOSED** — re-verified 2026-08-27: `AboutCTA.astro`'s button no longer says "Join the Club"; it reads "Follow on {platform}" and links to the club's social profile, per the red team's own required fix. Header and Hero keep the join CTA (two instances, not three). |
| F6 | LOW-MEDIUM | The "dark rounded panel" surface pattern is hand-rolled ~7 times instead of composing `Card.astro` | **CLOSED** 2026-08-27 — owner decision: implement now. See `artifacts/review/F6-SURFACE-PRIMITIVE.md`. New `Surface.astro` primitive (background/foreground/radius/padding only, raw token passthrough not a fixed enum) migrated into 4 of 5 flagged components (`NewsTeaser` deliberately excluded — an `<a>`-element card with a different box model, not a clean fit). Verified zero visual change via direct computed-style comparison. Migrating surfaced and fixed a real regression: Astro's per-component scoping meant several `.some-class descendant` selectors silently stopped matching once `Surface` (a separate component) rendered the ancestor div — caught by the existing axe/contrast tests, fixed with `:global()`, and given a dedicated regression test. |
| F7 | LOW | Structured data omits the founding year even though the fact is available on the same page | **CLOSED** — re-verified 2026-08-27: `index.astro`'s `structuredData` already includes `foundingDate: homepage.founded`; confirmed in the built output (`dist/index.html`'s JSON-LD has `"foundingDate":"2020"`). Fixed by earlier work, never reconciled back into this doc. |
| F8 | LOW | Hard-coded `rgba()`/`rgb()` literals (should reference design tokens) | **CLOSED** 2026-08-27, mostly. 3 of 4 literals (`SubHeading.astro`, `Footer.astro` ×2 — all white-at-opacity) converted to `color-mix(in srgb, var(--ukbt-color-neutral-0) N%, transparent)` — same rendered color (verified: computes to `color(srgb 1 1 1 / 0.08)`, bit-identical to the old `rgb(255 255 255 / 8%)`), token reference only. The 4th (`Header.astro`'s `rgb(0 0 0 / 53%)` drawer-overlay scrim) was deliberately left as a literal: it's a true-black dim, and the closest token (`neutral-900`, `#17181c`) is not true black — swapping it in would be a real color shift, not a same-color reference, so it's recorded as a genuine gap rather than silently "fixed" with a slightly different color. |

**Corrected 2026-08-27:** the sentence previously here said "none of
F1–F8 have been fixed". That was written from the red-team receipt
without re-verifying against current code — the exact
"historical evidence is not current evidence" failure `CLAUDE.md` warns
about, and one this doc kept re-committing on later findings too (F4/F5/F7
were already fixed by the time this doc first listed them as OPEN). **All
eight findings are now closed** (F8 has one deliberate, documented partial
exception — see its row above).

A separate mobile-only visual QA pass (2026-08-27,
`artifacts/review/MOBILE-VISUAL-QA.md`) found and fixed six further
mobile defects not in the F1–F8 set — including real page-level
horizontal scroll on `/club-captain` at 320/360px, which the frozen
visual-regression matrix cannot see because its narrowest viewport is
390px.

A further follow-on round (2026-08-27, `artifacts/review/MOBILE-AXE-HEADING-ORDER.md`)
found that `playwright.config.ts`'s only project is Desktop Chrome, so
every axe-core scan in the suite had only ever run at desktop viewport —
no route had a full accessibility scan at mobile width before this round.
A dedicated mobile sweep across all 16 routes found 4 real `heading-order`
violations (`/about`, `/franchises` ×2, `/community`) — the same class of
bug as F4, but F4's fix and check were scoped to the homepage only — plus
an H1→H3 skip on `/404` (the only route with no H2 of its own). All fixed;
a new permanent regression test, `tests/visual/mobile-axe.spec.ts`, sweeps
all 16 routes at mobile viewport so this class of gap can't silently
reopen. `AboutStory.astro`'s pre-existing (non-flagged) h4-before-h2
ordering was deliberately left alone — out of scope without an actual
finding behind it.

A third round (2026-08-27, `artifacts/review/MOBILE-TOUCH-TARGET-SWEEP.md`)
measured every interactive element's tap target at 390×844 across all 16
routes against the 44×44 HIG/Material recommendation (stricter than WCAG
2.5.8's own 24px floor, which every route already passes per the existing
`TARGET_GROUPS` checks in `mobile-ux.spec.ts`). Of 284 undersized elements
found, all but two were text links whose ~24px hitbox is their own
line-height — already deliberately accepted at the WCAG floor; inflating
every nav/footer/social link site-wide would be a design-system-level
redesign, out of scope here. The two genuine fixes were the header's
icon-only nav-drawer toggle (50×36) and close (36×36) buttons — the
single most-used mobile control on the site — both raised to 44×44, with
new regression tests added to `mobile-ux.spec.ts`.

### 2.2 Release-gate gaps — `artifacts/receipts/RELEASE.md`

Of the four gaps that receipt originally found:

1. ~~Route/internal-link integrity~~ — **CLOSED**. `check:links` job
   (`scripts/check-internal-links.mjs`) now runs in CI and locally.
2. ~~SEO metadata completeness~~ — **CLOSED**. `pages.spec.ts` asserts
   non-empty, non-placeholder title + description on all indexable routes.
3. ~~Content-schema drift~~ — **CLOSED.** Re-verified 2026-08-27: this
   entry was stale — the fix already exists in the repository (committed
   as part of the original bootstrap build, `50e15a4`) and was simply
   never reconciled back into this doc, the same class of staleness
   corrected for F4/F5/F7 in § 2.1. Owner decision recorded in
   `contracts/CONTENT-CONTRACT.md`'s 2026-08-27 amendment was **Option
   A** (preserve the compile-time guarantee) — confirmed again
   2026-08-27 when this item was raised as a live decision. What's
   actually in the repo: `ContentRecordSchema`
   (`packages/truth/src/schema/provenance.ts`) is a Zod mirror of the
   real per-field `{field, value, status, sources}` shape content
   actually uses (not the Stage-3 aggregate types like `ClubInfo`, which
   no real content file's shape ever matched — see the contract
   amendment for why forcing that fit would have meant inventing
   placeholder fields). All 5 real content files
   (`apps/web/src/content/{homepage,about,captain,tournaments,franchises}-data.ts`)
   call `ContentRecordSchema.parse(...)` before `evaluate()` runs;
   `packages/truth/src/schema/content-types.test.ts` (9 tests, passing)
   verifies an invalid `status` value throws at parse time. Confirmed
   2026-08-27 with a fresh `pnpm deploy:verify` run — clean. The
   Stage-3 aggregate types remain genuinely unused by any real content
   file; whether to reshape content to populate them, retire them, or
   leave them for content types not yet gathered (fixtures/results don't
   exist yet) is recorded as a separate, smaller, still-open question in
   the contract's own amendment — not resolved here.
4. ~~Stale CI trailing-comment claim~~ — **CLOSED**, corrected to name
   which of the three original gaps are closed, enforced-elsewhere, or
   still absent.

### 2.3 CI/CD and deployment plumbing (this session)

The `main`-push deploy path (`workers-deploy` job in
`.github/workflows/ci.yml`, `cloudflare/wrangler-action@v4`) needed three
sequential fixes before it produced a real deploy — each one only visible
once the previous one was fixed, since each failure fully masked the next:

1. **Invalid YAML** (unquoted `name: Workers Builds: uk-bangla-tigers`)
   silently broke the entire workflow (0 jobs ever ran) — fixed.
2. **Worker name mismatch** (`wrangler.jsonc`'s `name` didn't match the
   Cloudflare-dashboard-renamed Worker) — every Workers Build failed
   instantly, 0-second duration, no logs — fixed (`contracts/
   DEPLOYMENT-CONTRACT.md`'s 2026-08-27 amendment).
3. **`workers-deploy` job missing `pnpm`/Node setup entirely** (dropped in
   an earlier simplification) — fixed via PR #9.
4. **`workers-deploy` job missing an install step, and `wrangler` declared
   only in `apps/web/package.json`** (invisible to `pnpm exec`/`pnpm add`
   run at the workspace root, which is where both `wrangler-action` and
   Cloudflare's own dashboard deploy command run from) — fixed via PR #10,
   merged as `f8d030c`.

**Status as of this update:** CLOSED. PR #10 merged as `f8d030c`; the
resulting push-to-main CI run's `workers-deploy` job completed with
`conclusion: success` (all 11 jobs green, including the "Deploy Workers"
step itself) —
https://github.com/LabLaunchPad/UKBT-UK-Bangla-Tigers/actions/runs/33042878477/job/98420743484.
This is the first fully successful GitHub-Actions-driven Cloudflare
Workers deploy after the four stacked fixes above.

**Still open, dashboard-only, cannot be fixed from this repository:**
- **Branch protection is not applied to `main`** (`docs/11-github-
  branch-protection.md` — `protected: false`, verified via the GitHub API).
  The rule, required-check list, and rationale are fully specified in that
  document; an admin must apply it in the GitHub web UI. Do this before
  treating `main` as a real production branch — right now a single
  mistaken push or force-push has no guard.
- **Cloudflare dashboard's Build command field**: reported empty in one
  amendment, then reported populated in a later dashboard screenshot
  supplied directly by the owner — not independently re-verified from
  this session against a fresh build log since. Confirm on the next real
  Workers Builds run before considering this fully closed.

### 2.3b Visual truth system adopted; 1920×1080 transcription gap CLOSED

- **CLOSED 2026-08-31** — `contracts/VISUAL-REGRESSION-CONTRACT.md`
  AMENDMENT 01 added 1920×1080 to the frozen matrix on 2026-08-26, but
  `apps/web/tests/visual/viewports.ts` still listed six viewports and
  still called itself "the frozen 6-viewport matrix". Every visual,
  responsive and screenshot run in those five days therefore exercised
  six viewports against a seven-viewport contract. Classified
  `CODE_DRIFT`; closed by transcribing the seventh viewport and
  capturing the 14 missing 1920×1080 screenshots plus geometry rows —
  never by narrowing the contract. See AMENDMENT 02 §1,
  `artifacts/visual/DECISION-LEDGER.md` VD-002, `EV-20260831-003`.
- **Measured at the newly-exercised width, no defect found.** The 1920
  row exists to observe centring and full-bleed behaviour above the
  1340px container cap. Measured on the homepage: container renders
  1340px wide, centred (290px each side); no horizontal overflow on any
  route at any of the seven viewports. Painted `.ukbt-section` panels
  measure viewport-minus-gutter at *every* width (30px gutter ≥1280,
  20px at 768–1024, 10px at 390) — consistent inset design, not a
  1920-specific regression. Recorded so the next reader does not
  re-investigate it.
- **New governance, now in force for UI work:**
  `docs/13-visual-truth-system.md` (nine roles, state machine,
  activation policy, ledger, drift model),
  `docs/14-tool-selection-layer.md` (authoritative tool per fact,
  UKBT's detected stack, adapter applicability),
  `knowledge/11-VISUAL-TRUTH-POLICY.yaml`, and the new `visual_never`
  block in `knowledge/10-ANTI-DRIFT-RULES.yaml`.

### 2.5 September 2026 work: captain profile links, full-codebase audit, P0 batch

**Captain profile links (2026-09-06, commit `96ea42a`).** Mohammad
Chowdhury's six stats-provider URLs (ESPN Cricinfo, Play-Cricket,
CricHeroes, LMS, NCL, CREX — supplied directly, not transcribed from the
ingestion PDF) wired as external links on `/club-captain`
(`captain-data.ts:186-211`, `club-captain.astro:109`). London Blaze and
Roma Ovest Titans moved Previous → Current per client confirmation.
The new gold-on-cream links failed axe color-contrast (2.12:1, needs
4.5:1) — fixed by switching link color to navy `#001E3A` (~15:1).
Verified: lint clean, typecheck 0 errors, build 17 pages,
`pages.spec.ts` 90/90.

**Full-codebase audit (2026-09-06).** Token system (143 tokens, generated
CSS matches source 1:1, ~30 dead tokens), 29-component visual QA, and
content/link integrity audited in one pass. Findings, impact-ordered:

- **P0 (all closed in `cba671d`, see below):** double-`h1` on
  `/club-captain`; NCL `http://` URL; stale anti-fabrication comments;
  uncommitted `playwright.config.ts` drift; stale crest-only portrait
  test.
- **P1 (open):** missing `:focus-visible` on SocialLinks links,
  PageBanner breadcrumbs, FranchiseTeaser link, StatsTable scroll
  wrapper; `ProfileHeader` flex overflow risk at 320–767px; franchise
  comment-vs-array contradiction risk (comment fixed, array is source of
  truth); `/design-system` missing from ROUTE-CONTRACT; hand-authored
  JSON-LD vs SEO-CONTRACT rule.
- **P2 (open):** five 24px touch floors (meet WCAG 2.2 AA, below 44px
  best practice); no shared `Link` primitive (five link treatments);
  ~21% dead tokens; 767/768 breakpoint seam; `Button` has no `external`
  prop; `check:links` was internal-only (now also gates `http://`).

**P0 batch (2026-09-06, commit `cba671d`).** ProfileHeader name `h1`→`h2`
(`/club-captain` now exactly one `h1`, verified in built HTML); NCL
`https://`; fabrication comments rewritten to cite the client-supplied
source; `playwright.config.ts` restored to the pinned `127.0.0.1` +
preview-`dist` version; `check-internal-links.mjs` now FAILs on any
`http://` href; portrait test updated to assert the client-confirmed
portrait (EV-20260831-008). Verified: lint clean, typecheck 0 errors,
build 17 pages, `check:links` PASS (695 internal, 0 insecure), built
HTML holds 1× `h1`, 1× portrait, 0× `http://`. Full Playwright e2e runs
on CI (ubuntu) — this Windows box cannot execute the Linux-pinned
browser path, so browser-dependent checks are CI-verified, not claimed
locally.

### 2.6 Minor, informational, not blocking anything

- **`crest-512.png` is supplied at 512px into 44-106px mobile slots**
  (4.8x-11.6x oversupply, measured 2026-08-27). Real mobile transfer-size
  waste. Closing it means generating smaller raster variants and updating
  `apps/web/src/assets/MANIFEST.md` provenance — asset work, not a CSS fix.
- **Frozen visual-regression matrix has no viewport below 390px**
  (`contracts/VISUAL-REGRESSION-CONTRACT.md`). A real horizontal-scroll
  defect on `/club-captain` existed only at 320/360px and was therefore
  structurally invisible to it. `apps/web/tests/visual/mobile-ux.spec.ts`
  now covers those widths separately; folding them into the frozen matrix
  would be a contract amendment and has not been done unilaterally.
- Header height at desktop viewport measures 182px against a 162px
  reference-evidence target after the responsive padding fix (PR #7,
  merged) — root-caused to UKBT's own separate fixed 60px logo asset, not
  the padding fix. Documented, not chased further (would require a logo
  decision, out of scope for that task).

### 2.7 External audit triage (2026-09-06)

An outside audit (no local execution — DNS-blocked, public tree only)
returned **SHIP_BLOCKED** with 5 P0 + 6 P1 findings. Every code claim
was re-verified locally this session before accepting it:

| Claim | Verdict |
|---|---|
| SEO contract violated: hand-built JSON-LD, no canonical/sitemap pipeline (`grep canonical\|sitemap = 0` hits in `src/`) | **CONFIRMED** — same finding as § 2.5 P1; still open |
| Canonical domain unknown | **CONFIRMED** — still `PENDING`, owner decision (§ 3) |
| Content ships as `pending_review` (8 hits across content modules) | **CONFIRMED** — needs a machine-enforced publish gate, still open |
| `main` branch protection | **UNVERIFIED this session** (no API access) — recorded open in § 2.3; admin action |
| No contact/form backend (0 `<form` in pages) | **CONFIRMED, deliberate** — shells by design until a backend exists (FORM-CONTRACT) |
| Actions tag-pinned, not SHA-pinned (all `uses:` are `@v4`/`@v2` tags) | **CONFIRMED** — still open |
| No `permissions:` block in `ci.yml` (0 hits) | **CONFIRMED** — still open |
| No `_headers` in `apps/web/public/` | **CONFIRMED** — still open |
| Spotlight unconditional / Sentry env-gated | **CONFIRMED** (`astro.config.mjs:11-14`) — needs production review |
| No perf budget, no live-site verification, no staleness enforcement | **CONFIRMED** (0 hits for budget tooling) — still open |
| "16 routes / 531 links" counts | **STALE** — now 18 pages, 695 internal links checked |

**Reconciliation with `RELEASE_STATUS = PASS`:** no contradiction. The
release gate passes for what it measures (code gates); the external
P0s are governance/operational (domain, approval, branch protection,
backend) plus real but ungated code gaps (SEO pipeline, headers, CI
hardening). Honest state: **release gate PASS, production SHIP_BLOCKED**
until the § 4 sequence below closes them. The auditor's phased ship
sequence (domain → metadata pipeline → security → journeys →
performance → live verification → release controls) is adopted as the
plan of record — see § 4.

### 2.8 SEO production pipeline shipped (2026-09-06)

Owner supplied the production domain (`https://ukbanglatigers.co.uk`);
Slices A+B of the approved SEO plan are implemented and merged:

- `src/lib/seo.ts`: SITE, canonical normalization (root `/` keeps
  slash, all other routes strip it), OG defaults (absolute 1200×630
  social card + alt), gated emitters (`homepageGraph`, `aboutGraph`
  with org-by-`@id`, `captainGraph` with Person + BreadcrumbList),
  `SEO_ROUTES` registry (12 indexable, 4 noindex).
- `BaseLayout.astro`: auto-canonical from `Astro.url` (indexable only,
  never on noindex/404), `index, follow, max-image-preview:large`
  robots, full OG/Twitter set, JSON-LD graph arrays.
- 3 hand-built JSON-LD blocks migrated to emitters; `design-system`
  page noindexed + described; `tournaments`/`faq` titles aligned to
  banners; `coaching` description rewritten after the new gate caught a
  real `about`/`coaching` description duplicate (same gated tagline).
- `public/robots.txt`, dist-derived `sitemap.xml` (12 URLs, no manual
  list), `scripts/check-seo.mjs` (`SEO_STATUS`), `tests/visual/seo.spec.ts`,
  `seo-gate` CI job, `deploy:verify` extended.
- `SEO-CONTRACT.md` Amendment 01 records the implementation.
- Verified fresh: `deploy:verify` fully green incl. `SEO_STATUS = PASS`
  (lint, typecheck 0 errors, unit 21/21, build 17 pages, links 695/0,
  seo 0 failures). Playwright suites (incl. `seo.spec.ts`) execute on CI.

---

## 3. Client-blocked content items (owner: UK Bangla Tigers club)

Full detail lives in `artifacts/content/CLIENT-ASK-LIST.md` — this is a
condensed pointer, not a fork of it. Update the source file, not this
list, when an item closes.

- Contact details (phone, email, venue, hours).
- Full player roster, full committee list, coaching staff names/roles.
- UKBT + Uppsala Tigers squad photos (blocked on direct file upload —
  tooling can't fetch from Google Drive).
- Photography rights confirmation for two watermarked photos.
- FAQ answers, membership tiers/terms, programme pricing, join/trial
  process, match reports/news, a real consented testimonial, full About
  Us history, sponsor names.
- Decisions: production domain, brand typography confirmation, whether a
  working contact form is wanted (none shipped — a form with no backend
  would silently drop real inquiries), analytics/tracking posture.

None of the above blocks a code fix. All of it blocks on information only
the club can supply.

---

## 4. What "next" means concretely

In priority order, next real work is:

1. ~~Confirm the `workers-deploy` job's actual success~~ — **done**, see
   § 2.3.
2. ~~Resolve F2's scope-expansion question~~ — **done**, 2026-08-27:
   owner chose to extend the contract; `HOMEPAGE-CONTRACT.md` Amendment
   02 approves `AboutCTA` and corrects the structure list.
3. ~~Fix F3 (focus-indicator contrast)~~ — **done**, 2026-08-27, see § 2.1.
4. ~~Re-verify F4/F5/F7 and fix F8~~ — **done**, 2026-08-27: F4, F5, F7
   were already fixed by earlier work and are now correctly marked
   closed (see § 2.1); F8 closed for 3 of 4 literals, 1 left as a
   documented, deliberate gap (see § 2.1).
5. ~~Decide on F6~~ — **done**, 2026-08-27: owner chose to implement now.
   `Surface.astro` primitive shipped, migrated into 4 of 5 flagged
   components. See § 2.1.
6. ~~Decide (A) or (B) for the content-schema drift~~ — **done**,
   2026-08-27: Option A was already implemented (see § 2.2 item 3); this
   doc's "STILL OPEN" label was stale and is now corrected.
7. Apply branch protection to `main` (§ 2.3 — owner action, not gated on
   anything else; can happen any time).
8. Work through `CLIENT-ASK-LIST.md` (§ 3) as the club supplies each item.
9. ~~Re-run the Stage 10 release gate~~ — **done**, 2026-08-27:
   `RELEASE_STATUS = PASS`, see § 1 and `artifacts/receipts/RELEASE.md`.
   Canonical URL and branch protection remain open as named, non-blocking
   caveats (§ 2.3), not gate failures.

Stage 11 (adaptive learning + replay) can start now that Stage 10 passes
clean — see `prompts/07-replay-stress.md` (or the `replay-stress` skill)
for what that stage actually does.

10. Work through the September audit's remaining P1/P2 items (§ 2.5) —
`Link` primitive, dead tokens, breakpoint seam, `/design-system`
contract entry. None blocks the release gate; each is a small,
independently committable fix (`focus-visible` gaps and ProfileHeader
overflow merged as `cadb7b4`).
11. External-audit ship sequence (§ 2.7): Phase 1 production SEO is
done (§ 2.8); Phase 2 CI/security hardening is done (§ 2.12).

### 2.12 Security hardening shipped (2026-09-06)

- **Least privilege:** top-level `permissions: contents: read`;
  `actions: write` only on the two artifact-upload jobs,
  `actions: read` on `workers-deploy`.
- **SHA-pinned actions:** all 7 `uses:` resolved via the GitHub API to
  commits (checkout, pnpm-setup, setup-node, upload/download-artifact,
  wrangler, gitleaks) with `# vN` trailers. Note: the gitleaks v2 tag
  itself is unsigned upstream — pin still fixes the consume-side risk.
- **`public/_headers`:** HSTS (no `includeSubDomains` — subdomain TLS
  posture unknown, honestly omitted), nosniff, DENY framing (+
  `frame-ancestors 'none'`), strict referrer, minimal
  permissions-policy, self-based CSP. `unsafe-inline` is required, not
  laziness: Astro bundles component scripts and scoped styles inline
  with per-build hashes (zero external `<script src>` in dist), so
  hashes/nonces cannot pin them. Sentry ingest host pre-allowed but
  inert until `SENTRY_DSN` is set.
- **`check-security.mjs`** (`SECURITY_STATUS`) + `security-gate` CI
  job + `deploy:verify` wiring: headers presence/content, CSP sanity
  (no eval/http/wildcards), no sourcemaps/env files, no
  plaintext-http subresources.
- **`pnpm audit` (first run): 9 findings (1 critical, 2 high,
  6 moderate) — all in dev/build tooling (vitest/vite/esbuild,
  style-dictionary, spotlight transitive), none reachable from the
  static production output. The critical (vitest UI file read) needs
  `vitest --ui` listening; the repo runs `vitest run`. Fixes need
  MAJOR bumps (vitest 2→3, style-dictionary 4→5) — queued as a
  dedicated upgrade batch with migration verification, not
  drive-by-bumped here.

### 2.9 UI/UX production program (2026-09-06, all phases approved)

Render-verified with local screenshots (home/captain/tournaments at
390+1280, banner at 320) plus keyboard-modality probes — no visual
claim without pixels. Static audit: zero heading skips, single h1 on
all 17 pages, zero img alt/dim defects in dist.

- **P0 fixed:** gold focus ring on the gold drawer toggle measured
  ~1:1 → white ring + 3px offset (`Header.astro`); same class fixed for
  the cream close button (navy ring) and `Section--inverse` subtree +
  `NewsTeaser` dark cards (accent token); `PageBanner h1` mid-word wrap
  at 390px → `text-wrap: balance` + fluid display size + banner title
  shortened to "Events" (matches nav/breadcrumb/route; SEO title
  unchanged) after two render-verified CSS-only attempts failed.
- **P1 fixed:** `check-ui.mjs` gate (`UI_STATUS`, CI job, wired into
  `deploy:verify`): heading order, single-h1, img alt/dims,
  stale-`Upcoming` FAIL (past month) / WARN (current month — Sept 2026
  Nordic Lights is WARN today, day unknown, needs club confirmation),
  dark-surface focus coverage, CTA-duplication WARN.
- **P1/P2 primitives:** `Link.astro` + `Breadcrumb.astro` with
  framework-neutral contracts; adopted by FranchiseTeaser,
  club-captain, Footer contact link, PageBanner (keeps `crumbs` API and
  `ukbt-breadcrumb` hooks for target-size tests); `Button.external`
  prop (AboutCTA social opens new tab).
- **Verified working, no change:** drawer keyboard (Tab/Enter/Escape,
  focus return, aria-expanded), StatsTable scroll region, PendingContent
  empty states.
- **Open, owner-gated:** "Join the Club" CTA → `/join` shell
  truthfulness (2× on homepage); Sept 2026 event confirmation;
  dead-token deletion; motion/rhythm tiers.

### 2.10 P2 leftovers closed (2026-09-06)

- **Dead tokens — keep, don't delete.** Re-verified all ~30
  candidates: all live only in generated output, but nearly all are
  scale members (type ramp, neutral ramp, gap ramp, z-stack, state
  pairs, border scale). Deleting scale steps would punch holes in the
  system; geometry values (72px header token vs 60px built) differ from
  shipped CSS, so adoption would be a redesign, not hygiene. One real
  fix: `button.contract.md` falsely listed `radius-md` as a dependency
  (only the design-system demo uses it) — corrected.
- **Media idiom normalized** (zero-visual-change): last six bare
  `@media (max-width:` → `screen and` (Hero, MissionWelcome,
  TournamentGrid, contact, tournaments ×2). The 479px MissionWelcome
  breakpoint is non-token but intentional — recorded, not "fixed" into
  a different layout.
- **200% zoom verified** (640 CSS px on home/tournaments/captain):
  zero overflow, h1 + links intact, screenshots read — drawer, hero,
  banner all usable.
- **Crest weight — no change, honest reason:** header/footer
  `crest-256.webp` is 28KB; smaller PNG variants save ≤13KB, and the
  real weight (`uppsala` 335KB, `crest-512` 183KB) needs binary
  tooling this session lacks. Lazy-loading already mitigates
  below-fold weight. Asset recompression is queued as tooling work,
  not attempted by hand.

### 2.11 Motion programme shipped (2026-09-06, M1–M4, ClientRouter)

- **Tokens:** `duration-slow`, `easing enter/exit/emphasized`,
  `distance sm/md`, plus `duration-signature` for the hero settle;
  4 literal transitions retokenized (timings preserved); dead
  `duration-fast` adopted.
- **Navigation:** ClientRouter in `BaseLayout` (normal document
  navigation preserved, incl. no-JS — tested); 350–550ms VT
  fade+rise; drawer stagger (capped 150ms), dropdown entry via
  `@starting-style` (exit instant, documented); gold underline-reveal
  on desktop nav + persistent current-page underline.
- **Micro-interactions:** Button arrow-shift + press scale(.98);
  linked-card lift; all transform/opacity, token-driven.
- **Hero/banner/reveals:** finite load choreography (image settle →
  headline → tagline → CTA → social); single IO controller with
  controller-gated initial states (no-JS renders static); SectionHeader
  + footer + banner reveals.
- **Reduced-motion catch:** probe found staged `backwards` entrances
  blanking content through their delays — delays now killed alongside
  durations; re-verified instant final state in-render.
- **Governance:** `contracts/MOTION-CONTRACT.md` (+ micro-interaction
  matrix), `check-motion.mjs` (`MOTION_STATUS`), `motion.spec.ts`,
  `motion-gate` CI job. Restraint list holds: no parallax/ambient/
  counters/letter-type/scroll-jacking (deferred, not drifted past).
- Verified: full `deploy:verify` green incl. `MOTION_STATUS = PASS`;
  screenshots read (hero final, drawer open, reduced-motion desktop,
  banner at 320/390).

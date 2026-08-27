# Roadmap & Open Items

**Status:** LIVING DOCUMENT — update in place as stages/items close, don't
fork a second copy. Last updated 2026-08-27.

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
| 10 | Full-site verification & release | **BLOCKED** | `artifacts/receipts/RELEASE.md` — `RELEASE_STATUS = BLOCKED`; see § 2.2 |
| 11 | Adaptive learning + replay | NOT STARTED | gated on Stage 10 passing first |

**Net position:** the site is built and deployable, but has not passed a
clean release gate, and CI/CD plumbing itself needed repeated fixes this
session (§ 2.3). Nothing here is a client-content problem — those are
tracked separately in § 3.

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

### 2.2 Release-gate gaps — `artifacts/receipts/RELEASE.md`

Of the four gaps that receipt originally found:

1. ~~Route/internal-link integrity~~ — **CLOSED**. `check:links` job
   (`scripts/check-internal-links.mjs`) now runs in CI and locally.
2. ~~SEO metadata completeness~~ — **CLOSED**. `pages.spec.ts` asserts
   non-empty, non-placeholder title + description on all indexable routes.
3. **Content-schema drift — STILL OPEN, needs an owner decision.**
   `contracts/CONTENT-CONTRACT.md` states real content types carry
   truth-gate provenance metadata as a structural, compile-time part of
   the schema. The five real content files
   (`apps/web/src/content/{homepage,about,captain,tournaments,franchises}-data.ts`)
   instead use an ad-hoc `{field, value, sources}` shape checked only by
   loose TypeScript typing plus a runtime `evaluate()` call — real
   enforcement, but not what the contract describes. Two ways to close
   it, not equivalent in cost or risk, and per `CLAUDE.md`'s "no gate
   weakening to obtain PASS" this repo should not pick one silently:
   - **(A)** Wire the 5 content files through the existing
     `ClubInfoSchema`/etc. Zod schemas — preserves the contract's stated
     compile-time guarantee; touches every live fact on the site.
   - **(B)** Amend `CONTENT-CONTRACT.md` to describe the shape actually in
     use — smaller, lower-risk, but is a real weakening of a stated
     invariant (compile-time → runtime-only).
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

### 2.4 Minor, informational, not blocking anything

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
6. Decide (A) or (B) for the content-schema drift (§ 2.2 item 3).
7. Apply branch protection to `main` (§ 2.3 — owner action).
8. Work through `CLIENT-ASK-LIST.md` (§ 3) as the club supplies each item.
9. Only once 6–7 are closed: re-run the Stage 10 release gate
   (`prompts/06-release-gate.md`) end-to-end and expect
   `RELEASE_STATUS = PASS` before calling the site launch-ready.

Stage 11 (adaptive learning + replay) starts only after Stage 10 passes
clean — not before.

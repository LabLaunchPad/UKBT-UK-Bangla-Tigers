# Release Gate Receipt (Stage 10)

Per `prompts/06-release-gate.md`: run the actual repository release
gates, discover commands from the repository (not invented), and report
`PASS` only if every required gate passes with no blocker remaining;
`BLOCKED` if evidence is insufficient; `FAIL` if a required gate fails.
Absence of a gate is reported as absent, never silently treated as pass
(`knowledge/08-VALIDATION-POLICY.yaml`).

```
task_id:      STAGE-10-RELEASE-GATE
sha:          213897fa1082642bbc364cd5e7a139b29efeafed
branch:       claude/ukbt-bootstrap-discovery-otlcwo
environment:  node v22.22.2, pnpm 10.33.0, Linux 6.18.44
git_status:   clean (no uncommitted changes at this SHA)
```

## Gates run, with real commands and exit codes

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Install / lockfile integrity | `pnpm install --frozen-lockfile` | 0 | PASS |
| 2 | Type check | `pnpm typecheck` | 0 | PASS — 52 files, 0 errors, 0 warnings, 1 pre-existing hint (`Section.astro` unused `Props`, unrelated to this cycle) |
| 3 | Unit tests | `pnpm test:unit` | 0 | PASS — 2 files, 17/17 (truth-gate rules + content-type schema fixtures) |
| 4 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` | 0 | PASS — 193 passed, 1 skipped (`reference-geometry.spec.ts`, requires `UKBT_REFERENCE_DIR`, not available in this environment — env-gated, not a failure) |
| 5 | Build | `pnpm build` | 0 | PASS — 16 pages, tokens compiled first |
| 6 | Lint | `pnpm lint` (Biome) | 0 | PASS — 35 files |
| 7 | Governance scaffold self-test | `node scripts/scaffold-self-test.mjs` | 0 | PASS — 23 required files present |
| 8 | Dependency allowlist | `node scripts/check-dependency-allowlist.mjs` | 0 | PASS — 12 allowed entries, 3 manifests checked |
| 9 | Secret scan | `gitleaks` (CI job `secret-scan`, `.github/workflows/ci.yml`) | — | Not reproduced locally (gitleaks not installed in this session); verified via the same CI job passing on every prior commit this session (`d08841d`, `bc0f17e`) — CI result for this exact SHA pending at time of writing, tracked via the subscribed PR |

## Truth / provenance — enforced, but at build time, not as a separate job

Every real content file (`apps/web/src/content/{homepage,about,captain,
tournaments,franchises}-data.ts`) calls `@ukbt/truth/gate`'s `evaluate()`
on every organization fact and `throw`s — failing the build itself,
which gate #5 above already re-ran successfully — if any fact's
provenance doesn't resolve. This was adversarially verified once already
(commit `7a00221`: a broken source id was confirmed to fail the build,
then reverted) rather than only asserted. Real enforcement exists; it is
just not a separately-named CI job, which is an acceptable implementation
of the same requirement, not a gap.

## Gates found ABSENT — real, current gaps, not stale claims

The following are reported absent because they genuinely are, verified
by inspection now — not copied from the CI workflow's own trailing
comment, which claims the same absences for a **different, no-longer-true**
reason (it says no real content/routes exist yet; 16 real routes and 12+
real organization facts exist today). That comment is itself stale and
should be corrected as part of closing this gate, but the underlying
absences it names happen to still be real for a different reason each:

- **Content schema validation against real content — ABSENT.**
  `packages/truth/src/schema/content-types.ts` defines real Zod schemas
  (`ClubInfoSchema`, `LeadershipMemberSchema`, `PlayerSchema`, etc.) per
  `CONTENT-CONTRACT.md`. Checked directly: no file under
  `apps/web/src/content/` imports or uses any of them
  (`grep` for `ClubInfoSchema`/etc. across `apps/web/src/` returns zero
  matches). The real content files instead use an ad-hoc
  `{field, value, sources}` shape validated only by TypeScript's
  structural typing and the truth gate's provenance rules (T1-T8) — a
  real, working guard, but not the dedicated content-shape schema this
  contract specifies. This is schema drift: either the real content
  should be validated against these schemas, or `CONTENT-CONTRACT.md`
  should be amended to reflect the shape actually in use. Not fixed here
  — it's a design decision, not a one-line bug, and release-gate's job is
  to surface it accurately, not silently resolve it.
- **Route / internal-link integrity — ABSENT.** No script or test
  crawls the built site's internal `<a href>` links and confirms every
  target resolves to a real, non-404 route. `smoke.spec.ts` checks the
  homepage's own network requests only (its own assets, not a
  site-wide link graph). With 16 real routes and cross-linking nav/footer
  content now, this is a genuinely checkable, currently-unchecked gate —
  worth adding before a real launch.
- **SEO metadata completeness — PARTIAL, not absent.** `pages.spec.ts`
  does assert the `noindex`/indexable split (`ROUTE-CONTRACT` Amendment 01
  condition 2) across all 16 routes — real coverage, not none. What's
  missing: no test asserts every indexable page has a non-empty,
  non-placeholder `<title>`, meta description, and canonical URL. Canonical
  URL is explicitly and correctly `PENDING` per `HOMEPAGE-CONTRACT.md`
  ("set once a deployment domain is decided") — that part is a real
  UNKNOWN, not a bug — but title/description completeness across all 16
  pages is checkable today and isn't checked.

## Deployment configuration — matches its own contract, not a gap

`apps/web/astro.config.mjs`: `output: 'static'`, `@astrojs/cloudflare`
present as a devDependency but not activated as an adapter; no
`wrangler.toml`/`wrangler.jsonc` in the repository. This is exactly what
`contracts/DEPLOYMENT-CONTRACT.md` specifies — Functions stay
unactivated until `FORM-CONTRACT.md`'s adapter is real — verified by
inspection, not assumed. No drift found between the frozen contract and
the current config.

## Verdict

```
RELEASE_STATUS = BLOCKED
```

**Update, 2026-08-26 (commits `1aa17d2`, `12ed20a`):** two of the three
named gaps below are closed with real, verified checks, not just
documented. `BLOCKED` remains the honest verdict — one category
(content-schema conformance) is still genuinely absent — but the reason
is now a single, scoped issue rather than three.

**Update, 2026-08-27 (RM-5 resolved, commit pending):** owner decision was
Option A (preserve the compile-time schema guarantee). Implementation
found the Stage-3 aggregate schemas don't match real content's actual
per-field shape (see `contracts/CONTENT-CONTRACT.md`'s 2026-08-27
amendment for the full finding) and closed the gap at the shape real
content uses instead: `ContentRecordSchema` in
`packages/truth/src/schema/provenance.ts`, applied via `.parse()` in all
five real content files, adversarially tested (an invalid `status` value
now throws where it previously passed through the truth gate unflagged).
21/21 unit tests pass (was 17; 4 new), full 204/205 Playwright suite
re-run clean, build/typecheck/lint/dependency-allowlist all pass.
**`RELEASE_STATUS` remains `BLOCKED`** — not because a gate failed, but
because `main` itself has never received a merge (PR #1 is still an
unreviewed draft with no branch protection) and the Cloudflare deployment
wiring landed the same day has not yet completed a successful build. Both
are process/deployment gaps, not code gates; see the PR for current
status.

Every gate that has ever run under this receipt has run clean — zero
failures. `BLOCKED`, not `PASS`, because per this project's own rule,
absence of evidence is not evidence of a passing gate, and a receipt
that can't show its evidence is a FAIL by this pipeline's own definition
(`docs/10-fresh-repo-pipeline.md`, "Machine-readable status").

## What would close this out

1. ~~Add a real internal-link crawl~~ — **done**, `12ed20a`:
   `scripts/check-internal-links.mjs` + a CI job. Verified to actually
   fail against a deliberately broken link before being trusted.
2. ~~Add an SEO-completeness assertion~~ — **done**, `12ed20a`:
   `pages.spec.ts` now asserts non-empty, non-placeholder title +
   description on all 11 indexable routes.
3. **Still open, needs an owner decision, not a default I should pick
   silently:** resolve the content-schema drift. `CONTENT-CONTRACT.md`
   states real content types carry truth-gate provenance metadata "as a
   structural part of the schema... a new field added without this
   metadata fails to compile against the base schema, not merely fails
   a lint warning." The real content files don't do this — they use an
   ad-hoc `{field, value, sources}` shape checked only by loose
   TypeScript typing plus a runtime `evaluate()` call. Two ways to
   close it, and they are not equivalent in risk or cost:
   - **(A)** Wire the 5 real content files through the existing
     `ClubInfoSchema`/etc. — preserves the contract's stated
     compile-time guarantee, but touches every fact currently live on
     the site.
   - **(B)** Amend `CONTENT-CONTRACT.md` to describe the shape actually
     in use — smaller and lower-risk, but is a real weakening of a
     stated invariant (compile-time → runtime-only enforcement), which
     `CLAUDE.md`'s "no gate weakening to obtain PASS" invariant means
     this receipt should not decide alone.
4. ~~Correct `.github/workflows/ci.yml`'s trailing comment~~ — done
   across this receipt and `12ed20a`: it now names exactly which of the
   three original gaps are closed, enforced-elsewhere, or still absent,
   rather than a blanket stale claim.
5. Confirm CI on `12ed20a` via the subscribed PR before treating this
   receipt as final.

## Rollback

This receipt records verification only — no application code changed to
produce it. Nothing to roll back.

## Verifier

This session, 2026-08-26, immediately following the Stage 8 fix cycle.
Not an independent verifier for the gates it ran locally; the CI jobs
themselves (a separate execution environment) independently reproduce
gates 1-8 on every push.

## Update, 2026-08-27 — full re-run at current `main` HEAD, all three
## remaining gaps closed, verdict changes to PASS

```
task_id:      STAGE-10-RELEASE-GATE (re-run)
sha:          b36b72b90641a6765ad243d2928211e52a25b017
branch:       main
environment:  node v22.22.2, pnpm 10.33.0, Linux 6.18.44
```

The three items the prior update left open are now all resolved:

1. **`main` has real merged history and a real green deploy.** Not true
   when the prior update was written (PR #1 was still an unreviewed
   draft). Since then, PRs #9–#17 have merged sequentially, each gated on
   its own passing CI run. The current HEAD's own CI run
   (https://github.com/LabLaunchPad/UKBT-UK-Bangla-Tigers/actions/runs/33064279665)
   was fetched and inspected job-by-job: all 11 jobs — Dependency
   allowlist, Governance scaffold self-test, Secret scan (gitleaks),
   Install, Build, Lint, Unit/integration tests, Typecheck, Playwright
   (structural/responsive/accessibility), Internal link integrity, and
   Workers deploy — report `conclusion: success`.
2. **Content-schema drift (item 3 of "What would close this out") is
   closed.** Re-verified directly, not assumed from the prior update's
   own claim: `ContentRecordSchema.parse(...)` is called in all 5 real
   content files (grepped directly), `packages/truth/src/schema/
   content-types.test.ts` passes (9/9), and this was the owner's
   confirmed choice (Option A) when raised again today.
3. Every gate below was re-run fresh, locally, at this SHA, not copied
   from the CI job list above:

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Install / lockfile integrity | `pnpm install --frozen-lockfile` | 0 | PASS |
| 2 | Type check | `pnpm typecheck` | 0 | PASS — 0 errors, 0 warnings, 1 pre-existing hint (unrelated) |
| 3 | Unit tests | `pnpm test:unit` | 0 | PASS — 2 files, 21/21 |
| 4 | Lint | `pnpm lint` (Biome) | 0 | PASS — 38 files |
| 5 | Build | `pnpm build` | 0 | PASS — 16 pages |
| 6 | Governance scaffold self-test | `node scripts/scaffold-self-test.mjs` | 0 | PASS — 23 required files |
| 7 | Dependency allowlist | `node scripts/check-dependency-allowlist.mjs` | 0 | PASS — 13 allowed entries |
| 8 | Route / internal-link integrity | `node scripts/check-internal-links.mjs` | 0 | PASS — 16 HTML files, 531 links, 0 broken |
| 9 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` | 0 | PASS — 267 passed, 1 skipped (`reference-geometry.spec.ts`, env-gated on `UKBT_REFERENCE_DIR`, not available in this environment) |
| 10 | SEO metadata completeness | included in gate 9 (`pages.spec.ts`) | 0 | PASS — non-empty, non-placeholder title + description on all 16 routes |
| 11 | Content schema | included in gate 3 (`content-types.test.ts`) | 0 | PASS |
| 12 | Truth / provenance | enforced at build time (gate 5) via `evaluate()` throwing on unresolved provenance — same mechanism as the original run, re-verified present in all 5 content files | 0 | PASS |
| 13 | Secret scan | `gitleaks/gitleaks-action@v2` (CI job, this exact SHA) | — | PASS — not reproduced locally (gitleaks not installed in this session, same as the original run), verified via the CI job's own `success` conclusion on this SHA (see job list above) |
| 14 | Deployment configuration | inspected `astro.config.mjs` (`output: 'static'`, `@astrojs/cloudflare` present but not activated), `wrangler.jsonc` present at repo root | — | Matches `DEPLOYMENT-CONTRACT.md`; no drift |
| 15 | Git cleanliness | `git status --short` | — | Clean at the SHA above (this receipt's own edit is what dirties it next, committed as part of closing this out) |

## Known, honest caveats — not gate failures

- **Canonical URL remains `PENDING`.** `astro.config.mjs`'s `site` field
  is deliberately unset — no production domain has been decided yet
  (`HOMEPAGE-CONTRACT.md`). This is a genuine `UNKNOWN` blocked on a
  client decision (`CLIENT-ASK-LIST.md`), not a code defect, and no gate
  asserts a value for it.
- **Branch protection on `main` is not confirmed re-checked this
  session.** `docs/11-github-branch-protection.md` records
  `protected: false`, verified via the GitHub API on an earlier date.
  This session had no tool access to re-query that setting directly, so
  it is cited from that existing record, not re-verified fresh today.
  Applying it is a GitHub-web-UI action for a repo admin
  (`docs/11-github-branch-protection.md` names the exact rule to apply)
  — outside what any code gate in this list checks, and outside what
  this session can do itself.
- Several organization-fact fields remain `status: draft`,
  `sources: []` placeholders per `CONTENT-CONTRACT.md`'s placeholder
  discipline (real content blocked on the client, `CLIENT-ASK-LIST.md`).
  This is the correct, contract-compliant state for genuinely unknown
  facts — the truth gate's `evaluate()` only throws on a *broken* or
  *missing* provenance record, never on an honestly-marked draft — so it
  does not fail any gate above.

## Verdict

```
RELEASE_STATUS = PASS
```

Every gate this pipeline names (`prompts/06-release-gate.md`'s list:
install/lockfile, type check, unit tests, e2e, truth/provenance, content
schema, routes, links, SEO, accessibility, build, deployment
configuration, git cleanliness) passes, reproducibly, both locally and in
CI at the current `main` HEAD. The two items still open (canonical URL,
branch protection) are named above as real, current, non-blocking
caveats — genuine `UNKNOWN`/owner-action items, not silently dropped and
not gates this pipeline requires for `PASS`.

## Verifier (this update)

This session, 2026-08-27, following the mobile UI/UX audit rounds
(`MOBILE-VISUAL-QA.md`, `MOBILE-AXE-HEADING-ORDER.md`,
`MOBILE-TOUCH-TARGET-SWEEP.md`) and the content-schema-drift
re-verification. Gates 1–8 re-run directly in this session; gate 13
(secret scan) verified via the current SHA's own CI job conclusion, the
same cross-check method the original receipt used.

## Update, 2026-09-10 — full re-certification at current `main` HEAD

```
task_id:      STAGE-10-RELEASE-GATE (re-certification)
sha:          bd8ce2643d041012eb0f586b451f7350ddf5f34d
branch:       main
environment:  node v22.23.2, pnpm 10.33.0, win32 x64
git_status:   tracked tree clean; 5 pre-existing untracked scratch files
              (apps/web/audit-capture.mjs, apps/web/audit-homepage/,
              apps/web/audit-screenshots/, audit-capture.mjs,
              opencode.json) — present before this session, untouched by it
```

Every gate re-run fresh, locally, at this SHA (not copied from CI):

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Install / lockfile integrity | `pnpm install --frozen-lockfile` | 0 | PASS — lockfile up to date |
| 2 | Governance scaffold self-test | `pnpm deploy:verify` gate 1 (`node scripts/scaffold-self-test.mjs`) | 0 | PASS — 23 required files |
| 3 | Dependency allowlist | `deploy:verify` gate 2 | 0 | PASS — 15 allowed entries, 3 manifests |
| 4 | Lint | `deploy:verify` gate 3 (`biome check .`) | 0 | PASS — 51 files |
| 5 | Tokens build | `deploy:verify` gate 4 | 0 | PASS — tokens.css regenerated |
| 6 | Type check | `deploy:verify` gate 5 (`pnpm -r typecheck`) | 0 | PASS — 63 files, 0 errors, 2 pre-existing hints (`RosterGrid.astro`, `Section.astro` unused `Props`) |
| 7 | Unit tests | `deploy:verify` gate 6 (`pnpm test:unit`) | 0 | PASS — 2 files, 21/21 |
| 8 | Build | `deploy:verify` gate 7 | 0 | PASS — 17 pages, sitemap 12 URLs |
| 9 | Route / internal-link integrity | `deploy:verify` gate 8 | 0 | PASS — 17 HTML files, 694 links, 0 broken |
| 10 | SEO | `deploy:verify` gate 9 | 0 | PASS, no failures |
| 11 | UI | `deploy:verify` gate 10 | 0 | PASS — 5 pre-existing advisory warnings (Sept-2026 upcoming-month note, 3 focus-leaf notes, header+hero CTA duplication), none blocking |
| 12 | Motion | `deploy:verify` gate 11 | 0 | PASS, no failures |
| 13 | Security | `deploy:verify` gate 12 | 0 | PASS, no failures |
| 14 | Perf | `deploy:verify` gate 13 | 0 | PASS — 2 pre-existing advisories (uppsala crest 327KB over 300KB budget, franchise page images over budget), none blocking |
| 15 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` (`CI=true`, real chromium) | 0 | PASS — 328 passed, 1 skipped (env-gated `reference-geometry.spec.ts`, requires `UKBT_REFERENCE_DIR`) |
| 16 | Secret scan | `gitleaks/gitleaks-action@v3` (CI job, exact-SHA main run `34474337388`) | — | PASS — verified via the CI job's own `success` conclusion on this SHA, same cross-check method as prior receipts |
| 17 | CI cross-check | main-branch CI run `34474337388` | — | `success` — all 15 jobs green including Playwright (328 passed); zero Node.js 20 deprecation annotations (verified via check-run annotations API: 1 annotation total, the intentional Playwright summary notice) |
| 18 | Production deploy | git-connected Workers Builds + live fetch | — | PASS — `https://ukbanglatigers.co.uk/` and `/club-captain` fetched live: hero slideshow, WhyChooseUs spacing, hero `icons-mobile` socials, all 6 cricket profiles + 4 social links for the captain present |

Notes since the 2026-08-27 receipt:

- **Redundant Actions deploy job removed** (PR #29). Production deploys
  via git-connected Workers Builds only; the `wrangler deploy` Action
  failed solely on an expired `CLOUDFLARE_API_TOKEN` and is deleted
  (restoration note left in `ci.yml`), not re-credentialed.
- **Pinned actions bumped to node24-runtime majors** (PR #30):
  checkout v4→v5, setup-node v4→v5, pnpm/action-setup v4→v5,
  upload-artifact v4→v6, gitleaks-action v2→v3. Same-major tags had no
  newer release, so majors were required; each SHA verified `node24`
  in upstream `action.yml` at the exact commit. Runner image unchanged
  (`ubuntu-24.04`).
- **Axe settle coverage completed.** The reveal-settle fix now covers
  all 6 `AxeBuilder` specs (`pages`, `mobile-axe`, `homepage`, `axe`,
  `about`, `design-system`) after the catalog'd mid-flight footer
  signature (~1.06–1.12 blended ratios) failed 2 tests on CI in the
  previously unsettled specs.
- Standing caveats from the prior receipt carry over unchanged:
  canonical URL still `PENDING` (client decision), branch protection
  still `protected: false` (verified via API 2026-09-10 this session
  while removing the deploy job — no required checks, so nothing
  referenced the deleted job), draft-placeholder facts remain
  contract-compliant.

## Verdict (2026-09-10 re-certification)

```
RELEASE_STATUS = PASS
```

## Update, 2026-09-10 — N2/N3 round-2 fix (branch `fix/about-n2n3-round2`)

```
task_id:      STAGE-10-RELEASE-GATE (N2/N3 round-2)
sha:          42c6201 (fix(about): N2 spotlight wrap at 200pct text; N3 founder-cap edge continuity)
branch:       fix/about-n2n3-round2
environment:  node v22.23.2, pnpm 10.33.0, win32 x64
git_status:   9 files (2 components + 7 refreshed about captures); opencode.json untracked tool config, untouched
```

Fresh runs at this SHA (not copied from prior receipts):

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1–13 | Full release gate | `pnpm deploy:verify` | 0 | PASS — scaffold/allowlist/lint/tokens/typecheck (0 errors, 2 pre-existing hints)/unit (21/21)/build (17 pages, sitemap 12 URLs)/links (704, 0 broken)/seo/ui (PASS, 5 pre-existing advisories)/motion/security/perf (PASS, 2 pre-existing advisories) |
| 14 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` (`CI=true`) | 0 | PASS — 328 passed, 1 skipped (env-gated `reference-geometry.spec.ts`, requires `UKBT_REFERENCE_DIR`) |
| 15 | N2 verification | transient zoom-200% spec (since deleted) | 0 | PASS — `text200-over: 0` after `flex-wrap: wrap` on `.ukbt-leadership__spotlight`; founder cap verified 448px at 700/766/768/1024 after lower-bound removal |

Change scope: `LeadershipGrid.astro` spotlight wraps below the portrait at
extreme text scaling (no-op at normal sizes); `FounderSpotlight.astro`
tablet cap lost its `min-width: 768px` lower bound, removing the 766/768
breakpoint-edge discontinuity. No content, route, token, or contract change.

## Verdict (N2/N3 round-2)

```
RELEASE_STATUS = PASS
```

## Update, 2026-09-10 — 3-page enhancement Phases 1–5 (branch `feature/3page-phase5-captain`)

Fresh runs on this branch (not copied from prior receipts):

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1–13 | Full release gate | `pnpm deploy:verify` | 0 | PASS — scaffold/allowlist/lint/tokens/typecheck (0 errors, 2 pre-existing hints)/unit (21/21)/build (17 pages)/links (704, 0 broken)/seo/ui (PASS, standing advisories)/motion/security/perf (PASS, standing advisories) |
| 14 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` (`CI=true`) | 0 | PASS — 328 passed, 1 skipped (env-gated `reference-geometry.spec.ts`); one in-branch failure fixed before this run: athlete hero frame overflowed 320px (specificity), fixed with an explicit mobile collapse rule, mobile-ux 48/48 + full suite re-run green |
| 15 | Visual comparison (§17) | full-page captures, transient specs (deleted after review) | — | PASS — homepage first viewport/Why/captain (desktop + mobile), about full-page 1440 (banner/identity/story/stats/values/leadership/CTA), captain full-page 1440 + 390 (hero/meta/timeline/stats/links/close); no overflow, no clipped text, hierarchy verified |

Scope: main `5aeda9d` → this branch adds Phase 1 (EV-20260910-003,
40+ active, CIC wording), Phase 2 (6 additive component variants +
FranchiseTimeline), Phase 3 (`index.astro`), Phase 4 (`about.astro` +
LeadershipGrid CSS), Phase 5 (`club-captain.astro` + ProfileHeader
mobile-collapse fix). No route, token, or contract change. Geometry
record honestly updated (captain `sectionCount` 4→5, rhythm 120/120
throughout).

## Verdict (3-page enhancement)

```
RELEASE_STATUS = PASS
```

## Update, 2026-09-11 — homepage enhancement (branch `feature/homepage-enhancement`)

Fresh runs on this branch:

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1–13 | Full release gate | `pnpm deploy:verify` | 0 | PASS — chained `&&` sequence, exit 0 means all 13 gates (scaffold/allowlist/lint/tokens/typecheck 0 errors/unit/build/links/seo/ui/motion/security/perf) |
| 14 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` (`CI=true`) | 0 | PASS — 328 passed, 1 skipped (env-gated `reference-geometry.spec.ts`) |
| 15 | Capture specs | `homepage-delivery` + `screenshots` specs (`CI=true`) | 0 | PASS — 108 passed; refreshed 3 delivery + 28 route PNGs (community/homepage/players/tournaments), about byte-identical by design |
| 16 | Visual comparison (§17+) | transient full-page spec, 8 viewports incl 320/375 (deleted after review) | — | PASS — eyebrow grammar, trough weighting, both transition fixes verified; no overflow/clipping at any viewport; cross-page safety reviewed |

Scope: 7 files (base.css eyebrow utility, Button tone, AboutCTA/Hero
`:global` removal, CaptainSpotlight/TournamentGrid eyebrow migration +
tournament hierarchy, FranchiseTeaser boundary). No copy, image,
route, token-value, or data change. Geometry record unchanged except
capture date (sectionCount still 7).

## Verdict (homepage enhancement)

```
RELEASE_STATUS = PASS
```

## Update, 2026-09-11 — About enhancement A1–A5 (branch `feature/about-enhancement`)

Fresh runs on this branch:

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1–13 | Full release gate | `pnpm deploy:verify` | 0 | PASS — all 13 gates; mid-work `css-weight` FAIL (56.3KB > 56KB, caused by the new rules) root-caused and fixed by removing provable-zero-change weight only (duplicate blocks/queries/rules) — no budget change, no gate weakening |
| 14 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` (`CI=true`) | 0 | PASS — 328 passed, 1 skipped (env-gated `reference-geometry.spec.ts`) |
| 15 | Capture specs | `homepage-delivery` + `screenshots` specs (`CI=true`) | 0 | PASS — 108 passed; only the 7 about PNGs changed, all other routes byte-identical (proves the Section + WhyChooseUs shared changes are zero-drift) |
| 16 | Visual comparison | transient full-page spec, 9 viewports incl 320/375/900 (deleted after review) | — | PASS — mirror, lede, narrative hierarchy, 2×2 tablet fix, odd-count span (3 + injected-5) verified; no overflow/clipping at any viewport |

Scope: A4/A5/A1/A3/A2 only (MissionWelcome, LeadershipGrid,
FounderSpotlight + `composition="mirror"`, WhyChooseUs + optional
`lede`, about.astro) plus zero-change CSS dedup (base.css,
Section.astro, PageBanner.astro). No route, data, image, token-value,
or gated-copy change — the single A2 lede line is presentational
framing, recorded in roadmap §2.19. Geometry record unchanged
(sectionCount still 7).

## Verdict (About enhancement)

```
RELEASE_STATUS = PASS
```

## Update, 2026-09-11 — Captain enhancement C1–C3 (branch `feature/captain-enhancement`)

Fresh runs on this branch (combined main + PR41 + PR42 baseline):

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1–13 | Full release gate | `pnpm deploy:verify` | 0 | PASS — all 13 gates; mid-work `css-weight` FAIL (56.1KB) root-caused and fixed by zero-change cuts only (selector/media merges, dead-rule removal, zero-consumer `centered` variant removal, footer list merge) — no budget change |
| 14 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` (`CI=true`) | 0 | PASS — 328 passed, 1 skipped (env-gated `reference-geometry.spec.ts`) |
| 15 | Capture specs | `homepage-delivery` + `screenshots` specs (`CI=true`) | 0 | PASS — 108 passed; only the 7 club-captain PNGs changed, all other routes byte-identical |
| 16 | Visual comparison | transient full-page spec, 9 viewports incl 320/375/900 (deleted after review) | — | PASS — stutter removed, orientation pills, deliberate terminal; tables fit ≥768, lawful scroll-region below; no overflow at any viewport |

Scope: C2/C1/C3 only (ProfileHeader opt-out, 2 SubHeadings +
h2-gap fold, close rule) plus zero-change CSS dedup (SectionHeader,
Footer, Section, ProfileHeader merges). No route, data, image,
token-value, stat, or gated-copy change — C1 labels are
presentational structure, recorded in roadmap §2.20. Geometry
sectionCount still 5.

## Verdict (Captain enhancement)

```
RELEASE_STATUS = PASS
```

## Update, 2026-09-11 — About corrections round (same `feature/about-refinements` branch)

Owner corrections + Ratan portrait integration, fresh runs:

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1–13 | Full release gate | `pnpm deploy:verify` | 0 | PASS — all 13 gates (includes Ratan 118KB portrait weight) |
| 14 | E2E / accessibility | `pnpm --filter @ukbt/web exec playwright test` (`CI=true`) | 0 | PASS — 328 passed, 1 skipped (env-gated `reference-geometry.spec.ts`; includes rewritten leadership photo-pin test) |
| 15 | Capture specs | `homepage-delivery` + `screenshots` specs (`CI=true`) | 0 | PASS — 108 passed; only the 7 about PNGs changed |
| 16 | Visual comparison | transient full-page + targeted crops at 1440/768/390/320 (deleted after review) | — | PASS — photo cards equal + legible, founder icons quiet, mobile stacks clean, no overflow |

Scope: management-team graphic render removed (file + authorisation
retained), roster cards gain cleared portraits, both spotlights +
their CSS deleted, R-A icons kept. No route, gated-copy, token, or
stat change. Sayem bio + graphic data retained unrendered.
Owner-input items closed: Ratan portrait (EV-20260911-001). Still
open: 3 quotes, legacy story paragraph, legacy Join CTA (copy +
photo) — all NOT VERIFIED, none published.

## Verdict (About corrections round)

```
RELEASE_STATUS = PASS
```

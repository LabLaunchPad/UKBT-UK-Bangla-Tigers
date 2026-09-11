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

## Update, 2026-09-11 — About bento roster grid (same `feature/about-refinements` branch)

Bento recomposition of the leadership roster. Targeted runs only
(the full gate was PASS on the parent commit `a380390`; this
refinement re-runs the affected scope):

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | About visual/accessibility | `CI=true playwright test tests/visual/about.spec.ts` | 0 | PASS — 6/6 (axe, mobile nav, contamination, excluded-images, leadership photo-pin, overflow) |
| 2 | Perf budget | `node scripts/check-perf.mjs` (fresh dist from the spec's webServer build) | 0 | PASS — CSS within 56KB; warnings pre-existing and franchises-only (crest 327KB, page images 1401KB) |
| 3 | Visual comparison | transient bento verify (5 full-page viewports + 1440/390 leadership crops) + photo-geometry diag (both deleted after review) | — | PASS — founder feature card spans 2 rows with tall top-crop photo, Ratan/Sayem stack beside; mobile single-column compact crops; no overflow |

Scope: `LeadershipGrid.astro` only (feature-card span, card-body
wrap, full-bleed definite-height photos, A5 orphan rule deleted as
superseded, mobile span reset) + 7 about PNGs. Definite photo
heights everywhere — diag spec confirmed the intrinsic-height trap
(flex-fill / aspect-ratio fall back to 1200px+ intrinsic boxes with
faces sliced inside indefinite grid rows). No route, data,
gated-copy, token, stat, or image-asset change. `gallery-02.webp`
deletion still unstaged (owner-side file organisation); the two
untracked `MD Shahidul Alam Ratan.webp` raw drops are MEASURED
distinct content (SHA256 differs from gallery-02 at HEAD, same
118230-byte size is coincidence) — left untracked and untouched.

## Verdict (About bento roster grid)

```
RELEASE_STATUS = PASS (targeted scope; full gate PASS carried from parent commit)
```

## Update, 2026-09-11 — Leadership intro compression (same `feature/about-refinements` branch)

Owner direction: the `org.management_story` passage compressed with
SEO/marketing in mind into the LeadershipGrid title column, replacing
the hardcoded committee line. Targeted runs only:

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors (2 pre-existing hints in unrelated files) |
| 2 | About visual/accessibility | `CI=true playwright test tests/visual/about.spec.ts` | 0 | PASS — 6/6 (photo-pin test unaffected: same 3 portraits) |
| 3 | Perf budget | `node scripts/check-perf.mjs` (fresh dist) | 0 | PASS — CSS within 56KB (narrative CSS deleted, net negative); warnings pre-existing franchises-only |
| 4 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g about` | 0 | PASS — 7/7; full-page review at 1440/390 confirms title-column intro + bento in one clean row, mobile stacks title-then-cards, no overflow |

Scope: new `org.leadership_intro` gated fact (same facts/sources as
managementStory — restatement, not a new claim; roster hedge kept as
"More committee roles to be announced"), `LeadershipGrid` gains
`intro` prop and loses the `narrative` prop + its CSS, `about.astro`
stops passing `managementStory` (no duplicate copy on the page —
the SEO rationale; full passage retained unrendered in about-data).
No route, image-asset, token, or stat change.

## Update, 2026-09-11 — WhyChooseUs removal + founder-stat restyle (same `feature/about-refinements` branch)

Owner decisions from multi-agent joint review (agents: visual-forensics,
UX+IA, design-system+frontend, content-truth+asset, responsive+a11y+perf+
release, red-team+brand — all six passes converged, evidence ledger held):

1. MissionWelcome cards own the four-pillar statement — WhyChooseUs
   removed from About (import, section, `reasons` locals deleted; a record
   comment remains in `about.astro`). Component untouched, still serves
   the homepage. Kills the byte-identical duplication AND the stale
   tournament list in one cut.
2. Mission tournament list is the current publishable record (Nordic
   Lights + Global T20 upcoming; Safari/Nordic Smash/Asian Challengers
   completed) — no Mission copy change needed.
3. 3-card leadership bento kept (founder double-use is distinct semantic
   jobs: story vs roster membership).
4. Dual 40+: values kept, presentation restyled — founder
   (personal-scope) stats now use a navy top-rule, club-scope Story
   stats keep gold. Gated numbers untouched. About-only component.

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | About visual/accessibility | `CI=true playwright test tests/visual/about.spec.ts` | 0 | PASS — 6/6 (no test pinned WhyChooseUs on About; axe clean without it) |
| 3 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g about` | 0 | PASS — 7/7; 1440/390 reviewed — page shorter, no duplication, stacks clean, no overflow |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — `css-weight 56.7KB > 56KB`, deterministic across 3 clean builds |

Perf note (root-caused, not waived): baseline at `8fce089` passes at
55.9KB with only ~115B of margin (knife-edge, cf. the earlier 56.3KB
zero-change incident). The mandated WhyChooseUs removal deterministically
adds +797B net — attribution concentrates in `index.css` (+1796B) via
Vite chunk reshuffle while `about.css` holds flat (+1B = the
accent→primary token swap); comments compile away (verified absent from
output). No zero-visual-impact saving exists. Owner direction 2026-09-11:
"its ok for now, dont need to cut anything" — FAIL recorded as-is, no
compensating cuts, no budget change. Budget revisit, if ever, is a
separate explicit re-approval event, not a silent weakening. Pre-existing
franchise-only warnings unchanged.

```
RELEASE_STATUS = FAIL (perf css-weight only; content/functional gates PASS)
```

## Update, 2026-09-11 — About banner backdrop gallery-06 (same `feature/about-refinements` branch)

Owner direction: implement gallery-06 as the About banner background.
Conflict handled explicitly, not silently: the file was banned from
About (`about.spec.ts` excluded list) and assessed "likely a different
club/tournament" (`EV-20260826-030` §4). Owner confirmed it depicts a
UKBT team/event photo. Override recorded in three places: amendment
appended to `EV-20260826-030` (this file only; join-us/home-hero
findings unchanged), new MANIFEST section (byte-identical staging,
SHA256 `94D132BF…F168`, 1400x933, 202KB; Islami Bank background
boards disclosed as documentary background), and the spec allowlist
with re-approval comment (other 3 exclusions kept).

Implementation (minimum-change per component protocol): PageBanner
gains an optional `background` prop (`src/alt/width/height`); default
absent preserves plain-navy rendering on all other pages. Backdrop is
a real `<img>` (fetchpriority high, explicit dims, no CLS) under a
token-navy shade at fixed opacity — token-native, no literals — so
gold title / white lede / breadcrumb keep the plain-navy contrast
posture. Radius clip via `overflow:hidden` (no positioned-overflow
children; safe).

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | About + cross-page | `CI=true playwright test tests/visual/about.spec.ts tests/visual/pages.spec.ts` | 0 | PASS — 96/96 (club-captain shared banner unaffected) |
| 3 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g about` | 0 | PASS — 7/7; 1440/390 reviewed — photo dimmed under navy, title crisp, radius intact, mobile stacks, no overflow |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — css-weight still exactly 56.7KB (no new failure: gallery-06 202KB under warn threshold, no about page-image failure; known FAIL stands per owner direction) |

## Update, 2026-09-11 — Players banner backdrop gallery-08 (same `feature/about-refinements` branch)

Owner direction: same banner treatment for Players Profile with
gallery-08. Evidence status differs from gallery-06: no prior EV
finding for this file (new owner-supplied drop), but its chest
branding matches the charity-event marks flagged unconfirmed on
home-hero (`EV-20260826-030` §7) — so the gallery-06 confirmation
does NOT transfer. Owner explicitly confirmed gallery-08 depicts a
UKBT squad photo (chat 2026-09-11); recorded in MANIFEST banner
section (byte-identical staging, SHA256 `671717C2…7B7B`,
1400x783, 291KB; chest branding disclosed as documentary
background). No spec change needed — no test bans gallery-08.
Same `PageBanner[background]` prop, no component change.

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | Cross-page | `CI=true playwright test tests/visual/pages.spec.ts` | 0 | PASS — 89 passed, 1 flaky (club-captain title/meta timing flake, unrelated to banner — no title/meta logic touched; passes on retry) |
| 3 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g players` | 0 | PASS — 7/7; 1440/390 reviewed — squad photo dimmed under navy, gold title crisp, radius intact, mobile stacks, no overflow |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — css-weight still exactly 56.7KB (no new failure: gallery-08 291KB under warn threshold, no players page-image failure; known FAIL stands per owner direction) |

## Update, 2026-09-11 — Events banner backdrop gallery-10 (same `feature/about-refinements` branch)

Owner direction: same banner treatment for the Events banner (route
`/tournaments`) with gallery-10. Evidence status: no prior EV finding
for this raw file and no test ban; MANIFEST's contact-sheet
"gallery-10" (European Cup 2025 banner, held back) is a different
numbering — recorded as such, raw file judged on its own pixels.
Owner explicitly confirmed gallery-10 depicts a UKBT squad photo
(chat 2026-09-11); recorded in MANIFEST banner section
(byte-identical staging, SHA256 `E884D263…E160`, 1400x1002, 230KB;
RTSC board + STONE & CO./SOL marks disclosed as documentary
background). Same `PageBanner[background]` prop, no component change.

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | Cross-page | covered by prior `pages.spec.ts` 89-pass run (tournaments route included; banner prop is additive/optional) | — | CARRIED (no banner-logic change since) |
| 3 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g tournaments` | 0 | PASS — 7/7; 1440/390 reviewed — medal-winning squad dimmed under navy, gold title crisp, radius intact, mobile stacks, no overflow |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — css-weight still exactly 56.7KB (no new failure: gallery-10 230KB under warn threshold, no tournaments page-image failure; known FAIL stands per owner direction) |

Cross-check (no action): the rendered `/tournaments` calendar matches
the owner-confirmed Mission record — Upcoming Nordic Lights (Sept
2026, Norway) + Global T20 Championship (Oct 2026, Romania);
Completed Safari (Jul 2026), Nordic Smash (Jun 2026), Asian
Challengers (Jan 2020).

## Update, 2026-09-11 — Contact banner backdrop gallery-04 (same `feature/about-refinements` branch)

Owner direction: same banner treatment for the Contact Us banner
(route `/contact`) with gallery-04. Evidence status: unlike the
prior three, the raw file visibly carries the "FSR FOTOGRAFIA /
www.fsabater.com" photographer watermark the contact-sheet review
describes — so that review's rights hold applied to this file. Owner
explicitly confirmed BOTH UKBT affiliation and publication rights
(chat 2026-09-11), superseding the hold for this file only; recorded
in MANIFEST banner section (byte-identical staging, SHA256
`BF01CC12…7503BF`, 1400x934, 67KB; watermark disclosed, not
scrubbed — the navy shade dims it with the rest). Same
`PageBanner[background]` prop, no component change. No spec change
needed — no test bans gallery-04.

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | Cross-page | covered by prior `pages.spec.ts` 89-pass run (contact route included; banner prop is additive/optional) | — | CARRIED (no banner-logic change since) |
| 3 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g contact` | 0 | PASS — 7/7; 1440/390 reviewed — match action dimmed under navy, gold title crisp, watermark dissolves into shade, radius intact, mobile stacks, no overflow |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — css-weight still exactly 56.7KB (no new failure: gallery-04 67KB trivial, no contact page-image failure; known FAIL stands per owner direction) |

## Update, 2026-09-11 — Franchises banner backdrop nordic-smash-slide.jpg (same `feature/about-refinements` branch)

Owner direction: same banner treatment for the Our Franchises banner
(route `/franchises`) with nordic-smash-slide.jpg. **Compliance
conflict, resolved explicitly:** the graphic bakes in "NIPO KHADEM /
PORTUGAL" — the person `CLIENT_REQ_008` requires excluded, whose
`.webp` sibling was pulled from the Homepage for this exact reason.
Owner waived the exclusion for this banner use only (chat
2026-09-11) after the conflict was stated in full, including that
gates scan HTML text and not pixels. Recorded in three places:
MANIFEST banner row + waiver note, `CLIENT_REQ_008` row waiver
annotation in CLIENT-REQUIREMENTS-INVENTORY.md (rosters, DOM copy,
alt text, and the `.webp` sibling remain excluded). Alt text and all
DOM copy carry no names. Same `PageBanner[background]` prop, no
component change. No spec change needed — no test bans the `.jpg`.

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | Cross-page incl. contamination | `CI=true playwright test tests/visual/pages.spec.ts` | 0 | PASS — 90/90 (DOM name-free on `/franchises`) |
| 3 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g franchises` | 0 | PASS — 14/14 (landing + Uppsala detail); 1440/390 reviewed — graphic dimmed under navy, gold title crisp, radius intact, mobile stacks, no overflow |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — css-weight still exactly 56.7KB (no new failure: slide 202KB under warn threshold, no franchises page-image failure; known FAIL stands per owner direction) |

## Update, 2026-09-11 — Club Captain banner backdrop gallery-05 (same `feature/about-refinements` branch)

Owner direction: same banner treatment for the Club Captain banner
(route `/club-captain`) with gallery-05. Evidence status: no record
anywhere for this file, no watermark, no test ban. Owner explicitly
confirmed it depicts a UKBT player/official (chat 2026-09-11);
recorded in MANIFEST banner section (byte-identical staging, SHA256
`7FD686A8…0F0BF52`, 1400x933, 56KB). Same `PageBanner[background]`
prop, no component change.

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | Route gate | `CI=true playwright test tests/visual/pages.spec.ts -g club-captain` | 0 | PASS — 1/1 (earlier title/meta timing flake not recurring) |
| 3 | Captures | `CI=true playwright test tests/visual/screenshots.spec.ts -g club-captain` | 0 | PASS — 7/7; 1440/390 reviewed — award presentation dimmed under navy, gold title crisp, radius intact, mobile stacks, no overflow |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — css-weight still exactly 56.7KB (no new failure: gallery-05 56KB trivial, no captain page-image failure; known FAIL stands per owner direction) |

## Update, 2026-09-11 — Captain face-crop focal point + strict uniform banner heights + MissionWelcome intro stacking (same `feature/about-refinements` branch)

Three owner-directed refinements, one commit:

1. **Captain faces cropped (reported with screenshot).** Root cause:
   `object-position: center` cover-crops gallery-05's face band
   (y≈13–37%) out of ~2.4:1 desktop slots. Fix per component
   protocol (a prop, not a component): new optional
   `background.focus` on PageBanner (default `center` — other five
   banners byte-identical), captain passes `50% 20%`. Geometry
   verified by reasoning across slot aspects (wide slots crop
   vertically around the focal band; narrow slots barely crop
   horizontally) and confirmed in captures at 1440/768/390 — both
   faces fully visible everywhere.
2. **Strict uniform banner heights.** Measured first (production
   Chromium): About+lede 537 vs 493 others at 1440, 425 vs 381 at
   768, 332 vs 264 at 390. Enforced via `min-height` (not `height` —
   clips nothing under cross-browser text-metrics variance) +
   centred content + balanced padding: 544px/64px desktop,
   432px/48px ≤1025px, 340px/40px ≤767px. Re-measured: 544/432/340
   pixel-identical across all six banner pages at all three
   viewports. border-box confirmed, so min-height covers padding +
   content; fixed header still cleared by outer margin.
3. **MissionWelcome intro organisation (reported with screenshot).**
   Root cause: 0.42fr/0.52fr end-aligned grid stranded the
   single-line tagline bottom-right of a 4-line H2. Fix: stacked
   intro (eyebrow + H2, lede full-width at 48rem/size-1 — the same
   grammar as every other section header). About-only component;
   fact rows and breakpoints untouched.

| # | Category | Command | Exit | Result |
|---|---|---|---|---|
| 1 | Typecheck | `astro check` | 0 | PASS — 0 errors, 0 warnings (2 pre-existing hints) |
| 2 | Cross-page | `CI=true playwright test tests/visual/about.spec.ts tests/visual/pages.spec.ts` | 0 | PASS — 96/96 |
| 3 | Captures | `screenshots -g about` 7/7 + `-g club-captain` 7/7 | 0 | PASS — about 1440/390 reviewed (stacked intro: one-line H2 + lede beneath, cards below); captain 1440/768/390 reviewed (both faces visible) |
| 4 | Perf budget | `node scripts/check-perf.mjs` (sanctioned `pnpm build`) | 1 | FAIL — css-weight still exactly 56.7KB (net-zero: new rules replace old; no new failure; known FAIL stands per owner direction) |

Section-organisation audit (prior pass, still valid minus WhyChooseUs):
page reads banner(h1) → welcome → sponsors → story → founder →
leadership → follow CTA → footer; one h1 + section h2s, eyebrow
dialect consistent, all-compact rhythm. The open pillar-duplication
question is now closed by the removal above.

## Update, 2026-09-11 — CI gate fix: roster card headings h4→h3 (same `feature/about-refinements` branch)

CI on PR44 failed two jobs on one root cause — axe
`heading-order` on /about (mobile-axe spec) + check-ui
`heading-order` (about/index.html skips h2 to h4): roster card
names sat directly under the section h2 as h4. Fix: h3 with the
same explicit size-2/bold declarations — visually identical,
outline correct. (AboutStory's h4 caption precedes its h2 in DOM
after an h3 section, so it is outline-safe; left untouched per
minimum change.) Verified locally the way CI runs it:
`check-ui.mjs` UI_STATUS PASS (only pre-existing warnings),
mobile-axe + about specs 23/23, about captures 7/7 reviewed
(cards unchanged). Perf unchanged (still 56.7KB known FAIL).

## Update, 2026-09-11 — Named view transitions (`feature/view-transitions`, owner-approved plan)

Global root transition KEPT; three semantic pairs added
(`ukbt-site-logo`, `ukbt-captain-portrait`,
`ukbt-franchise-crest`) + back-direction cue via
`data-astro-transition`. No persist, no loader, no Astro upgrade
(lockfile stays exactly 7.2.8). Reduced-motion layer untouched —
named groups animate only through the VT pseudo-elements the kill
already covers. Verified: `astro check` 0 errors; MOTION_STATUS
PASS; UI_STATUS PASS; `motion.spec.ts` 8/8 (incl. ClientRouter
logo-intro journeys); scratch nav matrix 9/9 with zero page
errors (scratch specs deleted after the run); settled captures
reviewed (captain 1440, players 1440, uppsala 390). One
mid-transition frame confirmed the crest morph engages; settled
states are pixel-correct. Perf: CSS 56.7KB → 57.7KB (+1.0KB —
the base layer ships in every page bundle, so global VT rules
multiply; comments are stripped from dist). Same accepted FAIL
class per owner direction; no cuts, no budget change.

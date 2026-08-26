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

Every gate that ran, ran clean — zero failures anywhere in this receipt.
`BLOCKED`, not `PASS`, because two of the twelve categories
`prompts/06-release-gate.md` requires evidence for (content schema
against real content; route/link integrity) have no real check at all,
and a third (SEO completeness) is only partially covered — per this
project's own rule, absence of evidence is not evidence of a passing
gate. This is not a statement that the site is broken: build, tests,
accessibility, and the newly-fixed homepage all demonstrably pass. It is
a statement that this project cannot yet show a receipt proving those
three categories, and a receipt that can't show its evidence is a FAIL
by this pipeline's own definition (`docs/10-fresh-repo-pipeline.md`,
"Machine-readable status").

## What would close this out

1. Add a real internal-link crawl (build the site, parse every page's
   `<a href>`, assert every internal target exists in the built output).
2. Add an SEO-completeness assertion (non-empty title/description on
   every indexable route).
3. Resolve the content-schema drift: either wire the real content files
   through `ClubInfoSchema`/etc., or amend `CONTENT-CONTRACT.md` to
   describe the `{field, value, sources}` shape actually in use — a
   contract nobody follows is worse than no contract.
4. ~~Correct `.github/workflows/ci.yml`'s trailing comment~~ — done as
   part of this receipt: it no longer claims no real content/routes
   exist, and now distinguishes "genuinely absent" (route/link
   integrity) from "enforced elsewhere, just not a named job" (truth
   gate) from "schema drift, not missing content" (content schema).
5. Confirm CI on this exact SHA (`213897f`) via the subscribed PR before
   treating this receipt as final; the secret-scan row above is carried
   over from prior commits' CI runs, not this one specifically.

## Rollback

This receipt records verification only — no application code changed to
produce it. Nothing to roll back.

## Verifier

This session, 2026-08-26, immediately following the Stage 8 fix cycle.
Not an independent verifier for the gates it ran locally; the CI jobs
themselves (a separate execution environment) independently reproduce
gates 1-8 on every push.

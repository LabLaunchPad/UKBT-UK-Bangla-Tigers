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

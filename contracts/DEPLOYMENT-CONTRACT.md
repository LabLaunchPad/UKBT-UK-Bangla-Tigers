# Deployment Contract

**ID:** CONTRACT-DEPLOYMENT-01
**Status:** FROZEN · Stage 3 (Contract Freeze)
**Purpose:** Fix the deployment target, static-output expectations,
function boundary, and rollback posture before any deployment config
exists.

## Outputs / Frozen deployment model (source: `ARCHITECTURE-PROPOSAL-V3.md`
§12, `EV-20260826-018`)

```
HOST = Cloudflare Pages
STATIC_OUTPUT = apps/web build output (Astro `output: 'static'`)
FUNCTIONS = Cloudflare Pages Functions, available under the same project,
            NOT ACTIVATED until a real form exists (FORM-CONTRACT.md)
PREVIEW_DEPLOYMENTS = one per PR, standard Cloudflare Pages behavior
PRODUCTION_DEPLOYMENT = on merge to the default branch
CI_INTEGRATION = GitHub Actions builds and runs the full CI-CONTRACT.md
                 gate set on every PR before a preview/production
                 deployment is considered valid
```

## Environment configuration

- No environment variable carries a real secret at this stage (no secret
  is currently required by any implemented functionality).
- When a form is implemented, its Cloudflare Functions environment
  bindings are documented here as an amendment, never invented in advance.
- `.env.example` (once created) documents variable names/purposes only.

## Secrets

- No secret is committed to the repository.
- Cloudflare account/API credentials (for CI-driven deployment, if used)
  are stored in GitHub Actions secrets, never in a tracked file.
- `CI-CONTRACT.md`'s secret-scan gate is the enforcement mechanism.

## Fonts (deployment-relevant, cross-referenced from `ASSET-CONTRACT.md`)

- Lato/Montserrat (or their eventual UKBT replacements) are self-hosted
  under their OFL terms as part of the `apps/web` static output — never
  loaded from `fonts.gstatic.com` at runtime, resolving the GDPR/
  third-party-request finding (`U-18`, `knowledge/06 privacy`).

## Rollback / recovery

- Cloudflare Pages retains prior deployments; rollback is a target-the-
  previous-deployment operation, not a rebuild — this is standard
  Cloudflare Pages behavior, not a bespoke mechanism this project builds.
- A production deployment that fails a post-deploy smoke check (Stage 4
  addition, not yet implemented) is rolled back to the last known-good
  deployment rather than left live and "fixed forward" under user traffic.

## No runtime services beyond the approved architecture

- No database, no server process, no additional runtime service is
  deployed beyond: static asset hosting + (once activated) Cloudflare
  Pages Functions for the forms adapter (`FORM-CONTRACT.md`). Adding any
  other runtime service requires re-planning (`INV-009`, minimum
  defensible architecture).

## Invariants

- Static output remains portable to any static host — the
  Cloudflare-specific piece is scoped to the Functions adapter alone
  (`ARCHITECTURE-PROPOSAL-V3.md` §12), preserving `FORM-CONTRACT.md`'s
  rewrite-avoidance guarantee at the deployment layer too.
- Production deployment requires the full CI gate set to pass first — no
  direct-to-production deployment path bypassing CI exists.

## Forbidden behavior

- Committing a Cloudflare API token or account credential to the
  repository.
- Activating Cloudflare Pages Functions before a real form exists.
- Adding a runtime service (database, server process) without a new
  architecture decision record.
- Deploying to production on a red CI run.

## Validation method

- GitHub Actions workflow gates production deployment on the full
  `CI-CONTRACT.md` gate set passing.
- A future post-deploy smoke check (Stage 4) verifies the production
  deployment actually serves the expected build before considering the
  deployment complete.

## Owner

Track C. Not gated by Track B.

## Dependency

`CI-CONTRACT.md` (deployment gating). `FORM-CONTRACT.md` (Functions
activation trigger). `ASSET-CONTRACT.md` (font self-hosting).

## Change authority

Adding a runtime service beyond static hosting + Functions requires a new
architecture decision, following the same DECISION/WHY/ALTERNATIVES/
EVIDENCE/REVERSIBILITY/RISK/CONSEQUENCE format used in
`ARCHITECTURE-PROPOSAL-V3.md`.

## Evidence required

`EV-20260826-018` (Cloudflare deployment decision).

## Reversibility

MODERATE. Static output is portable; only the Functions adapter is host-
specific, and it sits behind `FORM-CONTRACT.md`'s own adapter boundary —
so even the Cloudflare-specific piece is designed to be swappable without
a UI rewrite.

## Amendment, 2026-08-27: HOST is Cloudflare Workers (static assets), not Pages

**What changed:** `HOST` above reads `Cloudflare Pages`. The actual owner
action taken this date, live in the Cloudflare dashboard (photographed and
supplied directly), was Workers Builds' "Connect to a repository" flow
against a pre-existing Worker named `uk-bangla-tigers` (created in the
account 2026-08-10, verified via the Cloudflare MCP connector's
`workers_list`/`workers_get_worker`) — production branch `main`, deploy
command `npx wrangler deploy`. That is Cloudflare Workers, a different
product from Cloudflare Pages, not a rewording of the same one.

**Why this doesn't require a new architecture decision record:** the
static-output architecture this contract exists to protect is unchanged —
`apps/web` still builds to `output: 'static'`, no adapter, no Functions,
no runtime service. Per Cloudflare's own current guidance
(`developers.cloudflare.com/workers/framework-guides/web-apps/astro/`,
queried 2026-08-27), a purely static Astro site needs no
`@astrojs/cloudflare` adapter at all under Workers — only a Wrangler
config naming an `assets.directory`. This is a delivery-mechanism
substitution (Workers' static-assets serving in place of Pages' static
hosting), not the runtime-service expansion `INV-009`/"Change authority"
above gates.

**What was added, this commit:**
- `apps/web/wrangler.jsonc` — `name: "uk-bangla-tigers"` (matches the
  existing Worker exactly, so `wrangler deploy` targets it rather than
  creating a new one), `assets.directory: "./dist"`, no `main` entry
  (static-only, no Worker script needed).
- `wrangler` as a pinned `apps/web` devDependency (Cloudflare's own
  documented convention: "Workers Builds will use the Wrangler version
  set in your package.json") + a matching
  `scripts/dependency-allowlist.json` entry.

**What is still genuinely open, not resolved by this amendment:**
- The Cloudflare dashboard's "Root directory"/Path field and Build/Deploy
  command fields are set by the owner directly in that UI — no tool
  available to this session can fill them in. Recommended values (proven
  against this repo's own CI, not invented): leave Root directory as the
  repository root; Build command
  `pnpm install --frozen-lockfile && pnpm run build`; Deploy command
  `npx wrangler deploy -c apps/web/wrangler.jsonc`; Non-production branch
  deploy command `npx wrangler versions upload -c apps/web/wrangler.jsonc`.
- **Do not click "Connect" against production branch `main` yet.**
  Verified this same date (release-ledger audit): `main` contains only
  `README.md` — no `package.json`, no build tooling, nothing for a build
  command to run. The first triggered build would fail immediately, not
  because of anything in this amendment, but because PR #1 (62 commits of
  real work) has never been merged — it is still an unreviewed draft with
  no branch protection on `main`. Either merge PR #1 first, or point the
  dashboard's production branch at `claude/ukbt-bootstrap-discovery-otlcwo`
  as a temporary measure and switch it back once merged.
- No deploy has been executed from this session — this amendment and its
  commit prepare the repository side only. `HOST` line above is left as
  written for the historical record; this amendment is the current truth.

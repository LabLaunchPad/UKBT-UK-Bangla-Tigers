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

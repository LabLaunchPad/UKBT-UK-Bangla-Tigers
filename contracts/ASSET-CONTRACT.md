# Asset Contract

**ID:** CONTRACT-ASSET-01
**Status:** FROZEN · Stage 3 (Contract Freeze)
**Purpose:** Fix the rights-classification discipline for every visual
asset before any asset is adopted into `apps/web`.

## Outputs / Frozen classification

Every asset (image, icon, font file, video) is recorded in one of four
provenance classes before use:

| Class | Meaning | Example |
|---|---|---|
| UKBT-owned | Captured/created for UKBT specifically, rights held by UKBT | A real match photo, once one exists |
| LabLaunchPad-authorized-authored | Created by LabLaunchPad for this engagement, authorization independently evidenced | None currently — `provenance_chain.B` is `ASSERTED_NOT_EXECUTED` |
| Third-party (cleared) | Licensed/permissive, attribution or terms tracked per component | Self-hosted OFL fonts (Lato/Montserrat, per `DEPLOYMENT`/`third_party_fonts`) |
| Unknown/uncleared | Rights not established | Any Adelux demo asset by default |

Per-asset record fields (binding, restated from `knowledge/06`
`asset_policy`): `SOURCE`, `IDENTITY`, `USAGE`, `RIGHTS_STATUS`,
`UKBT_REQUIRED`, `ALTERNATIVE`.

## Rules

- **No runtime use of uncleared material.** An asset without a resolved
  `RIGHTS_STATUS` never ships in a production build, regardless of how
  visually convenient it is.
- **No demo Adelux branding in production, ever** — `adelux_logo`,
  `adelux_name`, `adelux_demo_copy`, `adelux_specific_business_claims`, and
  `adelux_proprietary_branding` are permanently forbidden
  (`knowledge/06 brand_boundary.forbidden`), independent of how Track B
  resolves.
- When a needed visual role has no clearable Adelux-equivalent asset,
  replace it with a UKBT-cleared equivalent while preserving the visual
  role, dimensions, crop, ratio, and composition as closely as possible —
  and record the substitution (source asset, replacement, what was
  preserved, what changed, why). Never silently substitute and call it
  equivalent (`knowledge/06 asset_policy.when_needed_but_not_clearable`).
- Third-party assets are a **separate rights domain** from the Adelux
  template licence itself — Adelux's own licence status, whatever it
  resolves to, never automatically clears a bundled asset's independent
  licence (`DR-019`, `LP-03`).

## Invariants

- `boundary_roles.third_party_assets = SEPARATE_RIGHTS_DOMAIN`
  (`knowledge/06`), carried forward unchanged.
- Fonts: self-hosted, never loaded from `fonts.gstatic.com` at runtime
  (privacy/GDPR finding, `knowledge/06 privacy`; restated bindingly in
  `DEPLOYMENT-CONTRACT.md` §fonts).

## Forbidden behavior

- Copying an Adelux demo asset into `apps/web/public/` "temporarily."
- Shipping a font, icon, or image with `RIGHTS_STATUS: unknown`.
- Using Adelux's own brand marks anywhere in UKBT output.

## Validation method

- A per-asset manifest (Stage 4, `apps/web/src/assets/MANIFEST.md` or
  equivalent) records the four class fields for every committed asset.
- CI checks that no file under `apps/web/public/` or `apps/web/src/assets/`
  lacks a manifest entry (build fails otherwise — presence in the build
  without a recorded rights status is exactly the failure this contract
  exists to prevent).

## Owner

Track C for the manifest mechanism. Track B for clearing any specific
Adelux-derived asset for actual production use (none cleared at this
freeze).

## Dependency

`RIGHTS-CONTRACT.md` (overall rights posture). `DEPLOYMENT-CONTRACT.md`
(font self-hosting requirement).

## Change authority

Reclassifying an asset from `unknown`/`uncleared` to `cleared` requires a
new evidence record naming the clearance basis (a licence, a purchase
record, an explicit grant) — never a restated assertion.

## Evidence required

`THIRD-PARTY-DISPOSITION.md` (`EV-20260826-…`), reused for the
third-party-software/font baseline this contract's asset manifest will
extend at Stage 4.

## Reversibility

REVERSIBLE. No asset is currently committed to `apps/web` (it does not
exist yet); this contract fixes the intake discipline before the first
asset lands.

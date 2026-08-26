# Tokens — PARTIALLY BLOCKED pending contract resolution

**Do not treat this directory's current shape as a resolved design
decision.** A contract conflict was detected while scaffolding this
directory and is unresolved. See `artifacts/verification/CONTRACT-CONFLICT-001.md`
and `artifacts/evidence/EV-20260826-021.yaml`.

## What is NOT blocked (present, uncontested)

- `adapted/` and `approved/` — both `contracts/CSS-CONTRACT.md` and
  `contracts/REPOSITORY-CONTRACT.md` agree these live at
  `packages/truth/tokens/adapted/` and `.../approved/`. `approved/`
  contains one UKBT-original, non-Adelux-derived, non-brand-color
  spacing scale (`spacing.json`), added to prove the Style Dictionary
  pipeline (which reads `approved/**` only — also uncontested) executes.

## What IS blocked (do not create until resolved)

- Whether `raw/` and `candidate/` subdirectories should also exist here,
  inside `packages/truth/tokens/`. `contracts/CSS-CONTRACT.md`'s pipeline
  diagram lists them alongside `adapted/`/`approved/` as if co-located.
  `contracts/REPOSITORY-CONTRACT.md`'s layer table places RAW/CANDIDATE
  (layers 2-3) at the repository root (`artifacts/extraction/
  token-candidates.json`), explicitly outside both `apps/web` and
  `packages/truth`. Neither directory has been created pending that
  resolution — do not create `raw/` or `candidate/` here, and do not
  assume the repo-root location is settled either, until the conflict
  record above is resolved by a human decision.

# Contract Conflict 001 — token RAW/CANDIDATE filesystem location

**Status:** RESOLVED. Detected during Stage 4 (Foundation) implementation.
**Detected:** 2026-08-26. **Resolved:** 2026-08-26, by explicit human authorization — surgical wording correction applied to `contracts/CSS-CONTRACT.md` only, per the `PROPOSED_RESOLUTION` below (applied verbatim as proposed).

## CONTRACT_A

`contracts/CSS-CONTRACT.md`, "Outputs / Frozen pipeline" section:

> ```
> DTCG-compatible token source (tokens/raw/, tokens/candidate/, tokens/adapted/, tokens/approved/)
> ```

Read literally, this lists `raw/` and `candidate/` in the same path
notation as `adapted/` and `approved/`, which the same contract's
implementation elsewhere (and `CONTRACT_B`) places at
`packages/truth/tokens/adapted/` and `.../approved/` — implying, without
saying so explicitly, that `raw/` and `candidate/` are co-located at
`packages/truth/tokens/raw/` and `.../candidate/`.

## CONTRACT_B

`contracts/REPOSITORY-CONTRACT.md`, "Source-of-truth locations" table
(itself a transcription of `artifacts/architecture/
ARCHITECTURE-PROPOSAL-V3.md` §3's ten-layer table):

| Layer | Location |
|---|---|
| 2 Raw tokens | `artifacts/extraction/token-candidates.json` |
| 3 Candidate tokens | same file |
| 4 Adapted tokens | `packages/truth/tokens/adapted/` |
| 5 Approved tokens | `packages/truth/tokens/approved/` |

This places RAW/CANDIDATE at the repository root, explicitly **outside**
both `apps/web` and `packages/truth`.

## CONFLICT

Two frozen Stage 3 contracts imply different filesystem locations for the
RAW and CANDIDATE token lifecycle stages:

- `CSS-CONTRACT.md` (as literally worded): `packages/truth/tokens/raw/`,
  `packages/truth/tokens/candidate/`.
- `REPOSITORY-CONTRACT.md`: `artifacts/extraction/token-candidates.json`
  (repo root, one file, not a `raw/`/`candidate/` directory pair inside
  either package).

These are not equivalent, and building against one silently forecloses
the other.

## AUTHORITATIVE_EVIDENCE

`artifacts/architecture/ARCHITECTURE-PROPOSAL-V3.md` — the frozen,
already-verdict-PASSED architecture document both contracts were supposed
to derive from — resolves this **at the source**, and does so with a
stated rationale, not just a location:

- §3's ten-layer table (line 148-152) explicitly states layer 2 (Raw
  tokens) = `artifacts/extraction/token-candidates.json`, layer 3
  (Candidate tokens) = "same file," layer 4/5 (Adapted/Approved) =
  `packages/truth/tokens/adapted/` / `.../approved/`.
- Immediately below the table (line 158-165): *"WHY this exact boundary
  between layers 1–3 (repo-root `artifacts/`) and 4–10 (inside the
  `apps/web`/`packages/truth` application tree): layers 1–3 are evidence
  about Adelux — they must never be mistaken for UKBT's own design
  system, so they live outside the application tree entirely... Layers 4
  onward are UKBT's own artifacts."* This is an explicit, reasoned
  architectural decision, not an incidental wording choice.
- §5 (line 260), which `CSS-CONTRACT.md`'s pipeline diagram is drawn
  from, reads: `` `tokens/raw/, tokens/candidate/, tokens/adapted/,
  tokens/approved/` `` — **without any path prefix at all**. It never
  actually says `packages/truth/tokens/raw/`. That specific,
  package-relative reading was introduced when `CSS-CONTRACT.md` was
  drafted at Stage 3 (transcribing §5's generic pipeline-stage notation
  as if it specified one shared filesystem location for all four
  stages), not something §5 itself asserts.

In other words: **the underlying frozen architecture document is
internally consistent** — §3 and §5 do not actually disagree with each
other once §5's shorthand is read as pipeline-stage names rather than a
literal shared path. The conflict was introduced downstream, during
Stage 3 contract-writing, when `CSS-CONTRACT.md` rendered §5's generic
notation with an unwarranted co-location implication that
`REPOSITORY-CONTRACT.md` (transcribing §3 faithfully) does not carry.

## CURRENT_SAFE_STATE

- `packages/truth/tokens/adapted/` and `.../approved/` exist — uncontested
  by either contract.
- `packages/truth/tokens/raw/` and `.../candidate/` do **not** exist and
  were not created. `artifacts/extraction/token-candidates.json` (the
  existing, frozen Track A RAW/CANDIDATE evidence, `EV-20260826-009`) is
  untouched and remains the only RAW/CANDIDATE artifact in the
  repository.
- Style Dictionary (`packages/truth/style-dictionary.config.json`) reads
  only `tokens/approved/**` — both contracts agree on this, so it is
  unaffected by this conflict and was not paused.

## BLOCKED_SCOPE

Narrow: only the question of whether `packages/truth/tokens/raw/` and
`.../candidate/` directories should ever be created (e.g., at Stage 4+
when a real Adelux-derived candidate is being promoted toward ADAPTED).
Does not block: `adapted/`, `approved/`, the Style Dictionary build, the
truth gate, content schemas, or the Button component primitive — none of
which reference or depend on a `raw/`/`candidate/` path inside either
package.

## PROPOSED_RESOLUTION — APPLIED

Amended `contracts/CSS-CONTRACT.md`'s pipeline diagram to remove the
co-location implication, stating explicitly:

```
RAW        → artifacts/extraction/token-candidates.json  (repo root — frozen Track A evidence)
CANDIDATE  → artifacts/extraction/token-candidates.json  (same file)
ADAPTED    → packages/truth/tokens/adapted/               (UKBT-owned, governed)
APPROVED   → packages/truth/tokens/approved/               (UKBT-owned, governed)
```

Also corrected one "Forbidden behavior" bullet that referenced
`tokens/raw/`/`tokens/candidate/` without a location qualifier, to name
`artifacts/extraction/token-candidates.json` explicitly instead.

This was a **wording correction to match the frozen architecture
document's own already-stated, reasoned decision** — not a new design
decision, and no reversal of any of CSS-CONTRACT.md's substantive rules
(Style Dictionary compiling `approved/**` only, the selector-fidelity
rule, cascade preservation), all of which are unchanged. No other content
in `CSS-CONTRACT.md` was touched.

**Applied 2026-08-26, by explicit human authorization**
("CONTRACT-CONFLICT-001 IS AUTHORIZED FOR SURGICAL RESOLUTION... APPLY
ONLY THIS CHANGE"), per the project's change-control process
(`contracts/README.md` rule 4 — a contract is amended, never quietly
edited; this amendment is recorded here and in `EV-20260826-021`, not a
silent edit).

## CONFIDENCE

HIGH — the authoritative source document (`ARCHITECTURE-PROPOSAL-V3.md`)
is explicit, detailed, gives a stated rationale, and is not itself
ambiguous; the conflict is fully traceable to one contract's imprecise
transcription of the source, not to a genuine disagreement in the
frozen architecture.

## CONTRACT_MODIFICATION_REQUIRED

YES — `contracts/CSS-CONTRACT.md` only. `contracts/REPOSITORY-CONTRACT.md`
requires no change (it already matches the architecture document).

## Disposition

**RESOLVED.** `contracts/CSS-CONTRACT.md` amended per the applied
resolution above, under explicit human authorization. No Foundation work
had been built on the assumption of either filesystem shape for
`raw/`/`candidate/`, so no rework was required.
`packages/truth/tokens/{raw,candidate}/` remain uncreated, per the
authorized decision — RAW/CANDIDATE stay at
`artifacts/extraction/token-candidates.json`. Post-fix cross-reference
audit recorded in `EV-20260826-021` (updated) and the FOUNDATION report.

# SEO Contract

**ID:** CONTRACT-SEO-01
**Status:** FROZEN · Stage 3 (Contract Freeze)
**Purpose:** Fix that SEO/AEO/GEO metadata ownership derives only from
truth-gated UKBT content, never from Adelux demo facts — closing the
highest-leverage AEO/GEO leak path named in `knowledge/07`.

## Outputs / Frozen ownership

| Surface | Source | Rule |
|---|---|---|
| `<title>` | Content-schema field, per-route | Never a copied Adelux page title |
| Meta description | Content-schema field | Never invented boilerplate presented as descriptive of UKBT |
| Canonical URL | Derived from the frozen route (`ROUTE-CONTRACT.md`) | One canonical per route, mechanically generated, not hand-typed per page |
| Robots directives | Route-level config | Default `index, follow` for public routes; explicit override recorded when not |
| Sitemap | Generated from the resolved route list at build time | Never hand-maintained separately from routes (drift risk) |
| Open Graph tags | Content-schema fields (title/description/image), with `MediaAsset.rights_status` resolved (`ASSET-CONTRACT.md`) before an image is used in `og:image` | No OG image ships with an unresolved rights status |
| JSON-LD / structured data | **Emitted only from typed content that has passed the truth gate.** No exception. | **Hand-authored JSON-LD is prohibited absolutely** (`knowledge/07 aeo_geo.rule`) |

## Why hand-authored JSON-LD is prohibited absolutely

Answer and generative engines quote structured data as authority. An
unsourced claim in JSON-LD does not merely mislead a human reader — it
becomes a citation another system repeats, which UKBT would then have to
correct in public (`knowledge/07 aeo_geo.rationale`). Hand-authored JSON-LD
is the highest-leverage bypass of the truth gate because its output is
machine-read and rarely reviewed by a human before being consumed by a
third-party system. This contract closes that path structurally: the only
code path that emits JSON-LD reads from gated content, and no second path
exists.

## Invariants

- No SEO/metadata field is ever populated from `artifacts/extraction/` or
  Adelux demo copy (`LP-01`).
- A route's metadata cannot exist independently of that route's own
  gated content — metadata is derived from the same content record the
  page renders, not a separate, unaudited metadata table.

## Forbidden behavior

- Writing a JSON-LD block by hand in an Astro template.
- Copying an Adelux meta description as a "temporary" placeholder that
  ships to production.
- Generating a sitemap entry for a route that has no corresponding
  gated content.

## Validation method

- SEO metadata completeness gate (`CI-CONTRACT.md`, `A14`) checks every
  route has title/description/canonical/OG fields populated from content,
  not literal strings in the template.
- A structured-data validator (Stage 4: schema.org validator or
  equivalent) runs against generated JSON-LD in CI.

## Owner

Track C (mechanism: metadata derivation pipeline). Gated per-route by
`TRUTH-CONTRACT.md`/`CONTENT-CONTRACT.md` for the underlying facts.

## Dependency

`CONTENT-CONTRACT.md` (source fields). `TRUTH-CONTRACT.md` (gate).
`ROUTE-CONTRACT.md` (canonical URL basis). `ASSET-CONTRACT.md` (OG image
rights).

## Change authority

Adding a hand-authored-JSON-LD exception for any reason requires
escalation, not a quiet local override — per the hard invariant against
gate weakening.

## Evidence required

None new. `knowledge/07-CONTENT-TRUTH-POLICY.yaml` `aeo_geo` section is
the source.

## Reversibility

REVERSIBLE. No metadata pipeline exists yet; this contract fixes the rule
the pipeline must implement.

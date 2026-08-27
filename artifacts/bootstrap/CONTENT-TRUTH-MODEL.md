# Content & Truth/Provenance Model

**Stage:** 1 · Covers discovery items 5, 6, 13.
Truth rules are `REQUIREMENT` and binding **now**. Content shapes are `PROPOSED`.

---

## 0. The rule everything else serves

> **No organization-specific claim about UK Bangla Tigers may appear in a build
> artifact unless it resolves to an evidence record classified `FACT` or
> `APPROVED`, with a named source and a non-expired `valid_until`.**

Enforced by a build-time gate, not by review. Missing or `STALE` provenance
**fails the build**; it does not warn. A warning is a thing people learn to
scroll past.

`REQUIREMENT`. Not negotiable by deadline, by "it's obviously true", or by model
confidence — model confidence is never authorization (`AGENTS.md
@ukbt:deterministic-first`).

## 1. What counts as an organization-specific claim — `REQUIREMENT`

People (players, coaches, officials, committee) · squad lists and shirt numbers ·
fixtures, results, scorecards, statistics, standings · honours and history ·
founding date, founders, location · grounds, facilities, addresses · league,
affiliation, governing-body membership · sponsors, partners, funders · contact
details and social handles · pricing, membership, subscription terms ·
charitable/community claims and participation numbers · quotes attributed to
anyone · photographs of identifiable people · logo, crest, colours, brand assets.

**Not** organization-specific: generic copy that would be true of any club and
names nothing ("Sign up for updates"), UI labels, and legal boilerplate that a
solicitor supplies. When in doubt, a claim is organization-specific.

### The failure mode this prevents

Plausible filler. `Founded in 2015` · `Winners, Division 2, 2023` · `Over 200
members` · `Coach: [plausible Bengali name]`. Each reads like content and is
indistinguishable from truth to a reader, a search engine, and an AI answer
engine. **A plausible invented fact is a defect of the same severity as a
security vulnerability**, whether or not it ships — because once it ships it
gets cited, and a citation launders it into apparent fact.

Adversarial case ADV-002 covers exactly this. The correct response to "no source
is available" is `UNKNOWN`, never a plausible guess.

## 2. Evidence record — `REQUIREMENT`

Schema: `docs/03-evidence-contract.md`. Registry rules and freshness defaults:
`contracts/evidence-contract.md`. Records live in `artifacts/evidence/`,
append-only, `EV-YYYYMMDD-NNN`.

Classifications: `FACT` `DERIVED` `OBSERVED` `MEASURED` `INFERRED` `PROPOSED`
`APPROVED` `UNKNOWN` `STALE` `SUPERSEDED` `VALIDATION_RESULT`.

**Publishable:** only `FACT` and `APPROVED`.

### Source tiers — `PROPOSED`

| Tier | Source | Publishable |
|---|---|---|
| T1 | UKBT-controlled: official site, official social, club documents, direct written statement | yes, with retrieval date |
| T2 | Governing body / league / competition official records | yes |
| T3 | Established press | yes, if it names its own source |
| T4 | Third-party aggregators, wikis, listings | **no** — lead only |
| T5 | Model memory, inference, plausibility | **never** |

Two independent sources are required for: founding facts, honours, and any
statistic used in structured data or a headline claim.

### Freshness — `REQUIREMENT`

`STALE` ≠ false; it means *unverified now*. Publishing from a `STALE` record is a
release-gate failure. Squads, fixtures, results and standings change constantly:
their records expire by default at the next match or transfer window. A completed
match result may take `valid_until: null` **with written justification** —
immutability must be argued, not assumed.

## 3. Content types — `PROPOSED` shapes, currently holding zero data

`page` · `person` · `fixture` · `result` · `article` · `sponsor` · `honour` ·
`venue` · `mediaAsset`

Every type carries:

```ts
sources: SourceRef[]      // ≥1 for any org-specific field
lastVerified: Date
validUntil: Date | null   // null requires justification
status: 'draft' | 'sourced' | 'approved' | 'stale'
```

**These names are shapes, not data.** No roster, fixture, honour, sponsor or
venue exists in evidence. The type list is deliberately derived from the pipeline's
own priority order (team info → players → leadership → fixtures/results), **not**
from the reference template — which is a padel-club template whose sections
(courts, coaching, membership tiers, booking) are template facts and were not
carried across.

## 4. Placeholder discipline — `REQUIREMENT`

Structural work needs *something* on the page. That something must be
**machine-distinguishable** from publishable content — a human eyeballing it is
not a control.

`PROPOSED` mechanism, to be settled at Stage 4:

- placeholder content carries `status: 'draft'` and an empty `sources` array;
- placeholder strings use a reserved sentinel (e.g. `__PLACEHOLDER__`) that the
  truth gate greps for and fails on;
- the production build fails on any placeholder; preview builds render it with
  a visible marker.

**Prohibited absolutely:** a placeholder that is a plausible name, date, score,
statistic, or quotation. `__PLACEHOLDER_PLAYER_NAME__` is a placeholder.
`Rahim Ahmed, 24` is an invented fact wearing a placeholder's coat.

## 5. AEO/GEO consequence — `REQUIREMENT`

Answer and generative engines quote pages as authority. An unsourced claim here
does not merely mislead a reader; it becomes a citation that other systems repeat
and that UKBT then has to correct in public. Structured data (A14) may therefore
be emitted **only** from typed content that passed the truth gate — never
hand-authored JSON-LD, which is a bypass route around every control in this
document.

## 6. Editorial workflow — `PROPOSED`

```
draft → source attached → schema validation → truth gate → human editorial
approval → merge → deploy
```

No step is agent-skippable. **An agent may never be the approver** of an
organization-specific fact: the approval step exists to put a human's name on a
public claim. An agent may prepare, classify, flag and block — it may not sign.

CMS: none until a named non-technical editor exists (U-12). When one arrives, it
must be Git-backed and must submit to the same gate. A CMS that can publish an
unsourced claim has defeated this entire model.

## 7. Current state

**Zero** UKBT organization facts are held in this repository. `artifacts/evidence/`
is empty. Every content-bearing page is therefore blocked on evidence, which is
the correct state at Stage 1 — see `UNKNOWN-EVIDENCE.md` for what must be
obtained and from whom.

# Client Requirements Inventory

**Date:** 2026-08-26 · Source: `EV-20260826-026`. Per
`MASTER EXECUTION PROMPT § 13-14`: client instructions govern project
requirements; they do not automatically establish factual truth, and
conflicts with the Truth Model are marked `CONFLICTING`, never
silently resolved.

| CLIENT_REQ_ID | SOURCE | REQUIREMENT | TYPE | PRIORITY | AFFECTED_AREA | UKBT_SUPPORT | CONFLICT | DECISION | STATUS |
|---|---|---|---|---|---|---|---|---|---|
| CLIENT_REQ_001 | EV-026 | Site must include these top-level pages/sections: Home, About Us, Club Captain, Players Profile, Our Franchises (Uppsala Tigers), International Tournaments/Events, Contact Us | Structure | HIGH | Site IA, navigation | Not yet built (Foundation homepage is a placeholder) | None | Adopt as the candidate IA for Stage 7's Homepage Contract / site-scale route matrix | OPEN — pending Homepage Contract |
| CLIENT_REQ_002 | EV-026 | Any chairman reference must read "MD Shahidul Alam Ratan, Acting Chairman" — explicitly not "Chairman" | Content correction | HIGH | Home page, leadership content | No chairman content exists yet in this repo | None (nothing to conflict with — first mention) | Adopt verbatim wherever leadership is named | OPEN — apply when leadership content is built |
| CLIENT_REQ_003 | EV-026 | Player statistics must be rendered as charts/tables "on your style" — i.e. using UKBT's own design system, not the source document's own navy/gold table styling | Visual/design | MEDIUM | Player profile pages | Supported — `packages/truth` token system + `Card`/`Button` primitives exist (Stage 5); no table/stat-chart primitive built yet | None | Build a new UKBT-styled stat-table component when player pages are implemented; do not reuse the screenshot's literal styling | OPEN — Stage 9 (site scale) or later, not Stage 7 homepage |
| CLIENT_REQ_004 | EV-026 | Official UK Bangla Tigers / Uppsala Tigers social links must appear as icon-only (symbol), linking out — no text labels | Visual/design | MEDIUM | Footer / contact / social block | Supported — standard icon-link pattern, no new dependency required (`Font Awesome` already allowlisted) | None | Adopt for footer/contact social block | OPEN — not yet built |
| CLIENT_REQ_005 (implicit) | EV-026 | A "Club Captain" page exists as its own site section, distinct from a general "Players Profile" listing | Structure | MEDIUM | Site IA | Consistent with CLIENT_REQ_001 | None | Treat "Club Captain" and "Players Profile" as two distinct route types | OPEN |

## What this document does NOT specify (explicitly not inferred)

Per `MASTER EXECUTION PROMPT § 13`, the following categories were named
as things to extract, but this document contains **no requirement** in
them — recorded as absent, not guessed:

- Explicit Homepage section list/priority beyond the general site IA
  (CLIENT_REQ_001 names pages, not homepage sections specifically —
  `UNKNOWN` whether e.g. fixtures or a captain spotlight belong on
  the homepage itself vs. their own page).
- Brand colour instructions.
- Logo requirements or files.
- Typography instructions.
- CTA requirements (what the homepage's primary call-to-action should be).
- Explicit content exclusions.

## Conflicts with the existing Truth Model

**None found.** This is the first substantive client-content document
supplied; `knowledge/01-VERIFIED-FACTS.yaml` had no prior organization
facts to conflict with (`organization_facts_count: 0` before this
ingestion). See `knowledge/01-VERIFIED-FACTS.yaml` for the facts this
document establishes.

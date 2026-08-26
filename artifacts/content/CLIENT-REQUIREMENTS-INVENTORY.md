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
| CLIENT_REQ_006 | EV-027 | On squad/players-list pages (Uppsala Tigers page, UK Bangla Tigers Players list), show only player name, picture, and country flag next to the name — explicitly NO statistics or table | Content/visual | HIGH | Players Profile page, Uppsala Tigers page | Not yet built | **Scope clarification, not a conflict, with CLIENT_REQ_003:** CLIENT_REQ_003 governs the Club Captain's own individual profile page (full stats table); this governs the general squad-LIST pages (name/picture/flag only) — two different page types | Build a squad-list card component (name + photo + flag, no stats); keep the separate full-stats layout for individual captain/player profile pages | OPEN — blocked on squad list + photos being supplied (see BLOCKER below) |
| CLIENT_REQ_007 | EV-027 | Uppsala Tigers players should also appear in the UK Bangla Tigers Players list (i.e. the two sister franchises' rosters are shown together on UKBT's own Players Profile page, not just on a separate Uppsala Tigers page) | Structure/content | MEDIUM | Players Profile page | Not yet built | None | Players Profile page shows both franchises' squads (Uppsala Tigers gets its own page too, per CLIENT_REQ_001) | OPEN — same blocker |
| CLIENT_REQ_008 | EV-027 | Exclude "MD Siraj Ullah Khadem Nipo" from the squad list | Content correction | HIGH | Players Profile / Uppsala Tigers page | N/A — this name has not yet appeared in any content supplied to this repository | None | Apply this exclusion once the actual squad list is supplied — there is currently no list in this repo containing that name to remove | OPEN — same blocker |

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

## Open blocker: squad list + player photos not accessible

`EV-20260826-027` records that the client referenced two Google Drive
folders ("Team squad drive," "Other drive") as the source for the
Uppsala Tigers squad list and player pictures underlying
CLIENT_REQ_006/-007/-008. **This session's tool permissions explicitly
disable `curl`, `wget`, and `WebFetch`** (`.claude/settings.json` deny
list) — there is no way to open a Drive URL or download its contents
from inside this repository's tooling. CLIENT_REQ_006-008 cannot be
implemented until the actual files are supplied as direct uploads (as
every other piece of evidence in this project has been — PDFs, zips,
images), not as a link. No squad-list content, player names beyond
Mohammad Chowdhury, or player images exist in this repository yet.

## Conflicts with the existing Truth Model

**None found.** This is the first substantive client-content document
supplied; `knowledge/01-VERIFIED-FACTS.yaml` had no prior organization
facts to conflict with (`organization_facts_count: 0` before this
ingestion). See `knowledge/01-VERIFIED-FACTS.yaml` for the facts this
document establishes.

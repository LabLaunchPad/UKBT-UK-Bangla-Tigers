# Site-Scale Pages Contract

**Date:** 2026-08-26 · Covers the five remaining pages from the client's
own IA (`CLIENT_REQ_001`): Club Captain, Players Profile, Our Franchises,
International Tournaments/Events, Contact Us. Same discipline as
`HOMEPAGE-CONTRACT.md`/`ABOUT-CONTRACT.md`: content mapped to evidence,
gaps stated honestly rather than filled with invented facts. Per
`contracts/ROUTE-CONTRACT.md`, routes/names come from this evidenced IA,
never from Adelux's own page list.

## Club Captain (`/club-captain`)

The one full player profile actually evidenced
(`UKBT-CONTENT-INVENTORY.md` C-003/C-005/C-006/C-007/C-008). No Adelux
page maps to a player-stats profile — `ProfileHeader.astro` and
`StatsTable.astro` are UKBT-original. Content: DOB, nationality, batting/
bowling style, current/previous franchise history (lists, not invented
prose — the source captured structured facts, not verbatim biography
text), full batting/bowling stats tables (3 formats each). Crest only, no
portrait (none confirmed). External stats-provider and personal-social
**platform names** are evidenced; their literal URLs were never
transcribed during ingestion and are not retrievable this session —
rendered as plain text, never a fabricated href.

## Players Profile (`/players`)

`knowledge/01-VERIFIED-FACTS.yaml`: `full_roster_status: UNKNOWN` — only
the Club Captain has a complete profile; "30+ Players" is an aggregate,
not a roster. This page states that honestly (aggregate stat + Captain
spotlight + a note that the rest are pending) rather than inventing
player entries to fill a grid.

## Our Franchises (`/franchises`)

Uppsala Tigers sister-franchise facts (`EV-20260826-026`) + the real
"Overseas Signings" roster (`EV-20260826-030`), minus "Nipo Khadem" per
`CLIENT_REQ_008`. **Does not use `nordic-smash-slide.webp`**: that
graphic has the excluded name baked into the photo itself
(`EV-20260826-031`, found on direct visual inspection after initial
build — see `SITE-PAGES-VISUAL-QA.md`). Uses the crest instead, same as
the Homepage's `FranchiseTeaser.astro`, retroactively fixed there too.
Roster cards are text-only (name + country), no photos.

## International Tournaments/Events (`/tournaments`)

The full 5-event calendar (`EV-20260826-026`, C-009): 2 upcoming, 3
completed. Tournament-level only — no match-by-match fixtures/results
exist in evidence, so none are rendered. Uses a new `TournamentCard.astro`
(not the Homepage's `TournamentGrid.astro`, which is frozen/tested and
whose "see all tournaments" CTA would self-link on this very page).

## Contact Us (`/contact`)

`knowledge/01-VERIFIED-FACTS.yaml`'s unknowns register (U-16) records
venue/phone/email/opening-hours as UNKNOWN. Per
`contracts/FORM-CONTRACT.md`, a real submission form requires the
`submitForm` adapter boundary and a backend implementation, neither of
which exists yet. Shipping a "Send us a message" form with no working
backend would silently drop real inquiries. This page offers only the
real, working channel that exists today (official social media) and
states the contact-details gap honestly instead of fabricating details or
a non-functional form.

## 404 (`/404`)

Astro's file-based routing serves this automatically for any unmatched
path. No UKBT organizational fact is needed.

## Acceptance criteria (all five pages)

1. `pnpm typecheck && pnpm lint && pnpm build` all exit 0.
2. Playwright + axe: zero violations on every route.
3. Content-contamination and excluded-asset greps (text) return zero
   matches — extended this pass to also catch `nordic-smash-slide.webp`
   after the image-content finding above.
4. No photo rendered for any individual without a confirmed-identity
   source (Club Captain, Our Franchises roster).
5. No non-functional form ships on Contact Us.
6. Real screenshots captured at the frozen 6-viewport matrix and
   inspected directly — see `SITE-PAGES-VISUAL-QA.md` for the two real
   accessibility defects and one image-content defect found and fixed
   this pass.

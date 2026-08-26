# UKBT Content Inventory

**Date:** 2026-08-26 · Source: `EV-20260826-026` (first-party client-supplied
PDF, "Mohammad Chowdhury's Profile.pdf", read in full). Per
`MASTER EXECUTION PROMPT § 5-6`: original wording preserved; no fact
invented or rewritten during ingestion.

| CONTENT_ID | SOURCE | CONTENT_TYPE | ENTITY | ORIGINAL_CONTENT | DATE | TRUTH_STATUS | CONFIDENCE | REUSE_STATUS | NOTES |
|---|---|---|---|---|---|---|---|---|---|
| C-001 | EV-026 | Navigation outline | Site IA | Home / About Us / Club Captain / Players Profile / Our Franchises (Uppsala Tigers) / International Tournaments/Events / Contact Us | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Proposed IA, not yet a frozen Homepage Contract |
| C-002 | EV-026 | Leadership fact | MD Shahidul Alam Ratan | "Only correction will be **Acting** Chairman (MD Shahidul Alam Ratan, Acting Chairman)" | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Verbatim title correction instruction — always render as "Acting Chairman," never "Chairman." Origin of the draft being corrected is UNKNOWN (no prior chairman content exists in this repo) |
| C-003 | EV-026 | Player biography | Mohammad Chowdhury | DOB 10 Dec 1990; Nationality British & Bangladeshi; Right-Handed Top Order Batter; Right-Arm Off Spin Bowler; full narrative bio (career across Bangladesh, West Indies, USA, South Africa, Nepal, UAE, Spain, Sweden, Italy, UK; MCC representation; Uppsala Tigers captaincy in Nordic Smash T20 Stockholm) | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Role: Club Captain, UK Bangla Tigers |
| C-004 | EV-026 | Franchise history | Mohammad Chowdhury | Current: London Blaze (England, Gateway T20), Roma Ovest Titans (Italy, RPL T10), UK Bangla Tigers (UAE, Safari International T20 Cup), Uppsala Tigers (Sweden, Nordic Smash T20). Previous: Yankee Royals (Florida, US Open), Bangladesh Tigers of USA, US All Stars, West Indies (Caribbean T10), BAS Vampire (England, T20 Pro-Am), Faisalabad Falcons (Florida, US Open) | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Establishes UKBT as a UAE-competing franchise; sister franchise Uppsala Tigers named |
| C-005 | EV-026 | Career statistics — batting | Mohammad Chowdhury | 50-Over: 276 matches, 231 inn, 11276 runs, HS 189, avg 48.81, SR 117, 31×100s, 45×50s. T20: 136 matches, 123 inn, 4700 runs, HS 132, avg 38.21, SR 132, 7×100s, 26×50s. T10: 54 matches, 47 inn, 1600 runs, HS 103, avg 34.04, SR 147, 2×100s, 11×50s | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE_NEEDS_ADAPTATION | Client instruction: "Use the charts on your style table and format" — render with UKBT's own design-system table/chart styling, not the source screenshot's navy/gold styling |
| C-006 | EV-026 | Career statistics — bowling | Mohammad Chowdhury | 50-Over: 1203.2 overs, 297 wkts, avg 14.56, econ 4.09, best 6/21. T20: 246.3 overs, 143 wkts, avg 15.70, econ 6.30, best 5/19. T10: 98.2 overs, 67 wkts, avg 17.98, econ 8.06, best 4/26 | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE_NEEDS_ADAPTATION | Same styling instruction as C-005 |
| C-007 | EV-026 | External profile links | Mohammad Chowdhury | ESPN Cricinfo, Play-Cricket (England), CricHeroes, Last Man Stands, National Cricket League London, European Cricket/CREX — 6 URLs | 2026-08-26 | OBSERVED (first-party), **not independently verified** (WebFetch unavailable this session) | MEDIUM | AVAILABLE | Link out, don't scrape/republish the linked sites' own data |
| C-008 | EV-026 | Personal social links | Mohammad Chowdhury | Facebook, Instagram, YouTube, LinkedIn — 4 URLs | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | — |
| C-009 | EV-026 | Tournament calendar | UK Bangla Tigers | Nordic Lights (Upcoming, Sep 2026, Norway); Global T20 Championship (Upcoming, Oct 2026, Romania); Safari International T20 Cup (Completed, Jul 2026, UAE); Nordic Smash T20 (Completed, Jun 2026, Sweden); Asian Challengers Trophy (Completed, Jan 2020, Nepal) | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Tournament-level only — no match-by-match fixtures/results supplied (U-06 still open at that depth) |
| C-010 | EV-026 | Aggregate site statistics | UK Bangla Tigers | "30+ Players," "15+ Countries Internationals," "7+ International Tournaments" | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Suitable for a homepage stat strip |
| C-011 | EV-026 | Official social media | UK Bangla Tigers | Facebook, Instagram, TikTok, X — 4 URLs | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Client instruction: "Use the symbols only and connect using the links" — icon-only, no text label |
| C-012 | EV-026 | Official social media | Uppsala Tigers (sister franchise) | Facebook, Instagram, X — 3 URLs | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | Relevant to "Our Franchises" section, not the UKBT homepage directly |

## Missing / not supplied by this document

- **Profile picture:** the document's own placeholder says "Choose one
  from the attached" — no image file was attached to this upload.
  `ASSET_STATUS = MISSING`.
- Any other player's profile (roster says "30+ Players" — only 1 is
  detailed).
- Full committee/leadership beyond the Acting Chairman.
- "About Us" narrative content, founding history, honours (U-03).
- Sponsors/partners (U-07).
- Venue/contact details (U-16).
- Brand assets: logo, colours, typography (U-05) — zero evidence in this
  document.

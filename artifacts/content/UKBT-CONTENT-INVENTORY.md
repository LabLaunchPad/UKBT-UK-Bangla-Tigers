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

| C-013 | EV-029 | Logo/crest | UK Bangla Tigers | Shield crest: "UK BANGLA TIGERS," tiger-head mark, crown, "EST 2020" | 2026-08-26 | OBSERVED (first-party, direct pixel inspection) | HIGH | AVAILABLE | `artifacts/brand/raw/brand/crest.png`; full decision: `artifacts/brand/BRAND-DECISION.md` |
| C-014 | EV-029 | Leadership graphic | UK Bangla Tigers management | "INTRODUCING OUR MANAGEMENT TEAM": Mohammad Chowdhury (Founder & CEO), MD Shahidul Alam Ratan (Chairman), Sayem Rahman (Vice-Chairman); tagline "we are not only a team, but also an institute for learning" | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | `artifacts/brand/raw/images/leadership/management-team.webp` |
| C-015 | EV-029 | Hero photograph | UK Bangla Tigers | Real team photo, light-blue/black kit, sponsor logos on kit (names not confidently legible) | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | `artifacts/brand/raw/images/hero/home-hero.webp` |
| C-016 | EV-029, EV-030 | Gallery photos ×20 | Mixed — see note | Match/team photography | 2026-08-26 | OBSERVED (first-party); **not uniformly UK Bangla Tigers** | MEDIUM | AVAILABLE_NEEDS_ADAPTATION | `artifacts/brand/raw/images/gallery/`; gallery-15 and leadership/our-story are byte-identical (same photo, two names); gallery-06 shows unrelated green/red "Islami Bank... Cup 2022"-branded kit, no UKBT crest — affiliation unconfirmed, exclude from confident UKBT use pending clarification |
| C-020 | EV-030 | Second tagline | UK Bangla Tigers | "United by Passion. Driven by Cricket." | 2026-08-26 | OBSERVED (first-party, official social-card image) | HIGH | AVAILABLE | Shorter marketing line, distinct from the mission-statement tagline (C-010-adjacent) |
| C-021 | EV-030 | Uppsala Tigers overseas signings | Uppsala Tigers | 6 named players + countries (Chowdhury, Shakibal Hasan, Potgieter, Martins, Butt, Khadem) | 2026-08-26 | OBSERVED (first-party graphic) | MEDIUM | AVAILABLE_NEEDS_ADAPTATION | "Nipo Khadem" = the player already instructed for removal (CLIENT_REQ_008) — excluded from any published list |
| C-022 | EV-030 | Unlabeled leadership portrait | Unconfirmed — plausibly MD Shahidul Alam Ratan | Formal portrait, England lapel pin | 2026-08-26 | OBSERVED (first-party); **identity unconfirmed** | LOW | UNKNOWN | `artifacts/brand/raw/images/leadership/management-portrait.webp` — do not caption with a name until confirmed |
| C-023 | EV-030 | "Join us" leadership image | **Not UK Bangla Tigers** — likely BAS Vampire (a prior team of the Club Captain/Founder) | Squad photo, "MSG"/"BAS" kit branding, no crest | 2026-08-26 | OBSERVED (first-party); **affiliation does not match UKBT** | LOW | PROHIBITED (as UKBT recruitment imagery, pending confirmation) | `artifacts/brand/raw/images/leadership/join-us.webp` — do not use under a UKBT "join us" heading without confirming which team is actually shown |
| C-017 | EV-029 | Uppsala Tigers image | Uppsala Tigers | "Nordic Smash T20" branded slide/graphic | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | `artifacts/brand/raw/images/uppsala/nordic-smash-slide.webp` |
| C-018 | EV-029 | Social preview (OG) image | UK Bangla Tigers | 1200×630 default social-card image | 2026-08-26 | OBSERVED (first-party) | HIGH | AVAILABLE | `artifacts/brand/raw/images/social-card/default.jpg` |
| C-019 | EV-029 | Font files | UK Bangla Tigers (proposed) | Lato (400, 700), Montserrat (variable) — valid WOFF2, SIL OFL | 2026-08-26 | OBSERVED (files real); **typography choice itself PROPOSED, not verified** | MEDIUM | AVAILABLE_NEEDS_ADAPTATION | Explicitly an assumption per the supplied material, not club-confirmed |

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

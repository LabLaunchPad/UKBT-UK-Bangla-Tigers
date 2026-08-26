# Homepage Template Mapping

**Date:** 2026-08-26, revised same day · Maps `artifacts/ui/REFERENCE-ANALYSIS.md`'s
observed visual grammar (Stage 6) to actual UKBT content and assets
(Stage 7). No Adelux content, branding, or fictional material appears in
any `UKBT_CONTENT`/`UKBT_ASSET` column — every value below traces to a
Stage 7 evidence record.

**Revision note:** the table below was revised after implementation to
mirror each section's *actual measured geometry* from the Adelux source
(`HTML_TEMPLATE/index.html` + `assets/css/main.css`), read directly a
second time at the requester's instruction, rather than a looser
generic reinterpretation. Real CSS values used: `.banner-home-top`/
`.banner-home-bottom` (flex row, `justify-content: space-between`, `gap:
100px`) → the Hero's two-row layout; `.about-wrapper` (flex row, `gap:
100px`, `align-items: center`, with `.about-highlight-box`'s
border-top-accent 3-stat row) → Club Intro (which absorbed the
originally-separate "stat strip" section, since the reference has no
standalone strip — its stats live inside the About section); `.tournament-grid`
(`grid-template-columns: 0.32fr 0.68fr`) + `.card-tournament.tournament-cta`
(1fr 1fr) + `.other-tournament-container` (1fr 1fr) → the Tournament
section's main-event/CTA/secondary-cards layout; `.academy-title-container`
(flex row, `align-items: center`, `border-bottom: 3px solid var(--primary)`)
→ Club Captain spotlight; `.community-grid` (`grid-template-columns: 1fr
1fr`, `gap: 100px`) → Franchises teaser. The reference's "Testimonial"
and "Service/Booking" sections have no real UKBT content to populate
them (no consented member testimonials exist, no court-booking product
exists) and are correctly omitted, not filled with placeholder content.

| TEMPLATE_COMPONENT | PURPOSE | UKBT_CONTENT | UKBT_ASSET | SOURCE | TRUTH_STATUS | CLIENT_REQUIREMENT | DESIGN_DECISION | STATUS |
|---|---|---|---|---|---|---|---|---|
| Nav bar (§4, single collapse breakpoint) | Site navigation | Home, About Us, Club Captain, Players Profile, Our Franchises, International Tournaments/Events, Contact Us | `crest.png` (nav logo) | `EV-026` (IA), `EV-029` (logo) | OBSERVED / VERIFIED | `CLIENT_REQ_001` | Active link via Astro routing, not a client script (Stage 6 §4 improvement) | AVAILABLE |
| Hero section (§5) | First-impression identity + CTA | Headline built from the tagline(s); crest as the confirmed visual anchor | Crest/wordmark treatment (confirmed); `home-hero.webp` as an optional photographic layer, **pending team-affiliation confirmation** | `EV-029`/`-030` (taglines), `EV-030` (hero caveat) | VERIFIED (crest/tagline) / UNCONFIRMED (photo) | none explicit | Ship with the crest/wordmark hero now; swap in the photo later only if/when confirmed as UKBT's own | AVAILABLE (crest path) / AVAILABLE_NEEDS_ADAPTATION (photo path) |
| Primary CTA (§5 responsive-button rule) | Drive an action | "Join the Club" / follow on social | Social icons per `CLIENT_REQ_004` | `EV-026` (social handles) | OBSERVED | `CLIENT_REQ_004` (icon-only social) | Fluid-width CTA below the nav breakpoint (Stage 6 §5 rule) | AVAILABLE |
| Stat strip (§1 section-rhythm pattern) | Credibility/scale signal | "30+ Players," "15+ Countries Internationals," "7+ International Tournaments" | none needed (text-based) | `EV-026` | OBSERVED | none explicit | Present as a welded hero-adjacent strip (Stage 6 §6 rhythm rule) | AVAILABLE |
| Club introduction section | Mission/identity | Tagline ("we are not only a team, but also an institute for learning"); founding year 2020 | `crest.png` | `EV-026`/`-028` (tagline), `EV-029` (year) | OBSERVED (corroborated twice) | none explicit | Short mission block, not a full About Us (that's its own page) | AVAILABLE |
| Upcoming tournaments/events section | Near-term relevance | Nordic Lights (Sep 2026, Norway); Global T20 Championship (Oct 2026, Romania) | none | `EV-026` | OBSERVED | `CLIENT_REQ_001` (nav section exists) | Filter the 5-event calendar to "Upcoming" for the homepage; full calendar lives on its own page | AVAILABLE |
| Club Captain spotlight (card pattern, §3) | Highlight leadership | Mohammad Chowdhury — Founder & CEO, Club Captain; full profile lives on its own page | none confirmed (`management-portrait.webp` identity unconfirmed; not used here) | `EV-026`, `EV-029` | OBSERVED | `CLIENT_REQ_005` (Club Captain is its own page) | Homepage shows a short spotlight + link; full stats table stays off the homepage (`CLIENT_REQ_003` governs the captain's own page, not this one) | AVAILABLE |
| Franchise cross-link ("Our Franchises") | Site structure | Uppsala Tigers (Sweden) named as sister franchise | `nordic-smash-slide.webp` (event graphic; roster names excluded from homepage use) | `EV-026`, `EV-030` | OBSERVED | `CLIENT_REQ_001` | Homepage shows a link/teaser only, not the roster (roster is non-critical, its own page) | AVAILABLE |
| Footer + social block | Contact/social | Official UK Bangla Tigers social handles (Facebook, Instagram, TikTok, X) | Font Awesome icons (already allowlisted) | `EV-026` | OBSERVED | `CLIENT_REQ_004` (icon-only) | Icon-only links, no text labels | AVAILABLE |
| Card/component base (§3) | Visual consistency | N/A — structural only | `Card.astro`, `Button.astro` (Stage 5) | Stage 5 | VERIFIED | none | Reuse existing components unchanged; extend variants only if new evidence justifies it | AVAILABLE |
| Section/spacing primitive (§1, §6) | Layout rhythm | N/A — structural only | New `Section` primitive (proposed in Stage 6, not yet built) | Stage 6 `REFERENCE-ANALYSIS.md` | PROPOSED | none | Build at implementation (Stage 7G) | DERIVABLE |

## Explicitly excluded from this mapping

- `join-us.webp`, `gallery-06.webp` — not confirmed as UKBT (`EV-030`); not mapped to any homepage slot.
- "Nipo Khadem" — excluded from any roster/franchise content per `CLIENT_REQ_008`.
- Sponsor logos — not legibly identified; no sponsor section is in the client's stated IA, so none is added.
- Any Adelux-authored copy, business claims, or branding — Track B's unlock permits adapting *layout grammar*, never publishing Adelux's own content as UKBT's.

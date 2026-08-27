# Homepage Contract

**Date:** 2026-08-26 · **Status:** FROZEN, pending sign-off. Governs
Stage 7G (Homepage implementation). Built from `artifacts/STAGE_7_READINESS_MATRIX.md`
(all Homepage-critical items evidenced), `artifacts/pages/HOMEPAGE-TEMPLATE-MAPPING.md`,
`artifacts/brand/UKBT-BRAND-FOUNDATION.md`, and `artifacts/ui/REFERENCE-ANALYSIS.md`.
Per this pipeline's own rule: **no implementation begins until this contract is
approved.**

## Identity

```
CANONICAL_LOGO   = artifacts/brand/raw/brand/crest.png (+ pre-sized variants, favicon.svg)
PRIMARY          = #001E3A (Navy)   — VERIFIED
ACCENT           = #CCA44F (Gold)   — VERIFIED
GOLD_RULE        = Gold never used as text on white/cream (2.34:1, fails AA);
                    Gold used on Navy/dark surfaces or as non-text accent — BINDING
HEADING_FONT     = Montserrat (variable) — PROPOSED
BODY_FONT        = Lato (400/700)   — PROPOSED
HERO_IMAGE_RULE  = Ship the crest/wordmark hero treatment as the committed
                    option. home-hero.webp is NOT used until UKBT confirms
                    it depicts UK Bangla Tigers specifically (its kit's
                    small patches aren't legible as the UKBT crest, and
                    the dominant kit branding is an unrelated charity/
                    event logo — EV-20260826-030).
```

## Structure (section order)

1. Nav (7 items: Home, About Us, Club Captain, Players Profile, Our Franchises, International Tournaments/Events, Contact Us — `CLIENT_REQ_001`)
2. Hero (crest/wordmark + tagline + primary CTA)
3. Stat strip ("30+ Players," "15+ Countries Internationals," "7+ International Tournaments")
4. Club introduction (mission tagline + founding year 2020)
5. Upcoming tournaments (Nordic Lights, Global T20 Championship — filtered from the 5-event calendar to "Upcoming" only)
6. Club Captain spotlight (Mohammad Chowdhury — Founder & CEO / Club Captain — short spotlight + link to full profile page; no stats table here per `CLIENT_REQ_003`'s page-type distinction)
7. Our Franchises teaser (Uppsala Tigers link; no roster content on the homepage)
8. Footer (icon-only social links — `CLIENT_REQ_004`; copyright; nav repeat)

Not Adelux's page order — an IA derived from the client's own stated
structure (`CLIENT_REQ_001`) and what real content actually exists,
per Stage 6's "do not simply clone the reference page order" rule.

## Content (source + status per section)

| Section | Content | Status |
|---|---|---|
| Hero tagline | "We are not only a team, but also an institute for learning." / "United by Passion. Driven by Cricket." | OBSERVED, corroborated twice |
| Stat strip | 30+ / 15+ / 7+ | OBSERVED |
| Club introduction | Founding year 2020 | OBSERVED (crest) |
| Tournaments | Nordic Lights, Global T20 Championship (dates/countries as recorded) | OBSERVED |
| Captain spotlight | Mohammad Chowdhury, Founder & CEO / Club Captain | OBSERVED |
| Franchises teaser | Uppsala Tigers (Sweden) named, no roster shown | OBSERVED |
| Social links | Official UKBT Facebook/Instagram/TikTok/X | OBSERVED |

All static at build time (Astro content collections) — no dynamic
fetch, consistent with `contracts/FORM-CONTRACT.md`'s static-first
decision.

## Interaction

- Nav collapses at one site-wide breakpoint; active link set via
  `Astro.url.pathname`, not a client script (Stage 6 §4 improvement).
- Hover/focus transitions reuse `Button.astro`/`Card.astro`'s existing
  mechanism (Stage 5) — CSS custom-property swap on a fixed duration.
- **The reference's invisible-focus-outline defect is never reproduced**
  — every interactive element keeps its existing real `:focus-visible`
  indicator.
- CTA buttons go fluid-width below the nav-collapse breakpoint (Stage 6
  §5 rule), not fixed-width-then-overflow.

## Responsive

Frozen 6-viewport matrix, unchanged: 1440×900, 1280×800, 1024×768,
768×1024, 430×932, 390×844. Zero horizontal overflow at every viewport —
enforced by the existing Playwright suite, extended to the new homepage
route. **The reference's own overflow defects (4 of 13 pages) are never
reproduced.**

## Accessibility

- WCAG 2.1 AA target, real axe-core checks (Stage 5 infrastructure,
  extended to this page).
- The Gold-contrast rule above is binding and testable (computed, not
  eyeballed).
- Semantic headings (one `h1`), accessible nav landmark, real alt text
  for every image actually used (none for the unconfirmed
  `home-hero.webp`, since it isn't shipped).
- `prefers-reduced-motion` honored (Stage 5 base styles, unchanged).

## SEO / AEO / GEO

- Title: "UK Bangla Tigers — Cricket Club" (real, not fabricated —
  matches the crest wordmark and social-card copy).
- Description: built from the corroborated tagline, not invented.
- Canonical URL: set once a deployment domain is decided (not yet —
  `PRODUCTION_CLEARANCE` is `CONDITIONALLY_CLEARABLE`, deployment target
  itself is a separate, later decision).
- Open Graph image: `images/social-card/default.jpg` (already correctly
  sized, 1200×630, and already crest-branded — no new asset needed).
- Structured data: `SportsTeam`/`SportsOrganization` JSON-LD using only
  facts already on record (name, founding year, sport, sameAs → official
  social URLs) — no fabricated fields.

## Performance

- Self-hosted fonts (Lato/Montserrat woff2, already in `artifacts/brand/raw/fonts/`) — never loaded from `fonts.gstatic.com` at runtime, per `DEPLOYMENT-CONTRACT.md`.
- Images served as WebP where already supplied in that format; the social-card JPEG stays as-is (already correctly sized for its purpose).
- No new JS dependency introduced for this page.

## Acceptance criteria (executable)

1. `pnpm run build` succeeds with the homepage route included.
2. `pnpm exec playwright test` — 0 horizontal overflow at all 6 viewports on `/`.
3. axe-core — 0 violations on `/`.
4. Every interactive element shows a real, non-`none`, non-zero-width `:focus-visible` outline (computed-style assertion, same method as Stage 5).
5. Gold (`#CCA44F`) does not appear as computed text colour on any white/cream background anywhere on the page (grep/computed-style check).
6. `node scripts/scaffold-self-test.mjs` and `node scripts/check-dependency-allowlist.mjs` both pass unchanged.
7. A content-integrity grep finds no `Adelux`, `Fox Creation`, `Padel`, or template placeholder strings anywhere in the built output.
8. `home-hero.webp` does not appear anywhere in the built output unless a later evidence record confirms its UKBT affiliation.

## Open items carried forward, explicitly not blocking

Full player roster, full committee, sponsor identities, full About Us
narrative, `home-hero.webp` confirmation — all recorded in
`artifacts/STAGE_7_READINESS_MATRIX.md` as non-critical for this
contract. Each is closeable independently, later, without reopening this
contract.

---

## Amendment 01 (2026-08-26) — structure expanded under later client direction

**Authority:** `EV-20260826-032` (CLIENT_REQ_009–012) — the client's
explicit later direction to "mirror all template pages with section
parity" — postdates this contract's original freeze and was never folded
back into it before the homepage shipped.

**Finding that prompted this amendment:** the Stage 8 independent red
team (`artifacts/review/HOMEPAGE-REDTEAM.md`, finding F2) found the
shipped homepage renders 9 top-level sections against this contract's
originally-frozen 8-item structure above, with `WhyChooseUs`,
`AcademySection`, and `AboutCTA` present but never approved. That is a
real process failure — a page shipping ahead of its own contract — not
a judgment call this amendment is pretending away.

**Disposition:**
- `WhyChooseUs` and `AcademySection` are APPROVED, retroactively, as an
  amendment to the "Structure (section order)" above: they carry only
  evidenced content already on record elsewhere in this document or in
  `knowledge/01-VERIFIED-FACTS.yaml` (the founding year, the "institute
  for learning" tagline, the aggregate stats), and their inclusion is
  consistent with `EV-20260826-032`'s explicit direction, not merely
  convenient. The founding-year fact they had been carrying is now also
  rendered directly by `ClubIntro` (the section this contract originally
  assigned it to), per F2's own required fix, so it no longer depends on
  either section's continued presence.
- `TestimonialSection` and `NewsTeaser` are NOT approved for the
  homepage and have been removed from `apps/web/src/pages/index.astro`.
  Both are `CONTENT_STATUS = UNKNOWN` shells with no real content behind
  them; shipping a visibly-empty box on the site's primary indexed route
  was the more serious half of F2 and is not something a contract
  amendment can retroactively bless — it's fixed by not shipping it here.
  Both components remain available for lower-traffic pages once real
  content exists.
- Acceptance criterion 3 (axe-core, 0 violations) is clarified: it means
  the full, untagged rule set, not only `wcag2a`/`wcag2aa`/`wcag22aa` —
  F4 found a real `best-practice`-tagged `heading-order` violation the
  tag-filtered existing suite could not see. The four flagged instances
  are fixed; `homepage.spec.ts`'s axe scan should be widened accordingly
  as a follow-up so this class of gap doesn't silently reopen.

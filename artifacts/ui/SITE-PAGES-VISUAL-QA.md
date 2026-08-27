# Site-Scale Pages Visual QA

**Date:** 2026-08-26 · Method: real rendered screenshots at the frozen
6-viewport matrix (`apps/web/tests/visual/screenshots.spec.ts`),
inspected directly. Covers: Club Captain, Players Profile, Our
Franchises, International Tournaments/Events, Contact Us.

## Critical finding: excluded person visible inside an image, not just text

While reviewing the Our Franchises page's own screenshot, the "Overseas
Signings" graphic (`nordic-smash-slide.webp`) was read closely and found
to display **"NIPO KHADEM / PORTUGAL" baked into the photo itself** —
not just recorded as metadata. `CLIENT_REQ_008` requires that name
excluded from any published content. Cross-checking the Homepage's own
screenshot confirmed the identical graphic — already shipped via
`FranchiseTeaser.astro` since Stage 7G — carries the same caption. This
had been live on the Homepage the whole time; the existing
content-contamination Playwright checks (text grep) could not catch it,
because it's pixels, not text. Full record: `EV-20260826-031`.

**Fix:** the image is removed from both `FranchiseTeaser.astro` (Homepage)
and the new Our Franchises page. Both now use the crest instead — no
alternative Uppsala Tigers photo excluding this player exists in
evidence. The file itself is removed from `apps/web/public/`, and all
three excluded-asset Playwright checks (`homepage.spec.ts`,
`about.spec.ts`, `pages.spec.ts`) now include `nordic-smash-slide.webp`.
Re-screenshotted and visually reconfirmed clean on both pages after the
fix.

**Process note:** a text-content contamination grep proves nothing about
what an image itself displays. Any future image carrying visible names/
captions needs direct visual inspection before use, the same rigor
already applied to colour/contrast/logo claims.

## Accessibility defects found and fixed (axe-core, not visual)

| Page | Element | Issue | Fix |
|---|---|---|---|
| Club Captain | `.ukbt-profile-header__role` | Gold accent text directly on the default white/light section background — 2.33:1, fails AA (the same gold-on-white failure already documented in `EV-20260826-029`, reintroduced here in a new component) | Changed to the navy `brand.primary` colour, which has adequate contrast on light surfaces |
| International Tournaments/Events | `.ukbt-event-card__tag` ("Completed") | `opacity: 0.75` on the completed-event card blended the gold tag text toward the page background, dropping contrast to 4.12:1 (fails AA) | Removed the opacity-based dimming; "Completed" now uses a light-grey tag colour/border against the still-fully-opaque navy card (~8.5:1) |

Both found by running the real axe-core scan (not assumed passing), fixed,
and reconfirmed with a second full test run (101/101 passing).

## Visual inspection (1440×900, 390×844)

- **Club Captain:** profile header, franchise history (current/previous),
  batting/bowling stats tables, and the stats-provider/social-platform
  lists all render cleanly with no overlap. Stats tables use a horizontal
  scroll container (`overflow-x: auto`) at narrow widths rather than
  forcing 9 columns to fit 390px — a deliberate pattern, not a defect;
  the page itself has no horizontal overflow (verified by the automated
  check and by direct inspection).
- **Players Profile:** aggregate stat + Captain spotlight + honest
  full-roster-pending note render cleanly, no fabricated player entries.
- **Our Franchises:** crest panel + Uppsala Tigers facts + 5-player
  roster (Nipo Khadem excluded) render cleanly at both viewports; roster
  cards wrap correctly on mobile.
- **International Tournaments/Events:** upcoming (2) and completed (3)
  event cards render in a clean responsive grid, no fabricated
  "featured" event forced into the layout.
- **Contact Us:** honest "details being confirmed" copy + real social
  links render cleanly; no non-functional form is shipped (verified by
  the `pages.spec.ts` check that zero `<form>` elements exist on this
  page).

## What was not built, and why

- No contact form: `contracts/FORM-CONTRACT.md`'s adapter boundary has no
  real backend implementation yet (no Cloudflare Functions deployment).
  Shipping a form with no working backend would silently drop real
  inquiries — worse than not having one.
- No literal href for the Club Captain's external stats-provider links or
  personal social links: the source PDF names the platforms but their
  literal URL strings were never transcribed into any evidence file
  during ingestion and are not retrievable in this session. Rendered as
  plain text, never a fabricated href.
- No player photos anywhere on Players Profile or Our Franchises: no
  confirmed-identity photo exists for any named individual beyond the
  crest itself.

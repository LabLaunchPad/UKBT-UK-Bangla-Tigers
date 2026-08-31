# What We Need From the Client

**Date:** 2026-08-26, updated 2026-08-31. Everything below is already handled correctly on the
site — each is either a `PendingContent` shell, an `UNKNOWN` field, or a
held-back asset (never a fabricated fact) — so nothing here is blocking a
code fix. It's blocking on real information only the club can supply. Full
citations are in `knowledge/01-VERIFIED-FACTS.yaml`'s unknowns register
(`artifacts/bootstrap/UNKNOWN-EVIDENCE.md`) and
`artifacts/content/CLIENT-REQUIREMENTS-INVENTORY.md`.

## 1. Contact details
- Phone number, email address, physical venue/ground, opening hours.
  Currently the Contact page states these are "still being confirmed" and
  offers only social-media links.

## 2. People
- **Full player roster — RESOLVED 2026-08-31.** Your "Players Profile" and
  "Uppsala Tigers Players & Managements List" documents gave us the full
  42-name UK Bangla Tigers roster and the full 20-player Uppsala Tigers
  squad + 4 team officials. Both now render on `/players` and
  `/franchises/uppsala-tigers`. Still open: full individual profiles
  (biography, career stats, photo) beyond the Club Captain — names and
  countries only for everyone else.
- **One conflict we couldn't resolve ourselves — please confirm:**
  Roushan Singh's country. Your Aug 31 corrections document said
  Portugal; the Uppsala squad list says India; the master players list
  says Netherlands. We've left it showing "Country unconfirmed" on both
  pages rather than guess — let us know which is right.
- Full committee list (Founder/CEO, Acting Chairman, Vice-Chairman are named;
  the rest is not).
- Coaching staff names and roles for UK Bangla Tigers itself (the Coaching
  page is an empty shell) — Uppsala Tigers' own coach (Shaftab Khalid) and
  team officials are now on record and published.
- UK Bangla Tigers **and** Uppsala Tigers squad **photos** — you pointed us
  to two Google Drive folders previously, but our tooling can't fetch from
  Google Drive; these still need to come as direct file uploads. Names and
  countries no longer need this — see above.
- Reminder: "Nipo Khadem" / "MD Siraj Ullah Khadem Nipo" stays excluded from
  any published roster or photo per your earlier instruction — absent from
  both new roster documents, so this is unaffected; please flag if that
  instruction has changed.

## 2a. Uppsala Tigers logo — RESOLVED 2026-08-31
- You supplied the new Uppsala Tigers crest as a direct upload
  (`EV-20260831-004`). It now renders on the `/franchises` card grid and
  the `/franchises/uppsala-tigers` detail page, replacing the UK Bangla
  Tigers crest it fell back to. No action needed from you here.

## 3. Photography rights
- Two supplied photos carry third-party photographer watermarks ("FSR
  FOTOGRAFIA", "TOP-KNOCK STUDIOS"). We need confirmation the club holds
  publication rights before these can go live — this is a rights question,
  separate from the "these are usable club photos" authorization already
  given.
- A number of other supplied photos are held back for reasons that need your
  call, not ours: sponsor branding for other events (Safari T20 Cup,
  European Cup) that isn't UKBT's own; other national teams' kit (Oman,
  Bangladesh, Caribbean); unidentified people we can't caption. Full list in
  `apps/web/src/assets/MANIFEST.md`.

## 4. Page content still empty
These pages/sections currently show an honest "not yet published" shell
rather than invented copy:
- FAQ answers
- Membership scheme, tiers, and terms
- Programmes/services offered and their pricing
- Trial/selection/registration process (Join page)
- Match reports / club news
- Member testimonials (a real, consented quote from a player or parent)
- Full "About Us" history/honours narrative (we only have "Est. 2020" from
  the crest)
- Sponsor/partner names, if any exist and can be named

## 5. Decisions needed before launch
- **Domain and hosting**: no production domain is set anywhere in the
  project (deliberately — nothing is invented). The deployment target
  (Cloudflare Pages) is architecturally ready but not wired to a live
  domain.
- **Brand typography confirmation**: we're using Lato/Montserrat based on
  your supplied brand materials, but this hasn't been explicitly confirmed
  as your chosen typeface pairing — flag if this needs to change.
- **Contact form**: we deliberately did not ship a "Send us a message" form,
  because a form with no working backend would silently drop real inquiries.
  If you want a working contact form, we need to know before wiring the
  backend up.
- **Analytics/tracking**: none is set up yet — let us know if you want
  visitor analytics (and what your comfort level is with EU/UK cookie
  consent requirements, if so).

## Not blocking anything — for awareness only
GDPR/data-protection posture, WCAG accessibility target confirmation, and
CMS/non-technical-editor needs are all currently unconfirmed but don't block
the site as it stands today; they'll matter more once a form or user data
collection exists.

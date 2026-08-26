# Page Parity Matrix

**Generated** by `scripts/build-parity-matrices.mjs` from measured data — not written by hand, so it cannot drift from what the site renders. Regenerate after any page change.

**2026-08-26 exception, `index.html` row only:** the licensed Adelux
reference package (`UKBT_REFERENCE_DIR`) is not available in this
session, so the script cannot be re-run without discarding every
`SECTIONS_REF` value and the reference-sequences appendix below — real
evidence from a prior session that isn't reproducible here. The
`SECTIONS_UKBT`/`SHELLS`/`STATUS` cells for `/` only were hand-updated
to reflect the Stage 8 red team's F2 fix (`TestimonialSection` and
`NewsTeaser` removed from the homepage; `SECTIONS_UKBT` recount:
Hero + 7 `Section` blocks = 8, 0 shells). Every other row and the
`SECTIONS_REF` column are unchanged from the last real run. Re-run the
script properly with `UKBT_REFERENCE_DIR` set the next time it's
available to replace this note with a full regeneration.

`SECTIONS_UKBT` counts rendered `Section` primitives plus the page banner or hero. `SHELLS` counts sections carrying `CONTENT_STATUS = UNKNOWN`.

| TEMPLATE PAGE | UKBT ROUTE | SECTIONS_REF | SECTIONS_UKBT | SHELLS | NOINDEX | STATUS |
|---|---|---|---|---|---|---|
| `index.html` | `/` | 11 | 8 | 0 | no | BUILT |
| `about.html` | `/about` | 7 | 7 | 1 | no | SHELL — CONTENT_UNKNOWN |
| `event.html` | `/tournaments` | 4 | 5 | 1 | no | SHELL — CONTENT_UNKNOWN |
| `community.html` | `/community` | 6 | 6 | 1 | no | SHELL — CONTENT_UNKNOWN |
| `coaching.html` | `/coaching` | 4 | 5 | 2 | no | SHELL — CONTENT_UNKNOWN |
| `service.html` | `/services` | 6 | 4 | 2 | yes | SHELL — CONTENT_UNKNOWN |
| `membership.html` | `/membership` | 4 | 4 | 2 | yes | SHELL — CONTENT_UNKNOWN |
| `booking.html` | `/join` | 5 | 3 | 1 | yes | SHELL — CONTENT_UNKNOWN |
| `faq.html` | `/faq` | 4 | 3 | 1 | no | SHELL — CONTENT_UNKNOWN |
| `blog.html` | `/news` | 2 | 3 | 1 | no | SHELL — CONTENT_UNKNOWN |
| `single-post.html` | `/news/[slug]` | 3 | NOT BUILT | — | — | NOT_STARTED |
| `contact.html` | `/contact` | 4 | 3 | 0 | no | BUILT |
| `404-page.html` | `/404` | 1 | 1 | 0 | no | BUILT |

## Reference section sequences

What each reference page actually contains, for checking composition rather than counts.

- `index.html` → `/`: Banner Home → About → Why Choose Us → Service → Padel Booking → Academy → Tournament → Community → Testimonial → Membership CTA → Blog
- `about.html` → `/about`: Banner Inner → About Welcome → About → Why Choose Us → Membership CTA → Testimonial → Team
- `event.html` → `/tournaments`: Banner Inner → Tournament → Community → Testimonial
- `community.html` → `/community`: Banner Inner → Tournament → Academy → Testimonial → Community → Membership CTA
- `coaching.html` → `/coaching`: Banner Inner → Team Page → Contact CTA → Testimonial
- `service.html` → `/services`: Banner Inner → Service → Membership CTA → Pricing → Testimonial → Contact CTA
- `membership.html` → `/membership`: Banner Inner → Membership Benefit → Pricing → FAQ
- `booking.html` → `/join`: Banner Inner → Booking Process → Booking → Contact CTA → Testimonial
- `faq.html` → `/faq`: Banner Inner → FAQ → Membership CTA → Blog
- `blog.html` → `/news`: Banner Inner → Blog Page
- `single-post.html` → `/news/[slug]`: Banner Inner → Main Post → Blog
- `contact.html` → `/contact`: Banner Inner → Contact → Maps → Membership CTA
- `404-page.html` → `/404`: Banner Inner

## What a matching count does and does not prove

Equal counts do not mean equal pages. A route can hit its section count while a section carries a shell, and the reference sections with no UKBT counterpart (Service, Padel Booking, Pricing, Membership Benefit, Booking) are deliberately absent rather than pending. Read this table alongside `SHELLS` and `artifacts/ui/PARITY-HARNESS.md`, which measures geometry rather than composition.

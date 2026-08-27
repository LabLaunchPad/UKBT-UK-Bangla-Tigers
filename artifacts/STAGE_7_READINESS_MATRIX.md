# Stage 7 Readiness Matrix

**Date:** 2026-08-26 · Evidence exhausted as of `EV-20260826-026` through
`EV-20260826-030`. Distinguishes Homepage-critical items (must have
evidence to freeze the Homepage Contract) from non-critical remainders
(recorded, not blocking).

## Homepage-critical

| Requirement | Evidence | Status | Blocking? | Decision |
|---|---|---|---|---|
| Canonical logo | `artifacts/brand/raw/brand/crest.png`, `EV-029` | VERIFIED | No | Use as canonical logo |
| Core brand palette (primary/accent) | Direct pixel sampling, `EV-029` | VERIFIED | No | Navy `#001E3A` primary, Gold `#CCA44F` accent |
| Accessible colour usage rule | Computed WCAG contrast, `EV-029` | VERIFIED | No | Gold never as text on white/cream; binding rule in `UKBT-BRAND-FOUNDATION.md` |
| Typography decision | Font files + supplied-material framing, `EV-029` | PROPOSED | No — a decided status, just not a verified one | Proceed with Lato/Montserrat as PROPOSED; do not promote to VERIFIED without independent club confirmation |
| Hero asset | `home-hero.webp`, `EV-030` | **OBSERVED, team affiliation NOT confirmed** | **Partially** — blocks using this specific photo with confidence, does not block the contract | Use the crest/wordmark treatment (unambiguously UKBT) as the committed hero option; treat the photo as an optional enhancement pending one confirmation (see Homepage Contract §Identity) |
| Homepage IA (site structure) | Client PDF, `EV-026`, `CLIENT_REQ_001` | OBSERVED (first-party) | No | Home / About Us / Club Captain / Players Profile / Our Franchises / International Tournaments-Events / Contact Us |
| Primary CTA | Not explicitly specified by the client | UNKNOWN | No | Propose "Join the Club" / social follow, consistent with the tagline and the crest's own recruitment framing; a PROPOSED decision, not invented content |
| Required Homepage content | Client PDF + brand assets, `EV-026`/`EV-029` | PARTIAL | No | Tagline(s), founding year, tournament calendar, aggregate stats (30+/15+/7+), crest — sufficient for a real (not placeholder) homepage |
| Navigation | `CLIENT_REQ_001` | OBSERVED | No | 7-item nav per the client's own outline |
| Responsive behaviour | Stage 5 infrastructure (frozen 6-viewport matrix, zero-overflow enforced) | VERIFIED | No | Reuse, unchanged |
| Accessibility | Stage 5 infrastructure (real axe-core, focus-visible, contrast) + this stage's gold rule | VERIFIED | No | Reuse, extend with the gold-contrast rule |
| SEO requirements | Stage 3 `SEO-CONTRACT.md` (frozen, not yet applied to real content) | GOVERNED | No | Apply at implementation using real UKBT facts now on record (no fabrication needed for title/description) |

## Non-critical remainders (recorded, not blocking)

| Requirement | Evidence | Status | Why non-critical |
|---|---|---|---|
| Full player roster | Only Club Captain has a full profile; aggregate "30+" only | UNKNOWN, evidence-dependent | Homepage doesn't require a full roster — Players Profile page does, later |
| Full committee | Founder/CEO, Chairman, Vice-Chairman named; not complete | UNKNOWN, evidence-dependent | Homepage doesn't require a full committee list |
| Sponsor identities | Logos visible on kit photos, not legibly confirmed | UNKNOWN, evidence-dependent | No sponsor section is required on the Homepage per the client's own IA |
| "About Us" full narrative | One mission-snippet + one tagline pair | PARTIAL | Homepage needs a short mission statement (have it); the full About Us page is separate |
| Sister-franchise (Uppsala Tigers) full roster | 6 named overseas signings only, one excluded per client instruction | UNKNOWN, evidence-dependent | Not a Homepage requirement — its own page, later |

## Decision

```
ALL HOMEPAGE-CRITICAL ITEMS: evidenced (VERIFIED, PROPOSED, or an explicit
                              provisional handling) — none is a hard UNKNOWN
                              that stops the contract.
DECISION: PROCEED to Template Mapping, then the Homepage Contract.
NON-CRITICAL UNKNOWNS: recorded above, explicitly not blocking.
```

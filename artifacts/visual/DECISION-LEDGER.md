# Visual Decision Ledger

**Created:** 2026-08-31 · **Authority:** `EV-20260831-003` ·
**Defined by:** `docs/13-visual-truth-system.md` §11

The durable bridge between `past discussion ↔ current design ↔
implementation ↔ verification`. Every material visual decision gets a row.

**A row without an evidence ID or artifact path is a defect in this file,
not a fact about the project.** This ledger is seeded only with decisions
that already have evidence in this repository — it is deliberately *not*
back-filled from memory. Where a decision predates the ledger and its
rationale was not recorded anywhere retrievable, it is absent rather than
reconstructed.

## Schema

```
DECISION_ID · DATE · PAGE · SECTION · ELEMENT · VIEWPORT
DECISION · RATIONALE · SOURCE · EVIDENCE_IDS
STATUS · APPROVED_BY · SUPERSEDES · SUPERSEDED_BY
IMPLEMENTED_IN · VERIFIED_BY
```

## Status vocabulary

`PROPOSED` · `APPROVED` · `IMPLEMENTED` · `VERIFIED` · `REJECTED` ·
`SUPERSEDED` · `UNKNOWN` · `BLOCKED`

`IMPLEMENTED` and `VERIFIED` are distinct states. Only the visual-
regression gate promotes to `VERIFIED`, and only with all five evidence
kinds present (`contracts/VISUAL-REGRESSION-CONTRACT.md`).

---

## VD-001 — Uppsala Tigers imagery falls back to the crest, not the squad photo

| Field | Value |
|---|---|
| **Date** | 2026-08-26 |
| **Page / Section** | `/franchises`, homepage franchise teaser |
| **Element** | franchise image panel |
| **Viewport** | all |
| **Decision** | Use `/brand/crest-512.png`, never `nordic-smash-slide.webp` |
| **Rationale** | That graphic has "NIPO KHADEM / PORTUGAL" baked into the raster itself; `CLIENT_REQ_008` excludes that name from all published content. No text-content check can catch a name inside an image. No alternative Uppsala photo excluding him exists in evidence. |
| **Source** | Direct visual inspection of the page's own screenshot |
| **Evidence** | `EV-20260826-030`, `EV-20260826-031`, `EV-20260826-027` |
| **Status** | `IMPLEMENTED` |
| **Implemented in** | `apps/web/src/components/FranchiseTeaser.astro`, `apps/web/src/pages/franchises.astro` |
| **Verified by** | `pages.spec.ts` "excluded images are never referenced", `homepage.spec.ts` content-contamination test |

## VD-002 — Viewport matrix is seven viewports, and the code must say so

| Field | Value |
|---|---|
| **Date** | 2026-08-26 (decision) · 2026-08-31 (transcription gap closed) |
| **Page / Section** | all |
| **Element** | viewport matrix |
| **Viewport** | adds 1920×1080 |
| **Decision** | Canonical matrix = 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844 |
| **Rationale** | The reference container caps at 1340px, so centring and full-bleed behaviour above 1440 is unobservable without a 1920 row. |
| **Source** | `contracts/VISUAL-REGRESSION-CONTRACT.md` AMENDMENT 01, then AMENDMENT 02 |
| **Evidence** | `EV-20260826-032`, `EV-20260831-003` |
| **Status** | `IMPLEMENTED` |
| **Supersedes** | the original frozen 6-viewport matrix |
| **Implemented in** | `apps/web/tests/visual/viewports.ts` |
| **Verified by** | visual suites re-run across all seven viewports, 2026-08-31 |
| **Note** | `CODE_DRIFT`: the amendment landed 2026-08-26 but the transcription lagged five days, so every run in between exercised six viewports against a seven-viewport contract. Closed by fixing the code, never by narrowing the contract. |

## VD-003 — Focus rings are held to measured contrast, not mere presence

| Field | Value |
|---|---|
| **Date** | 2026-08-27 |
| **Page / Section** | site-wide, dark-background interactive elements |
| **Element** | `:focus-visible` outline |
| **Viewport** | all |
| **Decision** | Focus outline must measure ≥3:1 against its own painted background; gold-on-navy replaces the black default on dark panels |
| **Rationale** | 13 elements had a real, non-zero-width outline painted at 1.0–1.25:1 — a genuine WCAG 1.4.11 failure that both axe and the existing outline-*presence* test passed. Visual presence is not accessibility. |
| **Source** | Stage 8 homepage red team, finding F3 |
| **Evidence** | `artifacts/review/HOMEPAGE-REDTEAM.md` §F3, `artifacts/review/F3-FOCUS-CONTRAST-FIX.md` |
| **Status** | `IMPLEMENTED` |
| **Implemented in** | `apps/web/src/styles/`, `FranchiseTeaser.astro` (`--ukbt-color-focus-ring` override) |
| **Verified by** | `homepage.spec.ts` "visible AND contrast-safe focus outline" (computes the ratio, does not assert presence) |

## VD-004 — Dark rounded panels compose one `Surface` primitive

| Field | Value |
|---|---|
| **Date** | 2026-08-27 |
| **Page / Section** | site-wide |
| **Element** | dark rounded panel pattern |
| **Viewport** | all |
| **Decision** | Extract and compose a `Surface.astro` primitive instead of hand-rolling the pattern ~7 times |
| **Rationale** | Design-system drift: the same visual pattern re-implemented independently diverges silently. |
| **Source** | Stage 8 homepage red team, finding F6 |
| **Evidence** | `artifacts/review/HOMEPAGE-REDTEAM.md` §F6, `artifacts/review/F6-SURFACE-PRIMITIVE.md` |
| **Status** | `IMPLEMENTED` |
| **Implemented in** | `apps/web/src/components/Surface.astro` and call sites |
| **Verified by** | `homepage.spec.ts` "every Surface-wrapped panel still applies its component-specific descendant styling" — added because the migration silently broke a scoped selector and cost the gold focus colour |

## VD-005 — Mobile is audited at real mobile viewports, not by shrinking desktop

| Field | Value |
|---|---|
| **Date** | 2026-08-27 |
| **Page / Section** | all routes |
| **Element** | headings, touch targets, overflow, drawer |
| **Viewport** | 390×844 primary; 320×568 and 360×800 additionally |
| **Decision** | Maintain dedicated mobile suites outside the frozen matrix; raise nav-drawer toggle/close to 44×44; close 4 heading-order gaps |
| **Rationale** | Desktop-only axe scans stayed green through 4 real `heading-order` violations, and a real horizontal scroll on `/club-captain` existed only at 320/360px — below the frozen matrix's narrowest width. Widening the frozen matrix is a contract amendment, so narrow widths live in a separate suite instead. |
| **Source** | mobile axe sweep + touch-target sweep |
| **Evidence** | `artifacts/review/MOBILE-AXE-HEADING-ORDER.md`, `artifacts/review/MOBILE-TOUCH-TARGET-SWEEP.md`, `artifacts/review/MOBILE-VISUAL-QA.md` |
| **Status** | `IMPLEMENTED` |
| **Implemented in** | `apps/web/tests/visual/mobile-axe.spec.ts`, `mobile-ux.spec.ts`, header/drawer components |
| **Verified by** | those suites, executing per route |

## VD-006 — Our Franchises becomes a card grid with per-franchise pages

| Field | Value |
|---|---|
| **Date** | 2026-08-31 |
| **Page / Section** | `/franchises` |
| **Element** | page structure |
| **Viewport** | all |
| **Decision** | `/franchises` becomes a card-grid landing; Uppsala Tigers content moves to `/franchises/uppsala-tigers` |
| **Rationale** | Client instruction: Uppsala Tigers "should be under Our Franchise once you click, in future there will be more in the list." |
| **Source** | `Website_Corrections_1.pdf` + clarifying Q&A |
| **Evidence** | `EV-20260831-001`, `EV-20260831-002` |
| **Status** | `IMPLEMENTED` — open in PR #20, **not yet on `main`** |
| **Implemented in** | `apps/web/src/pages/franchises.astro`, `apps/web/src/pages/franchises/uppsala-tigers.astro`, `contracts/ROUTE-CONTRACT.md` AMENDMENT 02 |
| **Verified by** | `pages.spec.ts` (90 tests incl. the new route), `mobile-axe.spec.ts` (0 violations at 390×844) |
| **Blocked sub-item** | Uppsala Tigers **logo replacement** — client asked for a new logo but supplied no file. Status `BLOCKED`, tracked in `artifacts/content/CLIENT-ASK-LIST.md` §2a. No asset is fabricated to fill the slot. |

---

## Rejected / superseded register

Nothing has yet been formally recorded as `REJECTED` in a retrievable
artifact. This section stays empty rather than being populated from
recollection — an empty register is an honest one. Future rejections are
recorded here at the time of rejection, with the evidence that caused
them, so that a rejected pattern cannot quietly return later
(`knowledge/10` `VN-04`).

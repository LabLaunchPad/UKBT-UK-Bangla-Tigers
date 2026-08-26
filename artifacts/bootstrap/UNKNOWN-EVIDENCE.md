# Unknown Evidence Register

**Stage:** 1 · Every item is `UNKNOWN`. **None may be resolved by inference,
plausibility, or model memory.** Resolving one means obtaining a source and
writing an evidence record in `artifacts/evidence/`.

`UNKNOWN` is a valid, complete answer. Converting it to a guess is the failure
this entire scaffold exists to prevent.

---

## A. Organization facts — zero verified, all blocking content

| ID | Unknown | Blocks | Acceptable source |
|---|---|---|---|
| U-01 | What UK Bangla Tigers *is* — purpose, activities, audience, what the site is for | everything | UKBT directly (T1) |
| U-02 | Sport(s), format(s), and level of competition | content model, fixture/result types | UKBT (T1), governing body (T2) |
| U-03 | Founding date, founders, history, honours | about/history pages | UKBT documents + governing body; **two sources** |
| U-04 | Current roster, coaches, leadership, committee | players & leadership pages | UKBT (T1) — plus consent for named individuals |
| U-05 | Brand assets: logo, crest, colours, typefaces, usage rules | design system (Stage 5) | UKBT brand files (T1) |
| U-06 | Fixtures, results, statistics, standings; and their upstream feed | fixtures/results pages | league/governing body (T2) |
| U-07 | Sponsors, partners, funders and their permitted usage | sponsor page, logo display | UKBT + each sponsor's own approval |
| U-16 | Home ground / venue / addresses / contact details | contact page, `LocalBusiness` JSON-LD | UKBT (T1) |
| U-17 | Photography: what exists, who owns it, who is depicted, what consent exists | every page carrying imagery | UKBT + per-image licence and consent |

**Nothing in categories A may be drafted "for now" as plausible text.** Not in a
mockup, not in a screenshot, not in a test fixture that could be mistaken for
content. See `CONTENT-TRUTH-MODEL.md § 4`.

## B. Requirements — no client evidence

| ID | Unknown | Consequence if wrong |
|---|---|---|
| U-08 | Whether WCAG 2.2 AA is the agreed target | proposed as binding anyway; asymmetric failure cost |
| U-09 | Launch date, budget, content volume, page count | affects whether the proposed structure is over-built |
| ~~U-10~~ | ~~Who maintains this after handover~~ | **RESOLVED** — developers comfortable with JS/TS tooling · `EV-20260826-003` |
| U-12 | Whether a non-technical editor needs a CMS, and who they are | A18 stays "no CMS" until named |
| ~~U-13~~ | ~~Whether Bengali or bilingual content is required~~ | **RESOLVED** — English only · `EV-20260826-002` |
| ~~U-14~~ | ~~Whether any dynamic feature is needed~~ | **RESOLVED** — static at launch, forms escape hatch preserved · `EV-20260826-001` |
| U-15 | Existing web presence, domain, URL history to preserve | redirect requirements; SEO continuity |
| U-18 | Data-protection posture — UK GDPR obligations | **now on the critical path.** `EV-20260826-001` means a form is expected eventually, and any contact form collects personal data |

## B2. Raised by the Stage 2 architecture red team

| ID | Unknown | Arises from |
|---|---|---|
| U-22 | Who maintains the **source registry**, and what makes a source admissible to it? | revision R1/T2 |
| U-23 | **Who is the named human approver** for organization facts? `CONTENT-TRUTH-MODEL.md § 6` forbids an agent from signing but never says who does | revision R1/T6 |
| U-24 | Which of the two form routes will be used, and does the eventual host support it? | revision R6 |

## C. Technical

| ID | Unknown | Note |
|---|---|---|
| U-11 | Hosting vendor, domain, DNS control, CI/CD account access | **narrowed** by `EV-20260826-001`: the host must support serverless functions, or at minimum not preclude them |
| U-19 | CI runner and developer machine toolchains | container fingerprint is not evidence about either |
| U-20 | Whether an analytics/consent stack is required | affects performance budget and privacy policy |

## D-prime. Raised by the Stage 2A cross-framework verification (2026-08-26)

| ID | Unknown | Note |
|---|---|---|
| U-25 | Which acquisition channel (ThemeForest single-item, tier Regular/Extended; or Envato Elements subscription) applies to this copy | Two listings exist for the same product — item 60543035 (ThemeForest) and X3FTRWG (Elements) — with materially different licence models. Neither is confirmed |
| U-26 | Whether framework-reimplementation of Adelux's visual grammar (no copied markup/CSS/JS) counts as a derivative work under copyright law, vs. independent expression | `LEGAL_REVIEW_REQUIRED` — not resolved by marketplace FAQ language; `EV-20260826-006`, `ADELUX-CROSS-FRAMEWORK-VERIFICATION.md` Part 3 |
| U-27 | Upstream OFL confirmation for Lato/Montserrat, independent of Google's catalogue claim | Low priority — self-hosting under OFL is recommended regardless (Part 9) |

**Phase 2 forensic-analysis finding (2026-08-26, non-distributive, `EV-20260826-008`):**
12 of 13 Adelux pages carry the Adelux logo in shared chrome —
`brand_asset_rights = PROHIBITED_ABSOLUTE`, independent of how BL-02 resolves.
`index.html` uniquely depends on Isotope for what is likely a gallery/filter
section; per BL-05 (`DO_NOT_ADOPT_ISOTOPE`), its UKBT equivalent needs a native
CSS Grid/JS implementation. Four pages (`service`, `coaching`, `booking`,
`community`) are marked `UNKNOWN` rather than implementation candidates because
their content is padel-specific and U-01/U-02 (what UKBT is, what sport) remain
open — marking them candidates now would repeat the template-leak pattern
`INV-014` exists to prevent. See `artifacts/design/ADELUX-PAGE-INVENTORY.md`.

**Structural finding, not merely an unknown:** every acquisition path
researched (ThemeForest Regular, ThemeForest Extended, Envato Elements) caps at
**one end product per licence**. Reuse of this design as a basis for a second,
independent website is not something better paperwork resolves — it requires
purchasing an additional licence. Recorded as `OTHER_WEBSITE_REUSE_VERDICT =
NOT VERIFIED` and treated as the working assumption until a specific
multi-use/extended licence is shown to have been purchased.

## D. Third-party reference — **legal blocker**

| ID | Unknown | Status |
|---|---|---|
| U-21 | **Licence and entitlement for the "Adelux" reference template** | **BL-02 — OPEN.** Verified 2026-08-26: no licence document, purchase record, order ID or receipt exists in the package or repository. `LICENSE_VERDICT = STATED_BUT_UNVERIFIED` · `EV-20260826-005` |

Observed from the supplied archive, read-only, in a scratch directory:

- "Adelux — Padel Club & Community HTML Bootstrap Template", v1.0.0, October 2025.
- Author credited as *Fox Creation*; documentation links to a ThemeForest profile.
- The archive contains **no licence file** and **no purchase receipt or licence code**.
- Bundled third-party libraries: Bootstrap 5.3.x, jQuery 3.7.1, Font Awesome 5,
  Flatpickr, Swiper. Each carries its own licence, which must be recorded
  separately if any is used.
- Its credits name *Envato Elements* for stock images. The shipped images are
  `dummy-img-*` placeholders, so no stock photograph appears to be included —
  but Envato Elements assets are **not** freely redistributable, so any real
  photography must be sourced independently regardless.

**Decision taken at bootstrap:** the template has **not** been copied into this
repository. It stays outside as an evidence reference only. This is gap **G21**
and adversarial case **ADV-010** — *"the licence is probably fine because someone
said so"* is explicitly the wrong answer.

**To clear U-21, a human must supply:** the purchase record or licence
identifier; the licence type (single vs. extended — these differ materially in
what an end product may do); confirmation that the licence covers *this* client
and this deployment; and confirmation of whether derivative/adapted use is
permitted.

**Until then:** Stage 6 (reference analysis) does not run. Note that even once
cleared, the reference is **visual grammar only** — a padel-club template is not
UKBT's information architecture, and its section names (courts, coaching,
membership tiers, booking) are template facts, never UKBT facts.

---

## Open blockers

| ID | Blocker | Blocks |
|---|---|---|
| BL-01 | No verified UKBT organization fact of any kind | all content publication |
| BL-02 | Adelux licence unverified (U-21) | Stage 6 |
| BL-03 | No approved architecture | all application code (Stages 3–4) |
| BL-05 | Isotope v3.0.6 is GPLv3-or-paid-commercial (`EV-…-005`). No Adelux tier can convey it | adopting Isotope. **DECISION taken 2026-08-26: DO_NOT_ADOPT_ISOTOPE** (`ADELUX-CROSS-FRAMEWORK-VERIFICATION.md` Part 6) |
| BL-04 | Hosting/deployment target unknown (U-11) | deployment configuration |

`prompts/06-release-gate.md` cannot return `PASS` while any of these is open.

## Questions that blocked Stage 3 — status

Four unknowns were identified as architecture-deciding. Three are now resolved by
requester decision; one has a disposition but no evidence.

| # | Was | Now |
|---|---|---|
| U-14 | dynamic features? | **RESOLVED** — static at launch; forms escape hatch preserved (`EV-…-001`) |
| U-13 | Bengali/bilingual? | **RESOLVED** — English only (`EV-…-002`) |
| U-10 | who maintains it? | **RESOLVED** — JS/TS-comfortable developers (`EV-…-003`) |
| U-21 | template licence | **STILL OPEN** — requester will supply the record; the record does not yet exist (`EV-…-004`) |

**Stage 3 is no longer blocked on architecture-deciding unknowns.** It is still
gated on Stage 2 returning `ARCHITECTURE_VERDICT = PASS`.

**Stage 6 remains gated.** An undertaking to supply a licence record is not a
licence record (ADV-010). Stages 2–5 are unaffected — none of them depend on the
reference.

### Still open, not architecture-deciding

U-01…U-07, U-16, U-17 (all organization facts) · U-08 (a11y as a client
requirement) · U-09 (dates/budget/volume) · U-11 (hosting vendor) · U-12
(non-technical editor — distinct from U-10, which was about maintainers) ·
U-15 (existing web presence) · U-18 (data protection) · U-19 (CI/dev
toolchains) · U-20 (analytics/consent) · U-21 (licence).

**23 open. 4 resolved. 27 total.** (Stage 2 raised U-22, U-23, U-24; Stage 2A raised U-25, U-26, U-27.)

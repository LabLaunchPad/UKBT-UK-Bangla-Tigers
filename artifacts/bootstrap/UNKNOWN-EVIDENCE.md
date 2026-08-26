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
| U-10 | **Who maintains this after handover, and their stack familiarity** | the single largest input to framework choice (A01) |
| U-12 | Whether a non-technical editor needs a CMS, and who they are | A18 stays "no CMS" until named |
| U-13 | **Whether Bengali (or bilingual) content is required** | retrofitting i18n touches routing, layout, typography, every content file |
| U-14 | Whether any dynamic feature is needed — forms, login, ticketing, booking, live scores, payments | invalidates static-first (A05); expands the security boundary |
| U-15 | Existing web presence, domain, URL history to preserve | redirect requirements; SEO continuity |
| U-18 | Data-protection posture — any personal data collected, UK GDPR obligations | privacy policy, form handling, hosting region |

## C. Technical

| ID | Unknown | Note |
|---|---|---|
| U-11 | Hosting vendor, domain, DNS control, CI/CD account access | A16 specifies capability, not vendor, until resolved |
| U-19 | CI runner and developer machine toolchains | container fingerprint is not evidence about either |
| U-20 | Whether an analytics/consent stack is required | affects performance budget and privacy policy |

## D. Third-party reference — **legal blocker**

| ID | Unknown | Status |
|---|---|---|
| U-21 | **Licence and entitlement for the "Adelux" reference template** | **BL-02 — OPEN, BLOCKING** |

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
| BL-04 | Hosting/deployment target unknown (U-11) | deployment configuration |

`prompts/06-release-gate.md` cannot return `PASS` while any of these is open.

## Questions that block Stage 3

Most of the register can be resolved later, in parallel with foundation work.
**These four cannot** — they change the architecture itself, and getting them
wrong is expensive to reverse:

1. **U-14** — is anything dynamic required (forms, login, booking, payments,
   live scores)? Decides static-first.
2. **U-13** — is Bengali or bilingual content required? Decides i18n, and
   retrofitting it is expensive.
3. **U-10** — who maintains this after handover? Decides the framework more than
   any technical merit does.
4. **U-21** — the template licence. Decides whether Stage 6 exists at all.

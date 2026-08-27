# Adelux License Verification

**Task:** close BL-02 if, and only if, the actual evidence supports it.
**Date:** 2026-08-26 · **Application code changed:** none.

```
PACKAGE_ID:       Adelux — Padel Club & Community HTML Bootstrap Template v1.0.0
PACKAGE_SHA256:   cf4907bb60003b719f3d7712e2d06389c2ab7f8a02590bdea570da9780cafb54
LICENSOR:         Fox Creation (self-declared in package documentation)
PRODUCT:          Adelux v1.0.0, created October 2025
LICENSE_TYPE:     UNKNOWN — no licence document exists in the package or repository
LICENSE_HOLDER:   UNKNOWN — no purchaser is named in any available artifact
PURCHASE_EVIDENCE: NONE FOUND
PROJECT:          UK Bangla Tigers (UKBT)
INTENDED_USE:     adapt the design → build the UKBT website → commercial/client deployment
```

## A note on the premise of this task

The task brief refers to prior evidence **`EV-0009`** and to an admission status
of `ADMITTED_WITH_RESTRICTIONS`.

**Neither exists in this repository.** A full search returns no `EV-0009` and no
record of a prior admission:

```
grep -rn 'EV-0009' .        → no match
ls artifacts/evidence/      → EV-20260826-001 … -004 only
```

`EV-20260826-004` records the current state: the licence claim is `UNKNOWN` and
BL-02 is OPEN. The template has never been admitted here — it was **excluded**
from the repository pending licence evidence.

This is reported rather than reconciled. If `EV-0009` exists in another system, it
must be supplied to be usable; per the knowledge contract, *repository evidence*
outranks a reference to evidence held elsewhere, and a citation is not its
referent. **No conclusion in this document rests on `EV-0009`.**

## Evidence Ledger

| # | Claim | Evidence | Status |
|---|---|---|---|
| 1 | The package is Adelux v1.0.0 by Fox Creation | `Documentation/index.html` header block | `OBSERVED` (self-declared) |
| 2 | The exact bytes reviewed | SHA-256 `cf4907bb…fb54` | `MEASURED` |
| 3 | No licence file exists in the package | archive listing; filename + full-text search | **`FACT`** |
| 4 | No purchase code, order ID, invoice or receipt exists | archive + repository full-text search | **`FACT`** |
| 5 | The package asserts `All rights reserved` | `Documentation/index.html:182` | **`FACT`** |
| 6 | LabLaunchPad is the licensed/authorized builder | requester statement, this session | **`STATED_BUT_UNVERIFIED`** |
| 7 | The licence record will be supplied | requester statement (`EV-20260826-004`) | **not evidence** — an undertaking is not its object |
| 8 | Isotope v3.0.6 is GPLv3-or-commercial | verbatim header in `isotope.pkgd.min.js` | **`FACT`** |
| 9 | animate.css 4.1.1 is Hippocratic License 2.1 | verbatim header in `animate.min.css` | **`FACT`** |
| 10 | Font Awesome Free 6.7.2 requires attribution (CC BY 4.0 icons) | verbatim header in `fontawesome.css` | **`FACT`** |
| 11 | Bootstrap / jQuery / Swiper / Flatpickr are MIT | verbatim headers | **`FACT`** |
| 12 | fsLightbox and Odometer licences | no header, no licence file | `UNKNOWN` |
| 13 | Lato/Montserrat are loaded from `fonts.gstatic.com` | `@font-face` rules in the shipped CSS | **`FACT`** |
| 14 | Documentation claims FA 5x; package ships FA 6.7.2 | both files | **`CONFLICTING`** (internal to the package) |

## Rights Matrix

| Material | Intended use | Permission | Evidence | Status |
|---|---|---|---|---|
| **Adelux template source** | inspect, adapt | not established | none | **`STATED_BUT_UNVERIFIED`** |
| **Adapted UKBT implementation** | build & deploy commercially | not established | none | **`STATED_BUT_UNVERIFIED`** |
| **Redistribution of original template** | not intended | — | marketplace templates ordinarily prohibit this; unverified here | `UNKNOWN` (moot — not intended) |
| **Adelux logo assets** | none | **author's own branding; never UKBT's** | `Adelux-Logo.png` etc. | **`NOT PERMITTED`** |
| Bootstrap, jQuery, Swiper, Flatpickr | bundle & deploy | **permitted** | MIT headers | **`VERIFIED`** |
| **Font Awesome Free 6.7.2** | icons | permitted **with attribution** | CC BY 4.0 / OFL / MIT header | **`VERIFIED — obligation attaches`** |
| **animate.css 4.1.1** | animations | Hippocratic 2.1 — not OSI-approved; ethical-use conditions | verbatim header | **`REQUIRES DECISION`** |
| **Isotope v3.0.6** | layout | GPLv3 **or** paid commercial licence | verbatim header | **`BLOCKED`** — see F-A1 |
| fsLightbox, Odometer | lightbox, counters | not established | no licence shipped | `UNKNOWN` |
| Lato, Montserrat | typography | licence unstated; served from Google CDN | `@font-face` URLs | `UNKNOWN` + GDPR issue |
| Stock imagery | none shipped beyond placeholders | — | credits claim Envato Elements | `UNKNOWN` (moot for now) |

## Adversarial Findings

Every attempt to disprove clearance. The proposed clearance did **not** survive.

**F-A1 — Isotope is a separate, evidenced blocker, independent of Adelux.**
The shipped file states: *"Licensed GPLv3 for open source use **or** Isotope
Commercial License for commercial use."* A UKBT client website is commercial use.
Two options only: obtain a Metafizzy commercial licence, or accept GPLv3 and its
obligations. **An Adelux licence of any tier cannot convey Metafizzy's commercial
licence** — Fox Creation cannot sublicense rights it does not hold. This blocker
would survive even a fully verified Adelux Extended Licence. *Mitigation: A10
already forbids third-party UI libraries, so Isotope need never be adopted — but
that must be a recorded decision, not an accident.*

**F-A2 — animate.css is not permissively licensed.** Hippocratic License 2.1 is
not OSI-approved and imposes ethical-use conditions. Many organisations decline
it on policy grounds. Adopting it is a decision requiring sign-off, not a default.

**F-A3 — Font Awesome carries a live obligation.** CC BY 4.0 icons require
attribution. Shipping the icons without it is a licence breach even though the
licence is free.

**F-A4 — The purchaser is unidentified.** No artifact names who acquired Adelux.
"LabLaunchPad is the authorized builder" is a statement about *role*, not about
*acquisition*. A builder engaged by a client may hold no licence at all; the
client may; or nobody may. The evidence does not distinguish these.

**F-A5 — Builder authority does not imply asset ownership** (DR-004). Even if
LabLaunchPad's authority to build UKBT were verified, it would say nothing about
Adelux rights, font rights, image rights, or Metafizzy's licence.

**F-A6 — The licence *tier* is unknown, and tiers differ materially.** Marketplace
templates commonly distinguish a single-end-product licence from an extended one,
with different rules for client work and for end products that charge users.
Without the document, the applicable rules cannot be identified — and guessing
the common case is exactly the prohibited inference.

**F-A7 — The documentation is demonstrably unreliable.** It claims Font Awesome
5x while shipping 6.7.2. Its credits section is the only source for the Envato
Elements imagery claim. A document wrong about its own contents is weak evidence
for anything else it asserts.

**F-A8 — `All rights reserved` is the only rights statement present, and it points
away from clearance**, not toward it.

**F-A9 — A stated intention to supply evidence is not evidence** (DR-005,
`EV-20260826-004`). Closing BL-02 on that basis is precisely case ADV-010.

**F-A10 — GDPR leak via fonts.** The template's font CSS makes requests to
`fonts.gstatic.com`, disclosing visitor IPs to a third party. Not a licence defect,
but it must not survive into the UKBT implementation unexamined (U-18).

**Counter-argument considered and rejected.** *"The requester is the authorized
builder and says it is licensed; that is an authoritative party speaking."* It is
an authorised party — which is why item 6 is `STATED_BUT_UNVERIFIED` rather than
`UNKNOWN`. But the evidence policy is explicit that this class "may inform
planning; cannot be treated as verified fact", and the rights at stake belong to
third parties (Fox Creation, Metafizzy, Fonticons) who are not party to that
statement and cannot be bound by it.

## Final Verdict

```
LICENSE_VERDICT: STATED_BUT_UNVERIFIED
BL-02:           OPEN
```

**REASON.** No licence document, purchase record, order identifier, or receipt
exists in the package or the repository. The only rights statement in the package
asserts that rights are **reserved**. The requester's statement that LabLaunchPad
is the authorised builder is recorded and believed as a statement, and it raises
the claim above `UNKNOWN` — but it does not identify the licence, its tier, its
holder, or whether it permits adaptation and commercial deployment for this
client. Verification requires the document, not the assertion.

A second, **independent** blocker was discovered that no Adelux licence can clear:
Isotope v3.0.6 requires either GPLv3 compliance or a paid Metafizzy licence.

### Exactly what is missing

| # | Required artifact | Closes |
|---|---|---|
| 1 | The purchase record / licence certificate — order number, item ID, purchase date | F-A4, F-A6 |
| 2 | The **licence tier** (single end product vs. extended), as written | F-A6 |
| 3 | The named **licence holder**, and if not UKBT, the basis for use on UKBT's behalf | F-A4, F-A5 |
| 4 | The licence text's terms on **adaptation** and **client-work deployment** | core question |
| 5 | A decision on **Isotope** — commercial licence, GPLv3 acceptance, or (recommended) do not adopt | F-A1 |
| 6 | A decision on **animate.css** Hippocratic 2.1 | F-A2 |
| 7 | Attribution plan for **Font Awesome** if adopted | F-A3 |
| 8 | Licence evidence for **fsLightbox**, **Odometer**, **Lato**, **Montserrat** if adopted | item 12 |

Items 5–8 are cheaply closed by *not adopting those components* — which A10
already proposes. Items 1–4 need the document.

### What this unblocks anyway

BL-02 blocks Stage 6 and any Adelux-derived material. **It does not block Stages
3, 4, or 5.** The design system is built from first principles before the
reference is opened, so the pipeline ordering keeps that work clean.

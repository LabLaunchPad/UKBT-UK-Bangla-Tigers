# Component Candidates — Cross-Page Occurrence Evidence

**Date:** 2026-08-26 · State: `FORENSIC_ANALYSIS`/`DESIGN_EXTRACTION` (Track A).
**Not promoted to UKBT component contracts** — that step (naming, props,
UKBT-specific structure) is `UKBT_ADAPTATION` (Track B, rights-gated). This
document stays at candidate-level: what recurs, where, and how consistently.

Current candidate count remains **4**, per the requester's explicit
instruction not to artificially inflate it. Each is deepened with real
cross-page occurrence data this pass, which was the missing evidence for
distinguishing genuine reuse from coincidence.

| Candidate | Occurrences | Pages | Variant evidence | Reuse classification |
|---|---|---|---|---|
| `.btn-accent` | 56 | **13/13** (all pages) | Consistent base styling everywhere; `bg-accent-color` modifier observed on at least one `.card-chooseus` instance (§ below) | **`EXACT_REUSE`** — the strongest-evidenced candidate on the site |
| `.nav-link` | 72 | 12/13 (all but `404-page`, which has no nav) | Runtime `.active` class on the current page's link (`EV-20260826-009`) | **`EXACT_REUSE`** (shared chrome) |
| `.card-blog` | 19 | 4/13 (`blog`, `single-post`, and 2 others referencing article listings) | Not yet isolated from `.card` base | **`VARIANT`** of a shared `.card` base — occurs on a task-specific subset of pages, not universally |
| `.card-chooseus` | 8 | **2/13** only | One instance carries a `bg-accent-color` modifier (observed on the homepage: `card card-chooseus bg-accent-color animate-box…`) | **Leaning `PAGE_SPECIFIC`**, not broad reuse — occurrence is narrow enough that treating it as a general-purpose UKBT component would be over-abstraction ahead of evidence. Flagged for re-examination if a 3rd page turns up in deeper extraction. |

## The generic `.card` base

`grep` finds 112 raw occurrences of a `card` class token across 12/13 pages
— far more than any specific card variant. This confirms a shared `.card`
base exists (consistent with the earlier CSS AST finding of shared
Bootstrap-style primitives) with page/section-specific modifier classes
layered on top (`card-chooseus`, `card-blog`, `card-banner-reviewer`,
`card-booking-cta`, `card-membership-cta`, and others named in
`ADELUX-PAGE-INVENTORY.md`). **Not treated as a 5th candidate this pass** —
it is the base the other candidates specialize, not a separate component in
its own right; recorded here so the relationship is visible rather than
implied.

## Why the count stays at 4

Per the requester's explicit instruction: only promote a candidate when
occurrence evidence supports the abstraction. `.card-chooseus`'s 2-page
occurrence is exactly the case where inflating the count would be
premature — it is documented, tracked, and deliberately not promoted to a
5th confident candidate.

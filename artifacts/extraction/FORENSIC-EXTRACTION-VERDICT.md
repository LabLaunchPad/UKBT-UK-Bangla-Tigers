# Forensic Extraction Verdict

**Date:** 2026-08-26 · Closes the Track A / forensic-extraction phase for
this pass. No governance redesign performed this turn, per explicit
instruction — the model frozen at `EV-20260826-014` stands unchanged.

---

## Page-count discrepancy — RESOLVED

```
SOURCE_HTML_FILE_COUNT   = 14
RENDERABLE_PAGE_COUNT    = 13
NON_RENDERABLE_HTML_COUNT = 0
DUPLICATE_PAGE_COUNT     = 0
REDIRECT_ALIAS_COUNT     = 0
EXCLUDED_PAGE_COUNT      = 1
EXCLUSION_REASON         = "Documentation/index.html is the vendor's own
                            template-documentation page (title: 'Adelux -
                            HTML Bootstrap Template Documentation'), not a
                            site page. No UKBT route corresponds to it."
```

Both "13" and "14" were correct, for two different, previously
un-reconciled scopes. Neither was changed to match the other — both are
frozen with their exact scope in `artifacts/source/PAGE-INVENTORY.yaml`
(14 entries, every source HTML file appearing exactly once, including the
excluded one with its reason recorded).

---

## Verdicts

```
PAGE_INVENTORY_VERDICT       = FROZEN — 14/14 files accounted for, 0 unexplained
CSS_FORENSICS_VERDICT        = COMPLETE for the two authored stylesheets
                                (748 rules, 4 media queries, 2 keyframe
                                blocks); component-token cross-reference
                                graph built for all 4 candidates
DOM_VERDICT                  = COMPLETE at structural level (all 13 pages);
                                deep per-element DOM capture remains
                                homepage-only (named gap, not silently closed)
COMPUTED_STYLE_VERDICT       = COMPLETE for shared chrome across all 13
                                pages at 2 viewports; FULL depth (40-property,
                                whole-DOM) remains homepage-only
RESPONSIVE_VERDICT           = COMPLETE — full 6-viewport matrix run across
                                all 13 pages this pass; nav-toggle breakpoint
                                behaviorally confirmed against the CSS AST's
                                stated breakpoint; overflow findings recorded
                                on 4/13 pages as observed source behavior
INTERACTION_VERDICT          = COMPLETE for what could be deterministically
                                exercised (mobile nav ×12 pages, hover, focus,
                                Swiper init); Swiper drag-to-advance recorded
                                honestly as ATTEMPTED-INCONCLUSIVE, not
                                claimed either way
TOKEN_EXTRACTION_VERDICT     = RAW=61, CANDIDATE=20, ADAPTED=0, APPROVED=0.
                                ADAPTED/APPROVED intentionally NOT performed
                                this pass — that is Track B (UKBT_ADAPTATION),
                                rights-gated. The example naming convention
                                in the requesting instruction (e.g.
                                --accent-color-2 -> ukbt.color.action.accent)
                                is illustrative of the CONVENTION only; no
                                real token was given that name or any other
                                UKBT semantic identity this pass.
COMPONENT_DISCOVERY_VERDICT  = 4 candidates, unchanged count, each now
                                backed by cross-page occurrence data (56/72/
                                19/8 occurrences respectively) and a CSS
                                rule-count/token-reference cross-check.
                                .card-chooseus intentionally NOT promoted
                                further — 2-page occurrence is thin evidence
THIRD_PARTY_INVENTORY_VERDICT = COMPLETE — every dependency disposed with
                                USED_BY_SOURCE / REQUIRED_BY_UKBT /
                                LICENSE_STATUS / disposition /
                                ATTRIBUTION_REQUIRED. New this pass:
                                fsLightbox and Odometer confirmed invoked by
                                ZERO pages (checked all 13) - simplifies
                                their disposition to REMOVE regardless of
                                licence status
```

---

## Genuine remaining UNKNOWNs only

Per instruction: no unknown is listed here merely because more theoretical
evidence could exist. Each entry names what specifically remains
undetermined and why it matters.

| # | Unknown | Why it's genuine (not manufactured) |
|---|---|---|
| 1 | Full 40-property/whole-DOM computed-style depth on 12 of 13 pages | Only the homepage received this depth; the other 12 got 4 shared-chrome elements. A real, bounded gap for full pixel-fidelity work on non-homepage pages, deferred to per-page Stage 7+ work as originally scoped |
| 2 | Exact script/mechanism adding `.nav-link.active` at runtime | Checked all local JS files by keyword search; none showed the obvious pattern. Needed to reproduce current-page nav highlighting exactly |
| 3 | Swiper drag-to-advance interaction | Attempted with mouse-event simulation; did not cross the internal gesture threshold. Needs native touch-event simulation, not yet tried |
| 4 | True Lato/Montserrat glyph metrics | `fonts.gstatic.com` unreachable under this project's own network policy (not an external blocker — a deliberate project security boundary) |
| 5 | Cause of horizontal overflow on 4 pages (`service`, `coaching`, `community`, `event`) | Observed, not diagnosed to a specific CSS rule this pass — would need per-page cascade tracing similar to the homepage's button/nav-link work |
| 6 | `BL-02` / `provenance_chain.B` — LabLaunchPad's builder authority | Unchanged from `EV-20260826-014`. Genuinely requires primary evidence from outside this repository — not something forensic extraction can resolve |

**Track status, unchanged in kind, updated in completeness:**

```
TRACK_A_STATUS = SUBSTANTIALLY COMPLETE — sufficient to begin implementation
                 the moment Track B unlocks. Six named, bounded gaps remain
                 (above), none of which block starting Track C work.
TRACK_B_STATUS = RIGHTS_GATED — unchanged. Not claimed cleared.
TRACK_C_STATUS = MAY_PROCEED once BL-03 (architecture) is addressed —
                 unaffected by anything in this pass.
```

No application code changed. No Adelux asset, markup, or screenshot
entered this repository. No CSS was rewritten, normalized, or optimized —
visual parity work has not started, correctly, since Track B remains gated.

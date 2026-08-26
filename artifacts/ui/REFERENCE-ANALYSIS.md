# Reference Analysis — Stage 6

**Date:** 2026-08-26 · **Gate:** `prompts/16-reference-analysis.md`, licence
verified (`EV-20260826-024`/`-025`, Track B `UNLOCKED` — see
`artifacts/evidence/TRACK-B-UNLOCK-CHECKLIST.md`). **Scope note per the
prompt:** this document covers `PROPOSED_UKBT_ADAPTATION` recommendations
only (pipeline stages 3-4). It reuses, not repeats, the frozen stage 1-2
forensic evidence (`artifacts/extraction/TRACK-A-FREEZE-INDEX.md`).

**The reference is treated as VISUAL EVIDENCE, not application
architecture.** No content, no organization-specific fact, no dependency,
and no code is copied from Adelux anywhere in this document or its
proposals. `reference → visual grammar`, never `reference → cloned site`.
Nothing here is implemented — Stage 6 produces recommendations only, per
the prompt's explicit "Do not implement yet."

---

## 1. Layout grammar

**OBSERVED_FROM_REFERENCE:** Every page is composed of a flat sequence of
sibling blocks alternating two wrapper classes — `section-wrapper` and
`section` — with vertical-padding overrides (`py-0`, `pb-0`, `pt-0`)
applied to specific instances (`ADELUX-PAGE-INVENTORY.md` `SECTION_ORDER`,
e.g. index: `section-wrapper pb-0`, `section p-0`, `section`,
`section-wrapper py-0`, `section section-chooseus`, …). Section counts
per page range from 2 (`404-page`) to 16 (`index`). A generic `.card`
class occurs 112 times across 12/13 pages, with page/section-specific
modifier classes layered on top rather than one-off bespoke markup per
section (`COMPONENT-CANDIDATES.md`).

**DERIVED_DESIGN_RULE:** The page is built from a small set of reusable
section/block primitives, each independently toggling its own top/bottom
padding, rather than every section carrying bespoke spacing. Padding
removal (`py-0` etc.) is used deliberately where two sections should read
as visually adjacent (e.g. a hero immediately followed by a stat strip).

**PROPOSED_UKBT_ADAPTATION:** Build one UKBT `Section` layout primitive
(original implementation, not ported code) taking independent
top/bottom padding props, and compose pages from it plus the existing
`Card`/`Button` primitives — the same compositional grammar, expressed in
UKBT's own component API and token system, not Adelux's classes.

**UNKNOWN:** Full per-element computed-style depth exists only for the
homepage and shared chrome (`TRACK-A-FREEZE-INDEX.md` item 5); the exact
padding values for every section on the other 12 pages are not yet
extracted. This is a named, bounded gap, not a blocker — it is exactly
the kind of detail that surfaces naturally during page-by-page
implementation (Stage 9), not something to bulk-extract speculatively now.

## 2. Typography hierarchy

**OBSERVED_FROM_REFERENCE:** Two font families are declared:
`--font-family-1: "Montserrat", sans-serif` (headings) and
`--font-family-2: "Lato", sans-serif` (body) — `token-candidates.json`.
On the homepage hero, heading font-size steps `90px → 70px → 50px` across
exactly the viewport bands `{1440,1280} → {1024,768} → {430,390}`
(`RESPONSIVE-MATRIX.yaml`, `index.font_changes`), i.e. two size changes,
not a continuous scale, aligned to the same breakpoints as the nav-toggle
transition.

**DERIVED_DESIGN_RULE:** Typography scales in discrete steps tied to the
same breakpoint set as structural/navigation changes, not via fluid
`clamp()` or a larger number of finer steps. A two-typeface split
(display/heading vs. body) is used, not a single family for everything.

**PROPOSED_UKBT_ADAPTATION:** Keep UKBT's own step-based type scale
(`packages/truth/src/tokens/approved/typography.json`, already
`DERIVED`, already breakpoint-agnostic) — the *step-based-not-fluid*
rule is a legitimate grammar takeaway; the specific Montserrat/Lato
pairing and the 90/70/50px values are Adelux's own authored choices.
Adopting them literally is now rights-permitted (Track B unlocked,
scoped to this End Product) but remains a **design decision, not a
requirement** — UKBT's typography stays `PROPOSED` until real brand
evidence or an explicit decision says otherwise (`knowledge/01`, `U-05`).

**UNKNOWN:** Type scale values for body copy, subheadings, and captions
on the other 12 pages are not separately extracted (same named gap as §1).

## 3. Component composition

**OBSERVED_FROM_REFERENCE:** `COMPONENT-CANDIDATES.md`'s cross-page
occurrence evidence: `.btn-accent` appears on **13/13 pages, 56
occurrences** (`EXACT_REUSE` — the strongest-evidenced pattern site-wide);
`.nav-link` on 12/13, 72 occurrences (shared chrome); `.card-blog` on
4/13, 19 occurrences (`VARIANT` of the shared `.card` base, task-specific);
`.card-chooseus` on only 2/13, 8 occurrences (`PAGE_SPECIFIC`, explicitly
*not* promoted to a general pattern by the forensic work itself, to avoid
over-abstracting from thin evidence).

**DERIVED_DESIGN_RULE:** One primary CTA-button pattern is used
everywhere (not several competing button styles); cards are a shared base
with narrow, occurrence-justified specializations, not one bespoke card
type per section.

**PROPOSED_UKBT_ADAPTATION:** UKBT already has this grammar independently
(`Button.astro` — primary/secondary/danger; `Card.astro` — static/linked,
Stage 5). No new component is warranted by this evidence alone. If a
future UKBT page genuinely needs a "chooseus"-shaped variant, evidence
should justify it the same way — occurrence across real UKBT content, not
because Adelux has one on two pages.

**UNKNOWN:** Nothing further — this item is well-evidenced.

## 4. Navigation behavior

**OBSERVED_FROM_REFERENCE:** Live-tested (not just markup-inferred): the
mobile nav toggle (`[data-bs-toggle="collapse"]`) transitions
`#navbarNav` from `display:none/collapse` to `display:block/collapse
show`, uniformly across all 12 applicable pages (`404-page` has no nav)
— `INTERACTION-FORENSICS.md`. The breakpoint is confirmed behaviorally,
not just from CSS text, at exactly `1280×800 → 1024×768`
(`RESPONSIVE-MATRIX.yaml`, every page's `toggle_breakpoint_transition`).
`.nav-link` gets a runtime-only `.active` class on the current page,
added by client script whose exact source was not pinpointed
(`GAP-01`).

**DERIVED_DESIGN_RULE:** A single collapse breakpoint governs the entire
site's nav (not a per-page or per-section breakpoint); the active-link
indicator is applied client-side rather than server-rendered per page.

**PROPOSED_UKBT_ADAPTATION:** Build a UKBT nav with one site-wide
collapse breakpoint (value to be chosen against UKBT's own content
width needs, not necessarily 1024px) and mark the active link using
Astro's own routing (`Astro.url.pathname` at build/render time) rather
than a client-side script — this is a strictly better mechanism available
natively in UKBT's stack, not a regression from the pattern observed.

**UNKNOWN:** The exact client script that assigns `.active` was never
located (`GAP-01`) — moot for UKBT regardless, since the proposed
adaptation doesn't need it.

## 5. Hero composition (homepage)

**OBSERVED_FROM_REFERENCE:** On `index`, alongside the heading/font
scaling in §2, the hero image scales `214px → 255px → 139px` in width
with `object-fit: fill` at each breakpoint band, and the hero CTA button
is a fixed `200px` width with `5px` padding at desktop widths, becoming
fluid (`width: null`, i.e. intrinsic/auto) below 1024px, while padding
stays constant at `5px` across every tested viewport
(`RESPONSIVE-MATRIX.yaml`, `index.image_changes`/`button_changes`).

**DERIVED_DESIGN_RULE:** Fixed-width controls (buttons) are deliberately
allowed to go fluid on small viewports rather than shrinking
proportionally or overflowing; imagery is resized (not just
cropped/repositioned) at each breakpoint band, and `object-fit: fill`
(not `cover`) is used, meaning the source images are pre-cropped to the
target aspect ratio rather than relying on CSS cropping.

**PROPOSED_UKBT_ADAPTATION:** For UKBT's own homepage hero: use
intrinsic/fluid width for CTA buttons below the nav-collapse breakpoint
(the rule, not the literal 200px/1024px values), and prefer `object-fit:
cover` over `fill` for any UKBT-sourced photography whose aspect ratio
isn't pre-cropped to match — `fill` risks distortion and is only safe
here because Adelux's placeholder assets were prepared for it.

**UNKNOWN:** Whether Adelux's images were actually pre-cropped by design
or coincidentally match — not verifiable from computed styles alone, and
not decided here.

## 6. Section transitions & spacing rhythm

**OBSERVED_FROM_REFERENCE:** Adjacent-section "welding" via `py-0`/
`pb-0`/`pt-0` modifiers (§1) is applied selectively, not uniformly —
e.g. index's hero (`section-wrapper pb-0`) welds directly into the next
block (`section p-0`), while later sections revert to full padding.

**DERIVED_DESIGN_RULE:** Spacing rhythm is a per-adjacency editorial
decision (hero-to-stats reads as one visual unit; most other sections
don't), not a single global vertical-rhythm constant.

**PROPOSED_UKBT_ADAPTATION:** Give the proposed `Section` primitive (§1)
independent, explicit top/bottom padding props for exactly this reason —
UKBT's own page authors should make the same kind of adjacency decision
per page, using UKBT's own spacing scale (`packages/truth/src/tokens/
approved/spacing.json`, already `DERIVED`), not a hard-coded rhythm.

**UNKNOWN:** Nothing further — the rule generalizes cleanly regardless of
exact per-page padding values.

## 7. Imagery

**OBSERVED_FROM_REFERENCE:** The homepage references 14 named assets, 5
of them explicit `dummy-img-*` placeholders (`ADELUX-PAGE-INVENTORY.md`).
`object-fit: fill` is used at every tested breakpoint (§5).

**DERIVED_DESIGN_RULE:** The template ships with placeholder imagery by
design, expecting the implementer to substitute real photography —
standard practice for a commercial template, not evidence of a specific
UKBT-relevant imagery style.

**PROPOSED_UKBT_ADAPTATION:** UKBT supplies its own photography/imagery
(club/team content, once it exists — `knowledge/01`, still `UNKNOWN` for
now). Adelux's placeholder images themselves are not proposed for reuse:
they are stock/dummy content with their own independent rights status,
already tracked separately (`third_party_assets`, `knowledge/01`) and
outside the scope of what this license's End Product needs.

**UNKNOWN:** Nothing further.

## 8. Interaction states

**OBSERVED_FROM_REFERENCE (live-verified, not inferred):**
- `.btn-accent` hover: real color transition `rgb(198,239,46) →
  rgb(234,255,157)` (`--accent-color-2 → --accent-color-6`), confirmed
  after waiting out the declared ≥600ms transition.
- Swiper carousels: `swiper-initialized` present, live object exists,
  `slides.length` matches source config exactly (5 on index's booking
  swiper, 7 on about's partner swiper), `autoplay.running: true`.
- **`.btn-accent` focus state — a real accessibility defect, not a
  pattern to reproduce:** `outline` stays `none` in both default and
  focused states; only the (invisible, `0px`) outline's *color* value
  changes. **No perceptible visible focus indicator exists on this
  control in the reference.**

**DERIVED_DESIGN_RULE:** Hover feedback is implemented via CSS custom
property swap on a fixed transition duration; carousels are
config-driven and initialize/autoplay reliably. Separately: the
reference's own focus-visibility is a defect, not a design choice worth
preserving.

**PROPOSED_UKBT_ADAPTATION:** Reuse the *mechanism* (transition + custom
property swap) for `Button.astro`'s hover state, already implemented
this way since Stage 5. **Explicitly do NOT reproduce the invisible
focus outline** — `contracts/ACCESSIBILITY-CONTRACT.md` already requires
a real visible `:focus-visible` indicator, which `Button.astro` and
`Card.astro` already have (verified via real computed-style axe/Playwright
checks, Stage 5). This is the one place where `VISUAL_FIDELITY ≠
BLIND_REPRODUCTION_OF_ACCESSIBILITY_DEFECTS` matters concretely, and the
decision (repair, not preserve) is made explicitly here rather than by
silent inheritance.

**UNKNOWN:** Swiper drag-to-advance was tested and found
`INCONCLUSIVE` (simulated mouse events didn't cross the internal gesture
threshold; native touch events weren't attempted). Flatpickr's live
open/select behavior was never exercised. Neither blocks anything here —
investigate only if a specific future UKBT booking-page decision
actually depends on the exact gesture behavior.

## 9. Responsive behavior — including defects not to reproduce

**OBSERVED_FROM_REFERENCE:** Full 6-viewport matrix, all 13 pages
(`RESPONSIVE-MATRIX.yaml`). **Horizontal overflow observed in the source
itself** on 4/13 pages: `service` and `coaching` overflow even at desktop
widths (1440×900, 1280×800, and for `service` also 1024×768/768×1024/
430×932); `community` and `event` overflow at tablet/mobile widths only
(768×1024, 430×932, 390×844).

**DERIVED_DESIGN_RULE:** None — this is a source defect, not a design
rule. Explicitly recorded as `OBSERVED_IN_SOURCE`, not corrected in the
read-only reference.

**PROPOSED_UKBT_ADAPTATION:** Do **not** reproduce these overflows.
UKBT's own Playwright suite already asserts zero horizontal overflow at
all 6 frozen viewports on every implemented route
(`apps/web/tests/visual/responsive.spec.ts`) — this is already a
stronger, enforced guarantee than the reference provides, and stays that
way as new pages are built.

**UNKNOWN:** Whether these overflows were intentional (e.g. a
deliberately wide element) or a genuine authoring bug in the source is
not determinable from computed styles, and doesn't matter — either way,
UKBT does not inherit it.

## 10. Visual hierarchy / accessibility implications

**OBSERVED_FROM_REFERENCE:** Section headings use the two-step
Montserrat scale (§2); the one live-tested interactive-accessibility
finding is the `.btn-accent` focus defect (§8).

**DERIVED_DESIGN_RULE:** Visual hierarchy is carried primarily by
typography scale + spacing rhythm (§§2, 6), not by color alone (the
neutral/accent palette is used sparingly per `token-candidates.json`).

**PROPOSED_UKBT_ADAPTATION:** Consistent with UKBT's existing Stage 5
design system, which already carries hierarchy via the same two
mechanisms (type scale, spacing scale) and already passes real axe-core
checks with zero violations. No change proposed here beyond what Stage 5
already established.

**UNKNOWN:** Nothing further.

---

## Reusable as UKBT components vs. NOT to copy — and why

### Adapt (grammar/pattern only, already or about to be built independently)

| Pattern | Why it's safe and worth adapting |
|---|---|
| Section-primitive with independent top/bottom padding (§1, §6) | A structural composition rule, not Adelux's authored expression — generic to many sites; UKBT builds its own `Section` component, not Adelux's markup |
| One universal primary-CTA pattern, not several competing button styles (§3) | Already built (`Button.astro`); evidence (56 occurrences, 13/13 pages) confirms this is the right level of abstraction, not over- or under-abstracted |
| Shared card base + occurrence-justified variants (§3) | Already built (`Card.astro`); the *discipline* of not promoting a variant until evidence supports it (`.card-chooseus`, 2/13 pages, deliberately not promoted) is itself worth carrying into UKBT's own component decisions |
| Single site-wide nav-collapse breakpoint, active-link via routing not client script (§4) | Improves on the mechanism observed; not yet built (no Nav component exists yet — future work) |
| Fluid/intrinsic-width controls below the collapse breakpoint; `object-fit: cover` preference (§5) | A responsive-behavior rule, not a copied value |
| Hover-state transition mechanism (custom-property swap, fixed duration) (§8) | Already built into `Button.astro`; the *rule* is real, the literal accent hex values remain a separate, undecided choice (below) |

### Available (rights-permitted post-unlock) but NOT decided here — a design choice, not a requirement

- Adopting Adelux's literal typeface pairing (Montserrat/Lato) or its
  specific accent-color values (`--accent-color-2` etc.) into UKBT's
  `PROPOSED` typography/color tokens. Track B unlocking makes this
  legally available for this End Product; it does not make it correct —
  UKBT's tokens stay `PROPOSED` pending either an explicit decision or
  real brand evidence (`U-05`), consistent with Stage 5's original
  reasoning, unaffected by the rights unlock.

### Do NOT copy, regardless of Track B's status

| Item | Why |
|---|---|
| Adelux's own logo/wordmark image files | `PROHIBITED_ABSOLUTE` — Fox Creation's own brand assets, never licensed by any template tier (`THIRD-PARTY-LICENSE-FIREWALL.md`), unaffected by this unlock |
| The invisible-focus-outline defect on `.btn-accent` (§8) | A real accessibility defect, not a design choice — `contracts/ACCESSIBILITY-CONTRACT.md` already requires (and UKBT's components already have) a genuine visible focus indicator |
| The horizontal-overflow layout bugs on `service`/`coaching`/`community`/`event` (§9) | Source defects; UKBT's own responsive tests already enforce a stronger guarantee |
| Literal HTML/CSS/JS files themselves | The license covers adaptation into UKBT's own implementation, not literal reuse; UKBT's Astro + token-system approach never reuses Adelux's files verbatim regardless |
| Isotope (bundled, GPLv3) | Independently excluded by `THIRD-PARTY-DISPOSITION.md`/dependency allowlist, regardless of Adelux's own license status — never adopted |
| fsLightbox, Odometer | Moot — confirmed `NOT_USED_BY_SOURCE` on every page (`INTERACTION-FORENSICS.md`); nothing to consider adopting |
| Adelux's own placeholder/stock imagery | Independently rights-tracked, outside this license's scope; UKBT supplies its own imagery |

---

## Verdict

```
REFERENCE_ANALYSIS_STATUS = COMPLETE
GATE_SATISFIED = licence verified (EV-20260826-024/-025), per prompts/16-reference-analysis.md
SECTIONS_ANALYZED = 10 (layout grammar, typography, component composition,
                        navigation, hero composition, section transitions,
                        imagery, interaction states, responsive behavior,
                        visual hierarchy/accessibility)
COMPONENTS_PROPOSED_FOR_ADAPTATION = 2 new (Section primitive, Nav) —
                                     Button/Card already satisfy this
                                     analysis's findings from Stage 5
EXCLUSIONS_NAMED = 7 (brand assets, focus-outline defect, overflow defects,
                      literal files, Isotope, fsLightbox/Odometer, stock imagery)
IMPLEMENTATION_PERFORMED = NONE — analysis and recommendations only, per
                            this stage's explicit "do not implement yet"
NEXT_GATE = Stage 7 — Homepage contract then implementation (prompts/17+)
```

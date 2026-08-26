# Homepage Red Team — Stage 8

**Date:** 2026-08-26 · **Reviewer:** Independent session, per `prompts/18-homepage-redteam.md`
(Stage 8 of `docs/10-fresh-repo-pipeline.md`). No prior context on this
codebase's implementation history was assumed; every claim below was
re-derived from the checked-out repository at:

```
BASELINE_SHA = bc0f17ec1ba4732fda4536131015cc1ea31469d3
BRANCH       = claude/ukbt-bootstrap-discovery-otlcwo
```

**Scope reviewed:** `apps/web/src/pages/index.astro` and its full render tree
(`Header`, `Hero`, `Section`, `ClubIntro`, `WhyChooseUs`, `AcademySection`,
`SectionHeader`, `TournamentGrid`, `CaptainSpotlight`, `FranchiseTeaser`,
`TestimonialSection`, `AboutCTA`, `NewsTeaser`, `Footer`, `Button`,
`SubHeading`, `PendingContent`, `BaseLayout`, `base.css`,
`styles/generated/tokens.css`), compared against `contracts/REPOSITORY-CONTRACT.md`,
`artifacts/ui/DESIGN-SYSTEM.md`, `artifacts/ui/REFERENCE-ANALYSIS.md`, and
`artifacts/pages/HOMEPAGE-CONTRACT.md`.

## What was actually run (not asserted)

| Command | Result |
|---|---|
| `pnpm install --frozen-lockfile` | Already satisfied, exit 0 |
| `pnpm build` (root) | Exit 0 — 16 pages built, tokens compiled first |
| `cd apps/web && pnpm exec playwright test tests/visual/homepage.spec.ts` | **6/6 passed** |
| `pnpm exec playwright test tests/visual/{responsive,axe,homepage-delivery}.spec.ts` | **17/17 passed** |
| `node scripts/scaffold-self-test.mjs` | `{"status":"PASS","required_files":23}` |
| `node scripts/check-dependency-allowlist.mjs` | `{"status":"PASS", "allowed_count":12}` |
| `astro preview` + a from-scratch Playwright script driving real Chromium at 390/768/1440/1920px, taking full-page screenshots and inspecting them visually | Done — see Evidence below |
| A **full, untagged** `axe-core` scan (the shipped test only runs `withTags(['wcag2a','wcag2aa','wcag22aa'])`) | **1 real violation, 4 nodes** (`heading-order`) — see F4 |
| A real keyboard-only traversal (`page.keyboard.press('Tab')`) of the mobile header at 390×844, reading `getComputedStyle`/`getBoundingClientRect` on whatever received focus | **Confirms F1** |
| A real `PerformanceObserver('layout-shift')` measurement across page load | CLS = 0.00082 — negligible, **not** a defect (checked, not assumed) |
| `grep` of `dist/index.html` for JSON-LD, canonical tag, `og:image`, heading sequence, `home-hero.webp` | Used as evidence throughout |

The existing suite passing is treated as a starting point, not a verdict — three
of the findings below (F1, F3, F4) are real defects the existing suite's own
assertions are structurally unable to see, not import errors on my part.

---

## Findings

### F1 — Mobile/tablet nav drawer is 100% keyboard-inoperable

```
SEVERITY: HIGH
```

**REPRODUCTION**
1. `astro preview`, viewport 390×844 (or any width ≤1279px — this is 4 of the
   6 frozen viewports: 1024×768, 768×1024, 430×932, 390×844).
2. Load `/`. Press `Tab` from a blank focus state.
3. Tab stop 1 lands on the header brand logo link (correct).
4. Tab stop 2 lands on the drawer's "Home" link — but the drawer is closed.
   The hamburger toggle that is supposed to open it is **never reached by
   Tab at all**, at any point in the sequence.

**EVIDENCE**
- Direct inspection: `#ukbt-nav-toggle` (the checkbox driving the CSS-only
  drawer) has `display: none` unconditionally
  (`apps/web/src/components/Header.astro` lines 166-171) — never
  overridden back to visible/focusable in the `≤1279px` media query that
  follows. A `display:none` element is removed from the tab order and the
  accessibility tree by definition.
- The visible hamburger control is a bare `<label for="ukbt-nav-toggle" class="ukbt-header__toggle">`
  with no `tabindex` and no keydown handler. Measured directly:
  `label tabIndex = -1` (Playwright `element.tabIndex` read). Plain
  `<label>` elements are not in the native tab order unless given one.
  **There is no focusable element anywhere in the markup that opens the
  drawer.**
- Confirmed by live keyboard traversal (Playwright driving real Chromium,
  not a static read): after two `Tab` presses, `document.activeElement`
  is the drawer's "Home" `<a>`, with
  `getBoundingClientRect() = { x: -280, y: 121, width: 260, height: 65 }`
  at a 390px-wide viewport — i.e. it is sitting **110px past the left edge
  of the screen**, fully off-canvas, because `.ukbt-header__drawer` is only
  moved via `transform: translateX(-100%)`, which (unlike `display:none`)
  does **not** remove an element from the tab order.
- A screenshot taken at that exact focus state
  (`kbd-02-second-tab-stop.png`, captured this session) shows the visible
  hamburger icon completely unhighlighted and no focus ring anywhere on
  screen — a sighted keyboard user sees literally nothing happen.
- Net effect for a keyboard-only user at any of these 4 viewports: **the
  entire primary navigation and the header CTA are unreachable** (they are
  correctly `display:none`, so Tab correctly skips them), and there is no
  substitute path to them — Tab instead walks silently through 7 invisible,
  off-screen drawer links before ever reaching real on-screen content
  (the hero's social icons).
- The existing E2E test (`homepage.spec.ts:48`, "mobile nav toggle shows
  and hides the nav without a console error") only calls
  `toggle.click()` — a pointer-event simulation — and never drives this
  path via keyboard, which is exactly why it passes while this is broken.

**ROOT_CAUSE**
The drawer toggle was built as a CSS-only checkbox hack
(`<input type=checkbox> + <label>`) for pointer users, but the checkbox
itself is set `display:none` (needed so the raw checkbox square doesn't
render) without compensating by giving the visible `<label>` proxy a
`tabindex="0"` + keyboard activation handler, or replacing the label with
a real `<button aria-expanded>` wired to the same collapse state. The
component's own header comment claims "reproduced here with a CSS-only
checkbox toggle rather than the reference's jQuery" but never accounts for
keyboard operability of that substitute mechanism.

**REQUIRED_FIX**
Make the visible toggle a real, keyboard-operable control: either (a) add
`tabindex="0"`, `role="button"`, `aria-expanded`, and a keydown handler
(Enter/Space) to the `<label>`, while also removing it from being
`display:none` on the underlying input's own focus event so a
`:focus-visible` state is achievable — or, preferably, (b) replace the
checkbox+label pattern with a real `<button aria-expanded aria-controls="...">`
toggling a small amount of client-side JS (still zero new dependencies).
Also stop the closed drawer's links from being tab-reachable while hidden
(`visibility:hidden` + `inert`, or removing them from the tab order via
`tabindex="-1"` when the drawer is closed, toggled in sync with the open
state).

---

### F2 — Homepage silently expands beyond the frozen HOMEPAGE-CONTRACT.md structure

```
SEVERITY: HIGH
```

**REPRODUCTION**
1. Read `artifacts/pages/HOMEPAGE-CONTRACT.md` §"Structure (section order)":
   it freezes exactly 8 sections — Nav, Hero, Stat strip, Club
   introduction, Upcoming tournaments, Club Captain spotlight, Our
   Franchises teaser, Footer — and explicitly states *"Not Adelux's page
   order — an IA derived from the client's own stated structure
   (`CLIENT_REQ_001`) ... per Stage 6's 'do not simply clone the reference
   page order' rule."*
2. Read `apps/web/src/pages/index.astro`. Its own top-of-file comment
   states the opposite intent: *"Section order follows the reference
   homepage's own sequence ... Banner → About → Why Choose Us → Academy →
   Tournament → Captain → Community → Testimonial → CTA → News → Footer."*
3. Count the actual rendered sections between Hero and Footer: `ClubIntro`,
   `WhyChooseUs`, `AcademySection`, `TournamentGrid`, `CaptainSpotlight`,
   `FranchiseTeaser`, `TestimonialSection`, `AboutCTA`, `NewsTeaser` — 9
   sections, of which only `ClubIntro` (stat-strip+intro combined),
   `TournamentGrid`, `CaptainSpotlight`, and `FranchiseTeaser` map to an
   approved contract item. `WhyChooseUs`, `AcademySection`,
   `TestimonialSection`, `AboutCTA`, and `NewsTeaser` — **5 sections —
   appear nowhere in the frozen contract.**

**EVIDENCE**
- `artifacts/pages/HOMEPAGE-CONTRACT.md` lines 28-37 (frozen 8-item
  structure, explicit anti-Adelux-order instruction).
- `apps/web/src/pages/index.astro` lines 7-16 (comment admitting the
  reference's own sequence was followed) and lines 85-129 (actual render
  order, 12 top-level blocks vs. the contract's 8).
- Two of the five unapproved sections ship to the live, indexed production
  route as visibly empty "pending" shells:
  `apps/web/src/components/TestimonialSection.astro` renders "Member
  testimonials are being gathered... Nothing is shown until then." and
  `apps/web/src/components/NewsTeaser.astro` renders "Club news is not
  published yet." — both confirmed present in `dist/index.html` and
  visible in the full-page screenshots captured this session
  (`full-desktop-1440.png`, `full-mobile-390.png`) as clearly-empty
  boxes on the homepage a visitor actually lands on.
- The homepage is not `noindex`'d (correctly, per the contract), so these
  admittedly-empty sections are shipped to search engines and real
  visitors on the site's most important route.

**ROOT_CAUSE**
The implementer treated Stage 6's reference-analysis grammar ("adapt the
compositional pattern") as license to also adopt the reference's *page
order and section inventory*, which Stage 6 (`REFERENCE-ANALYSIS.md` §1)
and Stage 7 (`HOMEPAGE-CONTRACT.md` itself) both explicitly reject. This
is scope expansion past an approved, frozen contract without a new
approval cycle — the exact case `CLAUDE.md`'s "No scope expansion without
re-planning" invariant and the pipeline's Rule 2 ("no stage jumping
backwards silently... a failure moves to DIAGNOSE") are written to
prevent.
- Note: one open-item consequence of this drift — the required "founding
  year 2020" fact (`HOMEPAGE-CONTRACT.md` §"Club introduction") is not
  present in `ClubIntro.astro` (the section the contract assigns it to)
  at all; it only appears on the page because it was placed inside the
  unapproved `WhyChooseUs` section instead
  (`apps/web/src/pages/index.astro` line 59, "A Registered Club... Founded
  in 2020"). If `WhyChooseUs` were removed to bring the page back into
  contract compliance, this required fact would silently disappear.

**REQUIRED_FIX**
Either (a) strip the homepage back to the frozen 8-section structure and
move `WhyChooseUs`/`AcademySection`/`AboutCTA` content to pages where it
belongs (`/about`, `/coaching`), keeping `Testimonial`/`News` off the
homepage entirely until real content exists rather than shipping visible
empty shells on the primary route; or (b) take the expanded structure back
through PLAN → APPROVE as a `HOMEPAGE-CONTRACT.md` amendment before it
ships, per the pipeline's own change-control rule. Either path, move the
founding-year fact into whichever section is contractually responsible for
it so it does not depend on an unapproved section's survival.

---

### F3 — Focus-indicator contrast failure on every dark-background interactive element (real WCAG 1.4.11 failure, invisible to axe and to the existing outline-presence test)

```
SEVERITY: HIGH
```

**REPRODUCTION**
1. `astro preview`, 1440×900 (any viewport — this is a color issue, not a
   layout one).
2. `.focus()` each of: the 4 hero social links, the hero CTA button, the
   franchise-teaser CTA link, the 4 about-cta social links, and the 4
   footer social icon links.
3. Read `getComputedStyle(el).outlineColor` and the nearest ancestor's
   `backgroundColor`; compute WCAG contrast between them.

**EVIDENCE** (measured this session, real computed styles, real contrast math)

| Element(s) | Outline color | Background | Contrast | Needs |
|---|---|---|---|---|
| `.ukbt-hero__social a` ×4 | `rgb(0,0,0)` | `rgb(0,30,58)` navy | **1.25:1** | 3:1 |
| `.ukbt-hero .ukbt-button` (hero CTA) | `rgb(0,0,0)` | `rgb(0,30,58)` navy | **1.25:1** | 3:1 |
| `.ukbt-franchise__cta a` | `rgb(0,0,0)` | `rgb(0,30,58)` navy | **1.25:1** | 3:1 |
| `.ukbt-about-cta__benefit a` ×4 | `rgb(0,0,0)` | `rgb(0,30,58)` navy | **1.25:1** | 3:1 |
| `.ukbt-footer__social a` ×4 | `rgb(204,164,79)` gold | `rgb(204,164,79)` gold | **1.00:1** | 3:1 |

By contrast, `.ukbt-header__nav a`, `.ukbt-footer__links a`,
`.ukbt-tournament-cta__link`, and `.ukbt-captain__link` all measured
7.2–19:1 (fine) — these are the elements each component's local CSS
happens to override with an explicit `:focus-visible` rule. The 13
elements above fall through to whichever `:focus-visible` rule wins by
cascade, and in every failing case that is either the *global* fallback in
`base.css` (`outline: 2px solid var(--ukbt-color-surface-foreground)` →
`CanvasText`, which resolves to black in a light-theme browser regardless
of the *page's* background) landing on a navy section, or — for the
footer social icons specifically — `Footer.astro`'s own override
(`.ukbt-footer a:focus-visible { outline: 2px solid var(--ukbt-color-brand-accent) }`)
picking the exact same gold the social-icon tiles are already filled
with, so the "visible" ring is painted in a color identical to what it's
supposed to stand out against.

This is real, not a hypothetical: the reference analysis
(`artifacts/ui/REFERENCE-ANALYSIS.md` §8) documents that the *Adelux
source itself* has this exact class of defect (`.btn-accent`'s invisible
outline) and states explicitly it must not be reproduced; `HOMEPAGE-CONTRACT.md`
repeats that as a binding requirement. It has been reproduced anyway, in a
different but equally real form, on 13 of the homepage's interactive
elements.

Neither existing guard catches it:
- The Playwright test (`homepage.spec.ts:25`) only asserts
  `outlineStyle !== 'none'` and `outlineWidth > 0` — both true here (2px
  solid outlines exist), so the test is structurally blind to color.
- `axe-core`'s `color-contrast` rule evaluates text/background contrast,
  not focus-ring contrast (WCAG 1.4.11 Non-text Contrast is a separate SC
  axe does not check automatically) — confirmed by running the full,
  untagged axe scan this session and finding zero contrast-tagged
  violations for these elements.

**ROOT_CAUSE**
`base.css`'s global `:focus-visible` fallback hard-codes a single outline
color (`CanvasText`, effectively black) with no awareness of which surface
token (`surface-inverse` vs `surface-background`) the focused element sits
on, and no component-level override was added for the hero, franchise, or
about-cta sections' dark-surface links. Separately, the footer's own
override was authored using the accent-gold token without checking it
against elements whose own background is already that same gold.

**REQUIRED_FIX**
Give `:focus-visible` an outline color that is contrast-safe against
*both* surface roles — e.g. define `--ukbt-color-focus-ring` per surface
context (a light-surface value and a dark-surface value, the way
`Header.astro` and `Footer.astro`'s nav-link overrides already correctly
do), and apply the dark-surface variant wherever a `surface-inverse`
section contains an interactive element without its own override (Hero,
FranchiseTeaser, AboutCTA benefit column). For the footer social icons
specifically, use a color that contrasts against gold (e.g. the primary
navy, which already contrasts 7.2:1 against gold per `Button.astro`'s own
comment) rather than reusing brand-accent. Add the missing test: assert a
minimum 3:1 outline-vs-background contrast (not just presence) for every
focusable element, the same way `homepage.spec.ts`'s gold-contrast test
already does real relative-luminance math for text.

---

### F4 — Heading hierarchy skips levels four times; the "0 axe violations" claim is true only for a filtered rule subset

```
SEVERITY: MEDIUM
```

**REPRODUCTION**
1. `astro build`, then read the heading sequence out of `dist/index.html`
   in document order.
2. Run a full (untagged) `axe-core` scan against the live preview, not the
   `withTags(['wcag2a','wcag2aa','wcag22aa'])`-filtered scan the existing
   suite runs.

**EVIDENCE**
- Extracted heading sequence from the actual build output:
  `h1 → h5 → h3 → h4 → h2 → h2 → h4×4 → h2 → h2 → h3 → h4 → h3 → h2 → h3 →
  h4 → h4 → h2 → h4×3 → h2 → h3 → h2 → h4×4`. The `h1 → h5` jump (hero
  headline straight to "Players. One Club") skips four levels; three more
  skips occur further down the page.
- A full, untagged `axe-core` run against the live homepage this session
  returned:
  ```
  Violations: 1
  - heading-order moderate cat.semantics,best-practice - 4 node(s)
      h5
      .ukbt-chooseus__card:nth-child(1) > h4
      li:nth-child(1) > h4  (FranchiseTeaser facts list)
      .ukbt-footer__col:nth-child(1) > h4
  ```
- `heading-order` is tagged `best-practice`, not `wcag2a`/`wcag2aa`/`wcag22aa`
  — the existing test (`homepage.spec.ts:9`,
  `.withTags(['wcag2a','wcag2aa','wcag22aa'])`) cannot see it by
  construction. `HOMEPAGE-CONTRACT.md`'s acceptance criterion 3 says
  flatly "axe-core — 0 violations on `/`", with no tag-scope qualifier;
  read literally, that criterion is not actually met.

**ROOT_CAUSE**
Section-level components (`Hero`, `WhyChooseUs`, `FranchiseTeaser`,
`Footer`) each choose their own local heading level based on visual weight
(what looks right at that font size) rather than the document's logical
outline, and nothing enforces the two staying in sync since headings are
scattered across a dozen independently-authored single-purpose components
with no shared outline contract.

**REQUIRED_FIX**
Walk the intended outline (h1 page title → h2 per major section → h3/h4
for sub-groups within a section) and adjust the 4 flagged instances
(promote the hero's "Players. One Club" from h5 to something that doesn't
skip h2-h4, and correct the three h4-after-h2-with-no-h3 cases in
WhyChooseUs/FranchiseTeaser/Footer). Then either broaden the existing axe
test's tag list to include `best-practice`, or add a dedicated
`heading-order` check, so this class of regression is caught automatically
rather than only by a manual full-tag red-team scan.

---

### F5 — The identical primary CTA ("Join the Club" → `/contact`) is duplicated three times on one page

```
SEVERITY: MEDIUM
```

**REPRODUCTION** Load `/` and search the rendered HTML for `Join the Club`.

**EVIDENCE** Three separate, byte-identical `<Button label="Join the Club" href="/contact" variant="primary" />` invocations:
`Header.astro` line 67 (header bar CTA), `Hero.astro` line 63 (hero CTA
card), and `AboutCTA.astro` line 24 (the "Follow the Tigers" CTA card,
positioned below the Testimonial section). Visually confirmed in the
full-page screenshots captured this session — the same gold pill button
with the same label appears in the header, again ~200px into the page,
and a third time roughly two-thirds of the way down.

**ROOT_CAUSE** Each section was authored independently against its own
slice of the reference template (banner CTA, membership-CTA-section) with
no shared inventory of "what CTA already exists elsewhere on this page,"
so the same action was proposed three times rather than the third
instance being differentiated (e.g. a social-follow-specific CTA, since
that's what the surrounding `AboutCTA` copy — "Follow the Tigers... Stay
connected across every platform" — is actually about) or removed as
redundant.

**REQUIRED_FIX** Keep the header and hero CTA (both serve genuinely
different points in the scroll), and change the third (`AboutCTA`)
instance to match what its own section is actually asking the visitor to
do — follow on social — rather than repeating "Join the Club" verbatim a
third time.

---

### F6 — The recurring "dark rounded panel" surface pattern is hand-rolled independently ~7 times instead of composing the established `Card.astro` primitive

```
SEVERITY: LOW-MEDIUM
```

**REPRODUCTION** Compare `Card.astro`'s style block against
`.ukbt-tournament-card`/`.ukbt-tournament-cta` (`TournamentGrid.astro`),
`.ukbt-chooseus__card` (`WhyChooseUs.astro`), `.ukbt-news__card`
(`NewsTeaser.astro`), `.ukbt-about-cta__content`/`__benefit`
(`AboutCTA.astro`), and `.ukbt-franchise__cta` (`FranchiseTeaser.astro`).

**EVIDENCE** All seven independently declare the same
`border-radius: var(--ukbt-radius-lg | --ukbt-radius-ref-card)` +
`padding: var(--ukbt-space-*)` + a `surface-inverse`/`brand-accent`
background combination, each with its own slightly different property
list (some include `box-shadow`, some don't; some use `--ukbt-radius-lg`,
others `--ukbt-radius-ref-card`). `Card.astro` is never imported by any
homepage component (`grep` for `Card.astro` inside the homepage's
component tree returns zero matches), despite
`artifacts/ui/DESIGN-SYSTEM.md` naming it as one of only two established
primitives and `REFERENCE-ANALYSIS.md` §3 explicitly recommending "shared
card base + occurrence-justified variants... already built."

**ROOT_CAUSE** `Card.astro`'s contract is narrow (heading + body + optional
link only) and doesn't support the tag-pill/index-number/meta-row/media
content these sections need, so each was built as a one-off `<div>` rather
than either extending Card's contract or extracting a shared lower-level
"panel/surface" primitive underneath both Card and these sections.

**REQUIRED_FIX** Not urgent — none of the seven currently disagrees
visually — but before an 8th one is added (Stage 9 will add several more
pages), extract a shared `Surface`/`Panel` primitive (radius + padding +
background-role props) that `Card.astro` and these ad hoc divs both
compose, so the next page doesn't add an 8th slightly-different
implementation of the same rule.

---

### F7 — Structured data omits the founding year the contract requires, even though the fact is available on the same page

```
SEVERITY: LOW
```

**REPRODUCTION** `grep -o '<script type="application/ld+json"[^<]*</script>' dist/index.html`.

**EVIDENCE**
```json
{"@context":"https://schema.org","@type":"SportsOrganization","name":"UK Bangla Tigers","sport":"Cricket","sameAs":[...]}
```
`HOMEPAGE-CONTRACT.md` §SEO/AEO/GEO: "Structured data:
`SportsTeam`/`SportsOrganization` JSON-LD using only facts already on
record (**name, founding year, sport, sameAs**)" — `foundingDate`/`foundingYear`
is absent from the emitted object, even though "Founded in 2020" is a
verified fact rendered elsewhere on the very same page
(`apps/web/src/pages/index.astro` line 59).

**ROOT_CAUSE** `structuredData` in `index.astro` (lines 69-75) was built
from the same three fields as the previous foundation-stage placeholder
and never revisited when the founding-year fact was added to the page
content.

**REQUIRED_FIX** Add `foundingDate: "2020"` to the `structuredData` object
in `index.astro`.

---

## Checked and found NOT to be a problem (reported for completeness, not padding)

- **CLS / layout instability:** measured with a real `PerformanceObserver('layout-shift')`
  across page load — cumulative score **0.00082**, far under the 0.1
  "needs improvement" threshold. Not a defect.
- **Opacity-based text contrast** (the exact trap the review brief calls
  out): `.ukbt-footer__copyright p { opacity:0.7 }`, `.ukbt-footer__col p
  { opacity:0.85 }`, `.ukbt-academy__label { opacity:0.85 }`, and
  `.ukbt-section-header--inverse .ukbt-section-header__lede { opacity:0.85 }`
  were all hand-computed (alpha-blended white text over the actual navy
  background beneath them, not just the unmodified foreground color) —
  every one lands between 8.7:1 and 12.4:1, because the navy background
  they sit on is dark enough that even 70%-opacity white stays far above
  AA. Not a defect, unlike the three prior opacity-related contrast bugs
  these same components' comments describe having already been caught and
  fixed.
- **Horizontal overflow:** re-verified independently (existing suite) at
  all 6 frozen viewports on `/` — zero overflow, confirmed.
- **Gold-as-text-on-light-surface rule:** re-read every component; the
  rule is applied consistently (navy index numbers, not gold, in
  `WhyChooseUs`'s light cards; gold reserved for dark/accent surfaces
  throughout). Existing automated check re-run and passing.
- **Image dimensions vs. `width`/`height` attributes:** crest usages
  declare slightly different aspect ratios (e.g. Header's 60×82 vs. the
  source PNG's true 512×697) across Header/Hero/Footer/FranchiseTeaser,
  but the drift is under 1% in every case — not enough to produce a
  visible reflow. Not reported as a defect.
- **`pnpm build`, `scaffold-self-test.mjs`, `check-dependency-allowlist.mjs`,
  content-contamination grep, excluded-asset grep, `home-hero.webp`
  absence:** all independently re-run this session, all pass.

---

## Summary

```
FINDINGS_BY_SEVERITY:
  HIGH = 3   (F1 keyboard-inoperable mobile nav, F2 unapproved scope
              expansion vs. frozen contract, F3 focus-ring contrast failure)
  MEDIUM = 2 (F4 heading-order / partial axe-scan claim, F5 duplicated CTA)
  LOW-MEDIUM = 1 (F6 card-pattern duplication)
  LOW = 2    (F7 missing foundingDate, F8 hard-coded rgba() literals
              bypassing the token system — Header.astro:210,
              Footer.astro:147/212, SubHeading.astro:47)
TOTAL_FINDINGS = 8
```

F1 alone is disqualifying on its own: a keyboard-only user cannot open
the primary navigation at 4 of the 6 frozen viewports (everything below
1280px wide), which is a WCAG 2.1.1 (Level A) failure on the site's own
primary nav, not an edge case. F2 compounds it — the page that shipped is
not the page that was approved, and the pipeline this repository commits
to (`docs/10-fresh-repo-pipeline.md` Rule 2) treats that as a DIAGNOSE-track
failure, not a matter for the next patch. F3 is a second, independent real
accessibility regression of exactly the class (`REFERENCE-ANALYSIS.md` §8,
`HOMEPAGE-CONTRACT.md` Interaction section) this project already
identified as unacceptable and committed not to reproduce.

None of this should be read as "the build is broken" — it isn't: it
compiles, deploys, and the existing test suite is honest about what it
actually checks. The gap is between what the existing suite checks and
what the frozen contracts actually require.

```
HOMEPAGE_VERDICT = FAIL
```

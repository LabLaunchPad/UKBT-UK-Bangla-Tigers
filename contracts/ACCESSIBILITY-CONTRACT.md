# Accessibility Contract

**ID:** CONTRACT-ACCESSIBILITY-01
**Status:** FROZEN · Stage 3 (Contract Freeze)
**Purpose:** Fix WCAG 2.2 AA as the binding target, name the automated
tooling, and bind the rule that a source accessibility defect is evidence,
never a mandatory behavior to reproduce.

## Outputs / Frozen requirements

```
STANDARD = WCAG 2.2 AA (A15, unchanged)
AUTOMATED_TOOL = axe-core, run in CI on every route (A12)
MANUAL_SUPPLEMENT = explicit Playwright keyboard-navigation tests
AUTOMATION_LIMIT, STATED HONESTLY = automated a11y checks alone catch
    roughly a third of real defects (VALIDATION-MODEL.md) — axe-core
    passing is never reported as "accessible," only as "no automatable
    violation found"
```

Required checks, all merge-blocking (`CI-CONTRACT.md`), not informational:
- axe-core violations (any WCAG 2.2 AA rule).
- Keyboard reachability and operability for every interactive element.
- Visible focus indicator on every focusable element.
- Semantic HTML (landmark roles, heading hierarchy) over ARIA-patched
  `<div>` soup.
- Programmatic labels for every form control and icon-only control.
- `prefers-reduced-motion` respected for any animation/transition.
- Color contrast at AA thresholds for text and meaningful UI.

## The binding source-defect rule

> **SOURCE ACCESSIBILITY DEFECT ≠ UKBT REQUIREMENT.**
>
> **VISUAL_FIDELITY ≠ BLIND_REPRODUCTION_OF_ACCESSIBILITY_DEFECTS.**

Where Track A finds a source behavior that conflicts with an accessibility
requirement — the concrete instance on record is `.btn-accent`'s invisible
focus-state outline (`INTERACTION-FORENSICS.md`, labeled `SOURCE_DEFECT`)
— the source behavior is **recorded**, never silently inherited. The
adaptation decision for that element must explicitly choose
repair-vs-preserve and record which, with a reason.

**The default, absent an explicit documented reason to preserve, is
REPAIR.** WCAG 2.2 AA (a `REQUIREMENT`, `A15`) outranks visual fidelity to
a defect. A reason to preserve would have to independently justify keeping
an accessibility failure — general "fidelity" is not such a reason, since
fidelity itself is defined (per `CSS-CONTRACT.md`) as visual outcome, and
an invisible focus state is not a visual outcome worth preserving over a
usability failure.

## Invariants

- No `SOURCE_DEFECT` reaches `APPROVED` (`DESIGN-SYSTEM-CONTRACT.md`)
  without an explicit REPAIR or documented-PRESERVE decision recorded
  against it.
- Accessibility gates are merge-blocking for every route once routes
  exist — "the gate runs" and "the gate blocks merge on failure" are
  different claims, and this contract adopts the second for every gate it
  names (`ARCHITECTURE-PROPOSAL-V3.md` §9/gate-set finding).

## Forbidden behavior

- Reproducing the `.btn-accent` invisible-focus behavior (or any other
  named `SOURCE_DEFECT`) without a recorded PRESERVE decision and reason.
- Reporting an axe-core pass as proof of accessibility rather than proof
  of "no automatable violation found."
- Making the accessibility CI gate informational/non-blocking to get a
  green build.

## Validation method

- axe-core run against every rendered route in CI; any violation fails
  the build.
- Playwright keyboard-navigation suite (Stage 4) exercises tab order,
  focus visibility, and operability without a mouse for every interactive
  component.
- Manual review at each `ADAPTED→APPROVED` promotion for any item carrying
  a named `SOURCE_DEFECT`.

## Owner

Track C (tooling, gate wiring, the repair-by-default rule as a UKBT
engineering standard — not gated by Track B, since accessibility applies
regardless of Adelux's rights status). Track B intersects only where a
specific Adelux-derived component's defect decision (repair vs. preserve)
is being recorded during adaptation.

## Dependency

`DESIGN-SYSTEM-CONTRACT.md` (promotion gate). `COMPONENT-CONTRACT.md`
(accessibility-behavior field). `CI-CONTRACT.md` (merge-blocking
enforcement).

## Change authority

Choosing PRESERVE over REPAIR for any named `SOURCE_DEFECT` requires an
explicit, recorded reason at the time of that component's adaptation
decision — not a default, not silence.

## Evidence required

`INTERACTION-FORENSICS.md` (`SOURCE_DEFECT` finding, already recorded).
`VALIDATION-MODEL.md` (automation-limit honesty).

## Reversibility

REVERSIBLE at the policy level. NOT REVERSIBLE in effect once a defect
ships to real users and is indexed/experienced — which is exactly why
REPAIR is the default rather than something decided per-instance under
time pressure.

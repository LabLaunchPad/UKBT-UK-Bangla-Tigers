# PROMPT 15 — DESIGN SYSTEM BEFORE PAGES (Stage 5)

Audit the implemented foundation, then create the UKBT visual system. Do NOT
create arbitrary page-by-page styling.

First define: typography · font loading · type scale · spacing scale · container
widths · grid · breakpoints · colors · surface hierarchy · borders · radii ·
shadows · motion · focus states · button states · card states · responsive rules.

Then implement reusable primitives/components.

Do NOT invent brand colors if authoritative brand evidence is unavailable.

Classify every visual decision: `BRAND_FACT` · `EVIDENCE_BACKED` · `DERIVED` ·
`PROPOSED`. `PROPOSED` values must be centrally replaceable — one token
definition, no hard-coded copies — so that arrival of real brand evidence is a
small diff, not a refactor.

Build a visual test page exercising the tokens and components.

Run: type check · lint · unit tests · build · accessibility checks.

Create `artifacts/ui/DESIGN-SYSTEM.md` and
`artifacts/ui/DESIGN-SYSTEM-VERIFICATION.md`.

Do not build the full website yet.

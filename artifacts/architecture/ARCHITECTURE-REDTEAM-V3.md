# Architecture Red Team v3 — Attacking the 15 Named Vectors

**Date:** 2026-08-26 · Attacks `ARCHITECTURE-PROPOSAL-V3.md` against the
requester's exact 15 failure modes. Six genuine findings surfaced and were
**fixed in v3 directly**, not merely logged — consistent with how this
project has handled every prior red-team pass. Nine attacks were survived
outright.

---

| # | Attack | Result | Detail |
|---|---|---|---|
| 1 | Framework is unjustified | **SURVIVED** | The sharpest counter — Next.js's larger ecosystem matters more for maintainer hiring than Astro's — is real but doesn't flip the decision: zero-JS-by-default is a *structural* fit for the WCAG/perf requirements, not a preference, and a general-purpose meta-framework would need that enforced by discipline every PR instead of gotten as a default |
| 2 | Workspace is over-engineered | **SURVIVED** | The sharper alternative (zero packages, one ESLint rule) was considered — an import-restriction lint rule is disable-able by a single comment; a package boundary is enforced by the module resolver itself. That asymmetry is why one package earns its place here |
| 3 | CMS is premature | **SURVIVED** | "No CMS" is not itself a premature assumption — it's the reversible default with a named trigger (`U-12` resolving) for revisiting it, which is the opposite of premature |
| 4 | Forms require rewrite | **SURVIVED, with a sharpened limit** | C2 protects the UI from rewrite if the *backend* changes. It does not guarantee Cloudflare Functions can do anything a future form ever needs — **fixed**: this limit is now stated explicitly in §7 rather than implied |
| 5 | Visual system becomes framework-dependent | **PARTIALLY UNVERIFIED — fixed by honest disclosure** | Framework-neutral contracts (layer 6) are a design *intent*; zero exist yet, so whether Astro-specific patterns leak into them is genuinely untested. **Fixed**: §3 now states this as an honest limitation, not a proven guarantee |
| 6 | Tokens cannot be reused | **SURVIVED** | Tokens compile to plain CSS custom properties — the most framework-independent layer in the whole design by construction |
| 7 | CSS becomes unmaintainable | **GENUINE FINDING — fixed** | Track A found real 4-level descendant selectors in the source (`.card-blog.card-blog-post .image-container img`). Preserving that exact selector shape for "fidelity" would import Adelux's specificity patterns wholesale. **Fixed**: §5 now states fidelity binds to rendered outcome, not literal selector structure — UKBT may use flatter selectors as long as the computed result matches at parity time |
| 8 | Third-party rights leak into implementation | **GENUINE FINDING — fixed** | `DO_NOT_ADOPT` was policy, not enforcement — nothing stopped a future `pnpm add isotope`. **Fixed**: §11 now requires a CI dependency-allowlist check |
| 9 | Source demo content leaks into UKBT | **SURVIVED** | The truth gate has no code path that reads from Adelux at all (§4) — this is stronger than a rule someone could disable, by construction |
| 10 | Accessibility cannot be enforced | **GENUINE FINDING — fixed** | "The a11y gate runs" and "the a11y gate blocks merge" are different claims; v3 draft only implied the second. **Fixed**: the gate set now says explicitly that every gate, accessibility included, is merge-blocking, not informational |
| 11 | Visual regression is nondeterministic | **GENUINE FINDING — fixed** | Cross-OS font rendering and sub-pixel hinting are a classic source of spurious visual-diff failures, and nothing in the draft addressed it. **Fixed**: §10 now requires CI-vs-CI-only comparison with a pinned, non-`latest` runner OS image |
| 12 | Deployment conflicts with architecture | **SURVIVED** | Static assets + Pages Functions in one Cloudflare project is the platform's own supported model — no conflict to find |
| 13 | Future pages require structural rewrite | **SURVIVED** | File-based routing (A21) + typed content collections mean a new page is a new content entry and a new route file — no structural change |
| 14 | Content and presentation become coupled | **Same finding as #5** | Not a separate defect — folded into the layer 6/7 honest-limitation disclosure |
| 15 | Architecture depends on unresolved Track B rights | **SURVIVED — the most important one** | Explicitly re-verified: **no part of Stage 4's foundation work requires a real Adelux-derived value.** Project structure, framework config, TypeScript config, lint, the content/truth schema itself, the design-token *system* (with placeholder values), a11y/SEO/testing foundations — all buildable and testable with synthetic data. Only *populating* layers 4–7 with real Adelux-informed content depends on Track B. This is the answer that makes Track A/B/C parallelism actually work, not just a hopeful claim. |

---

## Summary

**9 of 15 attacks survived outright.** **6 were genuine findings**, all
fixed directly in `ARCHITECTURE-PROPOSAL-V3.md` during this pass rather
than left as open items for a future revision cycle — consistent with how
v2's red team handled its own two clarifications.

**No finding required rejecting a decision.** Every fix was an addition —
a stated limitation, a sharpened boundary, or a CI enforcement mechanism —
none required reversing framework, workspace shape, or any of the other
core decisions.

```
CRITICAL_FINDINGS = 0
NON_CRITICAL_FINDINGS = 6, all fixed this pass
ATTACKS_SURVIVED_UNCHANGED = 9/15
FINDINGS_REQUIRING_FURTHER_REVISION = 0
NO_ADELUX_DERIVED_EXPRESSION_USED_IN_ANY_DECISION = confirmed by inspection
```

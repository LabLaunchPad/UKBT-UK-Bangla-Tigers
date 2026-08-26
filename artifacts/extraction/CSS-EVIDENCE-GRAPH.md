# CSS Evidence Graph — Component ↔ Token Associations

**Date:** 2026-08-26 · Derived entirely from the existing CSS AST
(`css-rule-graph.json`, `EV-20260826-009`, 748 rules) — **no re-parsing**,
per the instruction not to spend time proving what's already established.
This is the cross-reference layer that was missing: which rules actually
match each component candidate, and which tokens they reference.

Full machine-readable output: `artifacts/extraction/css-component-token-graph.json`.

| Candidate | Matching rules | Token references | Structural complexity |
|---|---|---|---|
| `.btn-accent` | 2 | `--accent-color-2` (base), `--accent-color-6` (hover) | Simple — base + one pseudo-state, both token-driven. Matches the fully-traced cascade in `EV-20260826-009`. |
| `.nav-link` | 7 | `--font-family-1`, `--secondary`, `--accent-color-2` | Moderate — base, container, hover/focus/active states, most declaring at least one token |
| `.card-blog` | **14** | `--accent-color`, on 3 related sub-selectors (`.card-blog-category`, `.card-blog-recent`, `.card-blog-tag`) — the base card and its image/hover rules are untokenized | **High** — genuinely structural (nested image container, hover-state image treatment, category/tag sub-components), consistent with its `VARIANT` classification in `COMPONENT-CANDIDATES.md` |
| `.card-chooseus` | 1 | `--secondary` | **Thin** — a single rule. Reinforces the `COMPONENT-CANDIDATES.md` finding that this candidate is narrowly scoped (2 pages) rather than a broadly reusable component |

## What this confirms

The rule-count asymmetry (`.card-blog`: 14 rules vs. `.card-chooseus`: 1
rule) is independent, structural confirmation of the occurrence-count
finding in `COMPONENT-CANDIDATES.md` — `.card-blog` is a real,
multi-part component with its own hover/image treatment; `.card-chooseus`
is a thin styling hook, not evidenced strongly enough to be a general
UKBT component candidate on its own.

**Cascade relationships are preserved, not normalized** — per instruction,
no CSS was rewritten, cleaned up, or "modernized" in producing this graph;
it reports what the source's own cascade actually contains.

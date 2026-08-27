# PROMPT 11 — BOOTSTRAP DISCOVERY (Stage 1)

Supersedes `prompts/00-admission.md` for a fresh repository.

You are the principal engineer bootstrapping a brand-new repository for UK
Bangla Tigers.

This repository is intentionally fresh. There is no existing application
architecture to preserve. However, we MUST NOT invent facts about UK Bangla
Tigers — its players, fixtures, history, leadership, achievements, sponsors,
locations, or any other organization-specific claim.

Read `CLAUDE.md`, `AGENTS.md`, `docs/`, `contracts/`, `prompts/`.

Do NOT build the website. Perform bootstrap discovery. Determine and document:

1. current repository state; 2. available runtime/tooling; 3. recommended
application architecture; 4. required package/workspace structure; 5. content
model; 6. truth/provenance model; 7. UI/design-system model; 8. SEO/AEO/GEO
model; 9. accessibility model; 10. testing strategy; 11. build/deployment
strategy; 12. image/asset strategy; 13. CMS/content workflow if required;
14. validation/release gates; 15. security boundaries; 16. agent/tool boundaries.

Classify every architectural decision: `FACT` · `REQUIREMENT` · `DERIVED` ·
`PROPOSED` · `UNKNOWN`.

Architectural choices MAY be `PROPOSED`. Organization-specific facts may NOT be
invented — at any classification.

Write no production application code. Planning and evidence artifacts only:

- `artifacts/bootstrap/REPOSITORY-BOOTSTRAP.md`
- `artifacts/bootstrap/ARCHITECTURE-PROPOSAL.md`
- `artifacts/bootstrap/CONTENT-TRUTH-MODEL.md`
- `artifacts/bootstrap/VALIDATION-MODEL.md`
- `artifacts/bootstrap/UNKNOWN-EVIDENCE.md`

Then self-review adversarially: What am I assuming? What did I invent? Which
decisions are reversible? Which could cause architectural lock-in? Which
requirements have no evidence? Which future changes would be expensive if chosen
incorrectly?

End with:

```
BOOTSTRAP_STATUS = READY | BLOCKED
INVENTED_ORG_FACTS = 0 | <number>
UNRESOLVED_DECISIONS = <number>
CRITICAL_RISKS = [...]
CHANGES_TO_APPLICATION_CODE = 0
```

Then STOP.

> Reviewer note: if the output contains a sentence like "UK Bangla Tigers was
> founded in X and has won Y" without a source, stop the run. `INVENTED_ORG_FACTS`
> must be 0.

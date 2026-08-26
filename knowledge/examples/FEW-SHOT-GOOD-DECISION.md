# Few-shot: a good decision

## Question
Should we create five packages immediately?

## Bad reasoning
> "We may need them later, so create them now."

## Good reasoning

**Evidence:**
- The current application is one website.
- Only the truth gate has a demonstrated cross-boundary need.
- No independent UI consumer exists.
- No independent content package consumer exists.
- No independent deployment boundary exists.
- Content schemas and provenance rules share every field; splitting them would
  create two places to edit one concern.

**Decision:** REJECT the five-package split.

**Choose:** `apps/web` + one package co-locating content schemas and the truth gate.

**Reason:** satisfies the boundaries that actually exist, while keeping extraction
reversible. Extraction later costs ~1 hour; five packages cost attention daily.

**Status:** `PROPOSED` — requires the architecture gate.

## Why this is the pattern
It cites evidence before concluding, names what is *absent* as well as present,
prefers the smallest defensible option (DR-007, DR-008), and ends in `PROPOSED`
rather than asserting the decision is made (DR-012).

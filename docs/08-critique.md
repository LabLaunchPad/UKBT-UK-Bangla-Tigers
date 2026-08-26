# Critical Self-Critique

## What was wrong with the earlier scaffold
1. It was too willing to treat historical audit claims as the operational baseline.
2. It did not force reconciliation against the real repository's existing CLAUDE.md and instruction hierarchy early enough.
3. It had generic verification, but not a sufficiently explicit acceptance-to-evidence mapping.
4. It did not make evidence freshness/expiry a first-class concept.
5. It did not sufficiently cover prompt injection from repository content.
6. It did not sufficiently cover secrets, destructive commands, external side effects, concurrent writers, interruption/resume, and dependency drift.
7. It had adaptive learning, but insufficient anti-overfitting replay.
8. It treated visual verification mainly as a screenshot problem rather than a DOM/CSS/assets/state problem.
9. It did not explicitly distinguish a deterministic tool being wrong from an LLM being wrong.
10. It did not explicitly freeze runtime/environment identity for receipts.

## What we deliberately did NOT add
- a mandatory six-agent architecture: historical evidence is inconsistent on the exact count, and later self-critique explicitly rejected treating six as a universal standard. fileciteturn4file10L1-L16
- MCP: historical analysis concluded it was not warranted for the current two-project setup when local deterministic tooling is sufficient. fileciteturn4file9L1-L16
- a second truth model: UKBT's existing `packages/truth` remains authoritative.
- forced DesignOS/UKBT convergence: the audit explicitly distinguishes their domains. fileciteturn4file10L1-L16

## Remaining uncertainty
This scaffold cannot prove current UKBT repository state until Claude Code executes admission against the actual checkout. In particular, current CLAUDE.md contents, current agent configuration, current license evidence, current release status, current dependencies, and current UI must be reverified.

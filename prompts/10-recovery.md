# PROMPT 10 — INTERRUPTED RUN RECOVERY

Assume the previous agent crashed halfway through implementation.

Do not continue editing immediately.

Inspect:
- git status/diff;
- task contract;
- receipts;
- latest test output;
- generated artifacts;
- lockfile/package changes;
- running processes if relevant.

Determine the last verified state transition. If uncertain, roll back or re-baseline rather than guessing.

Produce a recovery report before resuming.

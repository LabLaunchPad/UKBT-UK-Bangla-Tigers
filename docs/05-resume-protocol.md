# Resume Protocol

After interruption:
1. inspect git status/diff;
2. inspect latest receipt;
3. inspect task state;
4. rerun a minimal integrity baseline;
5. identify exactly which state transition was completed;
6. never assume a partial edit is safe;
7. continue only from a verified checkpoint.

States are append-only where possible. A receipt is evidence of what happened, not a promise of what should have happened.

# PROMPT 06 — RELEASE GATE

Run the actual repository release/quality gates. Discover commands from the repository; do not invent them.

At minimum determine whether applicable checks exist for:
- install/lockfile integrity;
- type/check;
- unit tests;
- e2e;
- truth/provenance;
- content schema;
- routes;
- links;
- SEO;
- accessibility;
- build;
- deployment configuration;
- git cleanliness.

If a check is flaky, reproduce it and classify it. Do not convert flaky to pass/fail by preference.

Never remove or weaken a gate.

Release status is:
PASS only if all required gates pass and no blocker remains.
BLOCKED if evidence is insufficient.
FAIL if a required gate fails.

Write a complete receipt including SHA, environment fingerprint, exact commands, exit codes and artifact paths.

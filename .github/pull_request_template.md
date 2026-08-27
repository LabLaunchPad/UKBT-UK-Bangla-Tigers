<!--
UKBT PR template. Sections mirror the review questions in
docs/11-github-branch-protection.md § "What every PR must answer".
Delete a section only if it genuinely does not apply, and say why —
an empty section reads as unanswered, not as not-applicable.
-->

## What changed

<!-- One or two sentences. The behaviour, not the file list. -->

## Why

<!-- The problem this solves, or the decision it implements. Link the
     contract, receipt, evidence id, or issue that authorises it. -->

## Scope

<!-- Files/areas touched. Call out anything outside the stated intent —
     unplanned scope is a review finding, not a footnote. -->

## Risk

<!-- What could this break? What is the blast radius if it is wrong?
     "None" is a claim that needs a reason. -->

## Tests / verification

<!-- Commands actually run and their result, not "should pass".
     Never claim a check passed unless it was executed. -->

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test:unit`
- [ ] `pnpm build`
- [ ] `pnpm --filter @ukbt/web exec playwright test`
- [ ] `pnpm run check:links`
- [ ] `node scripts/check-dependency-allowlist.mjs`

## Deployment impact

<!-- Does this change the built output, routes, deploy config, or
     anything Cloudflare serves? If it changes nothing deployed, say so. -->

## Truth / content

<!-- Any new or changed organizational fact? Every one needs provenance
     (contracts/CONTENT-CONTRACT.md, truth gate T1-T8). UNKNOWN stays
     UNKNOWN — never fill a gap with a plausible-looking value. -->

## Screenshots

<!-- Required for user-visible UI change. Before/after where useful. -->

## Known unknowns

<!-- What this PR does NOT resolve, and what still blocks it. Say
     "nothing" only if that is true. -->

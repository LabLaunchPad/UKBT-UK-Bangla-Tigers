# GitHub as the enforcement layer

**Status:** ACTIVE · authored 2026-08-27
**Purpose:** make `main` a branch that cannot quietly become broken
production, and define the one path every change takes to reach it.

This document is the repository-side half of that. The other half —
the branch-protection rule itself — lives in GitHub's settings and
**must be set by a repository admin in the web UI**. It is recorded here
because a control that exists only in someone's memory is not a control.

> **Not yet applied.** As of 2026-08-27, `main` has
> `protected: false` (verified via the GitHub API, not assumed).
> Everything in § "The rule" below is `PROPOSED`, not `ACTIVE`, until an
> admin applies it and this line is amended to say so.

---

## Why this exists at all

`main` is the deployment source: Cloudflare Workers Builds is configured
with production branch `main`, so whatever lands there is what the
public eventually gets. Without protection, a single mistaken push —
by a human, or by an AI agent with repository write access — is a
production change with no review, no green CI, and no record.

The CI gate set already exists and is real (`.github/workflows/ci.yml`,
10 merge-blocking jobs). What is missing is the part that makes passing
it *mandatory* rather than *observed*.

---

## The rule

Settings → Branches → Add branch protection rule.
Branch name pattern: `main`

| Setting | Value | Why |
|---|---|---|
| Require a pull request before merging | **on** | No direct pushes. This is the whole point. |
| → Required approvals | **1** | Solo project: one real review, not a rubber stamp. |
| → Dismiss stale approvals on new push | **on** | An approval describes a diff. New commits mean a new diff, so the old approval no longer describes what would merge. |
| → Require review from Code Owners | **on** | Routes review via `.github/CODEOWNERS` so governance/deploy/truth paths always surface. |
| Require status checks to pass | **on** | See the check list below. |
| → Require branches to be up to date | **on** | Green against a stale base is not green. Forces re-run against current `main`. |
| Require conversation resolution | **on** | An unresolved thread is unfinished review, whatever the approval says. |
| Do not allow bypassing the above | **on** | Including administrators. A control an admin can skip is a suggestion. |
| Allow force pushes | **off** | Force-push destroys the reviewed history the receipts point at. |
| Allow deletions | **off** | `main` should not be deletable. |
| Require signed commits | *optional* | Real provenance benefit, real friction. Not required here; enable if you want commit authorship to be cryptographically attributable. |
| Require merge queue | **off** | Merge queues solve concurrent-PR contention on a busy branch. One contributor, one open PR — it would add machinery with nothing to serialize. Revisit if that changes. |

### Required status checks — exact names

These are the job `name:` values from `.github/workflows/ci.yml`. GitHub
only offers a check in this list **after it has reported at least once**
on a PR targeting `main`, so apply the rule after PR #1's CI has run,
then add them:

```
Install (frozen lockfile)
Governance scaffold self-test
Dependency allowlist
Lint (Biome)
Typecheck
Unit / integration tests (truth gate + content schema)
Build (tokens + Astro static output)
Internal link integrity
Playwright (structural / responsive / accessibility)
Secret scan
```

`Workers Builds: uk-bangla-tigers` (posted by Cloudflare, not by this
workflow) is deliberately **not** in the required list yet. It has never
passed, and requiring a check that has never gone green would block all
merges rather than protect anything. Add it once it has succeeded at
least once — at that point a red deployment check *should* block a merge.

### "Green" must mean "executed and passed"

A skipped job can report success to the branch-protection layer, which
turns a required check into decoration. Verified 2026-08-27 against
`.github/workflows/ci.yml`: no job carries `if:`, `paths:`,
`paths-ignore:`, or `continue-on-error:`. The single `if: always()` is on
an artifact-upload *step* (the Playwright report), which cannot mask the
test step's failure — the job still fails.

**This property must be preserved.** Adding a path filter or a job-level
conditional to a required check would silently convert it into a check
that passes by not running.

---

## The one path to production

```
feature/… | fix/… | docs/… | chore/…
        │
        ├── local verification (the same commands CI runs)
        ├── logical commits (see § Commits)
        │
        ▼
   Pull request → main
        │
        ├── CI: 10 required jobs
        ├── review (AI review is supplementary; human approval is required)
        ├── conversations resolved
        │
        ▼
   MERGE GATE — all required checks green, branch current,
                approval valid, no unresolved threads
        │
        ▼
      main
        │
        ├── CI re-runs on main
        ├── Cloudflare Workers Builds → deployment
        │
        ▼
   LIVE VERIFICATION — homepage, every route, assets, links,
                       SEO, 404, mobile
        │
        ▼
   RELEASE RECEIPT → known-good production SHA
```

Nothing reaches production except by traversing this whole path. A
change that cannot survive it is not ready, and shortening the path for
one "small" change is how the path stops meaning anything.

---

## What every PR must answer

`.github/pull_request_template.md` asks these directly:

what changed · why · scope · risk · tests actually run · deployment
impact · truth/content provenance · screenshots for UI · known unknowns

Review — human or AI — examines: correctness, regression, security,
architecture, content truth, accessibility, performance, deployment
impact, test adequacy, and scope creep. The verdict is `APPROVE`,
`REQUEST_CHANGES`, or `BLOCKED`. "Looks good" is not a review.

---

## Commits

One logical change per commit. The message says what changed and why.

```
feat: add membership section
fix: correct contact page metadata
test: add FAQ truth fixtures
docs: update deployment contract
chore: upgrade Astro
```

Not: `fix stuff`, `updates`, `final`, `final-final`, `AI fixes`.

Before committing — inspect the diff, separate intended from unintended
changes, run the relevant checks, confirm no secret is staged. After —
verify the SHA and the resulting tree. Never stage the whole working
tree without reading what is in it.

---

## When CI fails

Classify → reproduce → root-cause → fix on the branch → re-run → review
→ merge.

Never: disable the check, skip or weaken the failing test, edit CI to
ignore it, merge red, or push the fix straight to `main`. "Flake" is a
diagnosis that requires evidence, not a default explanation for an
inconvenient failure.

---

## Merge conflicts

A conflict resolution is a code change. It gets tested and reviewed like
one.

Stop → read both sides' intent → resolve semantically → run the full
relevant check set → re-read the resulting diff → push → let CI re-run →
re-review if the approval was dismissed → merge.

Never resolve by taking `--ours` or `--theirs` wholesale to make the
conflict go away. Never rewrite history on a branch someone else may
have checked out.

---

## Rollback

Cloudflare retains prior deployments; rollback targets a previous
deployment rather than rebuilding
(`contracts/DEPLOYMENT-CONTRACT.md`). Keep two SHAs known at all times:
the current release, and the last verified-good one to fall back to.

A production regression is: stop → roll back → verify the rollback
actually served → record what happened → fix via PR through the normal
path. Not: fix forward under live traffic.

---

## Limits of this document

The AI agent working in this repository **cannot** apply the branch
protection rule — the GitHub tools available to it cover branches, pull
requests, files, and checks, but expose no branch-protection or ruleset
endpoint. It also cannot approve a pull request on the owner's behalf,
and must not merge one that protection would otherwise block. Those are
owner actions by design, not gaps to be worked around.

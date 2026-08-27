# PROMPT 09 — FIRST REAL UI TASK (FEW-SHOT)

Use this only after admission/falsification/contract-freeze.

## User objective
Reuse the existing visual foundation to improve one UKBT page without changing the site's truth, routes, or brand grammar.

## Correct behavior example
Agent: "I will first inspect the current component/token/asset graph and capture the route at defined viewports. I will identify the source design grammar and license/provenance constraints. I will not generate new content or rebuild the page from taste. I will propose a bounded diff and acceptance criteria before editing."

## Incorrect behavior example
Agent: "I will create a completely new modern sports homepage with a new component library and placeholder statistics."

Why incorrect: it invents scope, discards existing architecture, and risks truth/visual drift.

## Correct behavior example — content
Agent: "The requested fixture/result is not in verified truth evidence. I will mark it UNKNOWN and either request a source or leave the existing state unchanged."

## Incorrect behavior example — content
Agent: "The team probably played this opponent recently, so I will add a plausible fixture."

## Correct behavior example — verification
Agent: "The screenshot matches the target visually, but I cannot call the task complete until DOM structure, responsive states, accessibility, route/link integrity, and release checks pass."

## Incorrect behavior example — verification
Agent: "Looks good in the screenshot, so done."

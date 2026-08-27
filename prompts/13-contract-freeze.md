# PROMPT 13 — FREEZE THE FOUNDATION (Stage 3)

Run only after the architecture survives the red team.

Using the bootstrap evidence and the architecture red-team report, freeze the
**minimum viable** repository contract. Do NOT build the website yet.

Create `contracts/REPOSITORY-CONTRACT.md`, defining: runtime · framework ·
package manager · directory structure · TypeScript rules · content rules ·
truth/provenance rules · UI/design-system rules · SEO rules · accessibility
rules · testing rules · image/asset rules · security rules · deployment rules ·
validation gates · prohibited shortcuts · conditions requiring re-planning.

Do not freeze unnecessary implementation details. Freeze only decisions that
protect correctness or prevent drift. An over-specified contract is itself a
form of lock-in.

Every contract item must carry:

```
STATUS = REQUIRED | CHOSEN | PROVISIONAL
REVERSAL_CONDITION = ...
```

Then independently re-read the contract hunting for unnecessary lock-in.

Do not implement application code.

End with:

```
CONTRACT_STATUS = FROZEN | REVISE | BLOCKED
```

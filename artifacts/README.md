# `artifacts/`

Evidence and receipts. **Never a rule source** — `artifacts/` records what
happened; `contracts/`, `CLAUDE.md`, `AGENTS.md`, `docs/` and `prompts/` say what
should. Precedence: `docs/09-repository-reconciliation.md § 2`.

| Directory | Contents | First written at |
|---|---|---|
| `bootstrap/` | discovery, architecture proposal, truth model, validation model, unknowns | Stage 1 ✅ |
| `evidence/` | `EV-YYYYMMDD-NNN.yaml` records, append-only | as facts are sourced |
| `receipts/` | task receipts per `schemas/receipt.schema.json` | Stage 4 |
| `ui/` | design system + reference analysis | Stage 5–6 |
| `pages/` | per-page contracts | Stage 7 |
| `review/` | red-team reports, adversarial replay | Stage 2, 8 |

Receipts are append-only and record real exit codes. A receipt asserting a result
without the command that produced it is not a receipt.

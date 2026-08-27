# `.claude/` — agent and tool boundaries

Created at bootstrap (2026-08-26). Not part of scaffold v2.0.0; it is the
enforcement surface for `CLAUDE.md` and `docs/06-security-protocol.md`.

| Path | Purpose | State |
|---|---|---|
| `settings.json` | Permission allow/deny lists, stage flag | active |
| `agents/` | Specialist subagent definitions | **empty by design** |
| `commands/` | Slash commands mapping to `prompts/` | active |

## 1. Single session, zero specialist agents

Bootstrap and foundation run as **one session with deterministic checkpoints
between stages**. `.claude/agents/` is intentionally empty.

`CLAUDE.md § Agent roles` lists eight roles. That is a vocabulary for *who is
accountable for what*, not an instruction to spawn eight agents. Spawning agents
to look thorough is adversarial case **ADV-004**.

A specialist agent may be added only when **all** of these hold:

1. the foundation stage has passed verification;
2. a named, observed failure mode is attributable to single-session work;
3. the agent has a narrower tool surface than the parent, not a wider one;
4. its addition is recorded as an evidence record.

The one exception already scheduled by the pipeline is the Stage-8 homepage red
team, which runs in a **separate session** specifically so it does not inherit
the implementer's assumptions. Separation of context is the point; a subagent
sharing this session's context would not deliver it.

## 2. Permission rules

- **Deny beats allow.** A deny entry is a contract. Removing one changes the
  security contract and needs its own approval.
- **`WebFetch` is denied by default.** External research is a `NETWORK_READ`
  side effect requiring per-task approval, and every retrieved claim needs an
  evidence record with a retrieval date (`docs/03-evidence-contract.md`).
- **The allow list is bootstrap-scoped.** It contains no build, test, or deploy
  commands because no build system exists yet. Extend it when Stage 3 freezes
  the contract — never pre-emptively.
- Secrets paths are denied at read time. `docs/06-security-protocol.md` also
  forbids them reaching receipts, commits, logs, or screenshots.

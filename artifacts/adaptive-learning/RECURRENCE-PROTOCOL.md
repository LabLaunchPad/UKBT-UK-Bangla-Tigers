# Recurrence Protocol — when an error returns

1. **Match the symptom** against `ERROR-CATALOG.md` (use `INDEX.yaml`
   keywords) or `docs/12-roadmap-and-open-items.md` §2.14 (BL items).
   Quote the ID in your working notes.
2. **Apply the recorded fix verbatim first.** Do not innovate around a
   verified solution; most recurrences are exact repeats (stale cache,
   skipped step, reverted file).
3. **Verify the way the entry says** (its VERIFIED-BY line), not by
   re-reading code. Measurement beats inspection (AL-017).
4. **If the recorded fix fails**, the error is new until proven
   otherwise: do NOT edit the old entry's rule. Open a new entry with
   a new ID, link the old one, and mark what differed.
5. **If the recorded fix succeeds**, strengthen the entry: add the new
   observation date; promote PROVISIONAL → VERIFIED on the second
   independent confirmation (prompt 07). Never broaden the rule beyond
   the new evidence (no overfitting).
6. **Prevention debt:** if a recurrence traces to a skipped checklist
   gate, say which one (`PREVENTION-CHECKLIST.md` P1–P13) — the fix
   includes restoring the gate, not just the code.

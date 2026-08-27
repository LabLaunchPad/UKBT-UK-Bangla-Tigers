# Evidence Contract

Every material claim uses:

```yaml
id: EV-YYYYMMDD-NNN
classification: FACT|DERIVED|OBSERVED|MEASURED|INFERRED|PROPOSED|APPROVED|UNKNOWN|STALE|SUPERSEDED|VALIDATION_RESULT
claim:
source:
source_type: repo|command|test|screenshot|external|user
retrieved_at:
verified_at:
valid_until:
scope:
method:
result:
related_files: []
related_task:
```

## Rules
- `source` must be reproducible when practical.
- Current claims require current verification.
- `valid_until` may be null only when the claim is inherently immutable; justify that choice.
- Derived evidence must reference its inputs.
- Validation results must include exact command and exit code.
- Screenshot evidence must include viewport and environment fingerprint.
- External research must include retrieval date and URL/domain.
- User-provided facts are classified as USER-SUPPLIED until independently verified if they are intended for publication.

# Task Contract

```yaml
id:
goal:
non_goals: []
requested_by:
acceptance_criteria: []
evidence_required: []
allowed_paths: []
forbidden_paths: []
allowed_commands: []
side_effect_class: NONE|LOCAL_WRITE|GIT|NETWORK_READ|NETWORK_WRITE|DEPLOY|PUBLISH
max_iterations:
max_tool_calls:
max_duration_minutes:
rollback:
reapproval_triggers: []
```

A task is invalid if goal and acceptance criteria cannot be stated without guessing.

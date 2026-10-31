# Drift check PR

The PR one drift check run opens so the human can examine its findings.

| Field | Drift check PR |
| --- | --- |
| Who opens it | The orchestrator bot, in the drift check workflow |
| Branch | A new branch from the default branch, named by `branches.drift-check` |
| What it may touch | The verification skill's CLI and Feature Map, the report file, and agent rules the human answered with fix. Never a spec |
| Review | The human, who answers each finding in the report |
| Verification evidence | For changes to the verification skill, a run of its doctor and of each feature it drove |
| Merge | The human, once the report file is deleted. Closed instead when it holds no change |

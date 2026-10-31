# Dependency update PR

A PR that updates a dependency, opened by the repo's dependency update tool.

| Field | Dependency update PR |
| --- | --- |
| Who opens it | The repo's dependency update tool |
| Branch | The tool's own branch |
| What it may touch | Dependency manifests and lockfiles, and CI piece release tags |
| Review | Each weekly drift check: the full test suite, the reviewer bot's review and the orchestrator bot's one-line verdict |
| Verification evidence | None beyond the full test suite |
| Merge | The human |

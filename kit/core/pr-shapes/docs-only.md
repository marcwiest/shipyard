# Docs-only PR

A PR that changes only documentation.

| Field | Docs-only PR |
| --- | --- |
| Who opens it | The human, or an agent working with the human |
| Branch | A new branch from the default branch |
| What it may touch | Only the docs paths the settings file names. Anything else makes it another shape |
| Review | The human reads it against the spec and the glossaries |
| Verification evidence | None. Its checks still run; build and test jobs may report skipped |
| Merge | The human |

It still goes through a PR: no direct push to the default branch.

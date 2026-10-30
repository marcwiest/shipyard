# Docs-only detection

A CI piece that detects a PR whose diff touches only docs, so the repo's build and test jobs can report skipped. It serves the [docs-only PR](../core/pr-shapes/docs-only.md).

Needs: core.
Roles: none.

## What it checks

Whether every file the PR changes matches one of the patterns in `paths.docs`. On any event other than a pull request, the answer is no.

## Using it

- Called as `marcwiest/shipyard/kit/docs-only-detection@<release tag>`, from a step in the calling CI workflow's own job.
- The calling CI workflow runs on pull request events. The job needs `contents: read` and `pull-requests: read`.
- The build and test jobs depend on that job and run only when `docs-only` is `false`. A job skipped that way reports skipped, which satisfies a required check.

| Input | Holds | Default |
| --- | --- | --- |
| `token` | The token it reads the PR's files and the settings file with | The CI workflow's own token |

| Output | Holds |
| --- | --- |
| `docs-only` | `true` when every changed file matches `paths.docs`, otherwise `false` |

Settings it reads, from the default branch: `paths.docs`.

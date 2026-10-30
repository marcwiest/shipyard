# Docs-only detection

A CI piece that detects a PR whose diff touches only docs, so the repo's build and test jobs can report skipped. It serves the [docs-only PR](../core/pr-shapes/docs-only.md).

Needs: core.
Roles: none.

## What it checks

Whether every file the PR changes matches one of the patterns in `paths.docs`. On any event other than a pull request, the answer is no.

## Using it

- Called as `marcwiest/shipyard/kit/docs-only-detection@<release tag>`, from a step in a job of the calling CI workflow. It reads through the token, so the job needs no checkout.
- The job needs `contents: read` and `pull-requests: read`.
- The job passes the step's `docs-only` output on as a job output. The build and test jobs depend on that job and run only when it is the string `false`. A job skipped that way reports skipped, which satisfies a required check.
- On a push or any other event, `docs-only` is `false`, so build and test run.
- The detection job is a required check too, beside build and test. Otherwise a failed detection skips build and test, and the skipped jobs pass the PR.

| Input | Holds | Default |
| --- | --- | --- |
| `token` | The token it reads the PR's files and the settings file with | The CI workflow's own token |

| Output | Holds |
| --- | --- |
| `docs-only` | The string `true` when every changed file matches `paths.docs`, otherwise `false` |

Settings it reads, from the default branch: `paths.docs`. A change to them takes effect once merged.

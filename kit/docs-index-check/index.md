# Docs index check

A CI piece that fails when the spec index and the spec folder disagree. It keeps core's rule that the spec index lists every spec file (see [spec writing](../core/spec-writing.md)).

Needs: core.
Roles: none.

## What it checks

- Every link in the spec index, `index.md` in `paths.specs`, to a file in the spec folder points to a file that exists.
- Every markdown file in the spec folder, subfolders included, is linked from the spec index.

Each error names the file and the fix, such as "add a link to `area.md` in the spec index" or "remove the link to `old.md`, or add the file".

It checks the PR's own spec files.

## Using it

- Called as `marcwiest/shipyard/kit/docs-index-check@<release tag>`, after a step that checks out the PR.
- The calling CI workflow runs on pull request events, and the job needs `contents: read`.

| Input | Holds | Default |
| --- | --- | --- |
| `token` | The token it reads the settings file with | The CI workflow's own token |

Settings it reads, from the default branch: `paths.specs`.

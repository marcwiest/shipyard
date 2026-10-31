# Test output cap

A CI piece that runs the repo's tests and fails the CI run when their output exceeds a cap. Large output can crash the agent that reads it.

Needs: core.
Roles: none.

## What it checks

It runs `commands.test` and counts the bytes the command prints. Above the cap, it fails and prints the start of the output with a line naming the cap and the size reached. The tests' own result fails it as usual.

It sees only output a CI run prints. A large blob that appears only when a test fails gets through until that test fails; core's [testing practice](../core/practices/testing.md) covers that case, since tests assert on small fragments.

## Using it

- Called as `marcwiest/shipyard/kit/test-output-cap@<release tag>`, in place of the step that runs the tests.
- The job checks out the PR and installs dependencies before it, and needs `contents: read`.

| Input | Holds | Default |
| --- | --- | --- |
| `cap` | The most output allowed, in bytes | `262144` (256 KB) |
| `token` | The token it reads the settings file with | The CI workflow's own token |

Settings it reads, from the default branch: `commands.test`.

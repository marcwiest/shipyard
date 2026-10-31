# Coverage floor

A CI piece that fails when test coverage drops below the floor the repo has set.

Needs: core.
Roles: none.

## What it checks

It reads the line coverage from the coverage report the repo's test step wrote, and fails when it is below `coverage-floor`. It prints the coverage it found either way. With `coverage-floor` empty, it only prints.

The floor is read from the default branch, so a PR can't change the floor that judges it. Changing the floor is a settings change of its own, merged first.

## Using it

- Called as `marcwiest/shipyard/kit/coverage-floor@<release tag>`, after the step that runs the tests with coverage on.
- The job needs `contents: read`.

| Input | Holds | Default |
| --- | --- | --- |
| `report` | The path of the coverage report | none, required |
| `format` | The report's format: `lcov` or `cobertura` | `lcov` |
| `token` | The token it reads the settings file with | The CI workflow's own token |

Settings it reads, from the default branch: `coverage-floor`.

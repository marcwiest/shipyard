# Weekly drift check

A weekly run that maintains the verification skill, flags specs, Feature Map files and agent rules that no longer match the code, and reviews dependency update PRs. The human examines its findings on a drift check PR.

Needs: core, dispatch. With the verification module, it also maintains the verification skill; without it, it skips that step.
Roles: human, orchestrator bot, reviewer bot.
Trigger: a weekly schedule the repo sets up, such as a scheduled CI workflow that starts the orchestrator bot as the role mapping says. Its trigger label, `<prefix>drift-check`, marks the drift check PR so the dispatcher can resume it.

## Contents

- [Drift check workflow](workflow.md): the steps of one run, and what it may and may not edit.
- [Drift check PR](pr-shapes/drift-check.md): the PR each run opens for the human.
- [Dependency update PR](pr-shapes/dependency-update.md): the PRs a dependency update tool opens, which each run reviews.

Settings it reads: `roles`, `paths`, `branches.drift-check`, `commands` and `notify`.

# Building

Builds an approved plan on the PR that holds it, one phase at a time: the orchestrator bot splits the plan into phases and briefs the builder bot, the builder bot builds each phase, and the reviewer bot reviews it.

Needs: core, dispatch.
Roles: human, orchestrator bot, builder bot, reviewer bot.
Trigger label: `<prefix>build`. The dispatcher starts the orchestrator bot.

## Contents

- [Build workflow](workflow.md): every step from intake to handoff, with its done condition.
- [Phased PR](pr-shapes/phased.md): the PR shape the workflow produces. It holds its own plan.
- [Phases](phases.md): the phase brief, the restatement, building a phase, the spec rule, spikes and the phase report.
- [Review and fixes](review.md): preflight, review, the phase verdict, fix rounds and repo fixes.
- [PR comments](pr-comments.md): the PR body, the status comment and the headed comments.
- [Runs](runs.md): run handling, sizing and the Sizing log.

Settings it reads: `roles`, `paths.plans`, `paths.sizing-log`, `branches`, `commands` and `seams`.

# Building

Builds an approved plan on the PR that holds it, one phase at a time: the orchestrator bot splits the plan into phases and briefs the builder bot, the builder bot builds each phase, and the reviewer bot reviews it.

Needs: core, dispatch.
Roles: human, orchestrator bot, builder bot, reviewer bot.

Holds:

- the build workflow, from intake to handoff
- the phased PR shape, which holds its own plan
- the phase brief, the restatement and the spec rule
- fix rules: a blocking finding cites a plan or spec line, and a spec question stops the work
- PR comment conventions: one status comment edited in place, and comments headed `Phase N · preflight`, `Phase N · verification`, `Phase N · review` and `Handoff`
- spikes, run handling and the Sizing log columns

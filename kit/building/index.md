# Building

Builds an approved plan on the PR that holds it, one phase at a time: the orchestrator bot splits the plan into phases and briefs the builder bot, the builder bot builds each phase, and the reviewer bot reviews it.

Needs: core, dispatch.
Roles: human, orchestrator bot, builder bot, reviewer bot.

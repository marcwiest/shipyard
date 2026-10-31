# Phased PR

A PR that builds one plan, phase by phase. It holds its own plan: there is no separate PR for the plan.

| Field | Phased PR |
| --- | --- |
| Who opens it | The human, or the planning agent at the human's ask, from the plan's branch once the plan may be public |
| Branch | The plan's branch, named by `branches.plan` in the settings file. It holds the plan file and all of the plan's work |
| What it may touch | The plan file, and for each phase the scope its preflight set |
| Review | Each phase: the reviewer bot's advisory review and the orchestrator bot's phase verdict. At handoff, the plan's human, for intent |
| Verification evidence | What each Change's Evidence line names, captured by the builder bot and judged by the orchestrator bot. The PR gets only verification lines |
| Merge | The plan's human, after the handoff |

The human adds the trigger label `<prefix>build` to this PR once the plan is approved; the [build workflow](../workflow.md) runs on it.

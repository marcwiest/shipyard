# Roles

| Role | Does |
| --- | --- |
| Human | Writes plans with the planning agent, gives the go with a trigger label, answers human steps and spec questions, merges, releases. |
| Planning agent | Drafts the plan with the human in an interactive session. |
| Orchestrator bot | Runs intake, writes phase briefs, launches the builder bot, gives the phase verdict, keeps the plan record and the status comment, escalates to the plan's human. |
| Builder bot | Builds one phase: restatement, spec, tests, code, verification, phase report. |
| Reviewer bot | Runs preflight and reviews each phase. Its review is advisory. |

One or more people can fill the human role. Each plan names its human, by default the person who wrote it. That person gets the plan's questions and its handoff.

Bots run unattended. The human and the planning agent work together interactively.

## Role mapping

An adopting repo states which tool fills each role and how each tool is started, in its settings file. Each role lists the capabilities its tool needs (see [agent use](agent-use.md)). Shipyard ships the maintainer's role mapping as an example:

| Role | Tool |
| --- | --- |
| Planning agent | A local CLI agent (Claude Code or Grok CLI) |
| Orchestrator bot | The maintainer's Coding bot |
| Builder bot | A Cursor cloud agent on a pinned Grok model |
| Reviewer bot | The Claude GitHub Action |

The maintainer's setup also has a Chief of Staff bot, which routes work and keeps the backlog, and one Project Management bot per project, which checks plans with the human and relays approval. Neither is a role.

**Today:** `docs/init/` names the maintainer's bots throughout instead of roles.

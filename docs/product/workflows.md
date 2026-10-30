# Workflows, PR shapes and practices

Shipyard's content comes in three kinds:

- **Workflow**: a process from a trigger to an outcome. Each workflow names its trigger, its steps, the roles that take part and the PR shapes it produces.
- **PR shape**: the structure of one kind of PR. Every PR shape fills the same fields: who opens it, branch, what it may touch, review, verification evidence and merge.
- **Practice**: rules shared by all workflows.

Workflows, PR shapes and practices hold only mechanics. Opinions go into [house rules](house-rules.md).

## Mechanics

- The plan format, which names the plan's human, and the plan check.
- Trigger, hold and waiting labels, and the dispatcher (see [agent use](agent-use.md)). A plan is built on the PR that holds it.
- Commits tagged by phase, so each phase can be reviewed on its own.
- PR comment conventions: one status comment edited in place, fixed phase headers (`Phase N · preflight`, `Phase N · verification`, `Phase N · review`, `Handoff`), and a handoff comment.
- Fix rules: a blocking finding cites a plan or spec line, and a spec question stops the work.
- A spec conflict between plans goes to the human of the plan whose branch hit it.
- Each skill has one source file plus discovery stubs, and a CI check confirms the stubs.
- CI pieces: docs-only detection, a test output cap, a docs index check and a coverage floor.
- The verification skill's shape: a CLI in the repo, a Feature Map, and minimum verification evidence per surface.
- Test-change signals.
- The Sizing log columns.
- A place for specs that tests can cite, and a place for agent rules.

**Today:** this page states rules that belong in the kit. They move there, and the spec keeps a description of what the kit contains (see [shape](shape.md)). `docs/init/` mixes mechanics and opinions and doesn't use this structure. What it describes:

- Workflows: planning, building (the phased PR) and the weekly drift check. Bootstrap is planned.
- PR shapes: plan PR, phased PR, docs-only PR, dependency update PR and hotfix PR.
- Practices: git, testing, verification, and knowledge and planning.

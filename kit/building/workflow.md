# Build workflow

- Trigger: the human adds `<prefix>build` to the PR that holds an approved plan, one with Status `ready`. The dispatcher starts the orchestrator bot on that PR.
- Roles: the orchestrator bot runs the workflow. The builder bot builds each phase, the reviewer bot runs preflight and review, and the plan's human answers human steps and takes the handoff.
- Produces: a [phased PR](pr-shapes/phased.md).

The orchestrator bot checks for the hold label before each step (see the dispatch module's labels). Human steps go on the PR as the dispatch module's human steps on a PR say.

## Intake

1. The orchestrator bot reads the plan, the specs, the kit glossary, the repo's glossary and the agent rules. It runs the plan check, and checks the plan against the repo: Changes that contradict the spec, paths or seams that don't exist, Evidence lines the repo can't produce. Each gap is a human step; only the human changes the Goal or the Changes. Done condition: the status comment, holding intake's result.
2. It splits the Changes into phases, writes them into the plan's Phases section and sets Status `in progress`. A Change that builds on another goes in the same phase or a later one. Each phase's heading ends with its estimate in hours (see [runs](runs.md)), such as `· about 2 h`. It runs the plan check again and fixes what it lists. Done condition: a `chore(plan): phases` commit.

## Each phase

Phases run in order, never in parallel. Each starts from the branch as the previous phase left it.

3. Branch update: if the branch is behind the default branch, the orchestrator bot merges the default branch into it, never rebases. A conflict goes to the reviewer bot, which names the conflicting files and how to resolve them, then to the builder bot as a fix round. A conflict in the spec folder is a human step. Done condition: the branch is not behind the default branch.
4. Preflight: the orchestrator bot asks the reviewer bot for preflight of the phase (see [review and fixes](review.md)). Done condition: the `Phase N · preflight` comment.
5. Open questions: the orchestrator bot answers preflight's open questions from the plan, the spec, the agent rules and the settings file, and records each answer and its source in the status comment. A question it can't answer is a human step. Done condition: every open question answered in the status comment.
6. Brief: the orchestrator bot writes the phase brief (see [phases](phases.md)) and starts the builder bot with it. Done condition: the phase's line in the status comment reads `running`.
7. Build: the builder bot restates the phase, the orchestrator bot checks the restatement, and the builder bot builds and verifies the phase and ends with its phase report (see [phases](phases.md)). Done condition: the phase's commits pushed, and its line reads `finished, awaiting review`.
8. Checks: the repo's CI checks pass on the branch's newest commit. A failure goes back to the builder bot as a fix round. Done condition: green checks on the newest commit.
9. Review: the orchestrator bot asks the reviewer bot to review the phase, reviews it itself and gives the phase verdict (see [review and fixes](review.md)). Done condition: the `Phase N · review` and `Phase N · verification` comments, and the verdict on the phase's line.
10. Fix rounds: blocking findings go back to the builder bot, then steps 8 and 9 repeat on the fix commits. Done condition: the phase's line reads `passed`.
11. Plan record: the orchestrator bot ticks the phase's boxes, adds its Notes line and, where the Sizing log lives in the repo, its row. The last phase's plan record also sets Status `done`. Done condition: a `chore(phase-N): plan record` commit.

## Handoff

12. The orchestrator bot runs the branch update once more, posts the `Handoff` comment (see [PR comments](pr-comments.md)) and notifies the plan's human as `notify` in the settings file says. Done condition: the `Handoff` comment.
13. Human step: the human reviews the PR for intent and merges it, or asks for changes on the PR. A change the human asks for is a fix round, or a spec question if it changes a Change.

There is no review of the whole PR at the end; each phase was reviewed on its own. Outside human steps and spec questions, the human hears nothing until the handoff.

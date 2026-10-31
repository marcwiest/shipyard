# Phases

How one phase is briefed, built and reported. Steps 6 and 7 of the [build workflow](workflow.md).

## Phase brief

The orchestrator bot's instructions to the builder bot for one phase, given when it starts the builder bot, as the role mapping says. It is not posted on the PR; a fresh orchestrator bot writes it again from the plan, the preflight comment and the status comment. It holds:

- the phase's goal and done condition, and one line on the whole plan for orientation
- the Changes the phase delivers, with their Spec and Evidence lines, and the phase's Tests and Code boxes or its Work box
- facts already resolved, such as paths, versions, constraints and the answers to preflight's open questions
- the scope preflight set: the files and folders the phase may touch
- the commit prefixes for the phase (see core's [git practice](../core/practices/git.md))
- what to read first: the AGENTS.md block, the spec index and the agent rules index
- what is off limits: everything agents never do under the git practice, and editing the plan file, which the orchestrator bot keeps
- the phase report to end with

## Restatement

- Before any change, the builder bot states its phase in its own words: the goal, the Changes, the scope, and how it will show the phase is done.
- The orchestrator bot checks the restatement against the plan and the brief. On a match, it tells the builder bot to go on.
- A mismatch stops the phase before any change. The orchestrator bot corrects the brief and starts again. If the plan itself is unclear, it is a spec question.
- The human sees a restatement only when the orchestrator bot can't tell whether it matches, as a human step.

## Building a phase

The builder bot, in order:

1. Reads what the brief names first, then only the files its work needs.
2. Writes the spec text the phase's Spec lines call for, within the spec rule. Commit: `spec(phase-N):`.
3. Writes the tests at the seam the phase's Tests box names, and the code that makes them pass. Commits: `test(phase-N):`, then `feat(phase-N):` or `fix(phase-N):`. The test commit comes first, so review can see the tests were written before the code. For a phase with a Work box, it makes the change the box names instead: changes to files in the settings file's docs paths in `docs(phase-N):` commits, any other change in `feat(phase-N):` or `fix(phase-N):`.
4. Runs the repo's checks and tests with the commands in the settings file.
5. Verifies each Change the phase delivers as its Evidence line and the repo's minimums say (see core's [verification practice](../core/practices/verification.md)).
6. Pushes its commits and ends with the phase report.

- It touches only files inside the phase's scope.
- A question it can't answer from the brief, the plan, the spec and the agent rules stops the phase. It reports the question instead of guessing, and the orchestrator bot answers it or makes it a human step.

## Spec rule

The builder bot writes spec text without asking only when all of these hold:

- It states only behavior the phase's Spec lines name. Anything a user would notice that they don't name, such as a new option, limit, default, message or step, needs the human.
- It changes or removes nothing already in the spec.
- It doesn't touch the spec index's principles or the later file.

Otherwise, or when unsure, it stops and reports, and the orchestrator bot makes it a human step. Every line it writes that no Spec line called for is an extra spec line, listed in the phase report.

## Spikes

- A spike answers an implementation question with evidence: how, or whether, something works. It never answers a spec or intent question; those go to the human.
- Spikes are the builder bot's own. They are never shown to the human for review or choice.
- A spike runs in a git worktree on a throwaway local branch, or for a tiny experiment in a temporary folder outside the repo. Its branch is never pushed, and the worktree is removed once the spike has served its purpose.
- Its finding goes in the phase report; the orchestrator bot adds it to the phase's Notes line.

## Phase report

The builder bot's closing account of the phase, to the orchestrator bot:

- what changed
- the result of each check run
- the extra spec lines
- each change to an existing test, with its reason (see core's [testing practice](../core/practices/testing.md))
- the evidence list (see core's [verification practice](../core/practices/verification.md))
- spike findings
- any question it stopped on

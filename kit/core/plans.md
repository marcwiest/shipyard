# Plans

A plan states one piece of intended work. It is a file in the plans folder the settings file names, one file per plan, copied from [the plan template](templates/plan.md). Once done, it is the record of what got done.

## Planning workflow

- Trigger: the human starts a session with the planning agent.
- Roles: the human and the planning agent.
- Steps:
  1. The planning agent reads the specs, the kit glossary, the repo's glossary and the agent rules, and the north star where the repo has one.
  2. The human and the planning agent draft the plan. The human states the intent; the planning agent writes it down as Changes.
  3. The planning agent runs the plan check and fixes what it lists. Done condition: the check lists nothing missing.
  4. Human step: the human approves the plan by setting its Status to `ready`.
- Outcome: an approved plan. Starting work on it is a separate trigger, named by the workflow that builds it.

In a public repo, a plan is public once its branch is pushed. Keep it unpushed until it is ready to be.

## Plan format

Header lines:

- **Status**: `draft`, `ready`, `in progress` or `done`. The human sets `ready`; whoever builds the plan keeps it after that. Status is never a trigger.
- **Human**: the person who owns the plan's intent and answers its questions. By default, its author.
- **Goal**: one sentence on what changes for the user.
- **Specs touched**: the spec files the Changes edit.
- **Out of scope**: what the plan leaves alone.

Changes: the human's intent, approved with the plan. Each is a checkbox with two parts:

- **Spec line**: what the spec says after the Change.
- **Evidence line**: the verification evidence that proves it. Checks are always required and not listed.

Phases: added before building starts, by whoever builds the plan. Each phase delivers one or more Changes and is built and reviewed on its own. Each has:

- a heading naming the Changes it delivers
- a Tests box naming the seam and the behavior the tests assert
- a Code box naming what makes the tests pass
- a Notes line, added when the phase is done: the verification line, deviations, blockers, and answers that changed how the work was done

## Who changes what

- Only the human changes the Goal and the Changes.
- Whoever builds the plan writes and owns the phases, keeps the Status line, ticks the boxes and adds each phase's Notes line in the plan record commit.
- The PR is the working channel for questions, reviews and the handoff. The plan keeps only what the record needs.

## Plan check

An inspection of a plan for its required items. It lists what is missing and never judges plan quality.

Required before approval:

- Status, Human, Goal, Specs touched and Out of scope lines
- at least one Change
- each Change has a Spec line and an Evidence line, and the Evidence line names concrete verification evidence: what is driven and what is captured

Required once phases exist:

- each phase names the Changes it delivers
- each phase has a Tests box naming a seam, and a Code box
- together the phases deliver every Change

The planning agent runs it before the human approves the plan. Whoever adds the phases runs it again after adding them.

## Several plans

Plans don't block each other. Each has its own file, branch and PR. A spec conflict between plans goes to the human of the plan whose branch hit it.

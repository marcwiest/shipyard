# Review and fixes

Steps 4, 9 and 10 of the [build workflow](workflow.md).

## Preflight

- The reviewer bot reads one phase of the plan against the spec before it is built. It doesn't review code.
- It posts `Phase N · preflight`: the open questions for the orchestrator bot, and the phase's scope, the files and folders it may touch.
- Preflight stays light: open questions and scope only. An adversarial review of a plan not yet built makes agents invent risks.
- The orchestrator bot refines the phase's hour estimate from the scope, on the phase's line in the status comment.

## Review

- Once the checks pass, the orchestrator bot asks the reviewer bot to review the phase's commits, found by their phase prefix.
- The reviewer bot puts line-level findings in inline review comments, and posts `Phase N · review`: each finding marked blocking or nit, with the plan or spec line it cites. It looks for the test-change signals. It doesn't judge verification evidence.
- The reviewer bot's review is advisory and is never a required check: a required check counts only on the PR's newest commit, which lands after the last review.

## Phase verdict

The orchestrator bot reviews the phase itself, then gives one verdict from its own reading, the review and the verification evidence:

- The spec commit first, found by its `spec(phase-N):` prefix, against the Spec lines of the Changes the phase delivers. A mismatch is a fix round before tests and code are judged.
- Each change to an existing test, against its stated reason.
- The evidence list, against each Change's Evidence line and the repo's minimums. It opens only the evidence it needs. When it doubts the evidence, it starts a fresh builder bot to rerun the verification. Missing or weak evidence is a blocking finding.
- The extra spec lines. Any line it doubts is a human step.
- Any change outside the phase's scope is a blocking finding.

It posts `Phase N · verification` with one verification line per verified Change, and puts the verdict on the phase's line in the status comment.

## Findings

- A blocking finding cites a plan or spec line. A finding without one is a nit: nits are batched or dropped and never start a fix round on their own.
- When the reviewer bot and the orchestrator bot disagree, the spec decides. When the spec doesn't cover it, it is a spec question.
- A review thread is resolved once its fix lands, so an open thread always means open work.

## Fix rounds

- A fix round brings code and tests back in line with the spec. It never changes the spec, and spec text never changes to suit a fix.
- It goes to the builder bot as [runs](runs.md) says. Its commits are `fix(phase-N):`, and the reviewer bot re-reviews only those.
- Fix rounds have no cap. A finding that comes back after its fix points to an unclear spec or plan, and goes to the plan's human as a human step.
- A finding that the spec itself is wrong, unclear or can't be built is not a fix round. It is a spec question.

## Repo fixes

A mistake repeated across phases or PRs gets a repo fix, tried in this order: architecture, types, lint or CI, a test, docs. The orchestrator bot proposes it in the handoff, for a plan of its own.

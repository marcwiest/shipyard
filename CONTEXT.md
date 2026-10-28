# Context

Glossary for shipyard. One entry per term, one or two sentences each. `docs/init/` predates this glossary; where its terms differ, this glossary wins.

## Roles

- **Human**: The person or people who write plans with the planning agent, merge and release. Each plan names its human, who answers that plan's questions. _Avoid_: owner.
- **Planning agent**: The interactive agent the human drafts a plan with. _Avoid_: planner.
- **Orchestrator bot**: The bot that runs intake, briefs the builder bot for each phase, gives the phase verdict and keeps the plan record. _Avoid_: Coding bot, orchestrator.
- **Builder bot**: The bot that builds one phase. _Avoid_: cloud agent, build agent, phase agent.
- **Reviewer bot**: The bot that runs preflight and reviews each phase; its review is advisory. _Avoid_: Claude review.
- **Role mapping**: A table naming the tool that fills each role in one setup. _Avoid_: reference setup.

## Structure

- **Workflow**: A process from a trigger to an outcome, such as planning, building or bootstrap. It produces PRs of one or more PR shapes.
- **Trigger**: The event that starts a workflow; each workflow names its own. _Avoid_: go.
- **PR shape**: The structure of one kind of PR, given by the same fields for every shape: who opens it, branch, what it may touch, review, verification evidence and merge.
- **Practice**: Rules shared by all workflows, such as git, testing or verification.
- **House rules**: Opinions a person or an adopting repo layers on top of the workflows. Shipyard ships the maintainer's as an example. _Avoid_: preferences.
- **Adopting repo**: A repo that uses shipyard. _Avoid_: host repo, consuming repo, product repo.
- **CI workflow**: A GitHub Actions workflow. Always called this, never just "workflow".
- **Bootstrap**: The workflow that starts or straightens out a codebase by working through ordered questions into its specs and agent rules.

## Specs and plans

- **Spec**: The text in `docs/product/` that states what the codebase does and refuses. Tests can cite it.
- **Today note**: A note in a spec marking where code and spec differ; deleted when the gap closes.
- **North star**: Where the codebase is heading, and why.
- **Plan**: A file stating one piece of intended work: its human, goal, Changes and phases. Once done, it is the record of what got done.
- **Change**: One item of the human's intent in a plan, made of a Spec line and an Evidence line.
- **Spec line**: The part of a Change that states what the spec will say after it.
- **Evidence line**: The part of a Change that names the verification evidence proving it. Checks are always required and not listed. _Avoid_: Proof line.
- **Plan check**: An inspection of a plan for its required items. It never judges plan quality.
- **Intake**: The orchestrator bot checks an approved plan against the repo, raises gaps with the plan's human, and splits the Changes into phases.

## Phases

- **Phase**: One step of a plan, built and reviewed on its own. It delivers one or more Changes.
- **Preflight**: The reviewer bot reads one phase against the specs before it is built, lists open questions and sets the phase's scope.
- **Phase brief**: The orchestrator bot's instructions to the builder bot for one phase: goal, resolved facts, scope and limits.
- **Restatement**: The builder bot's own-words summary of its phase, checked against the plan before any change.
- **Spec rule**: When the builder bot may write spec text without asking: only behavior the plan names, and nothing existing changed or removed. _Avoid_: docs rule.
- **Extra spec lines**: Spec text the builder bot wrote that no Spec line called for. Listed in the phase report for review. _Avoid_: unplanned spec lines.
- **Seam**: Where tests touch the code, such as a package's exports or an app's routes. Each repo names its own.
- **Spike**: A throwaway experiment the builder bot runs to learn how something works. It never lands in the PR.
- **Phase report**: The builder bot's closing summary: what changed, check results, extra spec lines, test changes with reasons, the evidence list and spike findings. _Avoid_: closing summary.
- **Review**: The reviewer bot's findings on a phase's code and spec.
- **Blocking finding**: A finding that cites a plan or spec line and must be fixed. Findings without one are nits.
- **Phase verdict**: The orchestrator bot's combined judgment of a phase, from its own reading, the review and the verification evidence.
- **Fix round**: A pass where the builder bot brings code and tests back in line with the spec. It never changes the spec.
- **Spec question**: A finding that the spec itself is wrong, unclear or can't be built. Work stops and the plan's human decides.
- **Plan record**: The orchestrator bot's commit that ticks a finished phase's boxes and adds its notes to the plan.
- **Status comment**: The one PR comment the orchestrator bot edits in place with phase status and open questions.
- **Handoff**: The final PR comment that hands finished work to the plan's human.
- **Repo fix**: A change that stops a repeated mistake, tried in order: architecture, types, lint or CI, a test, docs.
- **Sizing log**: One row per phase comparing estimated hours with what the run took.

## Verification

- **Check**: An inspection that doesn't run the real thing, such as types, build, tests, a plan check or a drift check.
- **Verification**: Running the real artifact the way a user or consumer would and capturing what happened. Tests are not verification.
- **Verification evidence**: What a verification run captures: screenshots, traces, requests and responses, transcripts. _Avoid_: proof.
- **Evidence list**: The part of the phase report naming each piece of verification evidence: what was driven, the file, what it shows.
- **Verification line**: One line of text on the PR saying what was verified and how.
- **Feature Map**: The verification skill's index of features: how to reach and drive each one, and what end state proves it works.
- **Test-change signals**: Signs a test change weakens a test: a looser assertion, a deleted case whose code remains, changed expected values under an unchanged name, a test that reads internals.
- **Weekly drift check**: A weekly run per active repo that maintains the verification skill, flags specs and agent rules that no longer match the code, and reviews dependency update PRs. _Avoid_: weekly drift report.
- **Discovery stub**: A small per-tool skill file that points to the skill's single source file.

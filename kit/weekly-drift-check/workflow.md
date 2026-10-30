# Drift check workflow

- Trigger: the weekly schedule starts the orchestrator bot. If a drift check PR is still open, the run stops and notifies the human, as `notify` in the settings file says, that the last one waits.
- Roles: the orchestrator bot runs it, the reviewer bot reviews dependency update PRs, and the human examines the findings.
- Produces: a [drift check PR](pr-shapes/drift-check.md), and a verdict on each open [dependency update PR](pr-shapes/dependency-update.md).

Once the drift check PR exists, the orchestrator bot checks for the hold and waiting labels before each step (see the dispatch module's labels).

## Steps

1. Branch: the orchestrator bot starts a branch from the default branch, named by `branches.drift-check`. Done condition: the branch.
2. Verification skill: skipped when the repo has none, at `paths.verification-skill`. Otherwise the orchestrator bot runs the skill's doctor, drives each feature the Feature Map lists, and brings the verification CLI and the Feature Map back in line with the codebase: commands that no longer work, and features added, changed or removed. Done condition: its `fix:` commits on the branch, or none needed.
3. Drift: the orchestrator bot compares the specs, the Feature Map and the agent rules, with their drift-risk list where they have one, against the code. Each mismatch is a finding: the file and line, what it says, what the code does, and a recommendation: plan, fix or ignore. Done condition: none on its own; the findings go in the report.
4. Dependency update PRs: for each open one, the full test suite runs on it; where the repo's CI runs only part of the suite, the orchestrator bot runs the rest on that PR's branch first. The reviewer bot reviews it, and the orchestrator bot posts a one-line verdict headed `Drift check · verdict`, marking a PR with failing checks "needs a look". Done condition: a verdict comment on each open dependency update PR.
5. Report: the orchestrator bot commits a report file, `drift-<date>.md` in the plans folder: what step 2 changed or why it was skipped, each finding with its recommendation, and each dependency update PR with its verdict. If there is nothing to report, it deletes the branch and the run ends here. Done condition: a `docs: drift report` commit.
6. PR: the orchestrator bot opens the drift check PR from the branch, adds the waiting label and then `<prefix>drift-check`, and posts a `Human step` comment asking the human to answer each finding with plan, fix or ignore. Done condition: the PR with its `Human step` comment.
7. Human step: the human examines the report and answers each finding, on the PR or through the answer skill.
8. Close out: the orchestrator bot fixes each Feature Map or agent rules finding the human answered with fix, and deletes the report file. Findings answered with plan are the human's to plan. Done condition: a `docs: remove drift report` commit.
9. Human step: the human merges the PR, or closes it if it holds no change. The report never lands on the default branch.

## What it may edit

- May: the verification skill's CLI and Feature Map; the report file on its own branch; agent rules where the human answered fix; comments on dependency update PRs.
- Never: a spec, since specs are the human's intent; a finding about a spec is answered with plan or ignore; the codebase outside the verification skill; the contents of a dependency update PR; any merge.

## Drift-risk list

The agent rules may list areas prone to drift, such as generated files or a mirrored config. Each run checks them. An area that keeps drifting gets a repo fix, ideally a deterministic check, and leaves the list.

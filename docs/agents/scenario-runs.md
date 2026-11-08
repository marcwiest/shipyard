# Scenario runs

Before each release, an agent runs these scenarios and reports on the release's PR. Each checks that an agent with no shipyard context can install and use the release by [the guide](../guide/index.md) alone. They stay few while shipyard is early; real use in adopting repos is the main test.

## The sample repo

Each scenario starts from a sample repo created fresh from this description, in an empty folder outside any other repo:

- a git repo with a default branch, `main`, and no remote
- a README saying what the repo does and how to run its test
- one small script, such as a function that formats a duration, and one test for it, run by one command
- no shipyard files: no `.shipyard/` and no `AGENTS.md`

Everything is committed before the scenario starts.

## Running a scenario

- The release's package is the tarball `npm pack` writes from the release commit. It stands in for the published package: the fresh agent runs `npx --package <tarball> shipyard-kit` wherever the guide says `npx shipyard-kit@x.y.z`.
- Each scenario is carried out by a fresh agent with no shipyard context. It gets the guide's path, the tarball's path, the sample repo's path and the scenario's prompt, and nothing else.
- The agent running the scenarios plays the human. It answers the fresh agent's spec questions, approves the plan, and does the steps the kit gives the human. Since the sample repo has no remote, a plan ends approved and committed on its branch, with no PR.
- If the fresh agent's tools can't commit, it lists each commit it would make, with its message and files, and the agent running the scenarios makes them in that order. The criteria are judged on that list.
- The agent running the scenarios keeps the fresh agent's transcript, then throws away the sample repo, the tarball and the transcript once the report is posted.

## The scenarios

### 1. Adopt core and plan a code change

Prompt: the guide's adopt prompt for core alone, at the release, then: "Then plan a small change to the script", naming one, such as accepting negative durations.

### 2. Adopt core and plan a docs-only change

Prompt: the guide's adopt prompt for core alone, at the release, then: "Then plan a docs-only change to the README", naming one, such as adding a usage example.

### 3. Update from the previous release

Before it starts, the sample repo gets core installed from the previous release with that release's CLI, and the install committed. For the first release, there is no previous one: the agent running the scenarios copies core by hand from an older kit commit, following the guide's by-hand steps, so the update has files to change.

Prompt: the guide's update prompt, at the release.

## When a scenario passes

An adopt scenario passes when:

- the install matches the guide: core in `.shipyard/`, a filled settings file, the `AGENTS.md` block, the copied templates, and a version record whose checksums match the files
- the CLI's writes are committed on their own
- the plan passes the [plan check](../../kit/core/plans.md#plan-check)
- the fresh agent asked nothing outside the human's steps and spec questions

The update scenario passes when:

- the CLI's writes are committed on their own
- each next step is done in its own commit
- a second `update` writes nothing
- the fresh agent asked nothing outside the human's steps

## The report

One comment on the release's PR: for each scenario, each criterion's result and the friction points, meaning anything the fresh agent got wrong, guessed at or worked around. The human examines it before tagging. Friction the human accepts is fixed on the release's branch, and a scenario that failed a criterion runs again.

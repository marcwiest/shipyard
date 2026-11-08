# The first release, 0.1.0

Status: ready
Human: marcwiest
Goal: an adopter can install shipyard's core and its reference modules from npm as `shipyard-kit@0.1.0`, after scenario runs, a consistency read and a link check have passed, and the docs say plainly that the bots don't run yet.
Specs touched: `docs/product/shape.md`, `docs/product/adoption.md`, `docs/product/index.md`, and any spec a finding of the consistency read that the human accepts edits
Out of scope: the bots, skills, the dispatcher and CI pieces; tagging, publishing to npm and the GitHub release, which are the human's; shipyard installing its own release, a follow-up once `0.1.0` is on npm; scenarios for modules beyond core; a CI job that runs the scenarios or the link check. The scenarios file is kept; the sample repos, tarballs, transcripts and the link-check script are thrown away.

## Changes

- [ ] 1. Spec: none; `docs/agents/scenario-runs.md` holds the scenario runs. It describes the sample repo, created fresh from that description for each run: a small git repo with a README, one script and one test, a default branch, no remote and no shipyard files. Each scenario is carried out by a fresh agent with no shipyard context, given only the guide and the release's packed tarball in place of the published package; the agent running the scenarios plays the human, answering spec questions and approving the plan. Three scenarios: adopt core with the CLI and plan a small code change to the script; adopt core with the CLI and plan a docs-only change to the README; and update, from the previous release installed with its CLI or, for the first release, from a copy made by hand from an older kit commit, following the guide's update prompt. An adopt scenario passes when the install matches the guide (core in `.shipyard/`, a filled settings file, the AGENTS.md block, the copied templates and a version record whose checksums match), the CLI's writes are committed on their own, the plan passes the plan check, and the fresh agent asked nothing outside human steps and spec questions. The update scenario passes when the CLI's writes are committed on their own, each next step is done in its own commit, a second `update` writes nothing, and the fresh agent asked nothing outside human steps. The report lists each criterion's result and the friction points, posted on the release's PR for the human to examine before tagging · Evidence: run the three scenarios from the tarball of this plan's release commit; capture each criterion's result and each friction list on the PR. Friction the human accepts is fixed on this branch, and a scenario that failed a criterion runs again
- [ ] 2. Spec: none; the release steps in `docs/agents/releasing.md` link the scenario runs among the checks before a release, and their publish step says that npm may hold the publish until the human approves it on npmjs.com, and the version isn't public until then · Evidence: open the link it adds; run `npm view shipyard-kit` and capture the description of the placeholder npm's staged publishing left when the name was reserved
- [ ] 3. Spec: none; the kit, `docs/product/`, the guide and the README use no term without a glossary entry and give no rule more than one home, except findings the human chose to keep · Evidence: a fresh agent reads them together and lists its findings; capture the list and the human's call on each on the PR, then the fixes on this branch
- [ ] 4. Spec: none; every relative link and anchor in the tracked markdown resolves · Evidence: a throwaway script resolves each relative link and its anchor across the tracked markdown; capture its output, listing none broken, after the other Changes' edits
- [ ] 5. Spec: the Today notes in `shape.md` and `adoption.md`, and the spec index's Status, say `0.1.0` is the first release and the CLI installs it from npm, that scenario runs passed before it, and that shipyard doesn't install its own release yet. The guide and the README drop what they say about the time before the first release, and keep saying that the bots don't run yet · Evidence: search the tracked docs for "no release" and "Before that release"; capture that none is left; read the guide's "What works today" and the README's Status; capture both
- [ ] 6. Spec: none; in the release commit, `chore: release 0.1.0`, `package.json`'s version is `0.1.0` and the changelog's Unreleased heading reads `## 0.1.0`, with an empty "What a repo must do" list · Evidence: `npm pack --dry-run` on the branch; capture the name, version and file list it prints; from the tarball, run `--version` and capture `0.1.0`; capture the changelog slice the update scenario prints

## Open questions

## Phases

### Phase 1: the scenario runs and the release steps · delivers Changes 1, 2 · about 1.5 h
- [ ] Work: `docs/agents/scenario-runs.md`, linked from the release steps and the agent rules index; the release steps' publish step on npm's staged publishing. Docs only, so no seam reaches it

Notes:

### Phase 2: the docs say `0.1.0` is out · delivers Change 5 · about 1 h
- [ ] Work: the Today notes in `shape.md` and `adoption.md`, the spec index's Status, and the guide's and README's wording about the time before the first release. Docs only, so no seam reaches it

Notes:

### Phase 3: the consistency read · delivers Change 3 · about 2 h
- [ ] Work: a fresh agent reads the kit, `docs/product/`, the guide and the README for terms without a glossary entry and rules with more than one home; the human decides each finding on the PR, and the accepted ones are fixed. Docs only, so no seam reaches it

Notes:

### Phase 4: the release commit · delivers Change 6 · about 0.5 h
- [ ] Work: `package.json`'s version and the changelog's heading, in `chore: release 0.1.0`. Release metadata only; the CLI's tests read neither

Notes:

### Phase 5: run the scenarios · delivers Change 1 · about 3 h
- [ ] Work: the three scenarios, run by fresh agents from the tarball of the release commit, with the report on the PR and the friction the human accepts fixed. Runs and docs only, so no seam reaches it

Notes:

### Phase 6: the link check · delivers Change 4 · about 0.5 h
- [ ] Work: a throwaway script resolves every relative link and anchor in the tracked markdown, and broken ones are fixed. Docs only, so no seam reaches it

Notes:

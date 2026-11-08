# The first release, 0.1.0

Status: ready
Human: marcwiest
Goal: an adopter can install shipyard's core and its reference modules from npm as `shipyard-kit@0.1.0`, after scenario runs, a consistency read and a link check have passed, and the docs say plainly that the bots don't run yet.
Specs touched: `docs/product/shape.md`, `docs/product/adoption.md`, `docs/product/index.md`, and any spec a finding of the consistency read that the human accepts edits
Out of scope: the bots, skills, the dispatcher and CI pieces; tagging, publishing to npm and the GitHub release, which are the human's; shipyard installing its own release, a follow-up once `0.1.0` is on npm; scenarios for modules beyond core; a CI job that runs the scenarios or the link check. The scenarios file is kept; the sample repos, tarballs, transcripts and the link-check script are thrown away.

## Changes

- [x] 1. Spec: none; `docs/agents/scenario-runs.md` holds the scenario runs. It describes the sample repo, created fresh from that description for each run: a small git repo with a README, one script and one test, a default branch, no remote and no shipyard files. Each scenario is carried out by a fresh agent with no shipyard context, given only the guide and the release's packed tarball in place of the published package; the agent running the scenarios plays the human, answering spec questions and approving the plan. Three scenarios: adopt core with the CLI and plan a small code change to the script; adopt core with the CLI and plan a docs-only change to the README; and update, from the previous release installed with its CLI or, for the first release, from a copy made by hand from an older kit commit, following the guide's update prompt. An adopt scenario passes when the install matches the guide (core in `.shipyard/`, a filled settings file, the AGENTS.md block, the copied templates and a version record whose checksums match), the CLI's writes are committed on their own, the plan passes the plan check, and the fresh agent asked nothing outside human steps and spec questions. The update scenario passes when the CLI's writes are committed on their own, each next step is done in its own commit, a second `update` writes nothing, and the fresh agent asked nothing outside human steps. The report lists each criterion's result and the friction points, posted on the release's PR for the human to examine before tagging · Evidence: run the three scenarios from the tarball of this plan's release commit; capture each criterion's result and each friction list on the PR. Friction the human accepts is fixed on this branch, and a scenario that failed a criterion runs again
- [x] 2. Spec: none; the release steps in `docs/agents/releasing.md` link the scenario runs among the checks before a release, and their publish step says that npm may hold the publish until the human approves it on npmjs.com, and the version isn't public until then · Evidence: open the link it adds; run `npm view shipyard-kit` and capture the description of the placeholder npm's staged publishing left when the name was reserved
- [x] 3. Spec: none; the kit, `docs/product/`, the guide and the README use no term without a glossary entry and give no rule more than one home, except findings the human chose to keep · Evidence: a fresh agent reads them together and lists its findings; capture the list and the human's call on each on the PR, then the fixes on this branch
- [x] 4. Spec: none; every relative link and anchor in the tracked markdown resolves · Evidence: a throwaway script resolves each relative link and its anchor across the tracked markdown; capture its output, listing none broken, after the other Changes' edits
- [x] 5. Spec: the Today notes in `shape.md` and `adoption.md`, and the spec index's Status, say `0.1.0` is the first release and the CLI installs it from npm, that scenario runs passed before it, and that shipyard doesn't install its own release yet. The guide and the README drop what they say about the time before the first release, and keep saying that the bots don't run yet · Evidence: search the tracked docs for "no release" and "Before that release"; capture that none is left; read the guide's "What works today" and the README's Status; capture both
- [x] 6. Spec: none; in the release commit, `chore: release 0.1.0`, `package.json`'s version is `0.1.0` and the changelog's Unreleased heading reads `## 0.1.0`, with an empty "What a repo must do" list · Evidence: `npm pack --dry-run` on the branch; capture the name, version and file list it prints; from the tarball, run `--version` and capture `0.1.0`; capture the changelog slice the update scenario prints

## Open questions

## Phases

### Phase 1: the scenario runs and the release steps · delivers Changes 1, 2 · about 1.5 h
- [x] Work: `docs/agents/scenario-runs.md`, linked from the release steps and the agent rules index; the release steps' publish step on npm's staged publishing. Docs only, so no seam reaches it

Notes: the release steps' link opens `scenario-runs.md`, and its links to the guide and the plan check resolve. `npm view shipyard-kit@0.0.0-stage description` prints "Temporary package placeholder for staged publishing"; `latest` is now the human's `0.0.0-reserved`, which holds no code. `npx --package <tarball> shipyard-kit --version` runs the CLI from a packed tarball, so the scenario runs use that command. Deviations: the scenario runs say how to proceed when the fresh agent's tools can't commit: it lists its commits and the agent running the scenarios makes them. Change 1 stays open until Phase 5 runs the scenarios.

### Phase 2: the docs say `0.1.0` is out · delivers Change 5 · about 1 h
- [x] Work: the Today notes in `shape.md` and `adoption.md`, the spec index's Status, and the guide's and README's wording about the time before the first release. Docs only, so no seam reaches it

Notes: a search of the tracked markdown for "no release", "Before that release" and "Until that release" finds only `cli.md`'s lines about a version record with no release, which stay. The guide's "What works today" is unchanged and still says no skill drives the bots; the README's Status now says `0.1.0` is the first release, that planning with core works and that the bots don't run yet. Deviations: `shape.md`'s other Today note also dropped "the CLI has no release", and the guide no longer says "`0.1.0` or later" where it asks for a release.

### Phase 3: the consistency read · delivers Change 3 · about 2 h
- [x] Work: a fresh agent reads the kit, `docs/product/`, the guide and the README for terms without a glossary entry and rules with more than one home; the human decides each finding on the PR, and the accepted ones are fixed. Docs only, so no seam reaches it

Notes: a fresh agent reported 15 findings, each checked against the files; the list and the human's call on each are on the PR. Ten are fixed: one home for update rules, `remove` and the settings file, "release" kept for shipyard's, human steps and done conditions as workflow steps, the build workflow's label check, the dependency update PR's evidence, and glossary entries for surface, three PR shapes, the phase boxes and Notes line, and the repo's glossary. Five about bots and CI pieces that don't run yet are kept for a later plan. `node --test cli/` passes 29 tests after the fixes.

### Phase 4: the release commit · delivers Change 6 · about 0.5 h
- [x] Work: `package.json`'s version and the changelog's heading, in `chore: release 0.1.0`. Release metadata only; the CLI's tests read neither

Notes: `npm pack --dry-run` on the branch names `shipyard-kit` at `0.1.0` with 58 files: 10 in `cli/` without its tests, 44 in `kit/`, `CHANGELOG.md`, `README.md`, `LICENSE` and `package.json`. `npx --package <tarball> shipyard-kit --version` prints `0.1.0`. `node --test cli/` passes 29 tests. Change 6 stays open until Phase 5 prints the changelog slice in the update scenario.

### Phase 5: run the scenarios · delivers Change 1 · about 3 h
- [x] Work: the three scenarios, run by fresh agents from the tarball of the release commit, with the report on the PR and the friction the human accepts fixed. Runs and docs only, so no seam reaches it

Notes: all three scenarios passed every criterion, run from the tarball of the release commit; the report is on the PR. In both adopt scenarios, the first listed commit holds exactly the 27 files a clean `init` writes, every record checksum matches, and the plan passes the plan check; the update from a copy made by hand wrote 10 files, printed the `0.1.0` changelog entry with "Nothing to do.", and a second `update` wrote nothing. The human accepted both friction points, fixed in the guide: it names a branch for adopting and updating, and plans once the adoption is on the default branch. The package's files are unchanged since the release commit. Deviations: the fresh agents' tools couldn't commit, so each listed its commits and the lists were checked; a first attempt was thrown away after its harness refused chained shell commands and the agents read outside their repos.

### Phase 6: the link check · delivers Change 4 · about 0.5 h
- [x] Work: a throwaway script resolves every relative link and anchor in the tracked markdown, and broken ones are fixed. Docs only, so no seam reaches it

Notes: after the other phases' edits, the script resolved 134 relative links across 60 tracked markdown files. None is broken except the two placeholders in the spec index template, `<area>.md` and `later.md`, which name files an adopting repo writes; they stay. Nothing needed fixing.

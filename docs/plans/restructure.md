# Restructure shipyard into the kit

Status: ready
Human: marcwiest
Goal: an adopting repo can copy shipyard's kit by hand and plan with it, and every rule and term has one home.
Specs touched: `docs/product/index.md`, `shape.md`, `adoption.md`, `agent-use.md`, `roles.md` (removed), `workflows.md` (removed), `house-rules.md` (removed), `CONTEXT.md`, `docs/agents/index.md`.
Out of scope: skills and discovery stubs; the CLI; the code of CI pieces; releases and the changelog; the npm package name; sorting the "no X" rules (opinions found are moved to the example setup unsorted); rewording for a public reader beyond what the move needs; trying the kit in a real outside repo.

## Settled with the human

- License: MIT.
- Third-party text: credited in a way that can be removed once the kit no longer derives from it (see Change 10).
- Branches: the decisions are on `main`; this plan is built on `work/restructure`, with the plan as its first commit.

## How this plan runs

No bots run in this repo yet. One interactive agent orchestrates the whole plan and builds each phase; the human only acts at the human steps below. The agent leads: it says what it is doing, and it never waits for instructions outside a human step.

### Starting a session

1. Check out `work/restructure`. The next phase is the first one with unticked boxes; the Notes of earlier phases say what they did.
2. Read: this plan; `CONTEXT.md`; `docs/product/` (start at `index.md`); `docs/agents/index.md`; `.scratch/repo-cleanup.md`, the gitignored tracker holding the reasons behind every decision and the list of what the drafts' setup lost; and the `docs/init/` files the next phase names. `.scratch/plans/init/` holds private notes: read them only to know which names must never appear in tracked files.
3. Tell the human in a few lines which phases this session covers and what it needs from them, then start.

Sessions: phases 1–2, then 3–4, then 5–6. End a session early at a phase boundary if its context grows heavy, and say so.

### Each phase

1. Spec commit first: `docs(phase-N): ...` updates the `docs/product/` pages and `CONTEXT.md` the phase's Changes name.
2. Kit text: `feat(phase-N): ...` commits. Rewrite, don't copy: glossary terms only (no _Avoid_ names), roles instead of tools, dry reference text, each rule in one home decided by who carries it out. What Phase 1 superseded is dropped; opinions go to `examples/maintainer/` unsorted.
3. Checks (below). Fix what fails.
4. Scratch runs for the phase's Changes (see Verification setup).
5. Plan record: tick the phase's boxes, add its Notes line (evidence, deviations, judgment calls, plan format findings), commit `chore(phase-N): plan record`.
6. Phase review: a human step.

Commits on `work/restructure` are part of the plan and need no approval. Fixes after a review are `fix(phase-N): ...` commits.

### Human steps

The agent stops only here, says plainly what it needs, and offers a recommendation:

- **Phase review**, after each phase: a short summary of what moved where, the judgment calls made, new terms (added to the glossary marked proposed; accepted unless the human renames them) and the scratch run results. The human approves or asks for changes.
- **Spec question**: when the work shows a decision in `docs/product/` or the tracker doesn't hold. Work on that point stops; the reopening is recorded in the tracker once decided.
- **Newcomer run** for Change 10: the agent prepares an empty repo and a prompt; the human starts a fresh session there and pastes the transcript location back.
- **Mapping table review** for Change 11.
- **Push and PR**: the agent pushes and opens the PR only on the human's go. Only the human merges.

Anything else the agent decides itself and reports in the phase review: wording, file names and splits within the layout in `shape.md`, and which draft text is superseded.

## Verification setup

A scratch run: an empty git repo in a temporary folder outside shipyard, the kit files the run needs copied in, and a fresh agent with no access to shipyard's repo. The orchestrating agent starts it as a subagent told to work only in that folder, and gives it the task the Evidence line names. Its transcript and any file it produces are kept in `.scratch/plans/restructure-runs/`, never committed, since they can hold local paths. The phase's Notes line summarizes each run.

Checks on every phase, not listed per Change: relative links resolve; no retired (_Avoid_) term in new text; no tool name in `kit/` outside role mapping templates; no private names (the ones in `.scratch/plans/init/`).

## Changes

- [x] 1. Spec: `adoption.md` links to each part's index in `kit/` instead of describing its contents, and `shape.md`'s layout carries no Today note for `kit/`. · Evidence: scratch run in which the agent, given only `kit/`, names the folders to copy for a human-and-planning-agent setup and for one with building.
- [ ] 2. Spec: core holds the roles, the practices (git, testing, verification), the plan format and plan check, the PR shape fields, the docs-only and hotfix PR shapes, the spec writing rules, human steps and done conditions, where house rules go, and the templates (plan, settings file, AGENTS.md block, spec index, agent rules index with an empty house rules section, `CONTEXT.md`). `roles.md` and `workflows.md` are removed. · Evidence: scratch run with `kit/core/` and a filled settings file, in which the planning agent drafts a plan for a small change; transcript and the plan, which carries every required item.
- [ ] 3. Spec: the building module holds the build workflow from intake to handoff, the phased PR shape (holding its own plan), the phase brief, restatement, fix rules, the spec rule, PR comment conventions, spikes, run handling and the Sizing log columns. · Evidence: scratch run with core, building and the plan from Change 2, in which the agent, as orchestrator bot, writes the phases and phase 1's brief, naming roles and never tools.
- [ ] 4. Spec: the dispatch module holds the labels, what each means to whoever adds or removes it, and the answer skill's steps as reference text. `agent-use.md` keeps only the dispatcher and the properties of managed files. · Evidence: scratch run with core and dispatch, in which the agent says what it does at a human step and how a held PR resumes.
- [ ] 5. Spec: the verification module holds the verification skill's shape, the Feature Map, minimum verification evidence per surface and the verification rules. · Evidence: scratch run in which the agent writes a Feature Map entry for a sample feature from the module alone.
- [ ] 6. Spec: the weekly drift check module holds the drift check workflow and the dependency update PR shape. · Evidence: scratch run in which the agent lists the steps of one run and what it may and may not edit.
- [ ] 7. Spec: each CI piece (docs-only detection, test output cap, docs index check, coverage floor) has its own folder in `kit/` with an index stating what it checks, its inputs and the settings it reads; no action code. · Evidence: scratch run in which the agent writes the calling CI workflow for docs-only detection from its index alone; the written file.
- [ ] 8. Spec: `examples/maintainer/` holds the maintainer's settings file with the role mapping and the house rules as agent rules, including every opinion found while splitting `docs/init/`. `house-rules.md` is removed; the mechanics-versus-opinions principle stays in `index.md`. · Evidence: scratch run with the example copied in, in which the planning agent's plan follows the house rules (branch names, phase size).
- [ ] 9. Spec: `kit/core/glossary.md` holds every term an agent in an adopting repo could meet; `CONTEXT.md` keeps only terms about shipyard itself and loses its Today note; `docs/agents/index.md` adds the kit glossary to the reading order. · Evidence: in the run from Change 2, the agent finds each term it uses in the kit glossary.
- [ ] 10. Spec: a README (purpose, status, what's where, credits for ideas such as pstack), `docs/guide/index.md` (adopting by hand), a root AGENTS.md for shipyard pointing to `docs/agents/index.md`, and an MIT LICENSE. `kit/core/NOTICE.md` lists each outside source whose text the kit adapts (today mattpocock/skills, MIT), the kit files derived from it and its license text; it ships with core, so the notice travels with the copied text. Each derived file ends with a one-line pointer to its entry. An entry and its pointers are removed once a rewrite leaves no listed file derived from that source. `adoption.md` drops README and guide from its Today note. · Evidence: the newcomer run, in which a fresh session started by the human, given only the README and the guide, adopts core into an empty repo; transcript and the resulting tree.
- [ ] 11. Spec: `docs/init/` is removed once every draft section has a home; `index.md`'s status line no longer mentions the drafts. · Evidence: a table in the PR body mapping each draft section to its new file or to "superseded", which the human reviews.

## Phases

Written by the planning agent. The orchestrating agent may split a phase that runs long and notes it. The plan format's Tests and Code boxes don't fit docs-only work, so phases use Work and Evidence boxes (a finding for the friction audit).

### Phase 1: kit skeleton and glossary split · delivers Change 1, 9
- [x] Work: `kit/` folders with an index each; terms sorted into `kit/core/glossary.md` and `CONTEXT.md`; roles into core
- [x] Evidence: the Change 1 run

Notes: Change 1 run: given only `kit/`, the agent named `kit/core/` for a human-and-planning-agent setup and core, dispatch and building for one with building, citing each index's Needs line. It also found: no top-level kit index (the guide's job, Change 10), modules still empty, no plan template (Phase 2), and that neither building nor the weekly drift check lists verification as a need. Change 9 stays unticked until its evidence, the Change 2 run. Deviations: `roles.md` is removed here, not in Phase 2, since this phase moves the roles; the maintainer's role mapping moved to the house rules list until the example setup exists. Judgment calls: `CONTEXT.md` keeps platform, example setup, guide and bootstrap, and its _Avoid_ names became a retired-names table, since the kit glossary carries none; adopting repo, release and discovery stub moved to the kit glossary; the roles gained a column for what each role's tool needs (`agent-use.md` asks for it); every CI piece got its folder now, named after its glossary term. New terms, proposed: agent rules, AGENTS.md block. Plan format finding: a Change whose Evidence line runs in a later phase (Change 9) can't be ticked by the phase that delivers it.

### Phase 2: core · delivers Change 2
- [ ] Work: practices, plan format and check, PR shape fields, docs-only and hotfix PR shapes, spec writing rules, templates, from `knowledge-and-planning.md`, `git-workflow.md`, `testing-workflow.md` and the evidence part of `verification-workflow.md`
- [ ] Evidence: the Change 2 and Change 9 runs

### Phase 3: building and dispatch · delivers Change 3, 4
- [ ] Work: from `phased-pr-workflow.md` and `agent-use.md`; the separate plan PR and the hand-off start are superseded
- [ ] Evidence: the Change 3 and 4 runs

### Phase 4: verification, drift check and CI pieces · delivers Change 5, 6, 7
- [ ] Work: from `verification-workflow.md`, the drift parts of `knowledge-and-planning.md` and the CI parts of `git-workflow.md` and `testing-workflow.md`
- [ ] Evidence: the Change 5, 6 and 7 runs

### Phase 5: example setup and entry files · delivers Change 8, 10
- [ ] Work: `examples/maintainer/`, README, guide, AGENTS.md, LICENSE, `kit/core/NOTICE.md`
- [ ] Evidence: the Change 8 run and the newcomer run

### Phase 6: retire the drafts · delivers Change 11
- [ ] Work: remove `docs/init/` and the removed spec pages; update reading orders; draft the PR body with the mapping table
- [ ] Evidence: the mapping table, then push and PR on the human's go

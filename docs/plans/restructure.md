# Restructure shipyard into the kit

Status: draft
Human: marcwiest
Goal: an adopting repo can copy shipyard's kit by hand and plan with it, and every rule and term has one home.
Specs touched: `docs/product/index.md`, `shape.md`, `adoption.md`, `agent-use.md`, `roles.md` (removed), `workflows.md` (removed), `house-rules.md` (removed), `CONTEXT.md`, `docs/agents/index.md`.
Out of scope: skills and discovery stubs; the CLI; the code of CI pieces; releases and the changelog; the npm package name; sorting the "no X" rules (opinions found are moved to the example setup unsorted); rewording for a public reader beyond what the move needs; trying the kit in a real outside repo.

## Settled with the human

- License: MIT.
- Third-party text: credited in a way that can be removed once the kit no longer derives from it (see Change 10).
- Branches: `work/repo-cleanup` (the decisions) merges to `main` first; this plan is built on its own branch and PR, with the plan as its first commit. The human starts it.

## Verification setup

A scratch run: an empty git repo outside shipyard, the kit copied in by hand, and a fresh agent session that can't see shipyard's repo. Each Evidence line names the transcript of one such run, plus any file it produces.

Checks on every phase, not listed per Change: relative links resolve; no retired (_Avoid_) term in new text; no tool name in `kit/` outside role mapping templates; no private names.

## Changes

- [ ] 1. Spec: `adoption.md` links to each part's index in `kit/` instead of describing its contents, and `shape.md`'s layout carries no Today note for `kit/`. · Evidence: scratch run in which the agent, given only `kit/`, names the folders to copy for a human-and-planning-agent setup and for one with building.
- [ ] 2. Spec: core holds the roles, the practices (git, testing, verification), the plan format and plan check, the PR shape fields, the docs-only and hotfix PR shapes, the spec writing rules, human steps and done conditions, where house rules go, and the templates (plan, settings file, AGENTS.md block, spec index, agent rules index with an empty house rules section, `CONTEXT.md`). `roles.md` and `workflows.md` are removed. · Evidence: scratch run with `kit/core/` and a filled settings file, in which the planning agent drafts a plan for a small change; transcript and the plan, which carries every required item.
- [ ] 3. Spec: the building module holds the build workflow from intake to handoff, the phased PR shape (holding its own plan), the phase brief, restatement, fix rules, the spec rule, PR comment conventions, spikes, run handling and the Sizing log columns. · Evidence: scratch run with core, building and the plan from Change 2, in which the agent, as orchestrator bot, writes the phases and phase 1's brief, naming roles and never tools.
- [ ] 4. Spec: the dispatch module holds the labels, what each means to whoever adds or removes it, and the answer skill's steps as reference text. `agent-use.md` keeps only the dispatcher and the properties of managed files. · Evidence: scratch run with core and dispatch, in which the agent says what it does at a human step and how a held PR resumes.
- [ ] 5. Spec: the verification module holds the verification skill's shape, the Feature Map, minimum verification evidence per surface and the verification rules. · Evidence: scratch run in which the agent writes a Feature Map entry for a sample feature from the module alone.
- [ ] 6. Spec: the weekly drift check module holds the drift check workflow and the dependency update PR shape. · Evidence: scratch run in which the agent lists the steps of one run and what it may and may not edit.
- [ ] 7. Spec: each CI piece (docs-only detection, test output cap, docs index check, coverage floor) has its own folder in `kit/` with an index stating what it checks, its inputs and the settings it reads; no action code. · Evidence: scratch run in which the agent writes the calling CI workflow for docs-only detection from its index alone; the written file.
- [ ] 8. Spec: `examples/maintainer/` holds the maintainer's settings file with the role mapping and the house rules as agent rules, including every opinion found while splitting `docs/init/`. `house-rules.md` is removed; the mechanics-versus-opinions principle stays in `index.md`. · Evidence: scratch run with the example copied in, in which the planning agent's plan follows the house rules (branch names, phase size).
- [ ] 9. Spec: `kit/core/glossary.md` holds every term an agent in an adopting repo could meet; `CONTEXT.md` keeps only terms about shipyard itself and loses its Today note; `docs/agents/index.md` adds the kit glossary to the reading order. · Evidence: in the run from Change 2, the agent finds each term it uses in the kit glossary.
- [ ] 10. Spec: a README (purpose, status, what's where, credits for ideas such as pstack), `docs/guide/index.md` (adopting by hand), a root AGENTS.md for shipyard pointing to `docs/agents/index.md`, and an MIT LICENSE. `kit/core/NOTICE.md` lists each outside source whose text the kit adapts (today mattpocock/skills, MIT), the kit files derived from it and its license text; it ships with core, so the notice travels with the copied text. Each derived file ends with a one-line pointer to its entry. An entry and its pointers are removed once a rewrite leaves no listed file derived from that source. `adoption.md` drops README and guide from its Today note. · Evidence: scratch run in which the agent, given only the README and the guide, adopts core into the empty repo; transcript and the resulting tree.
- [ ] 11. Spec: `docs/init/` is removed once every draft section has a home; `index.md`'s status line no longer mentions the drafts. · Evidence: a table in the PR body mapping each draft section to its new file or to "superseded", which the human reviews.

## Phases

Written by the planning agent: no orchestrator bot runs in this repo yet. Each phase lands a spec commit first, then the kit text, then its scratch run. The plan format's Tests and Code boxes don't fit docs-only work, so phases use Work and Evidence boxes (a finding for the friction audit).

### Phase 1: kit skeleton and glossary split · delivers Change 1, 9
- [ ] Work: `kit/` folders with an index each; terms sorted into `kit/core/glossary.md` and `CONTEXT.md`; roles into core
- [ ] Evidence: the Change 1 run

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
- [ ] Work: `examples/maintainer/`, README, guide, AGENTS.md, LICENSE
- [ ] Evidence: the Change 8 and 10 runs

### Phase 6: retire the drafts · delivers Change 11
- [ ] Work: remove `docs/init/` and the removed spec pages; update reading orders
- [ ] Evidence: the mapping table

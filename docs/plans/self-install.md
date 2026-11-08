# Shipyard installs its own release

Status: in progress
Human: marcwiest
Goal: agents working on shipyard follow the workflow of its last release, installed in `.shipyard/` with the CLI like any adopting repo, so a PR that edits `kit/` no longer changes the rules its own agents follow.
Specs touched: `docs/product/adoption.md`
Out of scope: changes to `kit/` or the CLI; a check that `.shipyard/` matches the last release; keeping search tools out of `.shipyard/`; a changelog entry, since nothing in the package changes; the modules, which join shipyard's install once their bots run.

## Changes

- [x] 1. Spec: none; shipyard's repo has core alone from `0.1.0` installed by `npx shipyard-kit@0.1.0 init`: `.shipyard/core/`, the version record, the AGENTS.md block below the existing pointer line, and a settings file filled for shipyard: the planning agent's tool and how it starts, the default paths, the `plan/<slug>` branch, `node --test cli/` as the test command, and the CLI's seam. The CLI's writes are in their own commit, and the settings file in the next · Evidence: run the init on the branch and capture its output; capture that every checksum in the version record matches its file; run `npx shipyard-kit@0.1.0 update` and capture that it writes nothing; run `npm pack --dry-run` and capture that no `.shipyard/` path is in the package
- [x] 2. Spec: none; `docs/agents/index.md` follows the kit's agent rules template. Its reading order starts with `.shipyard/core/glossary.md`. A rule says agents follow the workflow in `.shipyard/`, the installed release, and change the kit only in `kit/`; `.shipyard/` is never edited other than `settings.yml`; kit text written on a branch uses the terms of `kit/core/glossary.md` on that branch, where a new term gets its entry; the consistency read and the link check cover `kit/`, not the copy. A Building plans section says how shipyard builds an approved plan: the agent building it adds the phases, builds and verifies each one, and keeps the plan record, on core's plan PR. Commands points to the settings file · Evidence: follow each path and link the file names; capture that each resolves
- [x] 3. Spec: `adoption.md`'s Today note says `0.1.0` is the first release, installed from npm after scenario runs passed, and no longer says shipyard doesn't install its own release · Evidence: search the tracked markdown for "install its own release yet" and "follow `kit/` as it stands"; capture that none is left
- [x] 4. Spec: none; the release steps in `docs/agents/releasing.md` tag the release PR's merge commit on `main`, as `0.1.0` was tagged, and end with a step, once the release is public, where an agent updates shipyard's own install to the new release with the CLI, on a branch such as `chore/shipyard-x.y.z`, through its own PR · Evidence: run `git rev-list -n 1 v0.1.0` and capture that it names PR 6's merge commit; open the step's links and capture that each resolves

## Open questions

## Phases

### Phase 1: install core from `0.1.0` · delivers Change 1 · about 0.5 h
- [x] Work: run `npx shipyard-kit@0.1.0 init` and commit its writes; fill `.shipyard/settings.yml` for shipyard. Running the released CLI changes no code, so no seam reaches it

Notes: init installed core, added the block below the pointer line and skipped the three templates, since shipyard has its own index files and glossary; its writes are `feat(phase-1): adopt shipyard 0.1.0`, the settings file `feat(phase-1): fill the settings file for shipyard` (Claude Code started with `claude`, `node --test cli/`, the CLI's seam; install and check stay empty, since shipyard has no dependencies or build). All 21 checksums in the version record match their files. A second `update` prints "matches this release" and writes nothing. `npm pack --dry-run` lists 58 files, none in `.shipyard/`; `node --test cli/` passes 29. Deviation: inside shipyard's repo, `npx shipyard-kit@0.1.0` fails with "command not found", because npm takes the repo itself for the requested package and looks for a local bin. The CLI ran from the registry as `npx --package shipyard-kit@0.1.0 -c 'cd <repo> && shipyard-kit init'`, started outside the repo; Phase 2's release step says so.

### Phase 2: agent rules, Today note and release steps · delivers Changes 2, 3, 4 · about 1 h
- [x] Work: `docs/agents/index.md`, `docs/product/adoption.md`'s Today note and `docs/agents/releasing.md`. Docs only, so no seam reaches it

Notes: every path the agent rules index names exists (`.shipyard/core/glossary.md`, `docs/context.md`, `docs/product/index.md`, `.shipyard/settings.yml`, `kit/core/glossary.md`), and the link check finds 165 relative links across 80 tracked markdown files, none broken but the spec-index template's two placeholders, in `kit/` and in its copy. The search finds both removed phrases only in this plan's Change 3. `git rev-list -n 1 v0.1.0` and PR 6's merge commit are both `0824722`. The release steps link the guide's "Update it" section. Deviations: the seam moved from the agent rules index to the settings file, which the Commands section now points to; the release step names the command that runs the CLI inside shipyard's repo, from Phase 1's notes.

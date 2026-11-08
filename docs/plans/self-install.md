# Shipyard installs its own release

Status: ready
Human: marcwiest
Goal: agents working on shipyard follow the workflow of its last release, installed in `.shipyard/` with the CLI like any adopting repo, so a PR that edits `kit/` no longer changes the rules its own agents follow.
Specs touched: `docs/product/adoption.md`
Out of scope: changes to `kit/` or the CLI; a check that `.shipyard/` matches the last release; keeping search tools out of `.shipyard/`; a changelog entry, since nothing in the package changes; the modules, which join shipyard's install once their bots run.

## Changes

- [ ] 1. Spec: none; shipyard's repo has core alone from `0.1.0` installed by `npx shipyard-kit@0.1.0 init`: `.shipyard/core/`, the version record, the AGENTS.md block below the existing pointer line, and a settings file filled for shipyard: the planning agent's tool and how it starts, the default paths, the `plan/<slug>` branch, `node --test cli/` as the test command, and the CLI's seam. The CLI's writes are in their own commit, and the settings file in the next · Evidence: run the init on the branch and capture its output; capture that every checksum in the version record matches its file; run `npx shipyard-kit@0.1.0 update` and capture that it writes nothing; run `npm pack --dry-run` and capture that no `.shipyard/` path is in the package
- [ ] 2. Spec: none; `docs/agents/index.md` follows the kit's agent rules template. Its reading order starts with `.shipyard/core/glossary.md`. A rule says agents follow the workflow in `.shipyard/`, the installed release, and change the kit only in `kit/`; `.shipyard/` is never edited other than `settings.yml`; kit text written on a branch uses the terms of `kit/core/glossary.md` on that branch, where a new term gets its entry; the consistency read and the link check cover `kit/`, not the copy. A Building plans section says how shipyard builds an approved plan: the agent building it adds the phases, builds and verifies each one, and keeps the plan record, on core's plan PR. Commands points to the settings file · Evidence: follow each path and link the file names; capture that each resolves
- [ ] 3. Spec: `adoption.md`'s Today note says `0.1.0` is the first release, installed from npm after scenario runs passed, and no longer says shipyard doesn't install its own release · Evidence: search the tracked markdown for "install its own release yet" and "follow `kit/` as it stands"; capture that none is left
- [ ] 4. Spec: none; the release steps in `docs/agents/releasing.md` tag the release PR's merge commit on `main`, as `0.1.0` was tagged, and end with a step, once the release is public, where an agent updates shipyard's own install to the new release with the CLI, on a branch such as `chore/shipyard-x.y.z`, through its own PR · Evidence: run `git rev-list -n 1 v0.1.0` and capture that it names PR 6's merge commit; open the step's links and capture that each resolves

## Open questions

## Phases

Added before building starts, by whoever builds the plan. Until then, it holds only this note and the example below, which the phases replace. A phase that changes code a seam reaches has Tests and Code boxes; any other phase has one Work box, which says why no seam reaches any code it changes:

```
### Phase 1: <name> · delivers Change 1
- [ ] Tests: <seam>: <behavior the tests assert>
- [ ] Code: <what makes them pass>

Notes: <added when the phase is done: verification line, deviations, blockers>

### Phase 2: <name> · delivers Change 2
- [ ] Work: <what it changes, such as docs, config or content>

Notes: <...>
```

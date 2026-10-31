# Give spec text its own commit prefix

Status: in progress
Human: marcwiest
Goal: a phase's spec text is found by its own `spec(phase-N):` prefix, so docs work in any phase can use `docs(phase-N):` like any other docs change.
Specs touched: none
Out of scope: other prefixes; branch names; the CLI and any commit lint config shipyard might ship later; history already written with the old prefixes.

## Changes

- [x] 1. Spec: none; core's git practice gives spec text `spec(phase-N):` in plan work and `spec:` outside a plan; `docs(phase-N):` holds a phase's other changes to files in the settings file's docs paths; and a repo that lints commit types adds `spec` to its allowed types · Evidence: read the prefix table, the line on work outside a plan and the commit lint line; capture all three
- [x] 2. Spec: none; the building module's phase steps commit spec text as `spec(phase-N):`, and a Work phase's docs changes as `docs(phase-N):`, its other changes as `feat(phase-N):` or `fix(phase-N):` · Evidence: read the builder bot's steps in `kit/building/phases.md`; capture the commit lines
- [x] 3. Spec: none; review finds the phase's spec commit by `spec(phase-N):` · Evidence: read `kit/building/review.md`; capture the spec commit line
- [x] 4. Spec: none; no tracked text outside history uses `docs(phase-N):` for spec text · Evidence: grep the repo, `.scratch/` excluded, for `docs(phase`, `docs:` and `spec(`; capture the output and check each hit

## Open questions

## Phases

### Phase 1: spec prefix in the kit · delivers Change 1, 2, 3, 4 · about 1 h
- [x] Work: `kit/core/practices/git.md` prefix table, the line on work outside a plan and a commit lint line; `kit/building/phases.md` builder bot steps 2 and 3; `kit/building/review.md` phase verdict's spec commit line; then the Change 4 grep

Notes: Verified by reading and capturing each line its Evidence names. Change 1: the git practice's table gives `spec(phase-N):` to spec text and `docs(phase-N):` to the phase's other changes in the docs paths, the line on work outside a plan names `spec:`, and a new line tells a repo that lints commit types to add `spec`. Change 2: builder bot step 2 commits `spec(phase-N):`, and step 3 splits a Work phase's commits into `docs(phase-N):` for the docs paths and `feat(phase-N):` or `fix(phase-N):` for the rest. Change 3: the phase verdict finds the spec commit by its `spec(phase-N):` prefix. Change 4: the grep found 14 hits, each the new text, the plan quoting its Changes, the drift check's `docs:` report commits or the settings files' `docs:` paths key; none uses `docs(phase-N):` for spec text. Deviations: this phase's kit edits were committed as `docs(phase-1):`, as the new rule says, where the old rule would have called them `feat(phase-1):`. Judgment calls: `feat` and `fix` now hold "any other change", since spec text and docs changes have their own rows; review's Review section still finds a phase's commits by their phase scope, which covers `spec(phase-N):` too.

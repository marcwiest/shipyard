# Planning fixes

- Status: in progress
- Human: marcwiest
- Goal: the planning agent doesn't start a plan before the repo's adoption is merged, reads core's practices before drafting, and an `update` that stops on edited files names each new version by a path that works outside npx's cache, for `0.1.2`.
- Specs touched: `docs/product/cli.md`
- Out of scope: a planning skill; a new scenario for an unmerged adoption; the other planning steps; the release itself, which follows the release steps after this merges; updating shipyard's own install to `0.1.2`, the release steps' last step.

## Changes

- [ ] 1. Spec: none; planning step 2 in `kit/core/plans.md` says that when the default branch doesn't have shipyard yet, such as while the PR that adopts it is unmerged, the planning agent stops and asks the human to merge it, then starts the plan's branch from the default branch · Evidence: in the scenario runs' sample repo, adopt core from the packed CLI on a branch and leave it unmerged, give a fresh agent scenario 1's planning prompt, "Plan a small change to the script", and capture from its transcript that it stops and asks for the merge before creating the plan's branch
- [ ] 2. Spec: none; planning step 1 in `kit/core/plans.md` has the planning agent read core's practices too: git, testing and verification · Evidence: run scenario 1 of the scenario runs with the packed CLI and capture from the fresh agent's transcript that it reads the three practices, and that it commits its plan as `docs(plan):`
- [x] 3. Spec: `docs/product/cli.md` says that when `update` stops on edited or deleted managed files, it names each one's new version by its path in the release, such as `kit/core/roles.md` in `shipyard-kit@0.1.2`, then by its path in the package on disk; the AGENTS.md block's line does the same · Evidence: the CLI's tests assert the refusal's line for an edited managed file and for the edited block, with the release path, the version and the package path; run the packed CLI's `update` in a throwaway repo with an edited managed file and capture the refusal
- [ ] 4. Spec: none; the changelog has an Unreleased entry for these changes, with an empty "What a repo must do" list · Evidence: in a throwaway repo installed from `0.1.1`, run the packed CLI's `update` and capture that it prints the entry

## Open questions

## Phases

### Phase 1: the refusal names the release path · delivers Change 3 · about 1.5 h
- [x] Tests: the CLI: arguments in; files, stdout, stderr and exit code out: `update`'s refusal names an edited managed file's new version as its path in the release, such as `kit/core/plans.md` in `shipyard-kit@<version>`, then its path in the package; the edited block's line does the same
- [x] Code: `cli/update.js` builds both lines from the release path, the version and the package path, and `docs/product/cli.md` says so

Notes: `node --test cli/` passes 30. The edited-file test now asserts both refusal lines in full; it failed against the old code (29 pass, 1 fail), then passed. A copy of the branch with `version` 0.1.2 and the Unreleased heading renamed, packed, ran `update` in a throwaway repo installed by `npx shipyard-kit@0.1.1 init`, with `.shipyard/core/roles.md` and the block's Skills line edited: it exits 1, writes nothing, and lists ``- `.shipyard/core/roles.md`: edited; its new version is `kit/core/roles.md` in `shipyard-kit@0.1.2`, at `<npx cache>/node_modules/shipyard-kit/kit/core/roles.md`.``, and the block's line names `kit/core/templates/agents-block.md` in `shipyard-kit@0.1.2` the same way.

### Phase 2: planning steps 1 and 2 · delivers Changes 1, 2 · about 1 h
- [ ] Work: steps 1 and 2 of the planning workflow in `kit/core/plans.md`. Kit text only, which no seam reaches

Notes:

### Phase 3: the changelog · delivers Change 4 · about 0.5 h
- [ ] Work: an Unreleased entry in `CHANGELOG.md`. Docs only, which no seam reaches

Notes:

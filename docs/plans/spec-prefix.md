# Give spec text its own commit prefix

Status: draft
Human: marcwiest
Goal: a phase's spec text is found by its own `spec(phase-N):` prefix, so docs work in any phase can use `docs(phase-N):` like any other docs change.
Specs touched: none
Out of scope: other prefixes; branch names; the CLI and any commit lint config shipyard might ship later; history already written with the old prefixes.

## Changes

- [ ] 1. Spec: none; core's git practice gives spec text `spec(phase-N):` in plan work and `spec:` outside a plan, and `docs(phase-N):` holds any other docs change in a phase · Evidence: read the prefix table and the line on work outside a plan; capture both
- [ ] 2. Spec: none; the building module's phase steps commit spec text as `spec(phase-N):`, and a Work phase's docs changes as `docs(phase-N):`, its other changes as `feat(phase-N):` or `fix(phase-N):` · Evidence: read the builder bot's steps in `kit/building/phases.md`; capture the commit lines
- [ ] 3. Spec: none; review finds the phase's spec commit by `spec(phase-N):` · Evidence: read `kit/building/review.md`; capture the spec commit line
- [ ] 4. Spec: none; no tracked text outside history uses `docs(phase-N):` for spec text · Evidence: grep the repo, `.scratch/` excluded, for `docs(phase`, `docs:` and `spec(`; capture the output and check each hit

## Open questions

- Commit lint: commitlint's conventional preset only allows its standard types, so `spec` fails in repos that lint commits with it unchanged. Say so in the git practice, so such a repo adds `spec` to its allowed types? · Recommendation: yes, one line in the git practice.

## Phases

Added before building starts, by whoever builds the plan.

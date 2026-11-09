# Lines that stay separate

Status: draft
Human: marcwiest
Goal: the plan's header, each part's Needs and Roles, and the AGENTS.md block's trigger labels and skills show as separate lines on GitHub and come through a markdown formatter unchanged, and the guide tells adopting repos to keep formatters off the files shipyard manages, for `0.1.1`.
Specs touched: none
Out of scope: frontmatter for plans, until a script reads them; making every kit file survive every formatter, such as table padding; a check for lines markdown joins; the release itself, which follows the release steps after this merges; updating shipyard's own install to `0.1.1`, the release steps' last step.

## Changes

- [ ] 1. Spec: none; the plan format in `kit/core/plans.md` writes the header as a list, one item per field: Status, Human, Goal, Specs touched and Out of scope. The plan template's header is that list, and the plan check asks for those items · Evidence: render the template with GitHub's markdown API and capture five separate list items; run prettier at its defaults over the template and capture that it leaves the header unchanged
- [ ] 2. Spec: none; each part's index in `kit/` writes Needs and Roles as list items, with building's Trigger label and the weekly drift check's Trigger beside them, and core's index says so. The CLI reads a part's needs from its Needs item, as it read the Needs line · Evidence: the CLI's tests assert that each module's needs come from the kit's real indexes, such as building needing core and dispatch; run the packed CLI's `init building` in a throwaway repo and capture that it refuses, naming dispatch
- [ ] 3. Spec: none; the AGENTS.md block's trigger labels and skills are list items, in the block template and in the block the CLI writes, and the guide's by-hand step 4 matches · Evidence: run the packed CLI's `init` in a throwaway repo and capture the block; render it with GitHub's markdown API and capture two separate list items
- [ ] 4. Spec: none; the guide says to keep a markdown formatter, such as a pre-commit hook or a CI format check, off `.shipyard/` and the AGENTS.md block, since a formatter's rewrite reads to `update` as a local edit. It says so where the CLI adoption checks ignore rules, in by-hand step 8, and where `update` stops on an edited file · Evidence: in a throwaway repo with prettier at its defaults, install from the packed CLI, add the ignore entries the guide names, run prettier over the repo, then run `update` and capture that every file matches
- [ ] 5. Spec: none; the changelog has an Unreleased entry for these changes, whose "What a repo must do" list says to keep formatters off `.shipyard/` and the block · Evidence: in a throwaway repo installed from `0.1.0`, run the packed CLI's `update` and capture that it replaces the block with the list items and prints the entry

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

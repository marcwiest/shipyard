# Adoption fixes

- Status: draft
- Human: marcwiest
- Goal: an agent adopting shipyard finds the repo's existing agent instructions, glossary and tooling that conflict with core, and the human settles each one before the adoption merges, for `0.1.3`.
- Specs touched: `docs/product/cli.md`
- Out of scope: a skill for the adoption check, which waits for skills to have an install path; running the check from `update`, where the changelog's "What a repo must do" list already says what a release asks; any script that runs the check; the release itself, which follows the release steps after this merges.

## Changes

- [ ] 1. Spec: none; a new core page, `kit/core/adoption-check.md`, with its kit glossary entry, says how the planning agent runs the adoption check once shipyard's files are written and before the adoption merges, and again when a part is added. It looks in every place the repo already instructs agents or shapes their work: `AGENTS.md` outside the block, other tools' entry files and rule folders, skills, memory files, contributing guides, PR templates, commit and format hooks, CI workflows, ignore rules, and existing specs, agent rules and glossary. It compares them with core: who edits and commits, branches and merging, commit format, where specs, plans and the glossary live, formatters that would rewrite `.shipyard/` or the block, test and verification rules, PR rules, and what CI, a merge or a tag sets off. Settling the conflicts is a human step, one decision item each, and each ends as a settings value, a house rule where the repo's way wins, or the old instruction retired or scoped, in its own commit. The adoption PR's description lists each conflict with its outcome. Core's index lists the page · Evidence: in Change 4's run, capture from the fresh agent's transcript that it opens the page after `init`, asks one decision item per seeded conflict, and lists them on its PR description draft; open each link the page adds
- [ ] 2. Spec: `docs/product/cli.md` says `init`'s next steps, on a fresh install and when adding parts, end with running the adoption check, naming its page in `.shipyard/`; and that where `init` copied a template, its next step says to delete a copy that duplicates a file the repo already keeps, such as a glossary, and set its path under `paths` · Evidence: the CLI's tests assert both next steps; run the packed CLI's `init` in a throwaway repo and capture its output
- [ ] 3. Spec: none; the guide's adopt prompt asks for the adoption check, the by-hand path runs it as a step before the commit, and the guide's own checks for ignore rules, formatters and what CI, a merge or a tag sets off point to the page instead of repeating it · Evidence: open each link the guide adds; Change 4's run uses the guide's adopt prompt
- [ ] 4. Spec: none; the scenario runs have a fourth scenario: adopt core in a sample repo seeded with conflicts, and it passes when the fresh agent's report names each seeded conflict · Evidence: run it with the packed CLI, the sample repo seeded with an instruction that agents commit only when asked, a handover rule where one agent designs and another edits, a commit lint config whose types reject `spec`, and a glossary at the root `CONTEXT.md`; capture the fresh agent's report and check it names all four, and that the duplicate glossary copy ends deleted with `paths.glossary` set
- [ ] 5. Spec: none; the changelog has an Unreleased entry for these changes, whose "What a repo must do" list is empty and whose summary says a repo adopted earlier may run the adoption check once · Evidence: in a throwaway repo installed from `0.1.2`, run the packed CLI's `update` and capture that it prints the entry

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

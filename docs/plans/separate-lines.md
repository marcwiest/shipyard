# Lines that stay separate

Status: in progress
Human: marcwiest
Goal: the plan's header, each part's Needs and Roles, and the AGENTS.md block's trigger labels and skills show as separate lines on GitHub and come through a markdown formatter unchanged, and the guide tells adopting repos to keep formatters off the files shipyard manages, for `0.1.1`.
Specs touched: none
Out of scope: frontmatter for plans, until a script reads them; making every kit file survive every formatter, such as table padding; a check for lines markdown joins; the release itself, which follows the release steps after this merges; updating shipyard's own install to `0.1.1`, the release steps' last step.

## Changes

- [x] 1. Spec: none; the plan format in `kit/core/plans.md` writes the header as a list, one item per field: Status, Human, Goal, Specs touched and Out of scope. The plan template's header is that list, and the plan check asks for those items · Evidence: render the template with GitHub's markdown API and capture five separate list items; run prettier at its defaults over the template and capture that it leaves the header unchanged
- [x] 2. Spec: none; each part's index in `kit/` writes Needs and Roles as list items, with building's Trigger label and the weekly drift check's Trigger beside them, and core's index says so. The CLI reads a part's needs from its Needs item, as it read the Needs line · Evidence: the CLI's tests assert that each module's needs come from the kit's real indexes, such as building needing core and dispatch; run the packed CLI's `init building` in a throwaway repo and capture that it refuses, naming dispatch
- [x] 3. Spec: none; the AGENTS.md block's trigger labels and skills are list items, in the block template and in the block the CLI writes, and the guide's by-hand step 4 matches · Evidence: run the packed CLI's `init` in a throwaway repo and capture the block; render it with GitHub's markdown API and capture two separate list items
- [x] 4. Spec: none; the guide says to keep a markdown formatter, such as a pre-commit hook or a CI format check, off `.shipyard/` and the AGENTS.md block, since a formatter's rewrite reads to `update` as a local edit. It says so where the CLI adoption checks ignore rules, in by-hand step 8, and where `update` stops on an edited file · Evidence: in a throwaway repo with prettier at its defaults, install from the packed CLI, add the ignore entries the guide names, run prettier over the repo, then run `update` and capture that every file matches
- [x] 5. Spec: none; the changelog has an Unreleased entry for these changes, whose "What a repo must do" list says to keep formatters off `.shipyard/` and the block · Evidence: in a throwaway repo installed from `0.1.0`, run the packed CLI's `update` and capture that it replaces the block with the list items and prints the entry

## Open questions

## Phases

### Phase 1: list items in the part indexes and the block · delivers Changes 2, 3 · about 1 h
- [x] Tests: the CLI: arguments in; files, stdout, stderr and exit code out: each part's needs, read from the kit's real indexes, are what their Needs items name; `init` writes the block's trigger labels and skills as list items
- [x] Code: the kit's part indexes and block template write those lines as list items, core's index says so, and the CLI reads the Needs item and fills the block's items

Notes: `node --test cli/` passes 30, up from 29. The new test drives `init` with each module alone through the kit's real indexes: building and the weekly drift check refuse, naming dispatch, and the rest install; it passes before and after the change, so it guards the Needs line's new form. The block tests failed first, then passed. The packed CLI's `init building` in a throwaway repo exits 1 with "building needs dispatch, which isn't taken." and writes nothing; its `init` writes `- Trigger labels: none` and `- Skills: none`. GitHub's markdown API renders those two, and building's Needs, Roles and Trigger label, as separate list items. The name stays "Needs line", as the guide and the CLI spec call it. Deviation: prettier also puts a blank line after the block's start marker, which would change the block's checksum, so the template now has one; a block `init` writes after a repo's own text comes through prettier unchanged. The four CI pieces' indexes still get table padding from prettier, out of scope.

### Phase 2: the plan header as a list · delivers Change 1 · about 0.5 h
- [x] Work: `kit/core/plans.md` and the plan template. Kit text only, which no seam reaches

Notes: the template's header is five list items, and the plan format and the plan check say so. GitHub's markdown API renders five separate list items; the Goal's and Out of scope's placeholders render empty, since GitHub drops angle-bracket text as HTML, as it did before. Prettier 3.6.2 at its defaults leaves the template unchanged.

### Phase 3: the guide and the changelog · delivers Changes 4, 5 · about 1 h
- [x] Work: `docs/guide/index.md` and `CHANGELOG.md`. Docs only, which no seam reaches

Notes: the guide states the formatter step in by-hand step 8, with the ignore file for `.shipyard/` and ignore comments around the block, outside the markers; the CLI adoption and Update point to it. In a throwaway repo installed from the packed CLI, prettier 3.6.2 at its defaults rewrites seven files in `.shipyard/` with no ignores, all table padding, and `update` then stops on them as edited; with the guide's ignores, prettier changes nothing and `update` prints "matches this release". For the changelog, a copy of the branch with `version` 0.1.1 and the Unreleased heading renamed, packed, updates a repo installed by `npx shipyard-kit@0.1.0 init`: it writes six files, replaces the block with the blank lines and list items, and prints the 0.1.1 entry and its step. `node --test cli/` passes 30, and the link check finds 166 relative links, none broken but the spec-index template's two placeholders, in `kit/` and its copy. Deviation, fixed in Phase 1's files: with ignore comments around the block, prettier took the end marker into the last list item and indented it, so the block template now has a blank line before the end marker too (`test(phase-1)` and `fix(phase-1)` commits); with that, prettier leaves `AGENTS.md` unchanged with or without the ignore comments.

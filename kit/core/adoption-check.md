# Adoption check

A repo that adopts shipyard often already instructs agents or shapes their work in ways that conflict with the parts it takes. The adoption check finds each conflict, and the human settles it, before the adoption merges.

## When

The planning agent runs it once `init` has written shipyard's files, on the adoption's branch, before the adoption merges. It runs again when a part is added, for that part.

## Before the first commit

Two checks run before committing what `init` wrote.

- Ignore rules keep the new files. Broad rules, such as `.*/` or `*.md`, drop them without a word. Use the settings file's paths in place of the `docs/` ones:

  ```sh
  git check-ignore .shipyard/settings.yml .shipyard/core/index.md AGENTS.md docs/product/index.md docs/agents/index.md docs/context.md
  ```

  Any path it prints is ignored, so change the rule that catches it.

- No formatter rewrites `.shipyard/` or the AGENTS.md block. List `.shipyard/` in its ignore file, and put its ignore comments around the AGENTS.md block, outside the markers. A formatter's rewrite reads to `update` as a local edit.

Found after the commit: fix the rule, restore what the formatter rewrote, and commit the fix on its own.

## Where to look

Every place the repo already instructs agents or shapes their work:

- `AGENTS.md` outside the AGENTS.md block
- other tools' entry files and rule folders
- skills and memory files
- contributing guides and PR templates
- commit hooks and format hooks
- CI workflows and ignore rules
- the repo's existing specs, agent rules and glossary

## What to compare

What each place says against what core says, one item each. The link names the kit page that sets core's side.

- Who edits and commits: [roles](roles.md), [git](practices/git.md).
- Branches and merging: [git](practices/git.md), and the branch names in the [settings file](templates/settings.yml).
- Commit format, such as a commit lint config whose types reject `spec`: [git](practices/git.md#commits).
- Where specs, plans and the repo's glossary live: `paths` in the [settings file](templates/settings.yml). Where `init` copied a template that duplicates a file the repo already keeps, such as a glossary at another path, delete the copy and set the repo's path under `paths`.
- Formatters that would rewrite `.shipyard/` or the AGENTS.md block: [Before the first commit](#before-the-first-commit).
- Test and verification rules: [testing](practices/testing.md), [verification](practices/verification.md).
- PR rules: [PR shapes](pr-shapes/index.md).
- What a CI workflow, a merge or a tag sets off, such as a deploy or a publish. It goes in the Rules section of the [agent rules index](templates/agent-rules-index.md#rules).

## Settling each conflict

Settling each conflict is a [human step](human-steps.md#human-steps). The planning agent asks about each conflict on its own: where the repo says it and what it says, what core says, the options, and a recommendation. It stops for the answer.

Each conflict ends as one of three outcomes, each in its own commit with the prefix the [git practice](practices/git.md#commits) gives:

- a settings value, such as the glossary's path under `paths`
- a [house rule](house-rules.md), where the repo's way wins
- the old instruction retired, or scoped to the work it still covers

When the check finds no conflict, the planning agent says so.

## Done condition

The adoption PR's description lists each conflict found, with its outcome and its commit, or says the check found none. That description is the step's [done condition](human-steps.md#done-conditions).

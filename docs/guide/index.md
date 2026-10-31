# Adopting shipyard by hand

How to copy the kit into your repo and plan with it. There is no CLI yet, so every step here is a copy or an edit you make yourself.

Terms in this guide are defined in the [kit glossary](../../kit/core/glossary.md).

## What works today

- **Core** works now: a human drafts plans with a planning agent, following the kit's plan format, practices and PR shapes. Core stops at an approved plan; without the building module, you build it your own way, written in your agent rules, keeping to the plan format and the practices.
- **Building, dispatch and the weekly drift check** describe bots that no skill drives yet. Copy them to read and try by hand; no bot runs them for you.
- **Verification** is reference text an agent can follow to write your repo's verification skill.
- **The CI pieces** state their interface but have no action code, so a CI workflow can't call them yet.

Shipyard assumes a GitHub repo: each plan's branch merges through a PR. A local-only repo can plan with core, but has nowhere to open the PR.

## 1. Get the kit

Clone shipyard beside your repo, not inside it, and note the commit you copy from. The commands below run from your repo's root:

```sh
git clone https://github.com/marcwiest/shipyard.git ../shipyard
git -C ../shipyard rev-parse HEAD
```

## 2. Choose the parts

Every repo takes core. Each module's `index.md` has a Needs line naming the other parts it needs and a Roles line naming the roles it uses; take a module only with what it needs.

| Setup | Parts |
| --- | --- |
| A human and a planning agent | `core` |
| Plus bots that build each plan on its PR | `core`, `dispatch`, `building` |
| Plus a weekly drift check | add `weekly-drift-check` |
| Plus verification | add `verification` |

## 3. Copy the parts into `.shipyard/`

Copy each part's folder from `kit/` into `.shipyard/` at your repo's root, keeping its name:

```sh
mkdir -p .shipyard
cp -R ../shipyard/kit/core .shipyard/core
# and each module you chose, such as:
# cp -R ../shipyard/kit/building .shipyard/building
```

These are managed files: don't edit them, so a later copy can replace them. `core/NOTICE.md` credits outside text the kit adapts; keep it with the files.

## 4. Fill the settings file

```sh
cp .shipyard/core/templates/settings.yml .shipyard/settings.yml
```

`.shipyard/settings.yml` is yours. Fill in at least:

- the planning agent's tool and how you start it, under `roles`
- the folders under `paths`, if your specs, agent rules, plans or glossary live elsewhere than the defaults
- the branch names under `branches`
- your install, check and test commands under `commands`; leave one empty until it exists, and the plan that adds it fills it in
- your seams, where tests touch the code, one short phrase each

Leave a role empty if no part you took uses it. Settings that no part you took reads do nothing; keep their defaults. [The example setup](../../examples/maintainer/settings.yml) shows a filled one.

## 5. Point your agents at it

Add the contents of `.shipyard/core/templates/agents-block.md` to your repo's `AGENTS.md`, creating the file if it's missing. Keep the marker lines. Fill in the trigger labels and skills lines; without dispatch or skills, both are "none".

Beside `AGENTS.md`, add a `CLAUDE.md` holding only `@AGENTS.md`, since Claude Code doesn't read `AGENTS.md`. Do the same beside any other `AGENTS.md` in the repo.

If another agent tool you use doesn't read `AGENTS.md`, add a one-line pointer to it in that tool's own entry file.

## 6. Create your own specs, agent rules and glossary

Create the folders your settings file names, then copy each template once to its path and fill its placeholders:

```sh
mkdir -p docs/product docs/agents   # or the paths in your settings file; the plans folder comes with the first plan
```

| Template | Copy to |
| --- | --- |
| `.shipyard/core/templates/spec-index.md` | `<paths.specs>/index.md` |
| `.shipyard/core/templates/agent-rules-index.md` | `<paths.agent-rules>/index.md` |
| `.shipyard/core/templates/CONTEXT.md` | `<paths.glossary>` |

The copies are yours. Where you have nothing for a section yet, as in a new project, delete its placeholder line and leave the heading; a heading that is itself a placeholder, such as `## <Group>`, goes too. The spec index's reading order lists only spec files that exist, so leave it empty until you write one.

If you don't take the building module, write in the agent rules index's Building plans section how you build an approved plan: the PR shape of the plan's PR, and who adds the phases, builds and verifies each one, and keeps the plan record.

The plan template stays in `.shipyard/`; the planning agent copies it for each plan.

## 7. Add house rules, if you have any

House rules are your opinions, such as phase size or merge style. They go in the House rules section of your agent rules index; a long list can move to its own file in the agent rules folder, linked from that section. None are on by default. [The maintainer's](../../examples/maintainer/house-rules.md) are an example.

## 8. Write the version record

Write `.shipyard/version.yml`, naming what you copied from and a checksum per managed file:

```sh
(
  cd .shipyard
  {
    echo 'release: ""   # none yet'
    echo "commit: $(git -C ../../shipyard rev-parse HEAD)"
    echo "files:"
    find . -type f ! -path ./settings.yml ! -path ./version.yml -exec sh -c \
      'if command -v sha256sum >/dev/null; then sha256sum "$@"; else shasum -a 256 "$@"; fi' sh {} + \
      | sort -k2 | awk '{ sub(/^\.\//, "", $2); print "  " $2 ": " $1 }'
  } > version.yml
)
```

## 9. Commit and plan

Commit the files, such as `chore: adopt shipyard core`. In a repo that already has a default branch, do it on a branch and merge it through a PR, as the [git practice](../../kit/core/practices/git.md) asks.

Then open a session with your planning agent and ask it to plan a change. It reads the `AGENTS.md` block and follows `.shipyard/core/plans.md`.

## Updating and removing

- To update, compare each managed file's checksum with `version.yml` first. A mismatch is a local edit that the copy would overwrite. Then copy the parts again and rewrite the version record. Never copy over your settings file or the templates you copied.
- To remove shipyard, delete `.shipyard/` and the `AGENTS.md` block. `CLAUDE.md` and any other pointer from step 5 can stay; they only load `AGENTS.md`.

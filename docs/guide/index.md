# Adopting shipyard

How to install, update and remove shipyard in your repo. The CLI does each with one command, from release `0.1.0` on. Before that release, or if you'd rather, [copy the kit by hand](#adopting-by-hand).

Terms in this guide are defined in the [kit glossary](../../kit/core/glossary.md).

## What works today

- **Core** works now: a human drafts plans with a planning agent, following the kit's plan format, practices and PR shapes. Core stops at an approved plan; without the building module, you build it your own way, written in your agent rules, keeping to the plan format and the practices.
- **Building, dispatch and the weekly drift check** describe bots that no skill drives yet. Take them to read and try by hand; no bot runs them for you.
- **Verification** is reference text an agent can follow to write your repo's verification skill.
- **The CI pieces** state their interface but have no action code, so a CI workflow can't call them yet.

Shipyard assumes a GitHub repo: each plan's branch merges through a PR. A local-only repo can plan with core, but has nowhere to open the PR.

## Choose the parts

Every repo takes core. Each module's `index.md` has a Needs line naming the other parts it needs and a Roles line naming the roles it uses; take a module only with what it needs.

| Setup | Parts |
| --- | --- |
| A human and a planning agent | `core` |
| Plus bots that build each plan on its PR | `core`, `dispatch`, `building` |
| Plus a weekly drift check | add `weekly-drift-check` |
| Plus verification | add `verification` |

## Adopt it with the CLI

The CLI runs with Node 22 or later, from your repo's root, at a pinned release: replace `x.y.z` below with the release you want, `0.1.0` or later. The [changelog](../../CHANGELOG.md) lists the releases.

Its output ends with numbered next steps, written for an agent to carry out, so the easiest way is to give your agent a prompt such as:

> Adopt shipyard x.y.z with core, building and dispatch: run the init, commit what it wrote on its own, then finish what its output asks in separate commits, and show me the diff.

The command it runs, naming the modules after `init`, or none for core alone:

```sh
npx shipyard-kit@x.y.z init building dispatch
```

It copies the parts into `.shipyard/`, writes the settings file with the keys those parts read, adds the block to `AGENTS.md`, adds `CLAUDE.md` if you have none, copies the spec index, agent rules index and glossary templates where you have none, and writes the version record. It stops before writing anything if a file it would write has uncommitted changes, so commit your own work first. Before committing what it wrote, check that your ignore rules keep the new files, as in [step 8 by hand](#8-commit-and-plan).

Then fill in what its next steps name, such as the settings file and the templates. Keep your own instructions in your agent rules and your opinions in their House rules section, which win over kit text; never edit `.shipyard/` other than `settings.yml`. In a repo that already has a default branch, commit on a branch and merge it through a PR, as the [git practice](../../kit/core/practices/git.md) asks.

Then open a session with your planning agent and ask it to plan a change. It reads the `AGENTS.md` block and follows `.shipyard/core/plans.md`.

To add a module later, run `init` again with its name, at the release you have installed.

## Update it

> Update shipyard to x.y.z: run the update, commit what it wrote on its own, then finish what its output asks in separate commits, and show me the diff.

```sh
npx shipyard-kit@x.y.z update
```

It replaces the managed files and the `AGENTS.md` block, deletes the files the new release dropped, and rewrites the version record. It never touches your settings file or other files you own. Its next steps list any settings lines the new release reads that your file lacks, and what the changelog asks of your repo for each release since yours.

If a managed file or the block was edited in your repo, it stops before writing and lists them. Move each edit to a file you own, such as your agent rules, then run it again with `--force` to overwrite them. It refuses to go back to an older release: to go back, revert the commit that updated shipyard.

A repo that copied the kit by hand switches to the CLI the same way: `update` reads the version record written by hand and rewrites it.

## Remove it

> Remove shipyard: run the remove, commit what it removed on its own, then finish what its output asks in separate commits, and show me the diff.

```sh
npx shipyard-kit@x.y.z remove
```

It deletes `.shipyard/`, your settings file with it, and the `AGENTS.md` block, and deletes `AGENTS.md` if nothing else is in it. It leaves `CLAUDE.md` and the templates it copied, which are yours, and lists them.

## Adopting by hand

Every step here is a copy or an edit you make yourself. Choose the parts first, as [above](#choose-the-parts).

### 1. Get the kit

Clone shipyard anywhere outside your repo and note the commit you copy from. You need the clone only for steps 2 and 7 below; your repo doesn't depend on it afterward. The commands below run from your repo's root and assume the clone sits beside your repo, so adjust `../shipyard` in step 2 and `../../shipyard` in step 7 if it doesn't:

```sh
git clone https://github.com/marcwiest/shipyard.git ../shipyard
git -C ../shipyard rev-parse HEAD
```

### 2. Copy the parts into `.shipyard/`

Copy each part's folder from `kit/` into `.shipyard/` at your repo's root, keeping its name:

```sh
mkdir -p .shipyard
cp -R ../shipyard/kit/core .shipyard/core
# and each module you chose, such as:
# cp -R ../shipyard/kit/building .shipyard/building
```

These are managed files: don't edit them, so a later copy can replace them. `core/NOTICE.md` credits outside text the kit adapts; keep it with the files.

### 3. Fill the settings file

```sh
cp .shipyard/core/templates/settings.yml .shipyard/settings.yml
```

`.shipyard/settings.yml` is yours. First look at what your repo already runs, such as its CI workflows and its release or deploy flows. Adoption records what exists and sets nothing up.

Fill in at least:

- the planning agent's tool and how you start it, under `roles`
- the folders under `paths`, if your specs, agent rules, plans or glossary live elsewhere than the defaults
- the branch names under `branches`
- your install, check and test commands under `commands`, matching what CI runs so a local pass predicts its result; leave one empty until it exists, and the plan that adds it fills it in
- your seams, where tests touch the code, one short phrase each

Keys marked `# read by:` matter only to the parts they name: delete those of parts you didn't take, or keep their defaults. [The example setup](../../examples/maintainer/settings.yml) shows a filled one.

### 4. Point your agents at it

Add the contents of `.shipyard/core/templates/agents-block.md` to your repo's `AGENTS.md`, creating the file if it's missing. Keep the marker lines. Fill in the trigger labels and skills lines; without dispatch or skills, both are "none".

Beside `AGENTS.md`, add a `CLAUDE.md` holding only `@AGENTS.md`, since Claude Code doesn't read `AGENTS.md`. Do the same beside any other `AGENTS.md` in the repo.

If another agent tool you use doesn't read `AGENTS.md`, add a one-line pointer to it in that tool's own entry file.

### 5. Create your own specs, agent rules and glossary

Create the folders your settings file names, then copy each template once to its path and fill its placeholders:

```sh
mkdir -p docs/product docs/agents   # or the paths in your settings file; the plans folder comes with the first plan
```

| Template | Copy to |
| --- | --- |
| `.shipyard/core/templates/spec-index.md` | `<paths.specs>/index.md` |
| `.shipyard/core/templates/agent-rules-index.md` | `<paths.agent-rules>/index.md` |
| `.shipyard/core/templates/context.md` | `<paths.glossary>` |

The copies are yours. Where you have nothing for a section yet, as in a new project, delete its placeholder line and leave the heading; a heading that is itself a placeholder, such as `## <Group>`, goes too. The spec index's reading order lists only spec files that exist, so leave it empty until you write one.

If a merge or a tag sets anything off in your repo, such as a deploy or a publish, say so in the agent rules index's Rules section.

If you don't take the building module, write in the agent rules index's Building plans section how you build an approved plan: who adds the phases, builds and verifies each one, and keeps the plan record. The plan's PR takes core's [plan PR](../../kit/core/pr-shapes/plan.md) shape, unless you name another there.

The plan template stays in `.shipyard/`; the planning agent copies it for each plan.

### 6. Add house rules, if you have any

House rules are your opinions, such as phase size or merge style. They go in the House rules section of your agent rules index; a long list can move to its own file in the agent rules folder, linked from that section. None are on by default. [The maintainer's](../../examples/maintainer/house-rules.md) are an example.

### 7. Write the version record

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

### 8. Commit and plan

Before committing, check that your ignore rules keep the new files. Broad rules, such as `.*/` or `*.md`, drop them without a word. Use your settings file's paths in place of the `docs/` ones:

```sh
git check-ignore .shipyard/settings.yml .shipyard/core/index.md AGENTS.md CLAUDE.md docs/product/index.md docs/agents/index.md docs/context.md
```

Any path it prints is ignored, so change the rule that catches it.

Commit the files, such as `chore: adopt shipyard core`. In a repo that already has a default branch, do it on a branch and merge it through a PR, as the [git practice](../../kit/core/practices/git.md) asks.

Then open a session with your planning agent and ask it to plan a change. It reads the `AGENTS.md` block and follows `.shipyard/core/plans.md`.

### Updating and removing by hand

- To update, compare each managed file's checksum with `version.yml` first. A mismatch is a local edit that the copy would overwrite. Then copy the parts again and rewrite the version record. Never copy over your settings file or the templates you copied.
- To remove shipyard, delete `.shipyard/` and the `AGENTS.md` block. `CLAUDE.md` and any other pointer from step 4 can stay; they only load `AGENTS.md`.

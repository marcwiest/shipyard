# Adoption

How shipyard gets into an adopting repo and stays current there.

## Core and modules

Each part of the kit has an index that says what the part holds and the modules and roles it needs.

- **Core**: [`kit/core/`](../../kit/core/index.md). Every adopting repo takes it. It works with a human and a planning agent alone.
- **Modules**, each taken or left on its own:
  - [Building](../../kit/building/index.md)
  - [Dispatch](../../kit/dispatch/index.md)
  - [Verification](../../kit/verification/index.md)
  - [Weekly drift check](../../kit/weekly-drift-check/index.md)
  - One per CI piece: [docs-only detection](../../kit/docs-only-detection/index.md), [test output cap](../../kit/test-output-cap/index.md), [docs index check](../../kit/docs-index-check/index.md) and [coverage floor](../../kit/coverage-floor/index.md)
- House rules are never on by default. Shipyard's are an example.

## Getting in

- A CLI, run at a pinned release without installing it (such as `npx <package>@x.y.z`), copies files into the repo and writes the version record.
- Files are copied into the repo, never left in `node_modules` for agents to read. Bots run on the checkout, often before dependencies are installed.
- The files are plain, so copying by hand also works. The version record is then written by hand.
- CI pieces are not copied. The adopting repo's own CI workflows call them at a release tag; those CI workflows ship as templates and set the trigger, runner and permissions. A dependency update tool can bump the tag.

## Ownership

- **Managed files**: skills, discovery stubs, workflows, PR shapes, practices, template sources and the kit glossary. Shipyard owns them; the adopting repo never edits them.
- **Repo-owned files**: copied templates, the settings file, and the repo's specs, agent rules and house rules. Shipyard never touches them after copying.
- **Settings file**: `.shipyard/settings.yml`, in YAML. It holds the repo's conventions, which skills read instead of hardcoding: role mapping, label prefix, who may add trigger labels, how the human is notified, branch names, commands, seams, verification surfaces, and the spec and agent rules folders (by default `docs/product/` and `docs/agents/`).
- CI pieces read the settings file themselves, from the default branch, so a PR can't change the settings that act on it. Inputs only carry values that matter to CI alone, such as the test output cap.
- An adopting repo keeps its house rules in its own agent rules.

## In an adopting repo

- `.shipyard/` holds everything the CLI writes, at a fixed path: one folder per installed part of the kit, mirroring `kit/`, plus the version record. The settings file is the one repo-owned file in it.
- Each skill gets a discovery stub in the skills folder of every tool the role mapping names, and only those.
- Template sources stay in `.shipyard/` as managed files, so skills can read them. Each copy made from them, such as a plan or a spec page, is repo-owned.
- Agents reach managed files by a named path: a stub, the AGENTS.md block or a skill step. Nothing depends on search tools that skip hidden folders.
- Removing shipyard means deleting `.shipyard/`, the stubs and the AGENTS.md block. The version record lists every managed file.

## Updates

- An update replaces managed files and never touches repo-owned files.
- The version record keeps a checksum per managed file. A managed file edited in the repo is flagged before it is overwritten.
- Template changes appear in the changelog as optional manual steps. A major release lists the actions a repo must take.

## Agent entry files

- Shipyard adds one marked block to AGENTS.md, creating the file if it's missing. Updates replace only what is between the markers. It is the only shipyard content inside a repo-owned file.
- A tool that doesn't read AGENTS.md gets a one-line pointer from its own entry file.

## Shipyard's own docs

- Shipyard's `docs/product/`, `docs/agents/` and `CONTEXT.md` describe shipyard and are never copied. They are made with the same templates and workflows, and serve as a worked example.
- An adopting repo creates its own from templates and skills, such as bootstrap, at the paths in its settings file.
- Instructions for adopting shipyard live in the README and the guide.
- Shipyard installs its own last release into `.shipyard/` like any adopting repo, and its agents follow that copy. A PR that edits `kit/` doesn't change the rules the agents working on it follow.

**Today:** no CLI, settings file, templates, README or guide exist yet, so shipyard doesn't install its own release. The npm package name for the CLI is open, since `shipyard` is taken.

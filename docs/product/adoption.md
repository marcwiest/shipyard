# Adoption

How shipyard gets into an adopting repo and stays current there.

## Core and modules

- **Core**: the plan format and the plan check, the practices, a place for specs, a place for agent rules, and the AGENTS.md block. It works with a human and a planning agent alone.
- **Modules**: building (the phased PR, the bot skills and the PR comment conventions), verification (the verification skill's shape and the Feature Map), the weekly drift check, and each CI piece on its own. Each module names the modules and roles it needs.
- House rules are never on by default. Shipyard's are an example.

## Getting in

- A CLI, run at a pinned release without installing it (such as `npx shipyard@x.y.z`), copies files into the repo and writes the version record.
- Files are copied into the repo, never left in `node_modules` for agents to read. Bots run on the checkout, often before dependencies are installed.
- The files are plain, so copying by hand also works. The version record is then written by hand.
- CI pieces are not copied. The adopting repo's CI workflow calls them at a release tag and configures them through inputs. A dependency update tool can bump the tag.

## Ownership

- **Managed files**: skills, discovery stubs, workflows, PR shapes and practices. Shipyard owns them; the adopting repo never edits them.
- **Repo-owned files**: copied templates, the settings file, and the repo's specs, agent rules and house rules. Shipyard never touches them after copying.
- **Settings file**: the repo's conventions, which skills read instead of hardcoding: role mapping, label prefix, who may add trigger labels, how the human is notified, branch names, commands, seams, verification surfaces, and the spec and agent rules folders (by default `docs/product/` and `docs/agents/`). CI pieces take the same values as inputs.
- An adopting repo keeps its house rules in its own agent rules.

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

**Today:** no CLI, settings file, templates, README or guide exist yet. Where managed files sit in an adopting repo, and where the distributed files sit in shipyard's own repo, is not decided yet.

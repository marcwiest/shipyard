# Shape

Shipyard is plain files in a git repo. The plain files are the source; nothing else is.

## What it ships

- **Skills**: what agents run. Each skill has one source file plus a discovery stub per tool, and a CI check confirms the stubs.
- **Workflows, PR shapes and practices**: reference text that skills cite and humans read. They hold only mechanics; opinions are house rules. Each workflow names its trigger, its steps, the roles that take part and the PR shapes it produces. Every PR shape fills the same fields.
- **Templates**: files an adopting repo copies and then owns, such as the plan skeleton or the docs layout.
- **CI pieces**: GitHub Actions an adopting repo's CI workflows call at a release tag.
- **The example setup**: the maintainer's role mapping and house rules.

Everything a bot needs lives in the adopting repo, because bots run autonomously on its checkout. Nothing installed on the human's machine reaches them.

A plugin for one agent tool may later wrap the same files. It never becomes the source (see [later](later.md)).

## Layout

| Path | Holds |
| --- | --- |
| `kit/core/`, `kit/<module>/` | The kit: one folder per part, each with an index naming what it needs, and its workflows, PR shapes, practices, skills, templates and CI pieces |
| `examples/maintainer/` | The example setup: a filled settings file with the role mapping, and the house rules written as agent rules |
| `.github/` | Shipyard's own CI only. It calls the CI pieces from `kit/` at the current commit |
| `docs/product/`, `docs/agents/`, `CONTEXT.md` | Shipyard's own specs, agent rules and glossary. Never copied |
| `docs/guide/`, `README.md`, `CHANGELOG.md` | Instructions for adopters and the release history |
| `AGENTS.md`, `CLAUDE.md`, `LICENSE` | Shipyard's own agent entry file, pointing to `docs/agents/index.md`, its `CLAUDE.md` sibling, and the MIT license |

The CLI's own code sits beside these.

- The kit holds what agents and humans do in an adopting repo: roles, workflows, PR shapes, practices, labels, skills, the kit glossary, and where house rules go.
- `docs/product/` holds what shipyard is and what its own tooling does: what the kit contains, the CLI, the CI pieces, releases, principles and refusals.
- Core holds what every workflow shares, such as the practices, the plan format and the PR shape fields. A new PR shape is one file in the module that produces it. A different approach to the same job is a sibling module that reuses core and never copies its text.

**Today:** `.github/`, `CHANGELOG.md` and the CLI don't exist yet.

## Platform

Shipyard assumes GitHub: PRs, PR comments, labels, CI workflows, branch rules and tag rules. GitHub is the platform, not a role, so it never appears in a role mapping.

## Outside skills

Shipyard depends on no outside skill. A mechanic can define a skill's shape, such as the verification skill's. Which outside skill builds or maintains it is a house rule.

## Outside text

- Where kit text adapts text from an outside source, `kit/core/NOTICE.md` lists the source, the kit files derived from it and its license text. It ships with core, so the notice travels with the copied text.
- Each derived file ends with a one-line pointer to its entry in the notice.
- An entry and its pointers are removed once a rewrite leaves no listed file derived from that source.
- Ideas taken without their text are credited in the README only.

## Releases

- Each release is a git tag. The files at that tag are the release.
- Release numbers follow semver:
  - **Major**: an adopting repo must act, such as a renamed plan field, a changed PR comment header, or a renamed or split skill.
  - **Minor**: something new that nobody has to use, such as a new skill, PR shape or CI piece.
  - **Patch**: wording and fixes that change no behavior.
- A changelog entry per release says what changed and whether an adopting repo must act.
- Each adopting repo keeps a version record naming the release its files came from (see [adoption](adoption.md)).

**Today:** no release, no changelog.

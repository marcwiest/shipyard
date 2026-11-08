# Shape

Shipyard is plain files in a git repo. The plain files are the source; nothing else is.

## What it ships

- **Skills**: what agents run. Each skill has one source file plus a discovery stub per tool, and a CI check confirms the stubs.
- **Workflows, PR shapes and practices**: reference text that skills cite and humans read. They hold only mechanics; opinions are house rules. Each workflow names its trigger, its steps, the roles that take part and the PR shapes it produces. Every PR shape fills the same fields.
- **Templates**: files an adopting repo copies and then owns, such as the plan skeleton or the docs layout.
- **CI pieces**: GitHub Actions an adopting repo's CI workflows call at a release tag.
- **The example setup**: the maintainer's role mapping and house rules.
- **The plan check**: a script the CLI runs. It only lists missing required items, so it needs no agent, and a CI piece can run it on PRs later.

Everything a bot needs lives in the adopting repo, because bots run autonomously on its checkout. Nothing installed on the human's machine reaches them.

A plugin for one agent tool may later wrap the same files. It never becomes the source (see [later](later.md)).

**Today:** no plan check script exists; agents run the check by reading core's [plans](../../kit/core/plans.md).

## Layout

| Path | Holds |
| --- | --- |
| `kit/core/`, `kit/<module>/` | The kit: one folder per part, each with an index naming what it needs, and its workflows, PR shapes, practices, skills, templates and CI pieces |
| `examples/maintainer/` | The example setup: a filled settings file with the role mapping, and the house rules written as agent rules |
| `.github/` | Shipyard's own CI only. It calls the CI pieces from `kit/` at the current commit, the docs index check on `docs/product/` among them, and checks every link in tracked markdown files |
| `docs/product/`, `docs/agents/`, `docs/context.md` | Shipyard's own specs, agent rules and glossary. Never copied |
| `docs/guide/`, `README.md`, `CHANGELOG.md` | Instructions for adopters and the release history |
| `AGENTS.md`, `LICENSE` | Shipyard's own agent entry file, pointing to `docs/agents/index.md`, and the MIT license |
| `cli/` | The [CLI](cli.md)'s code and its tests |
| `package.json` | Publishes `cli/`, `kit/` and `CHANGELOG.md` as the npm package `shipyard-kit`, with no dependencies and no build step, on Node 22 or later. Its version is the release number |

- The kit holds what agents and humans do in an adopting repo: roles, workflows, PR shapes, practices, labels, skills, the kit glossary, and where house rules go.
- `docs/product/` holds what shipyard is and what its own tooling does: what the kit contains, the CLI, the CI pieces, releases, principles and refusals.
- Core holds what every workflow shares, such as the practices, the plan format and the PR shape fields. A new PR shape is one file in the module that produces it. A different approach to the same job is a sibling module that reuses core and never copies its text.

**Today:** `.github/` doesn't exist yet, and the CLI has no release.

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
- Each release publishes `shipyard-kit` to npm at the same version, from its tag. The human publishes it, following the release steps in `docs/agents/`.
- Release numbers follow semver:
  - **Major**: an adopting repo must act, such as a renamed plan field, a changed PR comment header, or a renamed or split skill.
  - **Minor**: something new that nobody has to use, such as a new skill, PR shape or CI piece.
  - **Patch**: wording and fixes that change no behavior.
- `CHANGELOG.md` has one entry per release under a `## x.y.z` heading: a short summary and a "What a repo must do" list, empty when there's nothing. It ships in the package; the CLI prints the entries a repo's update spans, so nobody reads the whole file.
- Each adopting repo keeps a version record naming the release its files came from (see [adoption](adoption.md)).
- Before each release, a few short scenario runs pass in a small sample repo: fresh agents adopt the kit by the guide and plan a change. They stay small while shipyard is early; real use in adopting repos is the main test, and more checks come as that use shows where they are needed.
- Before each release, an agent reads the kit, `docs/product/`, the guide and the README together for terms used without a glossary entry and rules with more than one home. The human examines its findings before tagging.

**Today:** no release and no scenario runs; the changelog holds only an Unreleased entry. Until `.github/` exists, the link check runs by hand before each release.

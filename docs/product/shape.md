# Shape

Shipyard is plain files in a git repo. The plain files are the source; nothing else is.

## What it ships

- **Skills**: what agents run. Each skill has one source file plus a discovery stub per tool.
- **Workflows, PR shapes and practices**: reference text that skills cite and humans read.
- **Templates**: files an adopting repo copies and then owns, such as the plan skeleton or the docs layout.
- **CI pieces**: CI workflows an adopting repo calls at a release tag.
- **The example setup**: the maintainer's role mapping and house rules.

Everything a bot needs lives in the adopting repo, because bots run unattended on its checkout. Nothing installed on the human's machine reaches them.

A plugin for one agent tool may later wrap the same files. It never becomes the source (see [later](later.md)).

## Platform

Shipyard assumes GitHub: PRs, PR comments, CI workflows, branch rules and tag rules. GitHub is the platform, not a role, so it never appears in a role mapping.

## Outside skills

Shipyard depends on no outside skill. A mechanic can define a skill's shape, such as the verification skill's. Which outside skill builds or maintains it is a house rule.

## Releases

- Each release is a git tag. The files at that tag are the release.
- Release numbers follow semver:
  - **Major**: an adopting repo must act, such as a renamed plan field, a changed PR comment header, or a renamed or split skill.
  - **Minor**: something new that nobody has to use, such as a new skill, PR shape or CI piece.
  - **Patch**: wording and fixes that change no behavior.
- A changelog entry per release says what changed and whether an adopting repo must act.
- Each adopting repo keeps a version record naming the release its files came from (see [adoption](adoption.md)).

**Today:** no release, no changelog.

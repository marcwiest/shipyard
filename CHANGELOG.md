# Changelog

One entry per release, newest first, under a `## x.y.z` heading: a short summary, then a "What a repo must do" list, empty when there's nothing. `npx shipyard-kit@x.y.z update` prints the entries after a repo's installed release.

## Unreleased

Lines that markdown joined into one paragraph are list items now: a plan's header lines, each part's Needs and Roles lines, and the AGENTS.md block's trigger labels and skills lines. GitHub shows them as separate lines, and a markdown formatter such as prettier leaves them as written. The guide says to keep formatters off `.shipyard/` and the block.

### What a repo must do

- Keep any markdown formatter, such as a pre-commit hook or a CI format check, off `.shipyard/` and the AGENTS.md block, as the guide's step 8 says. A formatter's rewrite reads to `update` as a local edit.

## 0.1.0

The CLI: `npx shipyard-kit@x.y.z` installs, updates and removes shipyard's parts, in place of copying them by hand. Its `update` reads a version record written by hand.

### What a repo must do

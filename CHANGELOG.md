# Changelog

One entry per release, newest first, under a `## x.y.z` heading: a short summary, then a "What a repo must do" list, empty when there's nothing. `npx shipyard-kit@x.y.z update` prints the entries after a repo's installed release.

## Unreleased

The adoption check is a new core page: the planning agent finds where a repo's own agent instructions, glossary and tooling conflict with the parts installed, and the human settles each one before the adoption merges. `init`'s next steps end with it, and say to delete a copied template that duplicates a file the repo keeps. A repo adopted earlier may run the check once.

### What a repo must do

## 0.1.2

The planning agent stops for an unmerged adoption before starting a plan's branch. It reads core's practices before drafting. `update`'s refusal names each new version by its path in the release, then its path in the package.

### What a repo must do

## 0.1.1

Lines that markdown joined into one paragraph are list items now: a plan's header lines, each part's Needs and Roles lines, and the AGENTS.md block's trigger labels and skills lines. GitHub shows them as separate lines, and a markdown formatter such as prettier leaves them as written. The guide says to keep formatters off `.shipyard/` and the block.

### What a repo must do

- Keep any markdown formatter, such as a pre-commit hook or a CI format check, off `.shipyard/` and the AGENTS.md block, as the guide's step 8 says. A formatter's rewrite reads to `update` as a local edit.

## 0.1.0

The CLI: `npx shipyard-kit@x.y.z` installs, updates and removes shipyard's parts, in place of copying them by hand. Its `update` reads a version record written by hand.

### What a repo must do

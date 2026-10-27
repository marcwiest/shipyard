# Git workflow

Trunk-based, for autonomous agents. Concept only; nothing is set up yet.

## Branches

- `main` is the trunk. Never worked on directly; it only receives squash-merged PRs: one commit per PR on main, phase commits stay in the PR (kept, owner, 2026-10-26).
- `main` protection: required CI, branch up to date before merge, linear history, rules apply to admins, no force pushes.
- Plan branch: `plan/<slug>`, touches only `docs/plans/<slug>.md`.
- Work branch: `work/<slug>` (owner, 2026-10-27), cut from `main` after the plan has landed.
- Keeping work branches current (owner, 2026-10-27): the Coding bot runs GitHub's "Update branch" (merge from `main`) at the start of a phase if the branch is behind, and before handoff. On a conflict, the Coding bot first asks Claude review to look at it (`@claude review conflict`); Claude names the conflicting files and how to resolve them. The Coding bot then hands that to the cloud agent as a fix round. A conflict in `docs/product/` goes to the owner.
- A phased PR is one built from a plan file. No CI job needs to detect it; the Coding bot knows its plan (owner, 2026-10-26).
- No `develop`, no release branches, no back-merges, no emergency self-approval.
- GitHub auto-deletes branches after merge. No delay: merged PRs keep their commits and offer "Restore branch".

## Plan lifecycle

1. The owner drafts the plan anywhere; it stays unpushed until ready.
2. When ready and checked with the Project Management bot, it lands on `main` through a `plan/<slug>` PR, which the owner's local CLI agent opens and merges (owner, 2026-10-27). All open plans live side by side in `docs/plans/` on `main`.
3. The project's Project Management bot handing the ready plan to the Coding bot is the go (owner, 2026-10-26).
4. The work branch starts from `main` and already contains the plan. The PR body links the plan file.
5. After ticking the last phase, the Coding bot deletes the plan file in its final plan-record commit (owner, 2026-10-26), so the merge removes it from `main`. The plan stays in the PR's changed files and git history. No `_completed/` folder.
6. Several plans can run at once; each has its own file, branch and PR.
7. Plans in public repos are public once their `plan/<slug>` branch is pushed.

## Commits

- Conventional prefixes with phase: `docs(phase-N):` for the spec commit first, then `test(phase-N):` for failing tests, then `feat(phase-N):` or `fix(phase-N):`.
- The Coding bot's plan-record commit: `chore(phase-N): plan record`, after the phase review (owner, 2026-10-26).
- Squash commit message is the PR title in conventional form.

## Merge and release

- The owner alone merges, by hand or through their local CLI agent on their say-so (owner, 2026-10-27).
- Each plan merges as soon as it is done; plans are never held to merge together (owner, 2026-10-27).
- Release after each merged plan by default (optional); the bump follows the PR title (`feat` minor, `fix` patch, `!` major) (owner, 2026-10-27).
- Release by tag (for example `<package>/vX.Y.Z`); a tag push deploys. Release tags are owner-only, enforced by a tag rule.
- Hotfix: fix on `main` by PR and tag from `main`. If `main` holds unreleased work that can't ship, branch from the released tag, fix, tag, and land the same fix on `main` by PR the same day. Owner-only (owner, 2026-10-27).
- Release notes are generated from the merged PRs and their plans.
- Shared package updates: Renovate opens an update PR in each repo that uses the package (owner, 2026-10-26). One shared preset in the shared workflow repo, Dependency Dashboard off (no GitHub issues). The Coding bot reviews open Renovate PRs in the weekly run per repo (see `knowledge-and-planning.md`, Content drift): CI runs the full test suite on them; where a repo's CI runs only part of it, the Coding bot runs the rest first. Then one `@claude review` each, a one-line verdict on the PR, and one line to the owner listing them (red CI marked "needs a look"). The owner merges (owner, 2026-10-27).

## Decided

- No test-change check in CI. Test changes are judged in review (see `testing-workflow.md`, Tests the code can't bend) (owner, 2026-10-27).
- Claude review: runs after every phase, triggered by the Coding bot. Not a required check, since a required check only counts on the PR's newest commit, which lands after the last review (owner, 2026-10-26). Its verdict is advisory and feeds the Coding bot's review; the owner decides the merge.
- Claude review, the docs-only detection and the test output cap (see `testing-workflow.md`) (owner, 2026-10-27) live in one shared reusable workflow in the shared workflow repo: `shipyard`, one public repo on the owner's personal GitHub account (owner, 2026-10-27), called by every repo in every org. It must be public because public repos can't call workflows from a private repo (owner, 2026-10-26).
- Docs-only PRs still go through a PR (no direct pushes to main, no bypass). A changes job detects docs-only diffs (docs/**, *.md); build and test jobs then report skipped, which satisfies required checks.

## Still open

- (none)

# House rules

The maintainer's house rules, written as agent rules. They apply on top of the kit's workflows and change none of them.

## Plans

- Keep phases to about 3 hours of work for a developer who knows the repo, with a 150k context target. Estimate context at about 20k to start plus about 43k per hour of work.
- Where the builder bot's tool reports tokens, measure context as input plus cache-read plus cache-creation tokens, at the start, end and peak of a run.
- Draft plans with a slim planning skill modeled on pstack's multi-phase plan playbook, grounded with pstack's `how` and `why`.
- Design bigger changes with pstack's `/architect`: types and signatures first, candidates compared, a design scrapped when the evidence turns against it.
- Delete the plan file when the plan is done; its PR keeps the record.
- Never mention a plan file in the spec or other docs, such as the README. Docs describe the codebase, not the work that changed it, and the plan file is deleted when done.
- Keep no ADRs, GitHub issues or PR template.

## Building

- Run the restatement with pstack's `/in-your-own-words`.
- The builder bot runs on `<model>` (per repo) at high effort. Change the model only on purpose.
- Keep the Sizing log in the repo where its run data may be public, and outside it where it may not.

## Tests

- Never lower the coverage floor.
- Run mutation testing only with the human's approval, each time. A surviving mutant is evidence, not a task; never silence one with a disable comment.
- Test packages through their exports, imported by package name, never by internal path. Lint enforces it.

## Verification

- Drive browsers with CDP, not Playwright. The verification CLI is the default way to drive the app; a browser devtools MCP server is for digging in by hand.
- Set up the builder bot's MCP servers in its tool's own dashboard, since a local install doesn't carry over.
- Create and maintain the verification skill with pstack's verification skills. The weekly drift check runs pstack's `/maintain-verification-skill` for its verification skill step.
- No formal verification skills, swarms or fan-out verification until the base verification skill works.

## Specs

- Write specs with pstack's `/technical-writing`, which keeps tutorial, how-to, reference and explanation apart.
- Keep the direction in a north star file, the one explanation-style doc. The README opens with a sentence or two of purpose and links to it.

## Git and releases

- Trunk only: no `develop`, release branches or back-merges.
- The default branch requires CI and an up-to-date branch before merge, keeps a linear history, applies its rules to admins and allows no force pushes. No emergency self-approval.
- Squash merges. The squash commit message is the PR title in conventional form.
- Delete branches after merge.
- Each plan merges as soon as it is done; plans are never held to merge together.
- A release follows each merged plan. Its bump follows the PR title: `feat` minor, `fix` patch, `!` major. Release notes come from the merged PRs and their plans.
- A tag rule lets only humans push release tags. A tag push deploys.

## Dependencies

- Renovate opens dependency update PRs, from one shared preset, with its Dependency Dashboard off.

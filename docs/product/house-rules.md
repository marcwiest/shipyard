# House rules

Where an adopting repo keeps house rules is defined in core, in [`kit/core/house-rules.md`](../../kit/core/house-rules.md).

The maintainer's house rules ship in the example setup, `examples/maintainer/`, written as agent rules for an adopting repo to copy from. They are never installed.

**Today:** the example setup doesn't exist yet, so the list is kept here.

## The maintainer's house rules

- The maintainer's role mapping:

  | Role | Tool |
  | --- | --- |
  | Planning agent | A local CLI agent (Claude Code or Grok CLI) |
  | Orchestrator bot | The maintainer's Coding bot |
  | Builder bot | A Cursor cloud agent on a pinned Grok model |
  | Reviewer bot | The Claude GitHub Action |

  The maintainer's setup also has a Chief of Staff bot, which routes work and keeps the backlog, and one Project Management bot per project, which checks plans with the human and relays approval. Neither is a role.
- CDP for browser verification, not Playwright. The repo's verification CLI is the default way to drive the app; a browser devtools MCP server is for digging in by hand. The builder bot's MCP servers are set up in its tool's own dashboard, since a local install doesn't carry over.
- pstack's verification skills to create and maintain each repo's verification skill. The weekly drift check runs pstack's `/maintain-verification-skill` for its first step.
- No formal verification skills, swarms or fan-out verification until the base verification skill works.
- pstack's `/architect` for bigger changes: types and signatures first, candidates compared, a design scrapped when the evidence turns against it.
- Renovate opens dependency update PRs, from one shared preset, with its Dependency Dashboard off.
- Only a human merges; a release after each merged plan; a tag push deploys.
- Trunk only, squash merges, the `plan/<slug>` and `work/<slug>` branch names.
- Inside a phase: spec, then tests, then code.
- The restatement uses pstack's `/in-your-own-words`.
- Phases of about 3 hours of work, with a 150k context target. Context is estimated at about 20k to start plus about 43k per hour of work, and measured as input plus cache-read plus cache-creation tokens, at the start, end and peak of a run.
- The builder bot runs on a model pinned per repo in its agent rules, at high effort. The model changes only on purpose.
- The Sizing log lives in the repo where its run data may be public, and elsewhere where it may not.
- Plan files deleted when the plan is done; no ADRs, GitHub issues or PR template.
- The docs layout: `docs/product/`, `docs/north-star.md`, `CONTEXT.md`, `docs/agents/`.
- Coverage is never lowered; mutation testing only with the human's approval each time.
- The default branch's rules: required CI, branch up to date before merge, linear history, rules apply to admins, no force pushes. No `develop`, release branches, back-merges or emergency self-approval. Branches are deleted after merge.
- The squash commit message is the PR title in conventional form. A release's bump follows it: `feat` minor, `fix` patch, `!` major. Release notes come from the merged PRs and their plans. Release tags are the human's only, enforced by a tag rule.
- Each plan merges as soon as it is done; plans are never held to merge together.
- Packages are tested through their exports, imported by package name, never by internal path, enforced by lint.
- Specs are written with pstack's `/technical-writing`, which keeps tutorial, how-to, reference and explanation apart. A slim planning skill modeled on pstack's multi-phase plan playbook, grounded with pstack's `how` and `why`.

**Today:** `docs/init/` holds many "no X" rules. Each one still has to be sorted: a mechanic, a house rule, or dropped.

# House rules

House rules are opinions that a person or an adopting repo layers on top of the workflows. An adopting repo can apply house rules without changing any workflow, PR shape or practice. It keeps them in its own agent rules, and sets the conventions skills read in its settings file (see [adoption](adoption.md)).

The maintainer's house rules ship in the example setup, `examples/maintainer/`, written as agent rules for an adopting repo to copy from. They are never installed. The core's agent rules template has an empty house rules section.

**Today:** the example setup doesn't exist yet, so the list is kept here. Where house rules go moves into the kit.

## The maintainer's house rules

- The maintainer's role mapping:

  | Role | Tool |
  | --- | --- |
  | Planning agent | A local CLI agent (Claude Code or Grok CLI) |
  | Orchestrator bot | The maintainer's Coding bot |
  | Builder bot | A Cursor cloud agent on a pinned Grok model |
  | Reviewer bot | The Claude GitHub Action |

  The maintainer's setup also has a Chief of Staff bot, which routes work and keeps the backlog, and one Project Management bot per project, which checks plans with the human and relays approval. Neither is a role.
- CDP for browser verification, not Playwright.
- pstack's verification skills to create and maintain each repo's verification skill.
- Only a human merges; a release after each merged plan; a tag push deploys.
- Trunk only, squash merges, the `plan/<slug>` and `work/<slug>` branch names.
- Inside a phase: spec, then tests, then code; the restatement step.
- Phases of about 3 hours of work, with a 150k context target.
- Plan files deleted when the plan is done; no ADRs, GitHub issues or PR template.
- The docs layout: `docs/product/`, `docs/north-star.md`, `CONTEXT.md`, `docs/agents/`.
- Coverage is never lowered; mutation testing only with the human's approval each time.

**Today:** `docs/init/` holds many "no X" rules. Each one still has to be sorted: a mechanic, a house rule, or dropped.

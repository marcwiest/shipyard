# Agent use

How agents find, start, pause and finish work.

## Labels

Every label shipyard uses carries the repo's prefix from its settings file, such as `shipyard:`. Labels go on PRs only.

| Label | Added by | Meaning | Removing it |
| --- | --- | --- | --- |
| Trigger label, such as `shipyard:build` | Human | Go: this PR runs the workflow the label names | Does nothing; it stays until merge |
| `shipyard:hold` | Human | Stop at the next done condition | Resume |
| `shipyard:waiting-human` | Bot | Stopped at a human step | Resume |

- One trigger label per workflow that runs unattended. Adding it is the human's approval.
- A plan is built on its own PR: the human adds the trigger label to the PR that holds the plan, and the orchestrator bot builds on that branch.
- Who may add labels follows the repo's GitHub access. A repo can also list in its settings file who may add trigger labels; the dispatcher then checks it.

## Dispatcher

- The dispatcher is a CI piece in the dispatch module, with the labels and the answer skill. The adopting repo's CI workflow runs it on label events, and it starts the role the role mapping names, passing the PR number and the label.
- It reads the role mapping, the label prefix and who may add trigger labels from the settings file on the default branch.
- It acts only on PRs from branches inside the repo, never from forks.
- It doesn't hear label changes made with the CI workflow's own token. Bots add and remove labels under their own app identity; humans under their own.

## Reading

- A bot the dispatcher starts is told its skill and its PR, and starts there.
- The AGENTS.md block is a few lines, under a size cap. It points to the settings file and lists the trigger labels and skills available. It doesn't restrict how interactive work starts.
- A skill names the reference files each step needs; the agent reads only those.

## Any agent

- Managed files hold no tool-specific syntax: no `@` imports, no slash commands, no names of tool features.
- An action that differs by tool, such as starting the builder bot or asking the reviewer bot for a review, is named in the skill. The role mapping in the settings file says how each tool does it.
- Each role lists the capabilities its tool needs, such as editing files, a shell, git and commenting on PRs.

## Human steps

- A skill marks each human step. Agents ask nothing outside human steps and spec questions.
- The human adds the trigger label, answers human steps and spec questions, and merges.
- At a human step the bot posts the question on the PR, adds `waiting-human`, and notifies the plan's human as the settings file says. By default that is a GitHub mention.
- An answer counts once it is a PR comment and `waiting-human` is removed. Any agent the human talks to may post the answer and remove the label for them; the comment names the human and the channel.
- The answer skill finds every PR waiting on the human, shows the open questions, posts the human's answers and removes the labels.

## Done conditions

- Every skill step ends with a done condition: something visible in the repo or on the PR, such as a commit with its phase prefix, a comment with its fixed header, a ticked box or a passing check.
- A fresh agent resumes from repo and PR state alone.

**Today:** no labels, dispatcher, answer skill or capability lists exist. `docs/init/` starts work with a hand-off between the maintainer's bots, keeps a separate plan PR and says no labels are used. Everything on this page except the dispatcher moves into the kit; the dispatcher stays here.

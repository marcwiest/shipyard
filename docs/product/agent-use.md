# Agent use

What the dispatcher does, and what every managed file holds to so that any agent can use it. The labels, human steps on a PR and the answer skill are defined in the dispatch module, [`kit/dispatch/`](../../kit/dispatch/index.md).

## Dispatcher

- The dispatcher is a CI piece in the dispatch module. The adopting repo's CI workflow runs it on label events.
- On a trigger label added, or a hold or waiting label removed, it starts the role the trigger label's workflow names, through the role mapping, passing the PR number and the label. It starts nothing while a hold or waiting label remains on the PR.
- It reads the role mapping, the label prefix and who may add trigger labels from the settings file on the default branch. When that list is set, a trigger label anyone else adds starts nothing. A bot that adds its own workflow's trigger label, as the weekly drift check does, adds it after the waiting label, so that too starts nothing; removing the waiting label resumes the PR.
- It acts only on PRs from branches inside the repo, never from forks.
- It doesn't hear label changes made with the CI workflow's own token. Bots add and remove labels under their own app identity; humans under their own.

## Managed files

- They hold no tool-specific syntax: no `@` imports, no slash commands, no names of tool features.
- An action that differs by tool, such as starting the builder bot or asking the reviewer bot for a review, is named in the skill. The role mapping in the settings file says how each tool does it.
- Each role lists the capabilities its tool needs, such as editing files, a shell, git and commenting on PRs.
- A skill names the reference files each step needs; the agent reads only those.
- The AGENTS.md block is a few lines, under a size cap. It points to the settings file and lists the trigger labels and skills available. It doesn't restrict how interactive work starts.

**Today:** no dispatcher, skills or discovery stubs exist.

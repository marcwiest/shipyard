# Dispatch

Starts, holds and resumes unattended work on a PR.

Needs: core, and a CI workflow in the repo that runs the dispatcher on label events.
Roles: human, and the bots the modules that use it name.

## Contents

- [Labels](labels.md): the trigger, hold and waiting labels, what each means to whoever adds or removes it, and how a bot works under them.
- [Human steps on a PR](human-steps.md): how a bot asks the human, waits and resumes.
- [Answer skill](answer.md): how any interactive agent shows the human their waiting questions and posts the answers.
- The dispatcher, a CI piece. On a trigger label added, or a hold or waiting label removed, it starts the role the trigger label's workflow names, passing the PR number and the label. It acts only on PRs from branches inside the repo, never from forks.

Settings it reads: `roles`, `labels.prefix`, `labels.trigger-label-adders` and `notify`. The dispatcher reads them from the default branch.

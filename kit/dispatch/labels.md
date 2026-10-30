# Labels

Every label carries the prefix in `labels.prefix` of the settings file, such as `shipyard:`. Labels go on PRs only. They mark a PR's workflow and state, never a backlog.

| Label | Added by | Means | Removing it |
| --- | --- | --- | --- |
| Trigger label, `<prefix><workflow>`, such as `shipyard:build` | The human | Go: this PR runs the workflow the label names. Adding it is the human's approval to start | Does nothing. It stays until merge |
| `<prefix>hold` | The human | Stop at the next done condition | Resumes the work |
| `<prefix>waiting-human` | A bot | Stopped at a human step. The question is on the PR | The answer is in. Resumes the work |

## Trigger labels

- Each workflow that runs unattended names its trigger label and the role the dispatcher starts for it.
- A PR carries one trigger label at most.
- When `labels.trigger-label-adders` lists people, a trigger label counts only if one of them added it. When it is empty, anyone with write access can add one.

## Resuming

- Removing the hold or the waiting label resumes the work: the dispatcher starts the trigger label's role again on the PR.
- Nothing resumes while the other of the two is still on the PR: the dispatcher starts nothing until both are gone.
- To stop for good, the human closes the PR.

## Working under the labels

For a bot the dispatcher starts:

- It is told its skill, its PR and the PR's trigger label. It reads the PR's state, finds the last done condition, and starts at the next step (see core's [human steps and done conditions](../core/human-steps.md)).
- Before each step it checks for the hold and waiting labels. If either is on the PR, it stops without starting the step and changes nothing more. A step already under way runs to its done condition first.
- At a human step it adds the waiting label, as [human steps on a PR](human-steps.md) says.
- It commits, comments and adds or removes labels under its own identity, never with the CI workflow's token. It never adds or removes a trigger label or the hold label.

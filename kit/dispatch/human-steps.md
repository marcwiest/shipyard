# Human steps on a PR

How a bot asks the human at a human step, waits and resumes. The human is the plan's human, or for a PR without a plan, the human its workflow names.

## Asking

1. Post one comment headed `Human step` that mentions the human and holds each question, the bot's recommendation for it, and the step that waits on the answer. Several questions go in one comment.
2. Add the waiting label, `<prefix>waiting-human`.
3. Notify the human as `notify` in the settings file says. With `mention`, the comment's mention is the notification.
4. Stop. No further step starts while the waiting label is on the PR.

Done condition: the `Human step` comment. The waiting label marks it unanswered; the step that waited is not done until the bot resumes and finishes it.

## Answering

- An answer counts once it is a PR comment and the waiting label is removed.
- The human answers in a PR comment and removes the waiting label, or does both through any interactive agent running the [answer skill](answer.md).
- Answers posted while the waiting label stays on the PR are read when the work resumes.

## Resuming

1. Removing the waiting label resumes the work (see [labels](labels.md)).
2. The bot reads every comment after its latest `Human step` comment and continues from the step that waited.
3. If an answer doesn't settle a question, that question is a new human step.

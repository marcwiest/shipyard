# Answer skill

Lets the human answer waiting questions through whichever interactive agent they are talking to, while the record stays on the PR.

- Trigger: the human asks an interactive agent for their waiting questions.
- Roles: the human, and the interactive agent they talk to.
- Its tool needs: reading PRs, commenting on them and removing labels, all under the human's identity.

## Steps

1. Find every open PR in the repo with the waiting label whose latest `Human step` comment mentions this human.
2. Human step: show each PR's questions and recommendations. The human answers some or all of them.
3. On each PR with an answer, post one comment headed `Answer`. It names the human and the channel the answer came through, and gives each answer under the question it answers. Done condition: the `Answer` comment.
4. On each PR whose questions are all answered, remove the waiting label. A PR with questions still open keeps it. Done condition: the label is gone from every fully answered PR.

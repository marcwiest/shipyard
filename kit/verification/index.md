# Verification

The shape of the repo's verification skill, its Feature Map, and the rules its runs follow.

Needs: core.
Roles: the agents that verify work, such as the builder bot, and the orchestrator bot when it reruns a verification.

## Contents

- [Verification skill](skill.md): what the repo's verification skill holds, and when it counts as working.
- [Feature Map](feature-map.md): the skill's index of features, and one file per feature.
- [Surfaces and evidence](surfaces.md): how each surface is driven, the minimum verification evidence for each, and the rules every run follows.

How evidence is captured, judged and reported is core's [verification practice](../core/practices/verification.md).

Settings it reads: `paths.verification-skill` and `verification-surfaces`.

# shipyard

Status: in design, with no release yet. Core can be copied by hand and planned with today; what doesn't exist yet is in each page's Today note.

Who: a person who runs coding agents and bots on their repos and wants a repeatable way to plan, build, review and verify that work.

Promise: a workflow kit built around roles. It fits into any repo, agents can work with it, and its mechanics stay useful to someone who rejects its opinions.

## Principles

- Mechanics work without opinions. A mechanic stays useful to someone who rejects the opinions around it, and it works without them. Opinions are house rules: core says where a repo keeps them, and the maintainer's are an example in `examples/maintainer/`.
- Roles, not tools. Workflow text names roles; tools appear only in a role mapping.
- Each plan has one human, who owns its intent.

## Reading order

1. [Shape](shape.md)
2. [Adoption](adoption.md)
3. [Agent use](agent-use.md)
4. [Later](later.md)

Workflow terms and the roles are defined in the kit, in [`kit/core/glossary.md`](../../kit/core/glossary.md) and [`kit/core/roles.md`](../../kit/core/roles.md). Terms about shipyard itself are in the root `CONTEXT.md`.

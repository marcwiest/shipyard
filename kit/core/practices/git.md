# Git

Rules for every workflow. Branch names and the default branch come from the settings file.

## Branches

- Nobody works on the default branch directly. Work lands there only through a PR.
- Each plan has one branch and one PR, which hold the plan file and all of its work.
- Several branches can be open at once; none waits for another.

## Commits

- Commit subjects use conventional prefixes, scoped by phase in plan work, so each phase can be reviewed on its own:

  | Prefix | Holds |
  | --- | --- |
  | `docs(phase-N):` | spec text for the phase |
  | `test(phase-N):` | tests |
  | `feat(phase-N):`, `fix(phase-N):` | code, and any other change that isn't spec text |
  | `docs(plan):` | the plan file, from its draft to its approval |
  | `chore(plan): phases` | the phases, added to the plan before building starts |
  | `chore(phase-N): plan record` | the plan record |

- A fix after a phase's review is a `fix(phase-N):` commit for that phase.
- Work outside a plan uses the same prefixes without the phase scope. Copying or updating the kit's files is `chore:`.

## What agents never do

- Rewrite pushed history: no rebases, amends of pushed commits or force-pushes.
- Change git config, or bypass hooks or checks.
- Merge, tag, publish or deploy, unless the human asks for that one action.

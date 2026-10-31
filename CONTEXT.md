# Context

Glossary for shipyard itself. One entry per term, one or two sentences each. Workflow terms, which agents in adopting repos also meet, are in the kit glossary, [`kit/core/glossary.md`](kit/core/glossary.md).

## Shipyard

- **Platform**: The code host shipyard assumes: GitHub. Not a tool, so never in a role mapping.
- **Example setup**: The maintainer's role mapping and house rules in `examples/maintainer/`, copied by hand, never installed.
- **Guide**: Shipyard's how-tos for people adopting it, in `docs/guide/`. Never copied into an adopting repo.
- **Bootstrap**: The workflow that starts or straightens out a codebase by working through ordered questions into its specs and agent rules.

## Retired names

The drafts the kit was built from used names since retired. They remain in git history; new text uses the term on the right.

| Retired | Term |
| --- | --- |
| owner | human |
| planner | planning agent |
| Coding bot, orchestrator | orchestrator bot |
| cloud agent, build agent, phase agent | builder bot |
| Claude review | reviewer bot |
| reference setup | role mapping |
| go | trigger |
| preferences | house rules |
| host repo, consuming repo, product repo | adopting repo |
| shared workflow | CI piece |
| Proof line | Evidence line |
| proof | verification evidence |
| docs rule | spec rule |
| unplanned spec lines | extra spec lines |
| closing summary | phase report |
| weekly drift report | weekly drift check |

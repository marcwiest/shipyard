# PR comments

The PR is the working channel for questions, reviews and the handoff. Durable decisions go into the spec through a plan; PR comments are temporary.

## PR body

A link to the plan file and a short summary. The plan's Goal and Changes are the human's; the orchestrator bot keeps its Status line, phases, boxes and Notes lines.

## Status comment

One comment, kept by the orchestrator bot and edited in place, never posted again. It holds:

- intake's result
- one line per phase
- open questions
- each answer and its source: the spec, the agent rules or the human. An answer that changed how the work was done also gets one line in the phase's Notes.

A phase's line gives its state, the run number, the duration, the number of tool calls, and context used if the tool reports it, marked if the session compacted. States: `running`, `finished, awaiting review`, `fix round N`, `passed`, `stopped: <reason>`, `held`, `waiting on human`.

Example, for a tool that reports no context: `phase 2 · finished, awaiting review · run 2 · 41m · 58 calls`

## Headed comments

Each opens with a fixed header, so the thread can be scanned and a fresh agent can find its place:

| Header | Posted by | Holds |
| --- | --- | --- |
| `Phase N · preflight` | Reviewer bot | Open questions and the phase's scope |
| `Phase N · review` | Reviewer bot | Each finding, blocking or nit, with the line it cites |
| `Phase N · verification` | Orchestrator bot | One verification line per verified Change |
| `Human step` | Any bot | Questions for the human (see the dispatch module) |
| `Handoff` | Orchestrator bot | A summary of each phase, deviations, nits left open, the verification lines and proposed repo fixes. The human's review starts here |

## Reading

Each bot reads the plan file, the status comment and the headed comments its step names, never the whole comment history.

# Knowledge, specs and planning

Status: conceptual draft. Nothing is implemented until the owner says it is final.
Companions: `phased-pr-workflow.md`, `verification-workflow.md`, `testing-workflow.md`.

## Core idea

A good plan needs a solid picture of the app today and its destination. Spec writing, knowledge keeping and planning are one loop: planning reads today and north star, each phase moves a piece of north star into today.

## Plans are files (agreed, owner, 2026-10-20)

- A plan is a file at `docs/plans/<slug>.md` in the product repo itself. No separate plans repo.
- The go: the project's Project Management bot hands the ready plan to the Coding bot (see Planning partners). That hand-off is the trigger to create the branch and the PR and start work. No polling, no status-line trigger.
- The plan is the record of what got done (owner, 2026-10-26): the Coding bot keeps its Status line, ticks its boxes and adds a short note per finished phase (proof line, deviations, blockers). Agents never change its goal or Changes; the Coding bot writes and owns the phases (owner, 2026-10-27). The PR body and comments are the working channel (questions, preflight, review, handoff); an answer that changed how the work was done also gets one line in the plan.
- `main` is never worked on directly; only reviewed PRs land there (enforced by a branch rule).
- The setup must not block running several plans at once, though the owner runs one at a time.
- Privacy: GitHub visibility is per repo, so a branch of a public repo can't be private. In public repos a plan becomes public once its `plan/<slug>` branch is pushed. Until it is ready it stays unpushed.
- The PR body links to the plan file.

## The rule for `docs/product/`

A record belongs in `docs/product/` if changing it needs the owner's OK and a test could cite it. It holds intent: who, promise, behavior, refusals, direction. It changes when the owner changes their mind; a rename or a new helper does not get a paragraph.

## Layout (agreed, owner, 2026-10-20)

```
CONTEXT.md          glossary
README.md           purpose, links to the north star
docs/north-star.md  direction and why (the only explanation-style doc)
docs/product/       today: dry reference agreements tests can cite
docs/agents/        how agents build
```

`docs/product/` holds only `index.md` (status line, who, promise, reading order), one file per area (with **Today** gap notes), `principles.md` (customer-facing rules, inside `index.md` while there are two or three) and `later.md`.

## Homes (agreed, owner, 2026-10-19, updated 2026-10-20)

| Record | Home |
| --- | --- |
| Front door and reading order | `docs/product/index.md` |
| Project status (live or WIP) | one line in `docs/product/index.md` |
| Today state per area | each product file; gaps between doc and code under a **Today** note, deleted when closed |
| North star (direction, destination) | `docs/north-star.md`; README opens with one or two sentences of purpose and links to it |
| Parked and refused | `docs/product/later.md` |
| Glossary | root `CONTEXT.md` |
| Customer-facing principles (e.g. refuse, don't repair; no magic) | `docs/product/` |
| How agents build (engineering rules) | `docs/agents/` |
| A decision's outcome | the product file it changes |
| A why agents need (e.g. a rejected alternative) | one sentence beside the rule; refused ideas in `later.md` |
| Full decision history | PR decision log and git history, never read by default |
| Agent skills | `docs/agents/skills/` (see `testing-workflow.md`) |

Dropped: a shared `memory.md`, and an ADR folder (`docs/adr/`, `docs/decisions/`). The owner's experience: ADRs pile up and cost context for little benefit. Each lesson goes to its real home: a product line with its one-sentence why, a `docs/agents/` rule, or a deterministic check (fix the repo).

## What a planning agent reads

`docs/north-star.md`, `docs/product/`, `CONTEXT.md` and `docs/agents/`. Nothing else.

## Planning skill (agreed, owner, 2026-10-20)

We build our own slim planning skill, modeled on pstack's multi-phase plan playbook (`poteto-mode/playbooks/multi-phase-plan.md`). The full playbook is good but too expensive to reach for case by case; keep it for rare, large programs only.

Borrow:

- The plan is a checklist; every box names its evidence.
- One phase is one change with its own proof. The owner's plan holds the Changes; the Coding bot splits them into phases at the start of work (owner, 2026-10-27).
- A light plan-check skill checks the plan for its required items (see Plan skeleton and check).
- Execution starts only on the go (the Project Management bot's hand-off). Tests alone are not proof.
- Body written as a how-to under `/technical-writing`.

Leave out:

- Ten-lane swarm live checks. Proof follows `verification-workflow.md`.
- Prototypes to settle open questions. Agent-internal spikes only.
- A screenshot and video review gate in chat for the owner.

Inputs: `docs/north-star.md`, `docs/product/`, `CONTEXT.md` and `docs/agents/`, grounded with the pstack skills `how` and, where history matters, `why`, installed locally where plans are made.

## Plan skeleton and check (agreed, owner, 2026-10-22, updated 2026-10-27)

```
# <Plan title>
Status: draft | ready | in progress | done   (kept by the Coding bot, never the trigger)
Goal: one sentence on what changes for the user.
Specs touched: docs/product/<file>.md, ...
Out of scope: ...

## Changes   (the owner's intent, approved with the plan)
- [ ] Spec: <what docs/product says after> · Proof: <exact evidence: build, test output, screenshot, run>
- [ ] Spec: ... · Proof: ...

## Phases   (added by the Coding bot at Planning partners step 5)
### Phase 1: <one change> · delivers Change 1, 2
- [ ] Tests: <seam>: <behavior they assert>
- [ ] Code: <what makes them pass>
Notes: <added by the Coding bot when the phase is done: proof line, deviations, blockers>
### Phase 2: ...
```

Plan check (owner, 2026-10-26): a light skill next to the planning skill; no script, no CI job. It checks a plan for its required items: Goal, Specs touched, and at least one Change with a Spec and a Proof naming concrete evidence; once the Coding bot has added phases, each has Tests and Code boxes and names the Changes it delivers, each Tests box names a seam (owner, 2026-10-27), and together they cover every Change. It lists what is missing and never judges plan quality. The planning agent runs it before the owner takes the plan to the Project Management bot; the Coding bot runs it again at Planning partners step 5, after adding the phases. A phase's scope (the files and folders it may touch) is not in the plan; Claude's preflight comment sets it (owner, 2026-10-26).

## Spec writing (agreed, owner, 2026-10-22)

- The plan is the approval: each Change's Spec line states what `docs/product/` says after it. The owner's approval, passed on in the Project Management bot's hand-off, approves that intent; the Status line is never the trigger.
- The cloud agent writes the spec as the first commit of each phase, before tests, as dry reference text in the matching `docs/product/` area file (gaps under a **Today** note), and keeps `index.md` current.
- The Coding bot reviews the spec commit against the Spec lines of the Changes the phase delivers, first in the phase review; a mismatch sends the phase back as a fix round, before tests and code are judged (owner, 2026-10-27).
- Docs rule (owner, 2026-10-26). The agent writes a `docs/product/` change without asking only when all three hold: it describes only behavior the plan names (anything a user would notice that the plan doesn't name, such as a new option, limit, default, message or step, needs the owner); it changes or removes nothing already in `docs/product/`; it doesn't touch `principles.md` or `later.md`. Otherwise, or when unsure, it stops and the Coding bot asks the owner. In doubt, check in.
- Safety net: the phase report lists every docs line not stated in the Spec lines the phase delivers. The Coding bot checks them in the spec-commit review; any line the Coding bot doubts goes to the owner. The Coding bot batches questions into one message per phase. Loosen the rule once the log shows which questions the owner always approves.

## App-shaping questions and drift (agreed, owner, 2026-10-22)

- Shaping questions open the planning skill for a new app or area: how much surface area it must integrate; done-for-you magic vs easy-to-read manual integration; fail loud and early vs quiet, and which kind of app needs which. Answers land as principles in `docs/product/`.
- Drift-risk areas get a short list in `docs/agents/`, checked on every review; anything that actually drifts becomes a deterministic check or script ("make anything that can be done deterministically, run deterministically") and leaves the list.

## Content drift (settled, owner, 2026-10-26)

- **Index CI check on every PR:** fails when `docs/product/index.md` links a missing file or a `docs/product/` file is not in the index. The error names the fix.
- **Weekly drift report:** one weekly run per active repo with two named steps (owner, 2026-10-26): `/maintain-verification-skill`, then a separate spec-drift step that flags specs, Feature Map files and `docs/agents/` rules that no longer match the code. The drift step reports to the Coding bot for a fix PR and never edits a spec itself, since specs are the owner's intent. The same run also reviews open Renovate PRs (see `git-workflow.md`, Merge and release) (owner, 2026-10-27).

## `docs/agents/` layout (agreed, owner, 2026-10-22)

How agents build in this repo, never what the product does.

- Root `AGENTS.md`: kept light, points to `docs/agents/index.md` and `docs/product/index.md`. Every `CLAUDE.md` points to its sibling `AGENTS.md` (owner, 2026-10-26).
- `index.md`: reading order, build/test/lint commands, the pinned cloud agent model, and repo-specific rules until they need their own file.
- `tests.md`: testing rules.
- `verification.md`: proof required per surface (UI, CLI, API), per `verification-workflow.md`.
- `drift.md`: the drift-risk list.
- `sizing-log.md`: where this repo's Sizing log lives, see `phased-pr-workflow.md`, Sizing and sessions (owner, 2026-10-27).
- `skills/<name>/`: repo skills, with pointer stubs in `.cursor`, `.grok` and `.claude`.
Git rules are enforced once by the shared workflow repo (see `git-workflow.md`), not per repo; the phase brief tells the cloud agent the commit rules (owner, 2026-10-27).

## Closed (2026-10-22)

- Plan file home and deletion: `docs/plans/<slug>.md`, unpushed until ready, linked from the PR body and deleted in that same PR (owner, 2026-10-20).
- Git workflow: covered by `git-workflow.md`, now with no open items.

## Planning partners (agreed, owner, 2026-10-22)

1. The owner writes the plan file and its contents with a local CLI agent (Claude or Grok).
2. The owner checks the plan with the project's Project Management bot (intent and scope).
3. The owner's local CLI agent opens the `plan/<slug>` PR and merges it on the owner's say-so (see `git-workflow.md`) (owner, 2026-10-27).
4. The Project Management bot hands it off to the Coding bot; that hand-off passes on the owner's "plan is ready" and is the trigger.
5. The Coding bot checks the plan with the plan-check skill and against the repo, raises any gap or spec contradiction with the owner directly, splits the Changes into phases of about 3 hours at most and writes them into the plan, then starts the work (owner, 2026-10-27).

## Still open

- Migration of existing repos waits until final.
- Exact contents of `AGENTS.md`: to define. The owner has earlier work on this to dig up.

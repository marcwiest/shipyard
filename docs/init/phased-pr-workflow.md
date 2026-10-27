# Phased PR workflow

Status: being refined with the owner. No skills get written until the owner says it's final.
Last updated: 2026-10-26

## Roles

- Roles are defined on the Coding workflows page. The Coding bot uses Claude review (GitHub Action) for each phase's preflight and review. The owner owns product intent; the approved plan sets what docs/product/ must say, and the cloud agent writes it (see `knowledge-and-planning.md`, Spec writing) (owner, 2026-10-27).

## Backlog and PR shape (updated, owner, 2026-10-20 and 2026-10-26)

- The plan is a file, `docs/plans/<slug>.md`, never the PR body (see `knowledge-and-planning.md` and `git-workflow.md`).
- A phased PR is one built from a plan file; the Coding bot knows its plan (see `git-workflow.md`). No labels, no PR template (owner, 2026-10-26).
- Checkboxes live only in the plan file. When a phase is done, the Coding bot ticks that phase's boxes and adds its Notes line (proof, deviations, blockers) in the plan file in one `chore(phase-N): plan record` commit; the plan is the record. Agents never change the plan's goal or Changes; the Coding bot writes and owns the phases (owner, 2026-10-27). The PR body holds only the plan link and a short summary (owner, 2026-10-26).
- After ticking the last phase, the Coding bot deletes the plan file in its final plan-record commit; the ticked version stays in the PR's changed files and history (owner, 2026-10-26).
- No GitHub issues: the backlog lives outside GitHub, kept by the Chief of Staff bot (owner, 2026-10-26).

## Communication on the PR

- PR body = link to the plan file, short summary. The owner owns the plan's content; the Coding bot keeps its Status line, boxes and phase notes. The PR is the working channel.
- Status comment: one comment, owned by the Coding bot and edited in place. It holds:
    - the phase status lines
    - open questions
    - answers to open questions and where they came from (repo docs or the owner); an answer that changed how the work was done also gets one line in the plan
- Durable decisions go into specs. PR comments are temporary. A decision that changes product intent gets written into docs/product/ with the owner's OK.
- Phase comments open with a fixed header, so the thread can be scanned:
    - `Phase N · preflight`
    - `Phase N · proof`
    - `Phase N · review`
    - `Handoff`
- Claude's findings:
    - Line-level findings are inline review comments.
    - The summary comment marks each finding as blocking or nit and cites the plan or spec line.
    - A thread is resolved once its fix lands, so open threads always mean open work.
- Commit subjects carry the phase as in `git-workflow.md` (`docs(phase-N):`, `test(phase-N):`, `feat(phase-N):`, `fix(phase-N):`, `chore(phase-N):`), so Claude's review can be limited to that phase's commits.
- Agent context: each phase agent reads the plan file and the status comment, not the whole comment history.
- When the owner is pulled in: only for spec questions, a failure that changes the plan, and the final handoff. The ping goes to the owner in chat. The record stays on the PR.
- Handoff comment at the end: a summary of each phase, any deviations, nits left open, and links to proof. This is where the owner's review starts.

## Phase loop

1. Preflight: the Coding bot posts `@claude preflight phase N`. Claude reads only that phase of the plan against the specs and lists open questions for the Coding bot. It does not review code. The Coding bot resolves them and writes the phase brief (see Phase brief), so the build agent starts with less to work out. Claude's preflight comment also sets the phase's scope (files and folders it may touch); the Coding bot refines its hour estimate (owner, 2026-10-26).
2. Open questions: the Coding bot answers them from repo docs (docs/product/, docs/agents/) where it can. Otherwise it pings the owner directly (see Coding workflows, for now).
3. Build: one cloud agent works through the phase in order. It first restates its job in its own words (pstack `/in-your-own-words`); the Coding bot checks the restatement against the plan and its brief, and a mismatch stops the phase before any change. Restatement is kept (owner, 2026-10-26) and on trial: the Coding bot ticks Restatement caught in the Sizing log when it revealed a mismatch, reviewed after the pilot. Then docs: the agent writes the `docs/product/` text that the Spec lines of the Changes this phase delivers call for, within the docs rule in `knowledge-and-planning.md` (Spec writing); any other docs change, or doubt, means it stops and asks. Then tests that back the spec, then code. It reads `docs/product/index.md` first. It runs on a Grok model pinned per repo in `docs/agents/index.md`, at high effort; the model goes into each phase's Sizing log row and changes only on purpose (owner, 2026-10-26). If the agent hits a question it can't answer, it stops and reports it instead of guessing.
4. CI (lint, types, tests) must be green before Claude reviews.
5. Review: the Coding bot posts `@claude review phase N`, reviews the phase itself (the spec commit first, see `knowledge-and-planning.md`, Spec writing), and gives one combined verdict.
6. Fixes (see below).
7. Plan record: the Coding bot ticks the phase's boxes and adds its Notes in a `chore(phase-N): plan record` commit (owner, 2026-10-26). The same commit adds the phase's Sizing log row where the log lives in the repo (owner, 2026-10-27). After the last phase, that commit also deletes the plan file. Then on to the next phase.
8. After the last phase, the PR goes to the owner. There is no full-PR Claude review at the end.

## Fixes

- The spec is the owner's intent. A fix brings code and tests back into line with the spec. A fix never changes the spec.
- Merge conflicts from updating the branch: Claude review looks at them first, then they go to the cloud agent as a fix round; `docs/product/` conflicts go to the owner (see `git-workflow.md`, Branches).
- Docs follow the plan. During a phase, the agent writes the docs the plan's Spec lines call for, within the docs rule in `knowledge-and-planning.md`. Docs never change just to suit a fix.
- If a finding suggests the spec itself is wrong, unclear or can't be implemented, that is not a fix. It is a spec question. Work stops and the question goes to the owner, who decides and owns any spec change.
- Every blocking finding must point to a line in the plan or spec. Findings without one are nits: they get batched or dropped and never start a fix round on their own.
- If Claude and the Coding bot disagree, the spec decides. If the spec doesn't cover it, the question goes to the owner.
- Claude re-reviews only the fix commits.
- There is no hard cap on fix rounds. Context use decides when to start fresh (see Sizing and sessions).
- Escalate when the same finding comes back after a fix. That points to an unclear spec or plan.
- Repeated mistakes across phases or PRs lead to a fix in the repo (architecture, then types, then lint/CI, then a test, docs last), proposed as its own PR.

## Sizing and sessions

- Size work in human hours: how long a developer who knows the repo would take. Don't estimate in tool calls or tokens. In the owner's earlier Grok CLI runs those estimates came in 1.4 to 2 times too low.
- About 3 hours of work fills about 150k of context: roughly 20k to start, plus about 43k per hour. 150k is a soft target, not a hard limit.
- The Coding bot defines the phases at Planning partners step 5 and estimates each in hours, keeping each to about 3 hours of work at most. A phase that turns out bigger gets split by the Coding bot; the owner isn't involved. Estimate against actual goes into the Sizing log (owner, 2026-10-27).
- Phases run in order, never in parallel. Each phase starts from the branch as the previous phase left it.
- Corrections go back to the same agent, which already holds the context and is cheaper than a new brief. Start a fresh agent only when that session compacted or the fix won't fit. The fresh brief names the finding, the files involved, and which earlier changes must stay as they are.
- Measuring context (settled, owner, 2026-10-26): Cursor cloud agents report no token or context use. Checked on 2026-10-26: run transcripts carry only timings, tool calls and text, and the API usage endpoint (`/v1/agents/{id}/usage`) returns 0 tokens and 0 cents for agents the Coding bot launches, including a fresh test run. So sizing goes by human work hours. Each repo's `docs/agents/sizing-log.md` says where its Sizing log lives, as the owner decides per project: next to it (for example `docs/agents/sizing-log.csv`) where the run data may be public, elsewhere where it may not (owner, 2026-10-27). Each phase's row in the Sizing log records the date, plan slug, phase number, model, estimated hours, actual minutes, tool calls, fix rounds, whether the session compacted, whether the restatement caught a mismatch, and the repo size (simple site, app, monorepo) (owner, 2026-10-27). Where the log lives in the repo, the Coding bot adds the row in that phase's `chore(phase-N): plan record` commit, so it reaches `main` with the squash merge; where it lives elsewhere, the Coding bot needs write access there (owner, 2026-10-27). Estimates depend on codebase size, since monorepos and software use up context faster than simple sites. Start conservatively with small tasks and grow sizes as the log shows what fits. The owner's earlier Grok CLI runs report token use, so the formula below applies there.
- What to measure:
    - Context is the prompt size of one model call: input tokens plus cache-read tokens plus cache-creation tokens.
    - Track it at the start of the run, at the end, and at its peak.
    - Count tool calls and file reads.
    - Count compactions. A compacted session is a signal to start fresh.
    - Record the stop reason.
    - If the transcript carries usage data, the Coding bot uses the same formula so the numbers can be compared with the owner's calibration log from those runs.
- Calibration: the Coding bot logs each phase's estimated hours against what it actually took (context if available, otherwise run length and number of fix rounds) and checks the 3-hour figure against the log before estimating.

## Phase brief

- The goal and done condition for this phase only, plus one line on the overall PR for orientation.
- Facts already resolved (paths, versions, constraints), so the agent doesn't work them out again.
- The phase's scope from preflight: the files and folders it may touch.
- Commits: `docs(phase-N):` for the spec first, then `test(phase-N):`, then `feat(phase-N):` or `fix(phase-N):` (see `git-workflow.md`).
- Read `AGENTS.md` and `docs/product/index.md` first.
- What's off limits: rewriting history, force-pushes, rebases, git config changes, bypassing hooks (--no-verify, HUSKY=0), publishing, deploying, and editing the plan file (the Coding bot keeps its boxes and notes).
- End with a closing summary: what changed, the result of each check run, every docs line not stated in the Spec lines the phase delivers, each test change with its reason (see `testing-workflow.md`, Tests the code can't bend), the evidence list (see `verification-workflow.md`, Where proof goes) (owner, 2026-10-27), and any spike findings.

## Run handling

- If a run stops early or errors, the Coding bot reports what failed and doesn't retry blindly. The Coding bot never loosens a restriction on its own.
- Between phases the owner gets one short line at most. The owner is only involved mid-PR when a phase fails in a way that changes the plan, or for a spec question.
- Scope check: a phase whose diff touches files outside that phase's scope is rejected in review.
- Phase status: the Coding bot keeps one status comment on the PR, with one line per phase, and edits it rather than posting new ones. Each line gives:
    - the state: running, finished and awaiting review, or died without finishing
    - the run number
    - the duration
    - the number of tool calls
    - context against the 150k target, if measurable, with a mark if the session compacted
    Example (cloud agent, no context data): `phase 2 · finished, awaiting review · run 2 · 41m · 58 calls`
- Stalls: if a run goes unusually long, the Coding bot checks its transcript. Little or no new activity means a long build or a hang. A hang gets reported, not silently restarted.

## Commits and merging

- Squash merge, per `git-workflow.md`.
- No merge without the owner's OK.

## Decided (2026-10-26)

- Claude GitHub App: set up only with the pilot repo. Two PRs in order (owner, 2026-10-27): first the reusable workflow in `shipyard`, the shared workflow repo; then the pilot repo's caller workflow, which goes green against it. The owner installs the app and creates the `CLAUDE_CODE_OAUTH_TOKEN` secret; the Coding bot writes both (owner, 2026-10-26).

## Still open

- Two separate skills: one for the owner's planning side and one for the Coding bot's orchestration. Next to the planning skill sits a light plan-check skill, also used by the Coding bot (see `knowledge-and-planning.md`, Plan skeleton and check). Not written until the workflow is final.

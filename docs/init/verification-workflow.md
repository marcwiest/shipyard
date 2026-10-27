# Verification workflow

Status: draft, conceptual only. Nothing is implemented and no skills are written until the owner says it is final.
Companion to `phased-pr-workflow.md`. That doc covers how work flows through a PR. This one covers how the output gets proven, so that the owner's own review shrinks to intent ("is this what I wanted").
Sources: poteto, The Complete Guide to pstack, Part 1 ("Verification is all you need") and Part 2 (research, planning, architecture). Part 3 is not out yet.

## Core idea

- Verification is separate from tests. Tests (unit, integration, end-to-end) are code that backs the spec. Verification means the agent runs the real artifact the way a user or consumer would, and captures evidence that it works.
- Tests alone do not count as proof. A phase is verified only once the agent has run the real thing.
- Agents verify their own work, so they can keep going until it works without waiting on the owner.

## Per-repo verification skill

Each repo gets a project-local skill, `docs/agents/skills/verify-<app>/` with discovery stubs in `.cursor`, `.grok` and `.claude` (see `testing-workflow.md`, Where skills live; owner, 2026-10-26), created with pstack `/create-verification-skill`. That skill writes to `.cursor/skills/verify-<app>/` by default; point it at `docs/agents/skills/verify-<app>/` and add the stubs (owner, 2026-10-27). The skill has three parts.

1. **A CLI in the repo.** It scripts launching, driving and observing the app, so agents run commands instead of writing throwaway scripts. It must:
    - compose easily, with deep commands and subcommands
    - offer `--dry-run` on any command with side effects
    - give rich `--help` output
    - return JSON
    - use error messages that tell the agent what to do instead
2. **Skill sections:**
    - Launch, including when the app counts as ready
    - Doctor, a read-only health check
    - Drive
    - Evidence
    - Cleanup, which never deletes the evidence
3. **A Feature Map.** `docs/agents/skills/verify-<app>/features/README.md` is the index, with one file per feature, inside the skill where both pstack skills expect it (owner, 2026-10-27). Each file says, from the user's point of view, what the feature is, how to reach it, how to drive it with the CLI, what end state proves it works, and its gotchas. The map is the repo's materialized memory.

The generated skill must prove itself once end to end before it counts as done: launch, doctor, drive one mapped feature, capture evidence, clean up, and confirm the evidence survived the cleanup.

## Tooling

- Browser surfaces run on the Chrome DevTools Protocol (CDP), the same engine as the owner's local chrome-devtools MCP. Playwright is not used.
- The CLI is committed to the repo, so local Grok and cloud agents drive the app the same way. The chrome-devtools MCP stays available for hands-on and interactive work.
- Found (Cursor docs, 2026-10-19): cloud agents can use MCP servers. They are configured in the Cursor dashboard (`cursor.com/agents` MCP dropdown), not in the repo's `.cursor/mcp.json`. A stdio server such as chrome-devtools runs inside the agent's VM. Cloud agents also have a built-in Cursor Cloud MCP with run transcripts and events, but no token or context data (see `phased-pr-workflow.md`, Sizing and sessions). Decided (owner, 2026-10-19): use both. The repo CLI is the default, and the chrome-devtools MCP is for digging in. The MCP must be added through the MCP menu at `cursor.com/agents` or on the team dashboard, because a local Cursor app install does not carry over to cloud agents.

## Non-visual surfaces

The concept follows the surface a user touches, not a screen.

- **Web UI / browser library:** drive pages through CDP. The evidence is screenshots, video, performance traces, and console and network logs.
- **API / service:** launch the service locally with seed data and test users, then drive it with real HTTP calls. The evidence is requests and responses, status codes, logs and side effects (rows written, messages or webhooks sent). The Feature Map lists endpoints and journeys from the consumer's point of view.
- **Library:** drive it through a small consumer app or the demo page.
- **CLI:** drive it in an isolated PTY or tmux session. The evidence is the transcript, exit codes and files written.

Minimum evidence per surface (settled, owner, 2026-10-26). Each repo writes these into its `docs/agents/verification.md`; a Change's Proof line can ask for more, never less:

- **Web page:** a screenshot of every changed view at mobile and desktop width, and no console errors.
- **API:** one real request and response per changed endpoint, including one failure case.
- **Library:** one run through the demo page or a consumer app.
- **CLI:** a transcript of each changed command with its exit code.
- Every entry point the Feature Map lists for a touched feature also gets driven.

Proof rules for every surface:

- Exercise the real path, never test-only endpoints or internal setters.
- Capture both the action and the resulting state.
- Check side effects.
- Mock only at a boundary that production already isolates.
- Check what a dry-run actually skips by observing it, not by trusting the flag.

## How it plugs into the phased-PR workflow

- **Restate first.** Each phase agent starts by restating its phase in its own words (pstack `/in-your-own-words`). The Coding bot checks the restatement against the plan (owner, 2026-10-19). A mismatch stops the phase before any change. Restatement is on trial (see `phased-pr-workflow.md`, Phase loop). The owner only sees the restatement when the Coding bot can't tell whether it matches.
- **Docs first.** Docs and specs come before code, as already agreed. docs/product is written with `/technical-writing`, which keeps four modes apart: tutorial, how-to, reference and explanation.
- **Proof.** Each phase's proof is a verification run of the features it touched, using the Feature Map. A proof that drives one convenient entry point is incomplete when the map lists others.
- **Where proof goes (owner, 2026-10-19):**
    - The evidence itself (screenshots, videos, traces, responses) goes only to the orchestrator (the Coding bot) or the next agent, which checks it before the phase verdict.
    - The build agent ends with an evidence list: per item, what was driven, the file, and what it shows; traces come with a one-line summary (e.g. "no console errors over a 30 s session") (owner, 2026-10-27).
    - No permanent record is kept. The PR gets no media and no links to cloud runs, which expire.
    - The PR proof comment gets one short text line listing what was verified and how, for example `verified: signup form at mobile and desktop, no console errors`. This keeps the PR lean.
    - Proof can be rerun once the implementation is complete. If the owner wants to see something at handoff, an agent reruns the verification on the final branch and shows it then. It shows the final state, not each phase as it was.
- **Review.** The Coding bot alone judges the evidence (owner, 2026-10-27). It checks the evidence list against the Proof line of each Change the phase delivers and the per-surface minimums in `docs/agents/verification.md`, and opens only the media it needs. When it doubts the evidence, it launches a fresh cloud agent to rerun the verification. Missing or weak proof is a blocking finding. Claude review doesn't judge proof; it reviews code and spec.
- **Map upkeep.** A phase that adds or changes a feature updates its Feature Map file in the same phase.
- **The owner's review** at handoff is about intent. The handoff comment lists the verification line for each phase, as text only.

## Spikes (cheap try-outs)

- A spike is a throwaway experiment an agent runs when it isn't sure how, or whether, something will work. It answers implementation questions with evidence instead of guesses or a ping.
- Spikes are agent-internal. They are not shown to the owner for review or choice, so the owner isn't pulled back in.
- Spikes never answer spec or intent questions. Those still go to the owner.
- Spikes run in a git worktree on a throwaway local branch inside the agent's checkout; a temp folder outside the repo is fine for a tiny experiment. The spike branch is never pushed and the worktree is removed once the spike has served its purpose, so spikes never land in the PR (owner, 2026-10-26). The agent reports a spike's finding in its closing summary; The Coding bot adds it to the plan's phase notes.
- Not adopted: poteto's visual prototype variants for a human to choose from.

## Design and planning notes from Part 2

- `/architect` for bigger changes: sketch types and function signatures first, compare candidates, and scrap a design when the evidence shows it's wrong (for example, the same workaround showing up at several call sites, or `any` or casts needed).
- Keep the Claude preflight light and limited to open questions and the phase's scope. Adversarial review of abstract plans makes agents invent risks.
- Settled: the plan-check skill checks the plan for its required items (see `knowledge-and-planning.md`). Plans are temporary: the Coding bot deletes the plan file after the last phase.

## Maintenance

- `/maintain-verification-skill` keeps the CLI and the Feature Map honest as the app changes. Decided (owner, 2026-10-19): a weekly `/maintain-verification-skill` run per active repo, on top of the per-phase Feature Map updates. It is the first step of the weekly drift report (see `knowledge-and-planning.md`, Content drift) and will become a routine once implementation is approved.
- Treat the skill as critical infrastructure: fix it when it breaks, before doing more feature work.

## Excluded for now

- Beta pstack skills, including `/create-formal-verification-skill`.
- Swarms and fan-out verification, until the base skill works.

## Pilot

- Not started; waits until the workflow is final.

## Still open

- Skills: written only once the owner marks the workflow final.
- Confirm at the pilot that the Coding bot can pull screenshots and other evidence files from a cloud agent's run. If not, the Coding bot works from the evidence list and reruns on doubt (owner, 2026-10-27).
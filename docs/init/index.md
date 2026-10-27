# Coding workflows

The owner's coding workflow drafts, the single source of truth for how coding work runs (the Coding bot, cloud agents, plans, git, tests, verification). Drafts until the owner marks them final.

## Roles

- **Owner**: owns intent, approves plans, merges, tags releases.
- **Chief of Staff bot** (Grok bot): routes all coding work to the Coding bot and brings the owner only decisions, blockers and next moves.
- **Project Management bot**: one bot per project. Checks plans with the owner for intent and scope and hands them to the Coding bot; that hand-off is the go.
- **Coding bot**: orchestrates coding work. Triggers preflight, resolves its open questions and writes the phase brief, launches one cloud agent per phase, reviews each phase, keeps the plan record, escalates.
- **Cloud agent**: a Cursor cloud agent that builds one phase.
- **Claude review**: GitHub Action that runs preflight and per-phase review. Its verdict is advisory.

No GitHub issues: the backlog lives outside GitHub, kept by the Chief of Staff bot (owner, 2026-10-26).

Questions the Coding bot can't answer from the repo docs go to the owner directly, for now, until the owner names who else can answer them (owner, 2026-10-26).

## Reading order

1. [Knowledge, specs and planning](knowledge-and-planning.md)
2. [Git workflow](git-workflow.md)
3. [Phased PR workflow](phased-pr-workflow.md)
4. [Testing for autonomous agent work](testing-workflow.md)
5. [Verification workflow](verification-workflow.md)

The files in `docs/init/` are the source of truth. The pages refer to each other by these filenames (owner, 2026-10-27).

## Source material

What the drafts were built from. Read for background only; the pages here win where they differ.

- **pstack by poteto**: The Complete Guide to pstack, Part 1 ("Verification is all you need") and Part 2 (research, planning, architecture); skills `poteto-mode` (incl. `playbooks/multi-phase-plan.md` and `scripts/check-plan.mjs`), `/create-verification-skill`, `/maintain-verification-skill`, `/in-your-own-words`, `/technical-writing`, `/architect`. Used by Verification, Knowledge and planning.
- **mattpocock/skills** `tdd` (MIT): test rules. Used by Testing.
- **Cursor docs** (2026-10-19): cloud agents and MCP servers.

## Pages

[Knowledge, specs and planning](knowledge-and-planning.md)

[Git workflow](git-workflow.md)

[Phased PR workflow](phased-pr-workflow.md)

[Testing for autonomous agent work](testing-workflow.md)

[Verification workflow](verification-workflow.md)

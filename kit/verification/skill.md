# Verification skill

Each repo writes its own verification skill: the one way its agents launch, drive and observe the codebase. It is repo-owned and lives in the folder `paths.verification-skill` in the settings file names, such as `docs/agents/skills/verify/`.

## What it holds

1. A CLI in the repo that scripts launching, driving and observing the codebase, so agents run commands instead of writing throwaway scripts. It:
   - composes, with deep commands and subcommands
   - offers `--dry-run` on every command with side effects
   - gives full `--help` output
   - returns JSON
   - has error messages that tell the agent what to do instead
2. A `SKILL.md` with these sections:
   - **Launch**: how to start the codebase, and when it counts as ready
   - **Doctor**: a read-only health check
   - **Drive**: how to drive a feature through the CLI
   - **Evidence**: what to capture, and the folder outside the repo or ignored by git where runs write it
   - **Cleanup**: how to stop and reset, never deleting the evidence
3. A [Feature Map](feature-map.md), inside the skill's folder.

The CLI is committed to the repo, so every agent drives the codebase the same way, whatever its tool.

## When it counts as working

A new verification skill proves itself once, end to end, before it counts as done: launch, doctor, drive one mapped feature, capture evidence, clean up, and confirm the evidence survived the cleanup.

## Keeping it working

- The skill is critical infrastructure. When it breaks, fixing it comes before more feature work.
- A phase that adds or changes a feature updates that feature's Feature Map file in the same phase.
- The weekly drift check, where the repo takes it, maintains the skill against the codebase each week.

# Agents

How agents work in this repo.

## Reading order

1. `kit/core/glossary.md`
2. `CONTEXT.md`
3. `docs/product/index.md`
4. This file

## Rules

- Use the terms in the kit glossary and `CONTEXT.md`.
- Name things by their definition. A new concept gets a glossary entry before it's used.
- Glossary entries are one sentence, two at most. Cap the length of entries, never the number of terms.
- `docs/product/` describes shipyard itself: intent, behavior, refusals. Install and usage instructions for adopting repos go in the README and `docs/guide/`.
- Shipyard's own `docs/product/`, `docs/agents/` and `CONTEXT.md` are never copied into adopting repos. What ships is the kit, in `kit/`.
- Before writing a rule, ask who carries it out. Agents or humans in an adopting repo: it goes in the kit. Shipyard's CLI or CI pieces: it goes in `docs/product/`. Each rule has one home.
- Workflow terms go in the kit glossary; terms about shipyard itself go in `CONTEXT.md`.
- `.github/` holds only shipyard's own CI. CI pieces live in `kit/`.
- Every `AGENTS.md` has a sibling `CLAUDE.md` holding only `@AGENTS.md`, so Claude Code loads it.
- This repo is public. Never name private orgs, repos, clients or products, local paths, or infrastructure hosts.

## Commands

None yet.

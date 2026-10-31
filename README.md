# shipyard

A workflow kit for planning, building, reviewing and verifying code with coding agents and bots. It is built around roles, not tools: a human plans with a planning agent, and optional bots build, review and verify the work on PRs. Its mechanics stay useful to someone who rejects its opinions.

## Status

In design. There is no release yet, no CLI, no skills, and the CI pieces describe their interface but have no action code. What works today is copying the kit by hand and planning with it: core needs only a human and a planning agent. See [the guide](docs/guide/index.md).

## What's where

| Path | Holds |
| --- | --- |
| [`kit/`](kit/core/index.md) | The kit: core, which every adopting repo takes, and the modules, each taken or left on its own. Each part's `index.md` says what it holds and what it needs. |
| [`examples/maintainer/`](examples/maintainer/index.md) | The maintainer's settings file and house rules, as an example to copy from |
| [`docs/guide/`](docs/guide/index.md) | How to adopt the kit |
| [`docs/product/`](docs/product/index.md) | Shipyard's own specs: what it is, what it ships and what it refuses |
| [`docs/agents/`](docs/agents/index.md), [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), [`CONTEXT.md`](CONTEXT.md) | How agents work on shipyard itself, and its own glossary |
| `docs/plans/` | Shipyard's own plans |

The workflow terms are defined in the [kit glossary](kit/core/glossary.md).

## Credits

- [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto, and The Complete Guide to pstack: the ideas behind verification as the evidence that work is done, the verification skill and its Feature Map, the restatement, and planning in phases.
- [mattpocock/skills](https://github.com/mattpocock/skills): the testing practice adapts text from its `tdd` skill, under the MIT license. See [`kit/core/NOTICE.md`](kit/core/NOTICE.md).

## License

[MIT](LICENSE).

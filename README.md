# shipyard

A workflow kit for planning, building, reviewing and verifying code with coding agents and bots. It is built around roles, not tools: a human plans with a planning agent, and optional bots build, review and verify the work on PRs. Its mechanics stay useful to someone who rejects its opinions.

## Status

In design, with no release yet. There are no skills yet, and the CI pieces describe their interface but have no action code. What works today is planning with core, which needs only a human and a planning agent.

## Install

From release `0.1.0` on, the CLI installs, updates and removes shipyard's parts. Run it with Node 22 or later from your repo's root, at a pinned release:

```sh
npx shipyard-kit@x.y.z init
```

Its output ends with next steps written for an agent, so you can ask your agent to run it and finish what it asks. Until that release, copy the kit by hand. [The guide](docs/guide/index.md) covers both, and updating and removing.

## What's where

| Path | Holds |
| --- | --- |
| [`kit/`](kit/core/index.md) | The kit: core, which every adopting repo takes, and the modules, each taken or left on its own. Each part's `index.md` says what it holds and what it needs. |
| [`examples/maintainer/`](examples/maintainer/index.md) | The maintainer's settings file and house rules, as an example to copy from |
| [`docs/guide/`](docs/guide/index.md) | How to adopt, update and remove the kit |
| [`cli/`](cli/main.js), `package.json` | The CLI, published to npm as `shipyard-kit` |
| [`CHANGELOG.md`](CHANGELOG.md) | What each release changed, and what a repo must do |
| [`docs/product/`](docs/product/index.md) | Shipyard's own specs: what it is, what it ships and what it refuses |
| [`docs/agents/`](docs/agents/index.md), [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), [`docs/context.md`](docs/context.md) | How agents work on shipyard itself, and its own glossary |
| `docs/plans/` | Shipyard's own plans while they are built. A done plan is deleted; its PR keeps the record |

The workflow terms are defined in the [kit glossary](kit/core/glossary.md).

## Credits

- [pstack](https://github.com/cursor/plugins/tree/main/pstack) by poteto, and [The Complete Guide to pstack](https://github.com/cursor/plugins/tree/main/pstack/docs/guide): the ideas behind verification as the evidence that work is done, the verification skill and its Feature Map, the restatement, and planning in phases.
- [mattpocock/skills](https://github.com/mattpocock/skills): the testing practice adapts text from its `tdd` skill, under the MIT license. See [`kit/core/NOTICE.md`](kit/core/NOTICE.md).

## License

[MIT](LICENSE).

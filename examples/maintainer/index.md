# Example setup: the maintainer's

The maintainer's own role mapping and house rules, as an example for an adopting repo to copy from. Never installed: copy only what you want.

| File | Copy to | Holds |
| --- | --- | --- |
| [settings.yml](settings.yml) | `.shipyard/settings.yml`, in place of core's template | The role mapping and the maintainer's conventions. Values marked "per repo" are filled in each repo. |
| [house-rules.md](house-rules.md) | The agent rules folder, linked from the House rules section of its index | The maintainer's house rules, written as agent rules |

- Copy core first. The settings file replaces the one copied from core's template.
- The house rules are opinions, gathered while the kit was split from the maintainer's earlier drafts. They are not yet sorted: some may later turn out to be mechanics, and some may be dropped.

# Example setup: the maintainer's

The maintainer's own role mapping and house rules, as an example for an adopting repo to copy from. Never installed: copy only what you want.

| File | Copy to | Holds |
| --- | --- | --- |
| [settings.yml](settings.yml) | `.shipyard/settings.yml`, in place of core's template | The role mapping and the maintainer's conventions |
| [house-rules.md](house-rules.md) | The agent rules folder, linked from the House rules section of its index | The maintainer's house rules, written as agent rules |

- Copy core first. The settings file replaces the one copied from core's template.
- Values marked "per repo", in either file, are filled in each repo.
- Empty the roles that no part you took uses. Rules that name a bot, such as the builder bot's model or the Sizing log, apply only where the repo takes the building module.
- Skills the house rules name, such as pstack's, are outside skills: install them yourself or drop the rule.
- The house rules are opinions, gathered while the kit was split from the maintainer's earlier drafts. They are not yet sorted: some may later turn out to be mechanics, and some may be dropped.

# Runs

How the orchestrator bot handles the builder bot's runs, sizes phases and logs what they took.

## Run handling

- A run that stops early or errors gets reported on the phase's line in the status comment, with what failed. The orchestrator bot doesn't retry blindly, and never loosens a restriction on its own.
- A run that goes unusually long: the orchestrator bot checks its transcript. Little or no new activity means a hang, which it reports rather than silently restarting.
- Corrections go back to the same builder bot, which already holds the context. A fresh builder bot starts only when that session compacted or the fix won't fit. Its brief names the finding, the files involved, and which earlier changes must stay as they are.

## Sizing

- Estimates are in hours: how long a developer who knows the repo would take. Never in tool calls or tokens.
- The orchestrator bot checks its estimates against the Sizing log before estimating. Start with small phases and grow them as the log shows what fits.
- A phase that turns out bigger than the size the repo's house rules set gets split by the orchestrator bot, without the human, and the split is noted in the plan.

## Sizing log

One row per phase, comparing the estimate with what the run took:

| Column | Holds |
| --- | --- |
| Date | When the phase finished |
| Plan | The plan's file name |
| Phase | The phase number |
| Tool | The builder bot's tool and model |
| Estimated hours | The orchestrator bot's estimate after preflight |
| Actual minutes | How long the runs took |
| Tool calls | Across the phase's runs |
| Fix rounds | How many |
| Compacted | Whether a session compacted |
| Restatement caught | Whether the restatement revealed a mismatch |
| Repo size | Such as small site, app or monorepo |
| Peak context | Where the tool reports it |

`paths.sizing-log` in the settings file says where the log lives. In the repo, the orchestrator bot adds the row in the phase's plan record commit. Elsewhere, the orchestrator bot's tool needs write access there. Empty: no log is kept.

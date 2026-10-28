# Later

## Refused

- **Agent runtime.** Shipyard doesn't host, run or schedule bots. It gives them instructions, skills and checks.
- **Backlog or tracker.** Work enters as an approved plan. Where ideas come from is outside shipyard.
- **Deploy system.** Shipyard says when and how to tag. The adopting repo's pipeline deploys.
- **Vendor lock-in.** No workflow requires a specific tool. Tools appear only in a role mapping. GitHub is the one assumed platform (see [shape](shape.md)).
- **Coordination between humans.** Shipyard doesn't decide whether a plan needs a second human's approval, who may merge whose plan, or how humans settle conflicting intent between plans. House rules or the adopting repo's own settings, such as required reviewers, decide that.

## Parked

- **Tool plugins.** A plugin per agent tool for one-command install, built from the plain files. Waits until the plain files are stable; never the source.

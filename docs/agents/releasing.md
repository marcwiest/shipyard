# Releasing

The steps for one release, `x.y.z`. Tagging and publishing are the human's; an agent prepares the release commit and runs the checks.

Before the release, the checks in [shape](../product/shape.md#releases) pass: the scenario runs, the read for terms without a glossary entry and rules with more than one home, and the link check.

1. In the release commit, set `version` in `package.json` to `x.y.z` and rename the changelog's `## Unreleased` heading to `## x.y.z`, such as `chore: release x.y.z`. It lands on `main` through a PR.
2. Tag that commit on `main` and push the tag:

   ```sh
   git tag vx.y.z <commit>
   git push origin vx.y.z
   ```

3. From a clean checkout of the tag, inspect the package:

   ```sh
   git checkout vx.y.z
   npm pack --dry-run
   ```

   It names `shipyard-kit@x.y.z`, and its files are `cli/` without its tests, `kit/`, `CHANGELOG.md`, `README.md`, `LICENSE` and `package.json`.

4. Still at the tag, publish it: `npm publish`.
5. Create a GitHub release from the tag, with the changelog's `x.y.z` entry as its notes:

   ```sh
   gh release create vx.y.z --title x.y.z --notes-file <the entry, saved to a file>
   ```

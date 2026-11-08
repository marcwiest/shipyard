# Releasing

The steps for one release, `x.y.z`. Tagging and publishing are the human's; an agent prepares the release commit, runs the checks and, once the release is public, updates shipyard's own install.

Before the release, the checks in [shape](../product/shape.md#releases) pass: the [scenario runs](scenario-runs.md), the read for terms without a glossary entry and rules with more than one home, and the link check.

1. In the release commit, set `version` in `package.json` to `x.y.z` and rename the changelog's `## Unreleased` heading to `## x.y.z`, such as `chore: release x.y.z`. It lands on `main` through a PR.
2. Once the release PR is merged, tag its merge commit on `main` and push the tag:

   ```sh
   git tag vx.y.z <merge commit>
   git push origin vx.y.z
   ```

3. From a clean checkout of the tag, inspect the package:

   ```sh
   git checkout vx.y.z
   npm pack --dry-run
   ```

   It names `shipyard-kit@x.y.z`, and its files are `cli/` without its tests, `kit/`, `CHANGELOG.md`, `README.md`, `LICENSE` and `package.json`.

4. Still at the tag, publish it: `npm publish`. npm may hold the publish until you approve it on npmjs.com; the version isn't public until then.
5. Create a GitHub release from the tag, with the changelog's `x.y.z` entry as its notes:

   ```sh
   gh release create vx.y.z --title x.y.z --notes-file <the entry, saved to a file>
   ```

6. Once `x.y.z` is public, an agent updates shipyard's own install in `.shipyard/` to it, as [the guide's update](../guide/index.md#update-it) says, on a branch such as `chore/shipyard-x.y.z`, through its own PR. Inside shipyard's repo, `npx shipyard-kit@x.y.z` fails with "command not found", because npm takes the repo for the package itself, so start it from a folder outside the repo:

   ```sh
   npx --package shipyard-kit@x.y.z -c 'cd <shipyard repo> && shipyard-kit update'
   ```

# CLI

The command that installs, updates and removes shipyard's parts in an adopting repo. It's the npm package `shipyard-kit`, and its version is the release number.

## Running it

- It runs from the repo root at a pinned release, without installing it: `npx shipyard-kit@x.y.z <command>`.
- `--help` lists the commands and the modules. `--version` prints the release.
- It exits 0 when done, 1 when it refused or stopped, and 2 for wrong arguments, such as an unknown command or module. It writes nothing in the last two cases.
- When it exits 0 it prints to stdout; otherwise to stderr.

## Next steps

- Every command ends its output with numbered next steps, or says nothing is left. Each step names a file, key or action and is complete enough for an agent to carry out.
- When a command wrote files, its first next step is to commit them alone, such as `chore: update shipyard to x.y.z`. The CLI's changes then stay apart from the repo's own.
- A command stops before writing anything when a file it would write has uncommitted changes, untracked files included. It lists them, and its next step is to commit them.

## init

`init [module...]` installs core and the named modules.

- It refuses when the current folder has no `.git`.
- It refuses when a named module's Needs line names a part not taken, naming that part. It never adds a part on its own.
- It copies each part's folder from the kit to `.shipyard/<part>/` and writes the version record (see [adoption](adoption.md#the-version-record)).

# CLI

The command that installs, updates and removes shipyard's parts in an adopting repo. It's the npm package `shipyard-kit`, and its version is the release number.

## Running it

- It runs from the repo root at a pinned release, without installing it: `npx shipyard-kit@x.y.z <command>`.
- `--help` lists the commands and the modules. `--version` prints the release.
- It exits 0 when done, 1 when it refused or stopped, and 2 for wrong arguments, such as an unknown command or module. It writes nothing in the last two cases.
- When it exits 0 it prints to stdout; otherwise to stderr.
- It refuses to write through a symlink, and refuses a version record that lists a path outside `.shipyard/`, so nothing it writes or deletes lands outside them.

## Next steps

- Every command ends its output with numbered next steps, or says nothing is left. Each step names a file, key or action and is complete enough for an agent to carry out.
- When a command wrote files, its first next step is to commit them alone, such as `chore: update shipyard to x.y.z`. The CLI's changes then stay apart from the repo's own.
- A command stops before writing anything when a file it would write has uncommitted changes, untracked files included. It lists them, and its next step is to commit them.

## init

`init [module...]` installs core and the named modules.

- It refuses when the current folder has no `.git`.
- It refuses when a named module's Needs line names a part not taken, naming that part. It never adds a part on its own.
- It copies each part's folder from the kit to `.shipyard/<part>/` and writes the version record (see [adoption](adoption.md#the-version-record)).
- It writes `.shipyard/settings.yml` from core's settings template, leaving out each key marked `# read by:` whose parts weren't taken. It never overwrites a settings file that exists.
- It adds the AGENTS.md block from core's template, between its markers, at the end of AGENTS.md, creating the file if it's missing. Trigger labels and skills are "none" while the kit has no skills or dispatcher.
- It copies the spec index, agent rules index and glossary templates once, to the settings template's default paths, skipping any that exist and saying which.
- Its next steps end by saying where the repo's own instructions go: its agent rules and house rules, never `.shipyard/`.

On an existing install, `init` adds the named parts at the installed release:

- It refuses when the CLI's release differs from the version record's, with running `update` first as its next step.
- It copies the new parts and adds their files to the version record.
- It never edits the settings file. It prints as next steps the exact settings lines the new parts read that the file lacks, and where each goes.

## update

`update [--force]` brings the installed parts to the CLI's release.

- It refuses when the version record names a release newer than the CLI's, naming the installed release. Its next step says that going back means reverting the commit that updated shipyard, since the CLI can't undo a newer release's manual steps.
- It compares each managed file and the AGENTS.md block with the version record. Any that was edited or deleted stops it before any write. It lists each one with the path of its new version in the package, and its next step tells the agent to ask the human whether the change belongs in a repo-owned file, such as the agent rules, before rerunning with `--force`.
- Otherwise, or with `--force`, it replaces the installed parts' managed files, deletes those the new release dropped, replaces the block's contents and rewrites the version record. It never touches repo-owned files.
- Its next steps after the commit are the settings lines the installed parts read that the file lacks, and the changelog's entries after the installed release up to the CLI's, oldest first: each entry's one-line summary and its "What a repo must do" list in full. With no release in the record, it prints every entry up to the CLI's. Each is done in its own commit, after the CLI's.
- It reads a version record written by hand, with a commit and no release or block checksum.

## remove

`remove` takes shipyard out of the repo.

- It deletes `.shipyard/`, the settings file with it, and the AGENTS.md block. It deletes AGENTS.md only when nothing else is left in it.
- It leaves the copied templates, which are repo-owned, and lists what it left. Its next steps name the files left that still point into `.shipyard/`.

# Feature Map

The verification skill's index of features: what each feature is, and how to reach, drive and prove it. It is the repo's memory of how its features are verified.

## Layout

In the verification skill's folder:

- `features/README.md`: the index. One line per feature, linking its file.
- `features/<feature>.md`: one file per feature.

## A feature's file

Written from the point of view of whoever uses the feature, a person or a consuming program. Each file has these sections:

| Section | Holds |
| --- | --- |
| What it is | The feature in one or two sentences, as its user sees it |
| Surface | The surface it is on, from `verification-surfaces` in the settings file |
| Entry points | Every way to reach it, such as a page, a route, a command or an export |
| Drive | The verification CLI commands that drive it, for each entry point |
| Proves it works | The end state that shows it works, and what to capture of it |
| Gotchas | What makes it easy to verify wrongly, such as a stale cache or a slow start |

## Using it

- A verification run drives every entry point the feature's file lists for a feature the work touched. A run that drives one convenient entry point when the file lists others is incomplete.
- A feature with no file gets one before its first verification run.
- The index lists every feature file. Adding or removing a file updates the index in the same commit.

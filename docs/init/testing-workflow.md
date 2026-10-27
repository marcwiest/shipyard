# Testing for autonomous agent work

Status: conceptual draft. Nothing is implemented and no skills are written until the owner says it is final.
Companions: `phased-pr-workflow.md`, `verification-workflow.md`.
Sources: mattpocock/skills `tdd` (MIT); pstack `principle-test-behavior-not-implementation`, `principle-prove-it-works`, `tdd`.

## Three layers of proof

1. Types, schema parse, build (`astro build` / `astro check` or the repo's equivalent).
2. Tests at seams.
3. A verification run against the real artifact (see `verification-workflow.md`). Tests alone are not verification.

## What gets a test

- Only behavior that can be wrong while layer 1 passes.
- Tests sit at seams, defined per repo in `docs/agents/tests.md` (owner, 2026-10-26). Packages: package exports, imported by package name, never by internal path (enforced by lint, e.g. Biome `noRestrictedImports` in `test/`). Sites and apps (Astro, WordPress, Laravel): the repo names its seams, such as routes or public APIs.
- Literal expected values. No tautologies, no restated source tables.
- Mocks only at system boundaries.
- Each test passes the two pstack checks: breaking the behavior fails it; changing internals without changing behavior keeps it green.

## Order inside a phase

- Spec first: the agent reads `docs/product/index.md` and writes the spec text the phase's Spec line calls for, within the docs rule in `knowledge-and-planning.md` (Spec writing), committed as `docs(phase-N):`.
- The seam and the behavior each test asserts come from the phase's Tests box, which the Coding bot writes at Planning partners step 5 from `docs/agents/tests.md`. The agent names the tests. Where it is unclear, the Coding bot answers from `docs/product/` and `docs/agents/`, else asks the owner. Agents stop instead of guessing (owner, 2026-10-27).
- Failing tests land as their own commit: `test(phase-N): ...`.
- Code commits (`feat(phase-N): ...` or `fix(phase-N): ...`) make them pass. Prefixes follow `git-workflow.md` (owner, 2026-10-26).

## Tests the code can't bend

Decided (owner, 2026-10-27): judged in review, with no CI check. Tests change for good reasons more often than bad ones: in an earlier repo's history, most changes to existing tests followed a behavior change, a refactor or rename, a removed feature, or a test made stronger, and a CI rule tied to `docs/product/` changes would have flagged mostly that work.

- The phase report gives each test change its reason: the product line it follows, a refactor or rename, a removed feature, or a stronger test.
- A test change that alters asserted behavior comes with a `docs/product/` change.
- The Coding bot judges each test change in the phase review, and Claude review flags the same signals:
    - an assertion moved from exact to loose
    - a case deleted while the code it tested still exists
    - expected values changed while the test name did not
    - a test that reads source or internals instead of behavior
- Loosening an assertion or deleting a case whose code still exists is a blocking finding unless the stated reason holds.
- Coverage floor: whatever coverage the repo has once the workflow is implemented there, never lowered after that (owner, 2026-10-26). It is set in the test runner's own threshold config (Vitest `coverage.thresholds`, Jest `coverageThreshold`, `node --test --test-coverage-lines=N`), so the repo's required test job fails below it. Lowering it is a visible diff in the PR; the Coding bot states the reason at handoff and the owner approves by merging (owner, 2026-10-27).

## Mutation testing

- Runs only with the owner's approval, each time (slow: about 1 hour for a mid-size package).
- A survivor is evidence, not a task. No `// Stryker disable` comments.

## Where skills live

Agreed (owner, 2026-10-19):

- Source of truth: `docs/agents/skills/<name>/SKILL.md` (plus its support files).
- Discovery stubs: `.cursor/skills/<name>/SKILL.md`, `.grok/skills/<name>/SKILL.md`, `.claude/skills/<name>/SKILL.md`.
- Each stub carries its own name and description header (tools fire skills from it) and a plain line: "Read `docs/agents/skills/<name>/SKILL.md` and follow it." Don't rely on `@` expansion.
- A CI check confirms every docs skill has all three stubs with matching headers.

## Decided (2026-10-26)

- Settled (owner, 2026-10-26): one rule for local and cloud. Each phase's commits land the spec first (`docs(phase-N):`), then tests (`test(phase-N):`), then code (`feat`/`fix(phase-N):`). Locally, working one test at a time is allowed, as long as the tests are committed before the code.

## Lesson (2026-10-23): keep test output small

A cloud agent run crashed when a failing test printed ~1.1 MB (assertion output included the full HTML with an embedded font data URI). Rule: tests assert on small fragments or substrings, never print or deep-compare large blobs (data URIs, binaries, whole documents). Deleting merged branches right away was not the cause and stays as is. Deterministic check (owner, 2026-10-26): CI caps test output size and fails the run above the cap. The cap is a job in the shared workflow with a default (e.g. 256 KB); a repo overrides it in its caller workflow only when needed. It only sees output a CI run prints, so a blob that appears only on failure gets through until a test fails; the small-fragments rule and Claude review cover that (owner, 2026-10-27).

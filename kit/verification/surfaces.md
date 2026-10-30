# Surfaces and evidence

Verification follows the surface a user touches, not a screen. Each repo names its surfaces in `verification-surfaces` in the settings file.

## Driving each surface

| Surface | Driven by | Evidence |
| --- | --- | --- |
| Web page | Driving pages in a real browser | Screenshots, video, performance traces, console and network logs |
| API or service | Launching the service locally with seed data and test users, then real HTTP calls | Requests and responses, status codes, logs, side effects such as rows written or messages sent |
| Library | A small consumer app or the demo page | What the consumer shows or returns |
| CLI | An isolated terminal session | The transcript, exit codes and files written |

For an API or service, the Feature Map lists endpoints and journeys from the consumer's point of view.

## Minimum evidence

The least a verification run captures for a touched feature, per surface. A repo can raise these in its agent rules, and a Change's Evidence line can ask for more, never less.

- **Web page**: a screenshot of every changed view at mobile and desktop width, and no console errors.
- **API or service**: one real request and response per changed endpoint, including one failure case.
- **Library**: one run through the demo page or a consumer app.
- **CLI**: a transcript of each changed command with its exit code.
- On every surface: each entry point the Feature Map lists for a touched feature is driven.

## Rules for every run

- Exercise the real path, never test-only endpoints or internal setters.
- Capture both the action and the state it leads to.
- Check side effects.
- Mock only at a boundary that production already isolates.
- Check what a dry run skips by observing it, never by trusting the flag.

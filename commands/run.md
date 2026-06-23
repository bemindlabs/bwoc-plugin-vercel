---
description: Run a single task headless on a BWOC agent and capture the result
argument-hint: <agent-name> "<task prompt>"
allowed-tools: Bash(bwoc:*)
---

Run a single task non-interactively (headless mode) on a BWOC agent and capture its
result by wrapping the `bwoc` CLI.

- `$1` is the agent (id `agent-foo` or bare `foo`).
- `$2` is the task prompt. Quote it so the whole prompt is one argument.

Run:

```bash
bwoc run "$1" --task "$2"
```

Optional flags from `bwoc run --help`: `--timeout <seconds>` to kill a long run, and
`--json` for structured `{ agent, backend, task, exit_code, duration_ms, output }`.
Always quote user-supplied values. Report the captured output verbatim.

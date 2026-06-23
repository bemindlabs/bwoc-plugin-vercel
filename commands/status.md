---
description: Show a BWOC agent's health + identity snapshot (read-only)
argument-hint: "[agent-name] | --all"
allowed-tools: Bash(bwoc:*)
---

Show the per-agent health + identity snapshot from the BWOC workspace by wrapping the `bwoc` CLI.

Run:

```bash
bwoc status $ARGUMENTS
```

`$ARGUMENTS` is an optional agent name (id `agent-foo` or bare `foo`). Omit it for the
per-agent table summary, or pass `--all` for the full detail block of every agent.
Other flags from `bwoc status --help`: `--banner`, `--json`. Report the output verbatim.

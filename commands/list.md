---
description: List BWOC agents registered in the workspace
argument-hint: "[--status active] [--backend claude] [--running] [--json]"
allowed-tools: Bash(bwoc:*)
---

List the agents registered in the enclosing BWOC workspace by wrapping the `bwoc` CLI.

Run:

```bash
bwoc list $ARGUMENTS
```

`$ARGUMENTS` may carry optional filters/flags discovered from `bwoc list --help`, e.g.
`--status active`, `--backend claude`, `--running`, `--inbox-pending`,
`--sort id|inbox|incarnated|backend`, `--names-only`, `--count`, or `--json`.
With no arguments, print the full agent table. Report the output verbatim.

---
description: Manage a BWOC team's shared task list (add / list / claim / complete)
argument-hint: <add|list|claim|complete> <team> [args]
allowed-tools: Bash(bwoc:*)
---

Manage a Saṅgha team's shared task list by wrapping the `bwoc task` CLI. The first
argument is the subcommand; pass the rest through verbatim.

Run:

```bash
bwoc task $ARGUMENTS
```

Subcommands and their shapes (from `bwoc task --help`):

- `list <team>` — list a team's tasks with state + claimant. (read-only)
- `add <team> "<title>"` — add a task; optional `--deps a,b`, `--id <id>`, `--requires-plan`.
- `claim <team> <task> --as <agent>` — claim a pending, unblocked task as a team member.
- `complete <team> <task> --as <agent>` — complete an in-progress task you claimed.
- `plan` / `approve` / `reject` — Pavāraṇā plan workflow.

Quote any multi-word title. Every subcommand also supports `--json`. Report output verbatim.

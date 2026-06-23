---
description: Manage BWOC Saṅgha teams (create / list / retire)
argument-hint: <create|list|retire> [args]
allowed-tools: Bash(bwoc:*)
---

Manage Saṅgha teams — named subsets of agents that share a task list — by wrapping the
`bwoc team` CLI. The first argument is the subcommand; pass the rest through verbatim.

Run:

```bash
bwoc team $ARGUMENTS
```

Subcommands (from `bwoc team --help`):

- `list` — list teams with member + task counts. (read-only)
- `create <id> --members a,b,c` — create a team with a kebab-case id and member list.
- `retire <id> [--yes]` — retire a team (removes its membership file + task list).

Every subcommand also supports `--json`. Report the output verbatim.

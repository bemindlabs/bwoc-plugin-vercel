---
description: Read & manage BWOC workspace memory (list / show / search / put)
argument-hint: <list|show|search|put> [args]
allowed-tools: Bash(bwoc:*)
---

Read and manage workspace-level memory (`.bwoc/memory/`) by wrapping the `bwoc memory`
CLI. The first argument is the subcommand; pass the rest through verbatim.

Run:

```bash
bwoc memory $ARGUMENTS
```

Subcommands (from `bwoc memory --help`):

- `list` — list memory entries. Flags: `--sort name|size|modified`, `--names-only`, `--count`, `--json`. (read-only)
- `show <name>` or `show --all` — print one entry, or every entry concatenated. (read-only)
- `search "<query>"` — case-insensitive substring search across entries. (read-only)
- `put <name> "<content>"` — write an entry; `--file <FILE>`, `--force`, or `--append`.
- `rm <name> [--yes]` — delete an entry.
- `wake-up` / `t2-search "<query>"` / `mine <path> --mode <mode>` — Tier 2 deep-memory.

Quote multi-word content/queries. Report the output verbatim.

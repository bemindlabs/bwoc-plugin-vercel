---
description: Open an interactive chat session with a BWOC agent
argument-hint: <agent-name>
allowed-tools: Bash(bwoc:*)
---

Start an interactive chat with a BWOC agent — execs the agent's backend CLI with its
manifest-driven model — by wrapping the `bwoc` CLI.

- `$1` is the agent (id `agent-foo` or bare `foo`).

Run:

```bash
bwoc chat "$1"
```

Optional flags from `bwoc chat --help`: `--tmux` (run under tmux), `--ghostty`
(new Ghostty window, macOS-only), `--tui` (full-screen ratatui client; harness backends
only), `--team <team>` (join a team's shared chat channel; requires `--tui`).

Note: `bwoc chat` execs an interactive backend CLI and takes over the terminal. Inside a
non-interactive tool call prefer `/bwoc:run` for a one-shot task; surface `bwoc chat` to
the user for a hands-on session.

---
description: Append a message to a BWOC agent's inbox
argument-hint: <agent-name> "<message>"
allowed-tools: Bash(bwoc:*)
---

Append a message to a BWOC agent's inbox (`.bwoc/inbox.jsonl`) by wrapping the `bwoc` CLI.

- `$1` is the recipient agent (id `agent-foo` or bare `foo`).
- `$2` is the message text. Quote it so multi-word messages stay a single argument.

Run:

```bash
bwoc send "$1" "$2"
```

Optional flags from `bwoc send --help`: `--from <agent>` (agent → agent sender),
`--reply-to <messageId>`, `--no-wakeup`, or `--file <FILE>` instead of an inline message.
Always quote user-supplied values. Report the confirmation output verbatim.

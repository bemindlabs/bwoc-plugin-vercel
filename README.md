<div align="center">

# 🛰️ bwoc-plugin-vercel

**One universal plugin that turns any AI coding agent into a BWOC fleet operator.**

Coordinate an agent fleet, run headless tasks, manage Saṅgha teams, and read workspace
deep-memory — all by wrapping the `bwoc` CLI. Install once; works across Claude Code,
Codex, Cursor, Copilot, and Grok.

[![CI](https://github.com/bemindlabs/bwoc-plugin-vercel/actions/workflows/ci.yml/badge.svg)](https://github.com/bemindlabs/bwoc-plugin-vercel/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![format: open-plugin](https://img.shields.io/badge/format-open--plugin-black)](https://vercel.com/docs/agent-resources/vercel-plugin)

</div>

## Install

```bash
npx plugins add bemindlabs/bwoc-plugin-vercel
```

The `plugins` CLI detects your AI coding tool and installs the matching manifest. The
plugin stays quiet until it sees a BWOC workspace (`.bwoc/agents.toml` present, or
`BWOC_WORKSPACE` set), then surfaces the fleet via slash commands and the `bwoc-fleet`
skill.

> Built in the same **universal open-plugin format** [Vercel pioneered](https://vercel.com/docs/agent-resources/vercel-plugin)
> for AI coding agents — one repo, every supported tool. For a Claude-Code-only build,
> see [`bwoc-plugin-claude`](https://github.com/bemindlabs/bwoc-plugin-claude).

## What it provides

| Component | Description |
| --- | --- |
| **8 slash commands** | `/bwoc:list` · `status` · `send` · `run` · `chat` · `team` · `task` · `memory` |
| **`bwoc-fleet` skill** | When/how to drive the fleet; auto-surfaced inside BWOC workspaces |
| **Session-start hook** | Announces fleet availability only when a BWOC workspace is detected |
| **Local sub-agents** | Generate native `@agent-<id>` delegates from *your* fleet (gitignored) |

## Supported tools

| Tool | Manifest |
| --- | --- |
| Claude Code | `.claude-plugin/` |
| Cursor | `.cursor-plugin/` |
| Codex · Copilot · Grok | canonical `.plugin/plugin.json` (open-plugin) |

## Usage

```text
/bwoc:list                      # who's in the fleet
/bwoc:status --all              # health + identity of every agent
/bwoc:run researcher "summarize the latest deploy logs"
/bwoc:send ops "rotate the staging token when you get a sec"
/bwoc:team list                 # Saṅgha teams + shared task lists
/bwoc:memory search "release"   # recall stored workspace context
```

Every command is a thin wrapper over the `bwoc` CLI — no server or daemon. Read-only
verbs (`list`, `status`, `*-list`, `memory show/search`) are safe to run anytime;
treat `send`, `run`, `task`/`team` mutations, and `memory put/rm` as mutating.

### Native sub-agents (optional)

```bash
BWOC_WORKSPACE=/path/to/your/workspace npm run gen-agents
```

Writes one delegator per active agent into `agents/` (gitignored). Hosts that support
sub-agents then expose your fleet as first-class `@agent-<id>` delegates.

## Develop

```bash
npm run build         # regenerate per-tool manifests from .plugin/plugin.json
npm run build:check   # verify committed manifests are in sync (CI gate)
npm run validate      # structural smoke test
npm test              # build:check + validate
```

The canonical manifest is **`.plugin/plugin.json`** — edit metadata there and run
`npm run build` to propagate it to every per-tool manifest. Commands live in
`commands/`, the skill in `skills/bwoc-fleet/`, and the session hook in `hooks/`.

## Requirements

- The [`bwoc`](https://github.com/bemindlabs) CLI on your `PATH`
- Node.js 18+ (for the build/validate/gen scripts)

## License

[MIT](./LICENSE) © 2026 Bemind Technology

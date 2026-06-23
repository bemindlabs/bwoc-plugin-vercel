# Changelog

All notable changes to the universal BWOC plugin are documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-23

First release — the BWOC fleet adapter as a **universal** plugin, installable into
multiple AI coding agents from one repo via `npx plugins add`.

### Added

- **Canonical open-plugin manifest** (`.plugin/plugin.json`) plus generated per-tool
  manifests for **Claude Code** (`.claude-plugin/`) and **Cursor** (`.cursor-plugin/`),
  produced from the canonical source by `scripts/build.mjs` (committed so installs need
  no build step; `--check` enforces sync in CI).
- **8 slash commands** (`/bwoc:list`, `status`, `send`, `run`, `chat`, `team`, `task`,
  `memory`) wrapping the `bwoc` CLI for fleet coordination, headless task runs, team /
  shared-task-list management, and workspace memory.
- **`bwoc-fleet` skill** — host-neutral guidance for when and how to drive the fleet,
  with `metadata.pathPatterns` so hosts can surface it in BWOC workspaces.
- **Lightweight session-start hook** that announces fleet availability only when a BWOC
  workspace is detected (`.bwoc/agents.toml` present or `BWOC_WORKSPACE` set).
- **Local sub-agent generation** (`scripts/gen-agents.mjs`) — writes one native
  delegator per active fleet agent from your `.bwoc/agents.toml`; output is gitignored,
  so no private fleet detail is committed to this generic plugin.
- **CI** — `node scripts/build.mjs --check` (manifest parity) + `scripts/validate.mjs`
  (structural smoke: manifests parse, version parity, command/skill frontmatter, hook
  event/type validity).

[0.1.0]: https://github.com/bemindlabs/bwoc-plugin-vercel/releases/tag/v0.1.0

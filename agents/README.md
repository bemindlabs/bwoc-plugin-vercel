# Generated sub-agents (not shipped)

This plugin is **generic** — it ships **no** agents. Sub-agent files are generated
**locally** from *your* BWOC workspace and are gitignored (`/agents/agent-*.md`), so
nothing about your fleet is ever committed to this repo.

Generate them for your own fleet:

```bash
BWOC_WORKSPACE=/path/to/your/bwoc/workspace node scripts/gen-agents.mjs
```

This reads `$BWOC_WORKSPACE/.bwoc/agents.toml` and writes one sub-agent file
(`agents/<id>.md`) per registered agent — each a thin delegator that shells out to
`bwoc run` / `bwoc send`. Hosts that support native sub-agents (Claude Code, Cursor)
then surface your fleet as first-class `@agent-<id>` delegates.

Until you generate them, the fleet is still fully usable through the `/bwoc:*` slash
commands and the `bwoc-fleet` skill, which wrap the `bwoc` CLI directly.

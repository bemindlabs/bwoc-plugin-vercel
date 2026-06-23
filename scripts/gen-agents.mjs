#!/usr/bin/env node
// Generate native sub-agent delegator files from YOUR BWOC workspace.
//
// Reads `$BWOC_WORKSPACE/.bwoc/agents.toml` and writes one `agents/<id>.md` per active
// agent — a thin delegator that shells out to `bwoc run` / `bwoc send`. The output is
// gitignored: it describes your private fleet and is never committed to this generic
// plugin. Re-run whenever your fleet changes.
//
// Usage: BWOC_WORKSPACE=/path/to/workspace node scripts/gen-agents.mjs

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ws = process.env.BWOC_WORKSPACE || process.cwd();
const tomlPath = join(ws, ".bwoc/agents.toml");

if (!existsSync(tomlPath)) {
  console.error(`No agents.toml at ${tomlPath}. Set BWOC_WORKSPACE to your workspace root.`);
  process.exit(1);
}

// Minimal `[[agent]]`-block parse — no TOML dependency. Each block has flat key = "value".
const blocks = readFileSync(tomlPath, "utf8").split(/\[\[agent\]\]/).slice(1);
const field = (b, k) => (b.match(new RegExp(`^${k}\\s*=\\s*"([^"]*)"`, "m")) || [])[1];

let written = 0;
for (const b of blocks) {
  const id = field(b, "id");
  if (!id) continue;
  const status = field(b, "status") || "active";
  if (status !== "active") continue;
  const backend = field(b, "backend") || "?";
  const bare = id.replace(/^agent-/, "");

  const md = `---
name: ${id}
description: BWOC fleet member "${bare}" (backend ${backend}). Delegate a self-contained task to this agent; it runs headless via the bwoc CLI and returns its result.
---

You are a thin delegator to the BWOC fleet agent \`${id}\`. When invoked, hand the task to
that agent and report its result verbatim — do not attempt the work yourself.

Run a headless one-shot:

\`\`\`bash
bwoc run ${id} --task "<the task prompt>" --json
\`\`\`

Or queue an async message to its inbox:

\`\`\`bash
bwoc send ${id} "<message>"
\`\`\`

Always quote the task/message so it stays a single argument. Surface the captured output
back to the caller unchanged.
`;
  writeFileSync(join(ROOT, "agents", `${id}.md`), md);
  written++;
}

console.log(`Generated ${written} sub-agent delegator(s) in agents/ (gitignored).`);

#!/usr/bin/env node
// Generate the per-tool plugin manifests from the canonical `.plugin/plugin.json`.
//
// The open-plugin format keeps one source-of-truth manifest at `.plugin/plugin.json`
// (metadata only) and ships a small per-tool manifest for each AI coding host that
// wants an explicit one. `npx plugins add bemindlabs/bwoc-plugin-vercel` reads the
// host-appropriate file. We commit the generated manifests so installs need no build
// step; this script regenerates them and (`--check`) verifies they are in sync in CI.
//
// Usage: node scripts/build.mjs [--check]

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const canonical = JSON.parse(readFileSync(join(ROOT, ".plugin/plugin.json"), "utf8"));
const { version, author, repository, homepage, license, keywords } = canonical;

// Per-tool name is the short slash-command namespace (e.g. /bwoc:list), distinct
// from the canonical package name. The plugin surfaces the same commands/skills/
// agents/hooks directories to every host.
const SHORT_NAME = "bwoc";
const SHORT_DESC =
  "BWOC fleet adapter — coordinate an agent fleet, run headless tasks, and read shared memory via the bwoc CLI.";

// Claude Code manifest: directory form (skills + hooks auto-detected from the dirs).
const claudePlugin = {
  name: SHORT_NAME,
  version,
  description: SHORT_DESC,
  author,
  homepage,
  repository,
  license,
  keywords,
  commands: "./commands/",
  agents: "./agents/",
  skills: "./skills/",
  hooks: "./hooks/hooks.json",
};

// Claude Code marketplace entry (so `/plugin marketplace add` resolves this repo).
const claudeMarketplace = {
  name: SHORT_NAME,
  owner: author,
  plugins: [
    {
      name: SHORT_NAME,
      source: "./",
      description: SHORT_DESC,
      version,
      keywords,
      license,
      homepage,
    },
  ],
};

// Cursor manifest: directory-pointer form.
const cursorPlugin = {
  name: SHORT_NAME,
  version,
  description: SHORT_DESC,
  author,
  homepage,
  repository,
  license,
  keywords,
  skills: "skills",
  agents: "agents",
  commands: "commands",
};

const targets = [
  [".claude-plugin/plugin.json", claudePlugin],
  [".claude-plugin/marketplace.json", claudeMarketplace],
  [".cursor-plugin/plugin.json", cursorPlugin],
];

let drift = false;
for (const [rel, obj] of targets) {
  const path = join(ROOT, rel);
  const next = JSON.stringify(obj, null, 2) + "\n";
  if (check) {
    let cur = "";
    try {
      cur = readFileSync(path, "utf8");
    } catch {
      cur = "";
    }
    if (cur !== next) {
      console.error(`drift: ${rel} is out of sync — run \`node scripts/build.mjs\``);
      drift = true;
    } else {
      console.log(`ok    ${rel}`);
    }
  } else {
    writeFileSync(path, next);
    console.log(`wrote ${rel}`);
  }
}

if (check && drift) process.exit(1);
console.log(check ? "manifests in sync" : "manifests generated");

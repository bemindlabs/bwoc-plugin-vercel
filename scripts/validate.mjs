#!/usr/bin/env node
// Structural smoke test for the universal BWOC plugin.
//
// Verifies the plugin is sound without installing it into any host: manifests parse,
// versions agree across the canonical + per-tool + package manifests, every command
// and skill carries the required frontmatter, and hooks declare valid events/types.
// Exit 0 = structurally sound. The `bwoc` CLI itself is only advisory (not on PATH in
// CI) — this gates structure, not the runtime.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fail = 0;
let warn = 0;
const ok = (m) => console.log(`  ok    ${m}`);
const bad = (m) => {
  console.log(`  FAIL  ${m}`);
  fail++;
};
const note = (m) => {
  console.log(`  warn  ${m}`);
  warn++;
};

const readJson = (rel) => JSON.parse(readFileSync(join(ROOT, rel), "utf8"));

// --- 1. manifests parse ---------------------------------------------------------
const MANIFESTS = [
  ".plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/plugin.json",
];
const parsed = {};
for (const m of MANIFESTS) {
  try {
    parsed[m] = readJson(m);
    ok(`${m} parses`);
  } catch (e) {
    bad(`${m} does not parse: ${e.message}`);
  }
}
let pkg;
try {
  pkg = readJson("package.json");
  ok("package.json parses");
} catch (e) {
  bad(`package.json does not parse: ${e.message}`);
}

// --- 2. version parity ----------------------------------------------------------
const canonicalVersion = parsed[".plugin/plugin.json"]?.version;
const versions = {
  ".plugin/plugin.json": canonicalVersion,
  ".claude-plugin/plugin.json": parsed[".claude-plugin/plugin.json"]?.version,
  ".claude-plugin/marketplace.json":
    parsed[".claude-plugin/marketplace.json"]?.plugins?.[0]?.version,
  ".cursor-plugin/plugin.json": parsed[".cursor-plugin/plugin.json"]?.version,
  "package.json": pkg?.version,
};
const mismatch = Object.entries(versions).filter(([, v]) => v !== canonicalVersion);
if (canonicalVersion && mismatch.length === 0) ok(`version parity (${canonicalVersion})`);
else bad(`version drift: ${JSON.stringify(versions)}`);

// --- 3. commands ----------------------------------------------------------------
const FM = /^---\n([\s\S]*?)\n---/;
const cmds = existsSync(join(ROOT, "commands"))
  ? readdirSync(join(ROOT, "commands")).filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  : [];
if (cmds.length === 0) bad("no commands found");
for (const f of cmds) {
  const body = readFileSync(join(ROOT, "commands", f), "utf8");
  const fm = body.match(FM);
  if (!fm) bad(`${f}: missing frontmatter`);
  else if (!/^description:\s*\S/m.test(fm[1])) bad(`${f}: missing description:`);
  else ok(`command ${f}`);
}

// --- 4. skills ------------------------------------------------------------------
const skillsDir = join(ROOT, "skills");
const skills = existsSync(skillsDir)
  ? readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory())
  : [];
if (skills.length === 0) bad("no skills found");
for (const s of skills) {
  const sp = join(skillsDir, s, "SKILL.md");
  if (!existsSync(sp)) {
    bad(`skill ${s}: missing SKILL.md`);
    continue;
  }
  const fm = readFileSync(sp, "utf8").match(FM);
  if (!fm) bad(`skill ${s}: SKILL.md missing frontmatter`);
  else if (!/^name:\s*\S/m.test(fm[1]) || !/^description:\s*\S/m.test(fm[1]))
    bad(`skill ${s}: SKILL.md needs name: + description:`);
  else ok(`skill ${s}`);
}

// --- 5. hooks -------------------------------------------------------------------
const VALID_EVENTS = new Set([
  "SessionStart",
  "SessionEnd",
  "UserPromptSubmit",
  "PreToolUse",
  "PostToolUse",
  "Stop",
  "SubagentStop",
  "Notification",
  "PreCompact",
]);
try {
  const hooks = readJson("hooks/hooks.json").hooks ?? {};
  for (const [event, entries] of Object.entries(hooks)) {
    if (!VALID_EVENTS.has(event)) bad(`hooks: unknown event ${event}`);
    else ok(`hook event ${event} valid`);
    for (const entry of entries) {
      for (const h of entry.hooks ?? []) {
        if (h.type !== "command" || !h.command) bad(`hooks/${event}: entry needs type+command`);
      }
    }
  }
  ok("every hook entry has type + command");
} catch (e) {
  bad(`hooks/hooks.json: ${e.message}`);
}

// --- 6. bwoc CLI (advisory) -----------------------------------------------------
try {
  const { execSync } = await import("node:child_process");
  execSync("command -v bwoc", { stdio: "ignore", shell: "/bin/bash" });
  ok("bwoc CLI on PATH");
} catch {
  note("bwoc CLI not on PATH — install it to actually drive the fleet (advisory)");
}

console.log("");
if (fail) {
  console.log(`FAIL — ${fail} problem(s)${warn ? `, ${warn} warning(s)` : ""}.`);
  process.exit(1);
}
console.log(
  `PASS — plugin is structurally sound${warn ? ` (${warn} advisory warning(s))` : ""}.` +
    " Install with: npx plugins add bemindlabs/bwoc-plugin-vercel",
);

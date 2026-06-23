---
name: bwoc-fleet
description: Coordinate the BWOC agent fleet from your AI coding agent. Use when the user wants to list/inspect BWOC agents, delegate or send work to a fleet member, run a headless task on an agent, manage Saṅgha teams or their shared task list, or read workspace deep-memory. Wraps the `bwoc` CLI (shell-out, no server).
metadata:
  priority: 7
  docs:
    - "https://github.com/bemindlabs/bwoc-plugin-vercel"
  pathPatterns:
    - ".bwoc"
    - ".bwoc/agents.toml"
    - ".bwoc/teams/*"
---

# BWOC Fleet Coordination

This skill teaches when and how to drive the **BWOC** agent fleet from any AI coding
agent. Every capability is a thin wrapper over the `bwoc` CLI — there is no server or
daemon to manage. Always discover exact flags with `bwoc <verb> --help` if unsure, and
quote user-supplied values.

## When to use

Reach for the fleet when the user asks to:

- See who is in the fleet, or check an agent's health → `bwoc list`, `bwoc status`.
- Hand a unit of work to a specific specialist agent → `bwoc send` or `bwoc run`.
- Coordinate several agents around a shared backlog → `bwoc team`, `bwoc task`.
- Recall prior decisions/context the workspace has stored → `bwoc memory`.

## Read-only first (safe to run anytime)

```bash
bwoc list                      # registered agents (table); add --json, --status, --backend, --running
bwoc list --names-only         # bare ids, good for scripting loops
bwoc status <agent>            # one agent's health + identity snapshot
bwoc status --all              # full detail for every agent
bwoc team list                 # Saṅgha teams with member + task counts
bwoc task list <team>          # a team's shared task list
bwoc memory list               # workspace memory entries
bwoc memory show <name>        # read one entry (or --all)
bwoc memory search "<query>"   # case-insensitive substring search
```

## Delegating work

- **`bwoc send <agent> "<message>"`** — append a message to the agent's inbox; fire-and-forget.
  The agent picks it up on its next run. Use for nudges, context, async hand-offs.
- **`bwoc run <agent> --task "<prompt>"`** — run a single task headless and capture the
  result synchronously. Use when you need the answer back now. Add `--timeout <seconds>`
  for long runs and `--json` for structured output.
- **Native sub-agents** — when the host supports re-exported sub-agents (see `agents/`,
  generated locally from your fleet), it can delegate to a fleet member as a native
  sub-agent; each one itself shells out to `bwoc`.

Pick `send` for async/fan-out, `run` for a blocking one-shot, `chat` for an interactive
hands-on session (it execs the backend CLI; surface it to the user rather than running it
inside a non-interactive tool call).

## Coordinating teams

```bash
bwoc team create <id> --members a,b,c     # form a Saṅgha team
bwoc task add <team> "<title>"            # add to the shared backlog (--deps, --requires-plan)
bwoc task claim <team> <task> --as <agent>      # a member claims a task
bwoc task complete <team> <task> --as <agent>   # claimant completes it
```

## Safety

- Prefer read-only verbs (`list`, `status`, `*-list`, `memory show/search`) when exploring.
- Treat `send`, `run`, `task add/claim/complete`, `team create/retire`, and `memory put/rm`
  as mutating — confirm intent before firing them against the live fleet.
- Always quote message/task/title/query arguments so multi-word values stay intact.
- Target a specific workspace with `--workspace <path>` (or `BWOC_WORKSPACE`) when the
  cwd is not inside the intended workspace.

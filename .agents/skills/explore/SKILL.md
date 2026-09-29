---
name: explore
description: Delegate read-only code exploration to the app-explore subagent before the first edit of an unfamiliar area, when a change spans several folders or 3+ unread files. Skip for files already read and for web research.
---

# Code exploration

## Main agent

1. Give one `app-explore` subagent the task, the questions, the repo
   directory and constraints. No session history, no whole files. One scope
   per ~20 tool calls; split a wider map into a second call.
2. Claude Code: `subagent_type="app-explore"`
   ([profile](../../../.claude/agents/app-explore.md), Haiku). No `model`
   parameter: an override beats the profile. Built-in `Explore`/`Plan`,
   forks and unnamed agents run on the expensive session model, and the
   `Agent` hook (`scripts/agent/guard.mjs`) denies them.
3. Codex: [app-explore.toml](../../../.codex/agents/app-explore.toml).
   Without named profiles pass `model="gpt-5.6-luna"`,
   `reasoning_effort="medium"`, `fork_turns="none"` and the path of this
   skill with an instruction to run the **Subagent** section.
4. Report a rejected model or a different runtime model; no silent swaps.
5. Delegate only what you will not read yourself; do independent work
   meanwhile. A run that ended without a result you finish yourself.

## Subagent

Read-only: no delegation, web research, edits or starting servers. Read the
`AGENTS.md` files on the way. Follow imports and consumers, not just names;
point to the pattern to copy, folder boundaries and checks. Stop when the
change location and dependencies are clear.

Report for the main agent, facts per token: `path:line`, symbol names,
one-sentence reasons. Contents: entry point and flow; files to read or
change, in order; props and consumers; local rules; confirmed facts apart
from guesses and open questions. Usually up to 800 words (max 1200).

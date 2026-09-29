---
name: harness
description: Create, change or trim skills, AGENTS.md files, hooks and subagent profiles of this repo (shared by Claude Code and Codex). Use for changes in .agents, .claude, .codex, scripts/agent, and when a recurring trap should go into the instructions.
---

# Agent harness

## What goes where

1. Rules for the whole repo: root `AGENTS.md`. Facts and traps of one
   folder: the `AGENTS.md` in that folder. Procedures: skills. Link to the
   owner of a rule instead of copying it.
2. A new skill only for a separate, recurring task; otherwise extend the
   skill that owns the process. Never a skill for the history of one task.
3. Never an `.md` file in `src/pages/` (Astro makes it a page) or `public/`
   (published as is).
4. Skills live only in `.agents/skills/<name>/SKILL.md`. Name in lowercase
   with hyphens, up to 64 characters, equal to the directory and the
   frontmatter `name`. `.claude/skills` is a symlink, never a second copy.
5. Only the root has `CLAUDE.md`, containing `@AGENTS.md`. Claude Code gets
   local `AGENTS.md` files from the PreToolUse hook; Codex reads them itself
   or via `bun run agent:instructions <path>`.

## Writing

- English, short. Only what changes a decision: rules, entry points,
  commands, traps. No generic advice, no change history.
- Frontmatter `name` and `description`: the task and when it triggers;
  exclusions only against real mix-ups.
- Instructions must work in every mode (TEMPLATE, ADAPTATION, APP). Facts
  of one app go to "This app" in the root `AGENTS.md`, never into skills.
- Details needed only sometimes go to `references/`, linked from the step
  that needs them. Scripts only for repeated, deterministic work, in
  `scripts/agent/`, run by bun, built-in modules only; hooks never block on bad
  input.
- Subagent profiles pick the model and tools and point to a skill section.
  A new profile = entries in `scripts/agent/guard.mjs` and the profile list
  in `agent.mjs check`, plus the Codex twin.

## Integration

1. Link the skill in the routing table of the root `AGENTS.md`.
2. `bun run agent:check`: frontmatter, routing, symlink, hooks, profiles,
   dead links, budgets (root `AGENTS.md` 8 KiB, local 2 KiB, skill 4 KiB;
   ceilings, not targets).
3. Walk a matching request and a similar non-matching one through the
   routing in your head.
4. [verify](../verify/SKILL.md).

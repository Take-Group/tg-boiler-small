# scripts

Run from the repo root through `bun run`.

- `shot.mjs` (`shot [paths] [--url base]`): Playwright screenshots on
  desktop 1440 and mobile 390 to `.cache/shots/`, plus console errors and
  horizontal scroll. Starts the dev server when none runs.
- `check-placeholders.mjs` (`placeholders`): template sample text left in
  `src/`, `public/`, `astro.config.ts`; exit 1 when found. A new kind of
  sample text = a pattern in `PATTERNS`.
- `agent/`: the agent harness, run by bun with built-in modules only, so hooks work
  before `bun install`.
  - `agent.mjs`: `context`, `instructions`, `brief` (SessionStart), `check`,
    `verify` (with the code rules), `smoke`.
  - `smoke.mjs`: every page in `dist/`: H1, title, description, canonical,
    robots, internal links, image `alt`, sitemap coverage, gzipped weight
    against `BUDGET`.
  - `hook.mjs`: local `AGENTS.md` for Claude Code. `guard.mjs`: subagent
    profiles.
  - `lib.mjs`: shared helpers and mode detection.

Hooks never block on bad input (exit 0). Harness authoring:
[.agents/AGENTS.md](../.agents/AGENTS.md).

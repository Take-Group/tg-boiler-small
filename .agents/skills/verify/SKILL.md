---
name: verify
description: Check a change before handing it over - harness, code rules, placeholders, type check, build, smoke of every page, the look - and report it plainly. Use at the end of every change to code or copy.
---

# Verify

1. `git status` and the diff: only this task's files, nobody else's changes
   touched, no secrets, nothing from `dist/`, `.astro/`, `.cache/`, `.env`.
   Code, names and comments in English; site copy in Polish.
2. `bun run agent:verify` runs in order: harness check, `git diff --check`,
   code rules (colors only from tokens, icons from `ui/icons`, no long
   dashes), mode and
   placeholders, `astro check`, `astro build`, smoke of every page in
   `dist/` (one H1, title, description, canonical, robots, broken internal
   links, images with `alt`, listed in `sitemap.xml`, gzipped weight under
   budget). Fix what fails and run it again.
3. Placeholders by mode: TEMPLATE expected; ADAPTATION give the count;
   APP zero, any new one is a bug.
4. The look is not in the scripts. Changed pages:
   `bun run shot <paths>` and read the PNGs
   ([screenshot](../screenshot/SKILL.md)). Skipped = say so in the report.
5. Save the work when the user asked for it or a plan step is done:
   [save-work](../save-work/SKILL.md).

Report in Polish, in this order: what the user got, what needs their
decision, then statuses: `Check: OK`, `Build: OK`, `Smoke: OK`,
`Zrzuty: OK`, `Placeholdery: 12`, and the weight of changed pages
(`Waga /: HTML 3 KB, JS 6 KB`). A failed status comes with the exact error.

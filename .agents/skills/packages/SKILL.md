---
name: packages
description: Add, bump or remove an npm package with bun, with the pins this template needs. Use for every change to package.json or bun.lock.
---

# Packages

## Pins

- TypeScript stays `^6.0.3`: TS 7 lacks the API `astro check` uses.
- `compressHTML: true` stays explicit in `astro.config.ts` after every Astro
  bump (Astro 7 changed the default).
- `packageManager` in `package.json` stays; use `bun`, never npm or yarn.

## Steps

1. A new package only when the platform and existing dependencies cannot do
   it (HTML, CSS, `Intl`, Astro built-ins). Choosing a library or a major
   version: [research](../research/SKILL.md) for maintenance, size and
   Astro 7 support.
2. `bun add <package>` (dev tools: `bun add -d`). `bun.lock` changes only
   through `bun`, never by hand.
3. A package that ships JavaScript to the browser needs a reason in the
   report: every visitor downloads it.
4. `bun run check`, `bun run build`, then [verify](../verify/SKILL.md).

Report: package and version, why, what it adds to the page weight.

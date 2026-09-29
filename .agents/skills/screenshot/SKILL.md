---
name: screenshot
description: See how a page looks - bun run shot takes desktop and mobile screenshots of local pages and reports console errors and horizontal scroll. Use after every visual change, when the user says something looks wrong, and before reporting any look.
---

# Screenshots

Static checks do not show the look. Before you say a page looks fine, look
at it.

1. `bun run shot /` or several paths: `bun run shot / /cennik`. It uses a
   running dev server or starts one for the run. First time on a machine
   it may ask for `bunx playwright install chromium`; run it.
2. Output in `.cache/shots/`: `<page>-<desktop|mobile>-first.png` (the first
   screen) and `-partN.png` (the page cut into screen-high parts). Read the
   PNGs; a long page is judged part by part.
3. `PROBLEM:` lines (console errors, failed requests, horizontal scroll,
   HTTP errors) are bugs to fix, not notes.
4. Interactive states (open menu, expanded item, hover) are not in the shots.
   For them write a short Playwright script in the session scratchpad based
   on `scripts/shot.mjs`, or ask the user to look.
5. After a fix, shoot again. Compare, do not assume.

Report what you saw ("na telefonie przycisk mieści się w pierwszym ekranie"),
not that you took screenshots.

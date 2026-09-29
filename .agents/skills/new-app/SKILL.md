---
name: new-app
description: Create a new app repo from the tg-boiler-small template, then configure it with onboarding and build it up to zero placeholders. Use for "new app", "make a site about X" in an empty directory, and ADAPTATION mode. Not for small copy changes in a finished app (content).
---

# New app from the template

## 1. Repo

The same steps as the prompt in the template's `README.md`:

1. Ask only for the folder, propose `~/projects/<name>`; never overwrite an
   existing one.
2. `git clone --depth 1 https://github.com/Take-Group/tg-boiler-small.git <folder>`
   (public repo, no login), then in
   the folder remove `.git` and `git init`, so the app is not a copy of the
   template (with the template as origin, the mode would be TEMPLATE).
3. `bun install`, `bunx playwright install chromium`.
4. The GitHub repo comes later, when the user wants to publish
   ([save-work](../save-work/SKILL.md)).

## 2. Configure

[onboarding](../onboarding/SKILL.md): interview in plan mode, then config,
`DESIGN.md`, tokens and the build plan. From then on `agent:context` shows
ADAPTATION with the placeholder count.

## 3. Build (ADAPTATION)

Follow `plan/PLAN.md` ([plan](../plan/SKILL.md)):

1. Replace the splash `src/pages/index.astro` with the real home page and
   delete `--color-template` from `src/styles/globals.css`.
2. Components: [ui-components](../ui-components/SKILL.md). Pages:
   [new-page](../new-page/SKILL.md). Layout and screenshots:
   [page-design](../page-design/SKILL.md). Copy:
   [content](../content/SKILL.md); business facts via `app-research`,
   company facts only from the user.
3. Logo and favicon only from files the user gives (`public/`, a `<link
   rel="icon">` in `BaseLayout`, `logo` in `organizationSchema`). Never
   draw a brand logo.

## 4. Wrap-up

1. `bun run placeholders` = zero. A placeholder you cannot close without
   data is a question to the user, not an invented value.
2. Check `README.md` describes this app. Fix comments and instructions that
   still talk about "the template" where they now mislead.
3. [verify](../verify/SKILL.md), then [save-work](../save-work/SKILL.md).

Report: what the app has now, the data still needed from the user,
placeholders, checks.

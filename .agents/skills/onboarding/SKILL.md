---
name: onboarding
description: First-run interview that configures the app for its owner - goal, features, pages, brand, domain, GTM, design playbook - in plan mode, before any file changes. Use when agent:context shows ONBOARDING, right after new-app, or when the user asks to set the project up again. Small later changes: the skill that owns the area.
---

# Onboarding

The owner is usually not technical. Everything that follows depends on
this conversation, so ask before you build.

## 1. Plan mode first

- Claude Code: call `EnterPlanMode` before anything else, then ask with
  `AskUserQuestion` (up to 4 questions per call, 2-4 options each, your
  recommendation first, the user can always type their own answer).
- Codex: stay read-only (no edits, no installs) until the user approves the
  plan; ask in chat as a numbered list with proposed answers.
- Polish, plain words, no jargon. Skip what the user already said.

## 2. Interview

Four rounds from [interview](references/interview.md): goal and audience,
features and pages, brand and domain, look and tone. After each round
restate in two lines what you understood. Unknown = "(do ustalenia)", never
an invented value; do not block on it.

Check each feature against the template: static site, no backend. A form,
login or payments need a server ([add-feature](../add-feature/SKILL.md));
say what that means before it goes into the plan.

## 3. The plan to approve

Present (Claude Code: `ExitPlanMode`) a short plan in Polish: what the app
is, pages, features, look in one paragraph, open questions, and the files
you will write. Wait for approval.

## 4. After approval

1. `package.json` `name`; free dev port in `astro.config.ts` (check with
   `lsof -iTCP:<port> -sTCP:LISTEN`, never stop someone else's process).
2. `src/config/site.ts`: `SITE` (name, url, description, `gtmId`) and
   `COMPANY`. `indexable` stays `false`.
3. `DESIGN.md`: every answer from the look and tone round, "(do ustalenia)"
   where unknown. Then the tokens in `src/styles/globals.css` per
   [ui-components](../ui-components/SKILL.md).
4. Root `AGENTS.md`, section "This app": one line each, facts only.
5. `README.md`: replace the template's start prompt with a short page for
   this app in Polish: what it is, `bun run dev`, where the plan and
   `DESIGN.md` are, a few example requests.
6. `plan/PLAN.md` with the build steps ([plan](../plan/SKILL.md)); the
   first build step replaces the splash page.
7. [verify](../verify/SKILL.md), [save-work](../save-work/SKILL.md) with the
   message "Configure the app for <name>".

Report: what is set, what is still "(do ustalenia)", the first step of the
plan and a question whether to start it.

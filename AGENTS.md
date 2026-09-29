# tg-boiler-small - agent instructions

**Talk to the user in Polish**: every answer, question and report, even
though this file, the skills and the code are in English. The user is
usually not a programmer. Code, identifiers, file names, comments, docs and
commit messages are English; everything a visitor sees (copy, URLs, `alt`)
is Polish.

Shared by Claude Code and Codex. `CLAUDE.md` only imports this file.

## What this is

A minimal template for small, static, SEO-first sites and apps: Astro 7,
Tailwind 4, SPA navigation (ClientRouter), Google Tag Manager slot,
`/robots.txt` and `/sitemap.xml`; no backend, no form, no deploy.
The frontend is deliberately empty: one splash page, no components, no
colors, no copy. Never build on the splash; every app gets its own look,
set by the owner in the design playbook `DESIGN.md`. A
new app is a new repo made from this template ([new-app](.agents/skills/new-app/SKILL.md)),
never a branch of it. Everything else is added on demand
([add-feature](.agents/skills/add-feature/SKILL.md)).

`bun run agent:context` prints the mode (Claude Code gets it at session start):

- **TEMPLATE**: origin is `Take-Group/tg-boiler-small`. You change the
  template itself; copy stays generic and caught by `bun run placeholders`.
- **ONBOARDING**: a new app, `package.json` name still `tg-boiler-small`.
  Before anything else run [onboarding](.agents/skills/onboarding/SKILL.md):
  plan mode, interview, no file changes until the plan is approved.
- **ADAPTATION**: an app made from the template, placeholders left. Brand,
  copy, colors, sections and sample pages are scaffolding: replace or remove
  them without asking. Keep the mechanics (SEO, UI system, harness).
- **APP**: zero placeholders; the copy is real, change it only on request.

Never invent facts about the business (company data, numbers, prices,
reviews, people). Source: the user, or research with a source and date. No
data = a question or a removed section.

## This app

Filled in by the new-app skill; empty in TEMPLATE mode.

- What it is and for whom: -
- Name, domain, owner: -
- Features: -
- Look: `DESIGN.md`
- Dev port: 4321
- Repo: -
- Deliberate deviations from the template: -

## How to work

- Do the task end to end: run the commands, look at the result, fix what
  fails. Stop only for the user's decision or missing business data. Ask
  about one thing at a time, in plain words, with a recommended answer.
- Start: `git status`, `bun run agent:context`; if `plan/PLAN.md` exists,
  follow [plan](.agents/skills/plan/SKILL.md). Then the skill from the table.
- Before the first edit in a folder apply its `AGENTS.md` (Claude Code gets
  it from a hook; Codex: `bun run agent:instructions <path>`).
- Delegation: `app-explore` for 3+ unread files, `app-research` for facts
  from the web. Built-in `Explore`/`Plan`, forks and unnamed agents are
  denied by the `Agent` hook.
- Commands: `bun install`, `bun run dev`, `check`, `build`, `shot <paths>`,
  `placeholders`, `agent:verify`. End of every change:
  [verify](.agents/skills/verify/SKILL.md).
- Never report a look you did not see on a screenshot.

## Reporting

- Start with what needs the user's decision or failed; otherwise with what
  they got, in terms of the site ("strona Cennik ma teraz tabelę"), not your
  steps or file names.
- Checks as statuses: `Build: OK`, `Smoke: OK`, `Placeholdery: 12`. A
  failure comes with the exact error and what you will do about it.
- No jargon without a translation, no preamble, no closing summary.

## Project rules

- Astro components (`.astro`), static output to `dist/`. The only
  JavaScript is the ClientRouter (~6 KB gz); more only when HTML cannot do
  it. Scripts that must run on every page listen to `astro:page-load`
  (links swap pages without a reload).
- Smallest possible pages: `agent:smoke` prints each page's gzipped weight
  and fails over 20 KB HTML or 40 KB JS. Raising a budget is the user's call.
  CSS is inlined; images through `astro:assets`, sized to their slot.
- Copy in `src/content-data/`, identity in `src/config/site.ts`; components
  get text through props. Colors only from tokens in
  `src/styles/globals.css`, icons only from `@/components/ui/icons`;
  `agent:verify` enforces both.
- Reuse before building: the component catalog in
  [ui-components](.agents/skills/ui-components/SKILL.md). A new look is a
  `cva` variant, not a copied class string.
- Look and tone follow `DESIGN.md`. No default look: no generic
  white-and-blue, no purple gradients. "(do ustalenia)" there = ask.
- Semantic HTML: rows and columns are a `<table>`; menus `<nav>`, posts
  `<article>`, side content `<aside>`, one `<main>`, headings in order
  ([semantic-html](.agents/skills/ui-components/references/semantic-html.md)).
- Keep handwritten files small and split by responsibility (up to ~200
  lines). A short comment at the top of each component says what it is for;
  comments explain why, not what.
- No long dashes anywhere in copy or code.
- `SITE.indexable` stays `false` until the user says the app goes live.
- Never `.md` files in `src/pages/` or `public/`: both get published.
- Secrets never in the repo, logs or reports; `.env` is git-ignored.
- Never stop someone else's process to free a port; pick another one.

## Task routing

| Task | Skill |
| --- | --- |
| New app from the template, adapting a copy | [new-app](.agents/skills/new-app/SKILL.md) |
| First run, set up goal, brand, domain, look | [onboarding](.agents/skills/onboarding/SKILL.md) |
| Work longer than one session, a build plan | [plan](.agents/skills/plan/SKILL.md) |
| Text on the site, too much text | [content](.agents/skills/content/SKILL.md) |
| Look of the app, page layout, redesign | [page-design](.agents/skills/page-design/SKILL.md) |
| Add, rename or remove a page | [new-page](.agents/skills/new-page/SKILL.md) |
| Components, variants, tokens, icons, font | [ui-components](.agents/skills/ui-components/SKILL.md) |
| Metadata, schema, sitemap, robots, going live | [seo](.agents/skills/seo/SKILL.md) |
| Widget, blog, form, server, analytics | [add-feature](.agents/skills/add-feature/SKILL.md) |
| Seeing how a page looks | [screenshot](.agents/skills/screenshot/SKILL.md) |
| Adding or bumping a package | [packages](.agents/skills/packages/SKILL.md) |
| Something broken | [diagnose](.agents/skills/diagnose/SKILL.md), then [fix](.agents/skills/fix/SKILL.md) |
| End of every change | [verify](.agents/skills/verify/SKILL.md) |
| Save, publish to GitHub, undo | [save-work](.agents/skills/save-work/SKILL.md) |
| 3+ unread files, unfamiliar area | [explore](.agents/skills/explore/SKILL.md) |
| Facts from the web, choosing a package | [research](.agents/skills/research/SKILL.md) |
| Skills, AGENTS.md, hooks, profiles | [harness](.agents/skills/harness/SKILL.md) |

## Harness

`.agents/skills/` holds the skills (Codex reads them there),
`.claude/skills` is a symlink to it. `.claude/settings.json`: SessionStart
prints the mode, PreToolUse loads local `AGENTS.md` once per folder, the
`Agent` hook enforces the `app-*` profiles (`.claude/agents`,
`.codex/agents`). `bun run agent:check` checks all of it.

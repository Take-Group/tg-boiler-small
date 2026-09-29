---
name: add-feature
description: Add something the minimal template does not have - an interactive widget (React island), Markdown articles or a blog, a contact form or anything that needs a server, analytics. Use when a request needs JavaScript in the browser, a server, or a new kind of content.
---

# Adding a feature

The template is static HTML whose only JavaScript is the ClientRouter
(~6 KB): fast, cheap to host, easy for Google. Every feature below costs something. Pick the
lightest option that does the job and tell the user what it costs.

## Pick the option

| Need | Lightest option | Guide |
| --- | --- | --- |
| open/close, tabs, accordion | HTML `<details>`, `:checked`, anchors | no guide |
| small behavior (copy a code, count up) | `<script>` in the component, run on `astro:page-load` | Astro docs "Scripts" |
| real widget with state (calculator, configurator, filter) | React island | [react-island](references/react-island.md) |
| articles, blog, guides written as text | Markdown content collection | [markdown-content](references/markdown-content.md) |
| form that sends data, login, API | server output + adapter | [server-output](references/server-output.md) |
| analytics | Google Tag Manager is built in: set `SITE.gtmId` | [seo](../seo/SKILL.md), section GTM |

## Steps

1. Say in one sentence what the feature needs (JavaScript, server, a
   package) and what that means: more to maintain, and for a server, a
   host that runs Node. A server or a paid service needs the user's yes.
2. Packages through [packages](../packages/SKILL.md).
3. Build it from existing components ([ui-components](../ui-components/SKILL.md));
   copy stays in `src/content-data/`.
4. Record the new capability where the next agent looks: the
   [component catalog](../ui-components/references/components.md), `src/AGENTS.md` for routes, the root `AGENTS.md` "This app"
   section for deliberate deviations from the template.
5. [verify](../verify/SKILL.md) (it prints the page weight) and `bun run shot`
   of the page, including the widget in use. Report how many KB it added.

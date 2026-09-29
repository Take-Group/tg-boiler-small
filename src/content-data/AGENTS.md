# Copy

Empty in the template. Every text a visitor reads lives here: one file per
page (`home.ts`, `pricing.ts`), plus `navigation.ts` for the menu and
footer links. Keys and comments English, values Polish.

- Export one object per section; its shape is what the component's props
  expect. Removing a section = remove it from the page and its export here.
- Each page file carries `title` (30-60 characters) and `description`
  (70-155).
- Brand and company from `@/config/site`, never typed in.

Writing rules and length budgets: [content](../../.agents/skills/content/SKILL.md).

---
name: page-design
description: Set the app's design direction and design or redesign pages - look agreed with the user, section plan, then a screenshot loop on desktop and mobile until it looks right. Use for the first visual work in an app, "redesign", "make it look better", a new home or landing layout. A single component variant: ui-components.
---

# Page design

The template has no look on purpose. Every app gets its own, agreed with the
user, never a default.

## Steps

1. **Design playbook.** Read `DESIGN.md` and follow it. Still "(do
   ustalenia)" = run the look round of [onboarding](../onboarding/SKILL.md)
   before any visual work. A new decision the user takes goes into its
   "Decyzje" section. Later pages also follow the pages already built.
2. **Section plan.** One goal per section, ordered by the visitor's
   questions: what is it, what do I get, how does it work, why trust you,
   doubts, what now. Write it as a list before building; if `plan/` has one,
   follow it.
3. **Reuse.** What the [catalog](../ui-components/references/components.md)
   already has comes first; a new look is a variant. New components per
   [ui-components](../ui-components/SKILL.md), copy through props.
4. **Copy.** Text into `src/content-data/` ([content](../content/SKILL.md)),
   within the budgets there.
5. **Build** section by section with semantic elements
   ([semantic-html](../ui-components/references/semantic-html.md)). The page
   file stays a thin list of sections with a one-line comment each.
6. **Screenshot loop** every 2-3 sections: `bun run shot <path>`
   ([screenshot](../screenshot/SKILL.md)). Fix, re-shoot, repeat until the
   checklist below passes. Never report a look you did not see.
7. [verify](../verify/SKILL.md).

## Checklist

- First screen on 390x844: H1, one sentence and the main button visible.
- Neighbouring sections differ in background, so the page has a rhythm.
- No horizontal scroll, no text overrunning cards, cards in a row equal
  height, no half-empty last row.
- Headings do not end with an orphan word on desktop.
- One primary button per section.
- Other pages using a changed shared component still look right.

## Do not

- Center everything, stack identical grey cards, or fill space with text.
- Duplicate markup for desktop and mobile: reorder one grid instead.
- Fall back to the generic AI look: white and blue SaaS, purple gradients,
  glows, glassmorphism, emoji icons. If the direction is unclear, ask.
- Add animations on load or pop-ups.

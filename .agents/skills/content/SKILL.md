---
name: content
description: Write or rewrite the copy visible on the site (src/content-data, page titles and descriptions) - true, short, SEO-aware Polish text. Use for every change to text a visitor reads, and for "too much text", "wall of text", "sounds like AI".
---

# Site copy

Copy is Polish (the visitors). Keys, file names and comments around it are
English.

## Before you write

1. Mode from `bun run agent:context`. TEMPLATE: copy stays generic and is
   caught by `bun run placeholders` (a new kind of sample text = a pattern in
   `scripts/check-placeholders.mjs`). ADAPTATION: existing text shows format
   and length only; write from scratch. APP: change only what was asked.
2. Read the copy file and the component that renders it. Keep the data shape
   (keys, types); values and array items are free to change.
3. Tone ("ty" or "Pan/Pani", casual or formal) from `DESIGN.md`.
4. Facts about a market, prices or law: `app-research`
   ([research](../research/SKILL.md)), with source and date. Facts about the
   company only from the user.

## Rules

- No text inside components: copy lives in `src/content-data/`, the brand
  and company in `src/config/site.ts`. Build sentences from `SITE.name`
  instead of typing the name.
- Only real numbers, reviews, projects, certificates. No data = remove the
  section from the page, never leave it empty or fake it.
- A price or rule that changes over time gets "stan na <miesiąc rok>".
- No long dashes (the check fails on them): use a period, a comma or a
  hyphen.
- Plain words, concrete facts, the next step. No "kompleksowe rozwiązania",
  no superlatives without proof, no promises the owner did not make.
- FAQ: one topic per question, the answer starts with the answer. FAQPage
  schema allows a question once per page.

## Length

Apply [budgets](references/budgets.md) to every element. A visitor scrolling
fast should get the page from headings, numbers and icons alone. Every fact
appears once per page, at its strongest spot.

## SEO copy

- `title` 30-60 characters, main phrase first. `description` 70-155
  characters with a benefit. Both in the page's copy file.
- One H1 per page, H2 per section, no skipped levels. Tabular data is a
  `<table>`, never text laid out in columns.
- Link related pages to each other with descriptive anchor text.

## Check

`bun run placeholders` (in ADAPTATION the count drops), then the look of the
changed pages ([screenshot](../screenshot/SKILL.md)): text length in cards,
wrapping on mobile. Finish with [verify](../verify/SKILL.md).

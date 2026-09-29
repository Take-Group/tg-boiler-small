---
name: ui-components
description: Build or change reusable components, variants, design tokens (colors, font, radius) and icons. The template ships none, so this is also the skill for the first button, section or header. Use for a new component or variant, colors, font, a new icon. Whole-page layout: page-design.
---

# Components and look

## Start from what exists

1. Read `src/components/AGENTS.md` and the
   [component catalog](references/components.md). Reuse or extend before
   adding. In a fresh app both are empty: that is expected, not a gap to
   fill with generic defaults.
2. Read `DESIGN.md`: colors with their roles, fonts, shape, density,
   imagery. Tokens implement it. Still "(do ustalenia)" = ask the user or
   run the look round of [onboarding](../onboarding/SKILL.md) first.

## Tokens

- Colors, font and radius live as CSS variables in `src/styles/globals.css`
  and are mapped into Tailwind with `@theme inline` (`--color-primary:
  var(--primary)` gives `bg-primary`, `text-primary`). Name tokens by role
  (`primary`, `surface`, `muted`, `border`, `accent`), not by hue.
- Components use only these tokens. No `gray-*`, `blue-*`, hex or `rgb()` in
  components; `bun run agent:verify` fails on them.
- A token change goes to `DESIGN.md` in the same change, and back.
- `SITE.themeColor` equals the main color. Check text contrast on colored
  backgrounds and buttons (WCAG AA, 4.5:1).
- Fonts self-hosted through a `@fontsource` package and `--font-sans`, never
  a request to Google Fonts.

## Semantic HTML

Every component renders the element that says what it contains: rows and
columns are a `<table>`, menus a `<nav>`, a post an `<article>`, side content
an `<aside>`. Full table: [semantic-html](references/semantic-html.md).
Read it before building any component.

## Components

- Base components in `src/components/ui/`, PascalCase `.astro` files, a
  one-line comment at the top saying what each is for.
- Looks are `cva` variants (`class-variance-authority`) typed as props,
  never class names built at runtime (Tailwind does not see them) and never
  a class string copied to the call site.
- Every component accepts `class` and merges it last through `cn()`.
- No visible text in components: props, or copy from `src/content-data/`.
- Plain Astro components add no JavaScript; keep it that way. Interaction first with
  HTML (`<details>`, `:checked`, anchors); anything more:
  [add-feature](../add-feature/SKILL.md).
- Icons: pick one set with the user's look in mind (Lucide via
  `@lucide/astro` is a good default), re-export each icon from
  `src/components/ui/icons.ts`, import only from there.
- Images: `astro:assets` `<Image>` with `width`, `height` and a Polish `alt`.
- New component or variant: export it from `ui/index.ts` and add a row to
  the catalog in the same change.

## Check

`bun run shot <path>` on every page using the component, desktop and mobile
([screenshot](../screenshot/SKILL.md)), then [verify](../verify/SKILL.md).

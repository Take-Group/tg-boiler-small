# Components

Empty in the template except `GoogleTagManager.astro` (mechanics, on when
`SITE.gtmId` is set). Build what the app needs, in this layout:

- `ui/`: base components (button, section, container, card...), exported
  from `ui/index.ts`; pages import from `@/components/ui`.
- `ui/icons.ts`: the only icon source; one export line per icon.
- `sections/`: page sections built from `ui/`.
- `layout/`: header, footer, rendered around the slot of `BaseLayout`.

Rules:
- Copy comes through props (pages pass it from `src/content-data/`).
  Visible Polish text inside a component is a bug; `aria-label` and
  `sr-only` may stay.
- Looks are `cva` variants in the base component, never a class string
  copied to the call site. Every component takes `class`, merged last with
  `cn()` from `@/lib/utils`.
- Colors only from the tokens in `src/styles/globals.css`, which follow
  `DESIGN.md`.
- Semantic elements: `<table>` for rows and columns, `<nav>`, `<header>`,
  `<footer>`, `<article>`, `<aside>`, `<section>` with a heading. Table:
  [semantic-html](../../.agents/skills/ui-components/references/semantic-html.md).
- Zero JavaScript of their own by default: `<details>`, anchors, CSS
  states. A `<script>` that must work after SPA navigation listens to
  `astro:page-load`. Anything more:
  [add-feature](../../.agents/skills/add-feature/SKILL.md).
- `compressHTML` removes whitespace between expressions: join text and
  values in one template string.

Catalog of what exists: [ui-components](../../.agents/skills/ui-components/references/components.md).
Update it in the same change as a new component or variant.

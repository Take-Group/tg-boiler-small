# src

The template ships no look and no copy on purpose: the app builds its own.
Nothing here is a design pattern to copy.

- `config/site.ts`: name, URL, description, theme color, `indexable`,
  company data. Never hard-code these anywhere else.
- `layouts/BaseLayout.astro`: `<head>` (title, description, canonical, Open
  Graph, robots, JSON-LD), the ClientRouter (SPA navigation) and GTM. Keep
  these mechanics; the body is the app's own.
- `styles/globals.css`: Tailwind and the app's design tokens (none yet).
- `lib/`: helpers, no markup. `components/`, `content-data/`: empty until
  the app needs them; their `AGENTS.md` says how to fill them.

## Routes (`pages/`)

File names are public Polish URLs (`cennik.astro` = `/cennik`); never rename
a public one without a 301 ([new-page](../.agents/skills/new-page/SKILL.md)).
No `.md` files here: Astro turns them into pages.

- `index.astro`: the template splash. Replace it, never build on it.
- `robots.txt.ts`: follows `SITE.indexable`, points to `/sitemap.xml`.
- `sitemap.xml.ts`: lists every static page by itself. Dynamic routes
  (`[slug].astro`) and noindex pages need an entry there; `agent:smoke`
  fails on a page missing from it.

Every page renders `BaseLayout` with `title` and `description`, and is a
thin list of sections with a one-line comment each.

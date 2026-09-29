---
name: new-page
description: Add, rename or remove a page (route) - file in src/pages, copy file, metadata, breadcrumbs, menu and footer links. Use for "add a page", "new subpage", "remove the X page", changing a URL.
---

# New page

## Add

1. URL: short Polish slug, lowercase, hyphens, no diacritics
   (`/cennik`, `/uslugi/montaz`). The file name is the URL:
   `src/pages/cennik.astro`, nested `src/pages/uslugi/montaz.astro`.
2. Copy file `src/content-data/<page>.ts` in English naming, with `title`,
   `description` and the section copy ([content](../content/SKILL.md)).
3. Page file: `BaseLayout` with `title` and `description`, one H1, then
   sections from `src/components/`. Subpages get breadcrumbs (a component
   using `breadcrumbSchema`) once the app has more than one level. Extra
   schema (Service, Product...) through the `schemas` prop; see
   [seo](../seo/SKILL.md). Copy the structure of an existing page of this
   app, never the template splash.
4. Links: menu and footer in `src/content-data/navigation.ts` when the page
   belongs there, and at least one link from a related page. An orphan page
   is hard to find for people and Google.
5. `/sitemap.xml` picks up a static page by itself. A dynamic route
   (`[slug].astro`) adds its paths in `dynamicPaths` of
   `src/pages/sitemap.xml.ts`; a noindex page goes to `EXCLUDED`.
6. Look: `bun run shot /<slug>` ([screenshot](../screenshot/SKILL.md)).
   [verify](../verify/SKILL.md) also checks the links.

## Rename or remove

- Before launch (`SITE.indexable` false and never public): rename or delete
  the file, fix every link (`bun run agent:smoke` lists broken ones).
- After launch: the old URL needs a 301 in `redirects` in `astro.config.ts`
  to the closest page. Ask the user before removing a public page.

## Never

- `.md` files in `src/pages/` (Astro turns them into pages) or in `public/`
  (published as is).
- A second H1, or copy typed into the page file.

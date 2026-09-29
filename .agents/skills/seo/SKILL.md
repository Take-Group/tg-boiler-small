---
name: seo
description: Change metadata, JSON-LD schema, canonical, robots.txt, sitemap.xml, redirects, indexing and Google Tag Manager without SEO regressions. Use for changes to BaseLayout, src/lib/seo.ts, robots or sitemap, URLs or slugs, GTM, and for "going live" / letting Google in.
---

# SEO

## Standing rules

- Every page passes `title` and `description` to `BaseLayout`. The layout
  builds canonical, Open Graph, robots and the Organization and WebSite
  schema. Canonical has no trailing slash and no `.html`.
- Page schema through the `schemas` prop, built in `src/lib/seo.ts`. A FAQ
  or breadcrumb component emits its own schema (`faqSchema`,
  `breadcrumbSchema`); do not duplicate it.
- Schema data must be visible on the page. Never add ratings or reviews
  without real, visible reviews.
- One H1, logical H2/H3, Polish `alt` on every image, slugs lowercase with
  hyphens and no diacritics.
- `compressHTML: true` stays in `astro.config.ts`: without it Astro 7 glues
  Polish words broken across lines. Text that joins two expressions goes in
  one template string (`` {`© ${year} ${name}`} ``) for the same reason.
- A 404 page (`src/pages/404.astro`) and other technical pages: `noindex`
  prop (drops the canonical too).

## Sitemap and robots

- `/sitemap.xml` (`src/pages/sitemap.xml.ts`) lists every static page.
  Dynamic routes add their paths in `dynamicPaths`, noindex pages go to
  `EXCLUDED`. `agent:smoke` checks both directions.
- `/robots.txt` (`src/pages/robots.txt.ts`) points to the sitemap and closes
  everything while `SITE.indexable` is `false`.

## Google Tag Manager

`SITE.gtmId` ("GTM-XXXXXXX") turns the tag on; empty = none. Navigation is
SPA, so the "Page View" trigger fires once: every page change pushes
`{ event: 'page_view', page_path, page_title }`, and GTM tags that count
pages use a custom event trigger on `page_view`. Tell the user this when
they set up GTM. Cookie consent is the owner's legal call; ask before
adding a banner.

## Indexing switch

`SITE.indexable` in `src/config/site.ts`. `false` (draft): every page gets
`noindex, nofollow` and `robots.txt` blocks all crawlers. Set `true` only
when the user says the app goes live on its final domain, with `SITE.url`
set to that domain. Mention it in the report either way.

## Changing a URL

Never public yet: rename and fix links. Public: a 301 in `redirects` in
`astro.config.ts` to the closest page, then fix internal links
([new-page](../new-page/SKILL.md)).

## Check

1. `bun run build`, `bun run agent:smoke`: H1, title, description,
   canonical, robots, broken internal links on every page.
2. On changed pages inspect `<head>` and JSON-LD in `dist/*.html`: valid JSON,
   the right `@type`, absolute URLs on the app's domain.
3. `dist/sitemap.xml` lists new pages and drops removed ones.
4. [verify](../verify/SKILL.md). After launch the user checks rich results in
   Google's Rich Results Test; say so when schema changed.

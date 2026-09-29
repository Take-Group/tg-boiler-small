# Markdown content (articles, blog, guides)

1. Collection in `src/content.config.ts` with the `glob` loader over
   `src/content/<name>/*.md` and a `zod` schema: `title`, `description`,
   `date`, optional `updated`, `image`, `draft`.
2. Articles live in `src/content/<name>/<slug>.md`. Never in `src/pages/`.
3. Routes: `src/pages/<section>/index.astro` (list) and
   `src/pages/<section>/[slug].astro` with `getStaticPaths` over
   `getCollection`, rendering `render(entry)` inside `prose-content`.
4. Each article page passes `title`, `description` and an Article schema
   (headline, datePublished, dateModified, author) through `schemas`.
5. Link the list from the menu or footer; the sitemap picks up the pages.
6. Add an `AGENTS.md` in `src/content/<name>/` with the frontmatter rules and
   who writes the articles.

# Semantic HTML

Crawlers, screen readers and AI summarizers read the element, not the
class. Pick the element that says what the content is; a `div` or `span`
only when nothing fits (layout wrappers).

| Content | Element |
| --- | --- |
| anything with rows and columns (prices, specs, comparisons, schedules) | `<table>` with `<caption>` or a heading, `<thead>`, `<tbody>`, `<th scope="col">` / `<th scope="row">`. Never a grid of divs. On phones wrap it in a `div` with `overflow-x-auto`, or stack rows with CSS, but keep `<table>` |
| site header with logo and menu | `<header>` |
| menus, breadcrumbs, footer links | `<nav aria-label="...">`, links in `<ul>`; more than one nav = each has its own `aria-label` |
| the page's own content | exactly one `<main>` (it wraps the slot in the layout or the page) |
| a thematic block with a heading | `<section>` with an `h2` |
| self-contained content (article, blog post, review, product card) | `<article>` with its own heading |
| side content (related links, author box, table of contents) | `<aside>` |
| site footer | `<footer>`; company data in `<address>` |
| image with a caption | `<figure>` + `<figcaption>` |
| dates | `<time datetime="2026-09-29">` |
| lists of things, steps | `<ul>`, `<ol>` (steps are ordered) |
| term and its definition (specs, FAQ pairs without details) | `<dl>`, `<dt>`, `<dd>` |
| question that expands | `<details>` + `<summary>` |
| action | `<button type="button">`; navigation is `<a href>`. Never a clickable `div` |
| form fields | `<label for>` for every input, `<fieldset>` + `<legend>` for groups |

Headings: one `h1` per page, then `h2`, `h3` in order without skipping a
level; a heading's size comes from classes, never from picking a different
level. `role="..."` on a `div` is a sign the right element exists.

`bun run agent:smoke` checks one `<main>`, heading order, labelled navs and
`role` attributes on `div`/`span`. The rest is on you.

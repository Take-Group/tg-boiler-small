# lib

Plain TypeScript, no markup.

- `seo.ts`: `absoluteUrl` and JSON-LD builders (`organizationSchema`,
  `websiteSchema`, `breadcrumbSchema`, `faqSchema`). A breadcrumb or FAQ
  component emits its schema with these; other page schema (Service,
  Product, Article) = a new builder here, passed through the `schemas` prop
  of `BaseLayout`.
- `utils.ts`: `cn()` merges class lists; later Tailwind classes win.

Logic worth testing (prices, calculations) goes here as pure functions with
a `bun test` file next to it.

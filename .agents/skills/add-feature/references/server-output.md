# Server output (forms, API, login)

A static site has no server to receive a form. Options, lightest first:

1. **External form service** (the owner's account): a plain HTML `<form>`
   posting to the service's URL. No server on our side. Ask which service.
2. **Server routes**: `bunx astro add node --yes` (the adapter is named node, it runs under bun), keep `output: 'static'`
   and mark only the routes that need a server with
   `export const prerender = false`. Form handling via Astro Actions
   (`src/actions/index.ts`, `zod` input). Secrets in `.env` (git-ignored) and
   `.env.example` with empty values.
3. Hosting changes: the app needs a running server process (`bun dist/server/entry.mjs`)
   instead of static files. Deployment is not part of the template; ask the
   user where it will run before building on it.

Whatever the option: validate on the server, show a clear success and error
message in Polish, never log personal data, and test the full path once
against a real inbox.

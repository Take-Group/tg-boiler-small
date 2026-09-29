# React island

1. React adds ~60 KB gz per page that uses it; above the JS budget in
   `scripts/agent/smoke.mjs` for most pages. Prefer Preact (`bunx astro add
   preact --yes`, ~4 KB) unless a React-only library is needed, and ask the
   user before raising the budget.
2. `bunx astro add react --yes` (adds `@astrojs/react`, `react`, `react-dom`
   and the integration in `astro.config.ts`). Check `package.json` after.
3. The widget goes to `src/components/islands/<Name>.tsx`. Props are plain
   data (strings, numbers, arrays); copy comes from `src/content-data/`
   through the page. Style with the app's tokens only.
4. Render it with the lightest directive: `client:visible` below the fold,
   `client:load` only when it must work on the first screen,
   `client:idle` otherwise. No directive = static HTML without behavior.
5. The HTML rendered before hydration must make sense on its own (heading,
   labels, default result): Google and slow phones see that first.
6. Logic worth testing (a price formula) goes to `src/lib/<name>.ts` as a
   pure function with a `bun test` file next to it.
7. Icons inside `.tsx`: `lucide-react` (add it), or pass an Astro-rendered
   icon as children.

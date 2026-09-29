import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/config/site';

export default defineConfig({
  site: SITE.url,
  // Static HTML in dist/ - no server needed. Add an adapter only with the add-feature skill.
  output: 'static',
  // Astro 7 defaults to 'jsx', which glues Polish words broken across lines.
  compressHTML: true,
  trailingSlash: 'never',
  build: {
    format: 'file',
    // CSS goes into each page's <head>: one request less, nothing render-blocking.
    inlineStylesheets: 'always',
  },
  // With the ClientRouter, links prefetch on hover so navigation feels instant.
  prefetch: { defaultStrategy: 'hover' },
  server: { port: 4321 },
  vite: { plugins: [tailwindcss()] },
});

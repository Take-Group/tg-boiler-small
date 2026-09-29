import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/seo';

// Every static page in src/pages is listed automatically. Keep out pages
// that are noindex (404, thank-you pages) by adding their path here.
const EXCLUDED = new Set(['/404', '/500']);

// Dynamic routes ([slug].astro) are not listed automatically: build their
// paths here from the same data their getStaticPaths uses.
const dynamicPaths = (): string[] => [];

/** "./index.astro" -> "/", "./cennik.astro" -> "/cennik", "./uslugi/index.astro" -> "/uslugi". */
function toPath(file: string): string {
  const path = file.replace(/^\./, '').replace(/\.astro$/, '').replace(/\/index$/, '');
  return path || '/';
}

const staticPaths = Object.keys(import.meta.glob('./**/*.astro'))
  .map(toPath)
  .filter((path) => !path.includes('[') && !EXCLUDED.has(path));

export const GET: APIRoute = () => {
  const urls = [...new Set([...staticPaths, ...dynamicPaths()])]
    .sort()
    .map((path) => `<url><loc>${absoluteUrl(path)}</loc></url>`)
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';
import { absoluteUrl } from '@/lib/seo';

// While SITE.indexable is false the whole app is closed to crawlers.
export const GET: APIRoute = () => {
  const body = SITE.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

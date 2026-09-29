// Smoke test of the static build: reads every page in dist/ and checks SEO
// basics, internal links, the sitemap and page weight. `astro build` passes
// with a page missing its H1, a link to nowhere or 200 KB of JavaScript;
// this test catches all three.
//
//   bun run agent:smoke      (run `bun run build` first)
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { ROOT, siteConfigValue } from './lib.mjs';

const DIST = path.join(ROOT, 'dist');
// Page weight ceilings, gzipped, per page. Raising one is the user's call:
// every visitor downloads it. The empty template uses about 3 KB HTML and 6 KB JS.
const BUDGET = { html: 20 * 1024, js: 40 * 1024 };

const gz = (file) => gzipSync(fs.readFileSync(file), { level: 9 }).length;
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

/** Gzipped size of the page and of the JavaScript it loads (static imports followed). */
function weight(file, body) {
  const seen = new Set();
  const visit = (src) => {
    const abs = path.join(DIST, src.split(/[?#]/)[0]);
    if (seen.has(abs) || !fs.existsSync(abs)) return;
    seen.add(abs);
    for (const [, dep] of fs.readFileSync(abs, 'utf8').matchAll(/from\s*"\.\/([^"]+\.js)"/g)) {
      visit(path.join(path.dirname(src), dep));
    }
  };
  for (const [, src] of body.matchAll(/<script[^>]+src="(\/[^"]+\.js)"/g)) visit(src);
  return { html: gz(file), js: [...seen].reduce((sum, abs) => sum + gz(abs), 0) };
}

function htmlFiles(dir = DIST, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Public URL of a built file: dist/index.html -> "/", dist/o-nas.html -> "/o-nas". */
function urlOf(file) {
  const relative = path.relative(DIST, file).split(path.sep).join('/');
  return '/' + relative.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
}

/** Does an internal link resolve to a built file or an asset? */
function exists(href) {
  const clean = decodeURI(href.split(/[?#]/)[0]).replace(/\/$/, '') || '/';
  const candidates = clean === '/' ? ['index.html'] : [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`];
  return candidates.some((candidate) => fs.existsSync(path.join(DIST, candidate)));
}

function problemsIn(body, { is404, indexable }) {
  const problems = [];
  const visible = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`H1: ${h1} (must be 1)`);
  if (!/<html[^>]+lang="/.test(body)) problems.push('missing <html lang>');
  if (!/<title>[^<]{10,}<\/title>/.test(body)) problems.push('missing or short <title>');
  if (!/<meta[^>]+name="description"[^>]+content="[^"]{30,}"/.test(body)) problems.push('missing or short meta description');
  const canonical = /<link[^>]+rel="canonical"/.test(body);
  const robots = body.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/)?.[1] ?? '';
  if (is404) {
    if (canonical) problems.push('404 must not have a canonical');
    if (!robots.includes('noindex')) problems.push('404 must be noindex');
  } else {
    if (!canonical) problems.push('missing canonical');
    const expected = indexable ? 'index, follow' : 'noindex, nofollow';
    if (robots !== expected) problems.push(`robots "${robots}", expected "${expected}" (SITE.indexable = ${indexable})`);
  }
  if (/[—–]/.test(visible)) problems.push('long dash in the copy');
  // Semantic structure: crawlers read elements, not classes.
  const mains = (body.match(/<main[\s>]/g) ?? []).length;
  if (mains !== 1) problems.push(`<main>: ${mains} (must be 1)`);
  const levels = [...visible.matchAll(/<h([1-6])[\s>]/g)].map(([, level]) => Number(level));
  levels.forEach((level, i) => {
    if (i > 0 && level > levels[i - 1] + 1) problems.push(`heading h${levels[i - 1]} followed by h${level} (skipped level)`);
  });
  const navs = [...visible.matchAll(/<nav\b[^>]*>/g)].map(([tag]) => tag);
  if (navs.length > 1 && navs.some((tag) => !/aria-label(ledby)?="/.test(tag))) problems.push('several <nav> without aria-label');
  for (const [, tag, role] of visible.matchAll(/<(div|span)\b[^>]*\brole="(navigation|main|banner|contentinfo|table|row|cell|list|listitem|article|button|link|heading)"/g)) {
    problems.push(`<${tag} role="${role}"> - use the semantic element instead`);
  }
  for (const [, href] of visible.matchAll(/href="(\/[^"]*)"/g)) {
    if (!href.startsWith('//') && !exists(href)) problems.push(`broken link: ${href}`);
  }
  for (const [, src] of visible.matchAll(/<img[^>]+src="(\/[^"]*)"/g)) {
    if (!exists(src)) problems.push(`missing image: ${src}`);
  }
  for (const [tag] of visible.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(tag)) problems.push(`image without alt: ${tag.slice(0, 80)}`);
  }
  return [...new Set(problems)];
}

export async function smoke() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('ERROR: missing dist/index.html - run `bun run build` first.');
    return 1;
  }
  const indexable = siteConfigValue(/indexable:\s*(true|false)/) === 'true';
  console.log(`\n> smoke: dist/ (SITE.indexable = ${indexable})`);

  const sitemapFile = path.join(DIST, 'sitemap.xml');
  const sitemap = fs.existsSync(sitemapFile) ? fs.readFileSync(sitemapFile, 'utf8') : '';
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname.replace(/(.)\/$/, '$1')));

  let failed = 0;
  for (const file of htmlFiles().sort()) {
    const url = urlOf(file);
    const body = fs.readFileSync(file, 'utf8');
    const noindexPage = url === '/404' || /<meta[^>]+name="robots"[^>]+content="noindex/.test(body) && indexable;
    const problems = problemsIn(body, { is404: url === '/404', indexable });
    if (noindexPage && listed.has(url)) problems.push('noindex page listed in sitemap.xml');
    if (!noindexPage && !listed.has(url)) problems.push('missing from sitemap.xml (dynamic route? see src/pages/sitemap.xml.ts)');
    const size = weight(file, body);
    if (size.html > BUDGET.html) problems.push(`HTML ${kb(size.html)} gz over ${kb(BUDGET.html)}`);
    if (size.js > BUDGET.js) problems.push(`JS ${kb(size.js)} gz over ${kb(BUDGET.js)}`);
    if (problems.length) failed++;
    const sizes = `[HTML ${kb(size.html)}, JS ${kb(size.js)} gz]`;
    console.log(`${problems.length ? 'FAIL' : 'OK  '} ${url} ${sizes}${problems.length ? `  - ${problems.join('; ')}` : ''}`);
  }
  for (const required of ['robots.txt', 'sitemap.xml']) {
    const ok = fs.existsSync(path.join(DIST, required));
    if (!ok) failed++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} /${required}${ok ? '' : '  - missing'}`);
  }
  console.log(failed ? `\nSmoke: ${failed} problems.` : '\nSmoke: OK.');
  return failed ? 1 : 0;
}

if (import.meta.main) {
  process.exitCode = await smoke();
}

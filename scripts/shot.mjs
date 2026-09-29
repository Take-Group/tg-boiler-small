#!/usr/bin/env bun
/**
 * Screenshots of local pages on desktop and mobile, for the agent to look at.
 *
 *   bun run shot                    home page
 *   bun run shot / /o-nas           several pages
 *   bun run shot /o-nas --url http://localhost:4321
 *
 * Uses a running dev server (port from astro.config.ts) or starts one for the
 * run. Saves PNGs to .cache/shots/: the first screen and the full page cut
 * into screen-high parts, because one long image is unreadable. Also reports
 * console errors, failed requests and horizontal scroll.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');
const OUT = path.join(ROOT, '.cache/shots');
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const MAX_PARTS = 8;

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const urlFlag = args.indexOf('--url');
const explicitBase = urlFlag >= 0 ? args.splice(urlFlag, 2)[1] : null;
const pages = args.length ? args : ['/'];

function devPort() {
  const config = fs.readFileSync(path.join(ROOT, 'astro.config.ts'), 'utf8');
  return Number(config.match(/port:\s*(\d+)/)?.[1] ?? 4321);
}

async function responds(base) {
  try {
    await fetch(base, { signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}

async function startDev(base) {
  const child = spawn('bun', ['run', 'dev'], { cwd: ROOT, stdio: 'ignore', detached: false });
  for (let i = 0; i < 60; i++) {
    if (await responds(base)) return child;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  child.kill();
  throw new Error(`Dev server did not start on ${base}. Run \`bun run dev\` and check its output.`);
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('ERROR: playwright is missing - run `bun install`.');
    return 1;
  }

  const base = (explicitBase ?? `http://localhost:${devPort()}`).replace(/\/$/, '');
  let server = null;
  if (!(await responds(base))) {
    if (explicitBase) {
      console.error(`ERROR: nothing answers on ${base}.`);
      return 1;
    }
    console.log(`Starting the dev server on ${base} for this run...`);
    server = await startDev(base);
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch {
    server?.kill();
    console.error('ERROR: no browser for screenshots - run `bunx playwright install chromium` once.');
    return 1;
  }

  fs.mkdirSync(OUT, { recursive: true });
  let problems = 0;
  try {
    for (const pagePath of pages) {
      const slug = pagePath.replace(/^\/|\/$/g, '').replace(/[^a-z0-9-]+/gi, '-') || 'home';
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
        const page = await context.newPage();
        const errors = [];
        page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
        page.on('pageerror', (error) => errors.push(String(error)));
        page.on('requestfailed', (request) => errors.push(`request failed: ${request.url()}`));

        const response = await page.goto(base + pagePath, { waitUntil: 'networkidle' });
        // Drop the dev toolbar and smooth scrolling, which would leave shots mid-scroll.
        await page.evaluate(() => {
          document.querySelector('astro-dev-toolbar')?.remove();
          document.documentElement.style.scrollBehavior = 'auto';
        });
        // Scroll through the page so lazy images load, then back to the top.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          window.scrollTo(0, 0);
        });

        const prefix = path.join(OUT, `${slug}-${viewport.name}`);
        const files = [`${prefix}-first.png`];
        await page.screenshot({ path: files[0] });
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const parts = Math.min(Math.ceil(height / viewport.height), MAX_PARTS);
        for (let i = 0; i < parts; i++) {
          const file = `${prefix}-part${i + 1}.png`;
          const y = i * viewport.height;
          await page.screenshot({
            path: file,
            fullPage: true,
            clip: { x: 0, y, width: viewport.width, height: Math.min(viewport.height, height - y) },
          });
          files.push(file);
        }

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const notes = [];
        if (response && response.status() >= 400) notes.push(`HTTP ${response.status()}`);
        if (scrollWidth > viewport.width) notes.push(`horizontal scroll: ${scrollWidth}px > ${viewport.width}px`);
        if (height > viewport.height * MAX_PARTS) notes.push(`page taller than ${MAX_PARTS} screens, the rest not shot`);
        notes.push(...errors.slice(0, 5));
        problems += notes.length;

        console.log(`\n${pagePath} ${viewport.name} (${viewport.width}px, page ${height}px)`);
        for (const file of files) console.log(`  ${path.relative(ROOT, file)}`);
        for (const note of notes) console.log(`  PROBLEM: ${note}`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server?.kill();
  }
  console.log(problems ? `\nShots saved, ${problems} problems above.` : '\nShots saved, no problems found. Read the PNGs before judging the look.');
  return 0;
}

process.exitCode = await main();

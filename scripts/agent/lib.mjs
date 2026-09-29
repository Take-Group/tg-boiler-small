// Shared helpers of the agent harness (agent.mjs, hook.mjs, guard.mjs, smoke.mjs).
// Built-in modules only (node:*), run by bun: hooks must work before `bun install`.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');
export const SKILLS = path.join(ROOT, '.agents/skills');
export const TEMPLATE_NAME = 'tg-boiler-small';

// Directories never scanned for instructions (generated, dependencies, output).
const SKIP_DIRS = new Set(['node_modules', 'dist', '.astro', '.git', '.cache', 'public']);

export const rel = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');

export function isGitRepo() {
  const result = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: ROOT, encoding: 'utf8' });
  return result.status === 0 && result.stdout.trim() === 'true';
}

export function git(...args) {
  const result = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  return result.status === 0 ? result.stdout : '';
}

/** Every AGENTS.md in the repo (root and local), sorted from the root. */
export function instructionFiles() {
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name));
      } else if (entry.name === 'AGENTS.md') {
        found.push(path.join(dir, entry.name));
      }
    }
  };
  walk(ROOT);
  return found.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length || a.localeCompare(b));
}

/** AGENTS.md files that apply to a path, from the root to the leaf. */
export function scopeChain(target, available = instructionFiles()) {
  return available.filter((file) => {
    const dir = path.dirname(file);
    return target === dir || target.startsWith(dir + path.sep);
  });
}

/** Absolute path inside the repo, or null. */
export function insideRoot(value) {
  const candidate = path.resolve(ROOT, value);
  return candidate === ROOT || candidate.startsWith(ROOT + path.sep) ? candidate : null;
}

function packageName() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).name ?? '';
  } catch {
    return '';
  }
}

/** Placeholder count from scripts/check-placeholders.mjs: { hits, files }, or null on error. */
export function placeholderCount() {
  const result = spawnSync(process.execPath, ['scripts/check-placeholders.mjs'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status === 0) return { hits: 0, files: 0 };
  const match = result.stdout.match(/Found (\d+) placeholders in (\d+) files/);
  return match ? { hits: Number(match[1]), files: Number(match[2]) } : null;
}

/** True when origin is the template repo itself (its maintainers work there). */
function isTemplateRepo() {
  const origin = git('remote', 'get-url', 'origin').trim();
  return new RegExp(`[/:]Take-Group/${TEMPLATE_NAME}(\\.git)?$`, 'i').test(origin);
}

/**
 * Work mode:
 *  TEMPLATE   - the template repo itself (origin Take-Group/tg-boiler-small),
 *  ONBOARDING - a new app not configured yet (package.json name still tg-boiler-small),
 *  ADAPTATION - configured, placeholders still in place,
 *  APP        - zero placeholders, the copy is real.
 */
export function detectMode() {
  const placeholders = placeholderCount();
  const name = packageName();
  if (name === TEMPLATE_NAME) return { mode: isTemplateRepo() ? 'TEMPLATE' : 'ONBOARDING', placeholders, name };
  if (placeholders && placeholders.hits === 0) return { mode: 'APP', placeholders, name };
  return { mode: 'ADAPTATION', placeholders, name };
}

export function describeMode({ mode, placeholders }) {
  const count = placeholders ? `${placeholders.hits} placeholders in ${placeholders.files} files` : 'placeholder counter failed';
  if (mode === 'TEMPLATE') {
    return [
      `Mode: TEMPLATE (${count} - expected).`,
      'This is the template repo itself: keep it generic, nothing specific to one business.',
      'If the user wants to build an app rather than change the template, use the new-app skill (it creates their own repo).',
    ].join('\n');
  }
  if (mode === 'ONBOARDING') {
    return [
      `Mode: ONBOARDING (${count}).`,
      'A new app that is not configured yet. Before anything else, whatever the first message says,',
      'run the onboarding skill (.agents/skills/onboarding/SKILL.md): enter plan mode and interview the user',
      'about the goal, features, pages, brand, domain and look. No file changes until the plan is approved.',
    ].join('\n');
  }
  if (mode === 'ADAPTATION') {
    return [
      `Mode: ADAPTATION (${count}).`,
      'A copy of the template being turned into a specific app, led by the new-app skill.',
      'Brand, copy, colors, sections and subpages are scaffolding to replace. Mechanics (SEO, UI system, harness) stay.',
      'Business facts come only from the user or sourced research.',
    ].join('\n');
  }
  return [`Mode: APP (${count}).`, 'A finished app: the copy is real, change it only on request.'].join('\n');
}

/** A value from src/config/site.ts matched with a regex, without running TypeScript. */
export function siteConfigValue(pattern) {
  try {
    return fs.readFileSync(path.join(ROOT, 'src/config/site.ts'), 'utf8').match(pattern)?.[1] ?? null;
  } catch {
    return null;
  }
}

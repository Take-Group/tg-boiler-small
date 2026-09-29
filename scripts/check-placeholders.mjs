#!/usr/bin/env bun
/**
 * Finds template placeholders that must be gone before the app goes live.
 *
 *   bun run placeholders
 *
 * Exits with code 1 when it finds any. A new kind of placeholder in the
 * template = a new pattern in PATTERNS.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');

// [pattern, hint] - patterns match the Polish sample copy of the template.
const PATTERNS = [
  [/twojadomena\.pl/i, 'domain - SITE.url in src/config/site.ts'],
  [/Twoja Marka/, 'brand name - SITE.name in src/config/site.ts'],
  [/Twoja Firma/, 'company data - COMPANY in src/config/site.ts'],
  [/\bTu (wpisz|opisz)\b/, 'instruction text instead of copy - src/content-data/'],
  [/\bPrzykładow(y|a|e|ego)\b/, 'sample copy - src/content-data/'],
  [/Take Group Boiler Small|Pusty szablon Take Group|--color-template|text-template/, 'template splash - replace src/pages/index.astro, delete --color-template'],
  [/\(do ustalenia\)/, 'open decision in the design playbook - DESIGN.md (onboarding skill)'],
];

const SCAN_DIRS = ['src', 'public'];
const SCAN_FILES = ['astro.config.ts', 'DESIGN.md'];
const EXT = /\.(astro|ts|mjs|json|svg|txt|css|webmanifest|md)$/;

function walk(dir, out = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(relative, out);
    else if (EXT.test(entry.name)) out.push(relative);
  }
  return out;
}

const files = [...SCAN_DIRS.flatMap((dir) => walk(dir)), ...SCAN_FILES.filter((file) => fs.existsSync(path.join(ROOT, file)))];
const hits = [];

for (const file of files) {
  fs.readFileSync(path.join(ROOT, file), 'utf8')
    .split('\n')
    .forEach((line, index) => {
      // Comments that describe placeholders are not placeholders.
      if (/^\s*(\*|\/\/|\/\*|#)/.test(line)) return;
      const match = PATTERNS.find(([pattern]) => pattern.test(line));
      if (match) hits.push({ file, line: index + 1, hint: match[1], text: line.trim().slice(0, 110) });
    });
}

if (hits.length === 0) {
  console.log('No template placeholders left - the copy is ready to publish.');
  process.exit(0);
}

const byHint = new Map();
for (const hit of hits) byHint.set(hit.hint, [...(byHint.get(hit.hint) ?? []), hit]);

console.log(`Found ${hits.length} placeholders in ${new Set(hits.map((hit) => hit.file)).size} files:\n`);
for (const [hint, list] of byHint) {
  console.log(`- ${hint} (${list.length})`);
  for (const hit of list.slice(0, 8)) console.log(`    ${hit.file}:${hit.line}  ${hit.text}`);
  if (list.length > 8) console.log(`    ... and ${list.length - 8} more`);
}
process.exit(1);

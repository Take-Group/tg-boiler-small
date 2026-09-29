#!/usr/bin/env bun
/**
 * Claude Code PreToolUse hook: loads local AGENTS.md files before a scope is touched.
 *
 * Claude Code loads only the root (CLAUDE.md -> @AGENTS.md), so local AGENTS.md
 * files (src/components, src/content-data, ...) would go unread. The hook finds
 * the scopes of the paths a call touches and returns their content once per
 * scope per session. Codex has no equivalent - it uses
 * `bun run agent:instructions <path>`.
 *
 * Never blocks: missing data, an unreadable file or an unknown payload = exit 0
 * with no output. APP_HOOK_BLOCK=1 instead denies the first call in a new scope
 * (for clients that ignore additionalContext).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT, insideRoot, rel } from './lib.mjs';

const STATE = path.join(os.tmpdir(), 'tg-app-agent-hook');
const PATH_FIELDS = ['file_path', 'notebook_path', 'path'];
// Bash can edit via sed or a heredoc, so we scan the command for paths.
const BASH_CANDIDATE = /[A-Za-z0-9._][A-Za-z0-9._/-]*\/[A-Za-z0-9._/-]+/g;
const BASH_LIMIT = 40;
const SCOPE_LIMIT = 3;
const CHARACTER_LIMIT = 20000;

function targets(payload) {
  const input = payload.tool_input;
  if (!input || typeof input !== 'object') return [];
  const found = [];
  for (const field of PATH_FIELDS) {
    const value = input[field];
    if (typeof value === 'string' && value) {
      const resolved = insideRoot(value);
      if (resolved) found.push(resolved);
    }
  }
  if (typeof input.command === 'string') {
    for (const match of (input.command.match(BASH_CANDIDATE) ?? []).slice(0, BASH_LIMIT)) {
      const resolved = insideRoot(match);
      if (resolved && fs.existsSync(resolved)) found.push(resolved);
    }
  }
  return found;
}

/** Local AGENTS.md files for a path, from the root to the leaf; the root is already loaded. */
function scopes(target) {
  const found = [];
  let dir = fs.existsSync(target) && fs.statSync(target).isDirectory() ? target : path.dirname(target);
  while (dir !== ROOT && dir.startsWith(ROOT + path.sep)) {
    const local = path.join(dir, 'AGENTS.md');
    if (fs.existsSync(local)) found.push(local);
    dir = path.dirname(dir);
  }
  return found.reverse();
}

function stateFile(payload) {
  const session = String(payload.session_id ?? '').replace(/[^A-Za-z0-9._-]/g, '').slice(0, 64) || 'session';
  return path.join(STATE, `${session}.json`);
}

function remembered(file) {
  try {
    const stored = JSON.parse(fs.readFileSync(file, 'utf8'));
    return new Set(Array.isArray(stored) ? stored.filter((name) => typeof name === 'string') : []);
  } catch {
    return new Set();
  }
}

function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    return 0;
  }
  if (!payload || typeof payload !== 'object') return 0;
  const file = stateFile(payload);
  const seen = remembered(file);
  const pending = [];
  for (const target of targets(payload)) {
    for (const scope of scopes(target)) {
      if (!seen.has(rel(scope)) && !pending.includes(scope)) pending.push(scope);
    }
  }
  if (pending.length === 0) return 0;

  const sections = [];
  for (const scope of pending.slice(0, SCOPE_LIMIT)) {
    try {
      sections.push(`## ${rel(scope)}\n\n${fs.readFileSync(scope, 'utf8').trim()}`);
      seen.add(rel(scope));
    } catch {
      // unreadable file - skip it, the hook never blocks
    }
  }
  if (sections.length === 0) return 0;
  try {
    fs.mkdirSync(STATE, { recursive: true });
    fs.writeFileSync(file, JSON.stringify([...seen].sort()));
  } catch {
    // no saved state = the instructions show up once more, harmless
  }
  const context = (
    'Local instructions for the scope this call touches ' +
    '(shown once per scope per session; apply them to the files you edit):\n\n' +
    sections.join('\n\n')
  ).slice(0, CHARACTER_LIMIT);

  if (process.env.APP_HOOK_BLOCK === '1') {
    process.stderr.write(`${context}\n\nRepeat the call after applying these instructions.`);
    return 2;
  }
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: context } }));
  return 0;
}

process.exitCode = main();

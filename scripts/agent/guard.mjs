#!/usr/bin/env bun
/**
 * Claude Code PreToolUse hook for the Agent tool: delegate only to pinned profiles.
 *
 * The `app-explore` and `app-research` profiles pin cheaper models in
 * `.claude/agents/*.md`, but Claude Code picks the subagent model per call: a
 * `model` override, the built-in `Explore`/`Plan`, a fork of the whole session
 * and an unnamed agent all run on the session model. The hook denies such calls
 * and points to the right profile.
 *
 * A bad payload never blocks (exit 0 with no output). APP_AGENT_GUARD=0 turns
 * the guard off for the session.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const PINNED = {
  'app-explore': { skill: 'explore', purpose: 'code exploration' },
  'app-research': { skill: 'research', purpose: 'web research' },
};
// Built-in or generic names that inherit the session model -> the right profile.
const REDIRECT = { explore: 'app-explore', plan: 'app-explore', research: 'app-research' };

function pinnedModel(profile) {
  try {
    const text = fs.readFileSync(path.join(ROOT, '.claude/agents', `${profile}.md`), 'utf8');
    const front = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
    const model = front.match(/^model:\s*["']?([^\s"']+)/m)?.[1];
    return model && model.toLowerCase() !== 'inherit' ? model : null;
  } catch {
    return null;
  }
}

const skillHint = (profile) => `Procedure: .agents/skills/${PINNED[profile].skill}/SKILL.md.`;
const profilesHint = () =>
  Object.entries(PINNED)
    .map(([profile, { purpose }]) => `subagent_type="${profile}" - ${purpose} (${pinnedModel(profile) ?? 'no model'})`)
    .join('; ');

function verdict(input) {
  const type = typeof input.subagent_type === 'string' ? input.subagent_type.trim() : '';
  const override = typeof input.model === 'string' ? input.model.trim() : '';
  if (!type) return `An unnamed agent runs on the session model. Use a profile: ${profilesHint()}.`;
  if (PINNED[type]) {
    const model = pinnedModel(type);
    if (!model) return `Profile .claude/agents/${type}.md must pin a model (not inherit) - fix the profile.`;
    if (override) return `Do not pass model="${override}" for ${type}: the profile pins ${model}. Remove the override. ${skillHint(type)}`;
    return null;
  }
  const target = REDIRECT[type.toLowerCase()];
  if (target) {
    return `Built-in "${type}" inherits the session model. Use subagent_type="${target}" (${pinnedModel(target) ?? 'model from the profile'}). ${skillHint(target)}`;
  }
  if (type.toLowerCase() === 'fork') {
    return `A fork inherits the model and the whole session context. Use: ${profilesHint()}.`;
  }
  return null;
}

function main() {
  if (process.env.APP_AGENT_GUARD === '0') return 0;
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    return 0;
  }
  if (!payload || payload.tool_name !== 'Agent' || !payload.tool_input || typeof payload.tool_input !== 'object') return 0;
  const reason = verdict(payload.tool_input);
  if (!reason) return 0;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason },
    }),
  );
  return 0;
}

process.exitCode = main();

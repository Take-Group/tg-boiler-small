#!/usr/bin/env bun
/**
 * Repo context and verification for agents (Claude Code and Codex).
 *
 *   bun run agent:context [path...]      work mode, git state, instruction map, skills
 *   bun run agent:instructions <path>    AGENTS.md chain for a path (from the root)
 *   bun run agent:check                  harness consistency (skills, links, budgets, hooks)
 *   bun run agent:verify                 check + code rules + placeholders + astro check + build + smoke
 *   bun run agent:smoke                  SEO basics and internal links of every page in dist/
 *
 * `brief` (no package.json script) prints just the mode - run by the Claude
 * Code SessionStart hook.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ROOT,
  SKILLS,
  describeMode,
  detectMode,
  git,
  insideRoot,
  instructionFiles,
  isGitRepo,
  rel,
  scopeChain,
} from './lib.mjs';
import { smoke } from './smoke.mjs';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const command = args.shift();

function skillFiles() {
  if (!fs.existsSync(SKILLS)) return [];
  return fs
    .readdirSync(SKILLS, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(SKILLS, entry.name, 'SKILL.md'))
    .filter((file) => fs.existsSync(file))
    .sort();
}

function resolvePaths(paths) {
  const resolved = [];
  for (const value of paths) {
    const target = insideRoot(value);
    if (!target) {
      console.error(`ERROR: path outside the repo: ${value}`);
      process.exit(1);
    }
    resolved.push(target);
  }
  return resolved;
}

function context(paths) {
  console.log(`Repo: ${ROOT}`);
  console.log(describeMode(detectMode()));
  if (isGitRepo()) {
    console.log(`\nBranch: ${git('branch', '--show-current').trim() || '(detached HEAD)'}`);
    const head = git('rev-parse', '--short', 'HEAD').trim();
    console.log(`HEAD: ${head || '(no commits yet)'}`);
    console.log('\nWorking tree:');
    console.log(git('status', '--short').trim() || 'clean');
  } else {
    console.log('\nGit: no repo - the new-app skill creates one.');
  }
  const available = instructionFiles();
  if (paths.length === 0) {
    console.log('\nInstruction map (read the scopes you edit):');
    for (const file of available) console.log(rel(file));
  }
  for (const target of resolvePaths(paths)) {
    console.log(`\nInstructions for ${rel(target) || '.'} (from the root):`);
    for (const file of scopeChain(target, available)) console.log(rel(file));
  }
  console.log('\nSkills:');
  for (const file of skillFiles()) console.log(rel(file));
  console.log('\nContext only - does not check the build. Run `bun run agent:verify` for that.');
}

function instructions(paths) {
  if (paths.length === 0) {
    console.error('Usage: bun run agent:instructions <path...>');
    process.exit(1);
  }
  const available = instructionFiles();
  for (const target of resolvePaths(paths)) {
    console.log(`# Instructions for ${rel(target) || '.'} (from the root to the leaf)`);
    for (const file of scopeChain(target, available)) {
      console.log(`\n## ${rel(file)}\n`);
      console.log(fs.readFileSync(file, 'utf8').trim());
    }
  }
}

const BUDGET = { root: 8192, local: 2048, skill: 4096 };

function checkHarness() {
  const failures = [];
  const tight = [];
  const rootAgents = path.join(ROOT, 'AGENTS.md');
  const agents = instructionFiles();
  if (!agents.includes(rootAgents)) failures.push('Missing AGENTS.md in the root');

  const bridge = path.join(ROOT, 'CLAUDE.md');
  if (!fs.existsSync(bridge) || fs.readFileSync(bridge, 'utf8').trim() !== '@AGENTS.md') {
    failures.push('Root CLAUDE.md must contain only @AGENTS.md');
  }
  for (const file of agents) {
    const sibling = path.join(path.dirname(file), 'CLAUDE.md');
    if (sibling !== bridge && fs.existsSync(sibling)) failures.push(`CLAUDE.md only in the root: ${rel(sibling)}`);
  }

  if (!fs.existsSync(path.join(ROOT, 'DESIGN.md'))) failures.push('Missing DESIGN.md (design playbook)');

  // Astro turns every .md in src/pages into a page, and public/ serves everything.
  for (const dir of ['src/pages', 'public']) {
    const walk = (abs) => {
      if (!fs.existsSync(abs)) return;
      for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
        const full = path.join(abs, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.md')) failures.push(`.md file in ${dir} would ship to production: ${rel(full)}`);
      }
    };
    walk(path.join(ROOT, dir));
  }

  if (!fs.existsSync(SKILLS) || fs.lstatSync(SKILLS).isSymbolicLink()) {
    failures.push('The skill source must be a plain directory: .agents/skills');
  } else {
    for (const entry of fs.readdirSync(SKILLS, { withFileTypes: true })) {
      const definition = path.join(SKILLS, entry.name, 'SKILL.md');
      if (!entry.isDirectory() || !fs.existsSync(definition)) {
        failures.push(`Expected a skill directory with SKILL.md: .agents/skills/${entry.name}`);
      }
    }
  }
  const discovery = path.join(ROOT, '.claude/skills');
  if (!fs.existsSync(discovery) || !fs.lstatSync(discovery).isSymbolicLink() || fs.readlinkSync(discovery) !== '../.agents/skills') {
    failures.push('.claude/skills must be a symlink to ../.agents/skills');
  }

  for (const script of ['hook.mjs', 'guard.mjs', 'smoke.mjs']) {
    if (!fs.existsSync(path.join(ROOT, 'scripts/agent', script))) failures.push(`Missing scripts/agent/${script}`);
  }
  for (const profile of ['app-explore', 'app-research']) {
    const claude = path.join(ROOT, `.claude/agents/${profile}.md`);
    const text = fs.existsSync(claude) ? fs.readFileSync(claude, 'utf8') : '';
    const model = text.match(/^model:\s*(\S+)/m)?.[1];
    if (!model || model === 'inherit') failures.push(`Claude profile must pin a model: .claude/agents/${profile}.md`);
    if (!fs.existsSync(path.join(ROOT, `.codex/agents/${profile}.toml`))) failures.push(`Missing Codex profile: .codex/agents/${profile}.toml`);
  }

  let commands = [];
  try {
    const hooks = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude/settings.json'), 'utf8')).hooks ?? {};
    commands = Object.entries(hooks).flatMap(([event, groups]) =>
      groups.flatMap((group) => (group.hooks ?? []).map((hook) => ({ event, matcher: group.matcher ?? '', command: hook.command ?? '' }))),
    );
  } catch {
    failures.push('Cannot read .claude/settings.json');
  }
  if (!commands.some((c) => c.event === 'PreToolUse' && c.command.includes('scripts/agent/hook.mjs'))) {
    failures.push('PreToolUse must run scripts/agent/hook.mjs (.claude/settings.json)');
  }
  if (!commands.some((c) => c.event === 'PreToolUse' && c.matcher.includes('Agent') && c.command.includes('scripts/agent/guard.mjs'))) {
    failures.push('PreToolUse for Agent must run scripts/agent/guard.mjs (.claude/settings.json)');
  }
  if (!commands.some((c) => c.event === 'SessionStart' && c.command.includes('agent.mjs'))) {
    failures.push('SessionStart must run scripts/agent/agent.mjs brief (.claude/settings.json)');
  }

  const routing = fs.existsSync(rootAgents) ? fs.readFileSync(rootAgents, 'utf8') : '';
  const skills = skillFiles();
  if (skills.length === 0) failures.push('No skills in .agents/skills');
  for (const file of skills) {
    const name = path.basename(path.dirname(file));
    const front = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---\n/);
    const fields = Object.fromEntries([...(front?.[1] ?? '').matchAll(/^(name|description):\s*(.+)$/gm)].map((m) => [m[1], m[2]]));
    if (fields.name !== name || !fields.description) failures.push(`Bad frontmatter: ${rel(file)}`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) failures.push(`Bad skill name: ${name}`);
    if (!routing.includes(`](${rel(file)})`)) failures.push(`Skill missing from AGENTS.md routing: ${rel(file)}`);
  }

  for (const file of [...agents, ...skills]) {
    const limit = file === rootAgents ? BUDGET.root : file.endsWith('SKILL.md') ? BUDGET.skill : BUDGET.local;
    const size = fs.statSync(file).size;
    if (size > limit) failures.push(`Budget exceeded: ${rel(file)} (${size}/${limit} B)`);
    else if (size >= limit * 0.9) tight.push(`${rel(file)} (${limit - size} of ${limit} B free)`);
  }

  // Explicit markdown links only; fenced examples, paths in `code` and URLs are not checked.
  const referenced = skills.flatMap((file) => {
    const dir = path.join(path.dirname(file), 'references');
    return fs.existsSync(dir) ? fs.readdirSync(dir).map((name) => path.join(dir, name)) : [];
  });
  for (const file of [...agents, ...skills, ...referenced]) {
    const text = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
    for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const destination = path.resolve(path.dirname(file), target.split('#')[0]);
      if (!fs.existsSync(destination)) failures.push(`Dead link in ${rel(file)}: ${target}`);
    }
  }

  if (failures.length) {
    for (const failure of failures) console.error(`ERROR: ${failure}`);
    return 1;
  }
  for (const notice of tight) console.log(`Budget almost full: ${notice}`);
  console.log(`Harness OK: ${agents.length} AGENTS.md files, ${skills.length} skills.`);
  return 0;
}

function run(label, cmd, cmdArgs) {
  console.log(`\n> ${label}`);
  const result = spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`FAILED: ${label}`);
    return false;
  }
  return true;
}

// Project rules a type check does not see. [pattern, rule, files it applies to]
const CODE_RULES = [
  [/from ['"]@lucide\/astro/, 'import icons from @/components/ui/icons, not @lucide/astro', (file) => file !== 'src/components/ui/icons.ts'],
  [/#[0-9a-fA-F]{3,8}\b|rgba?\(|\b(slate|gray|zinc|neutral|stone|red|blue|green|indigo|sky)-\d{2,3}\b/, 'colors only from tokens in src/styles/globals.css', (file) => !['src/styles/globals.css', 'src/config/site.ts'].includes(file)],
  [/[—–]/, 'no long dashes in copy or code, use a hyphen or a comma', () => true],
];

function codeRules() {
  console.log('\n> code rules');
  const failures = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const file = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(file);
      else if (/\.(astro|ts|tsx|css|mjs)$/.test(entry.name)) {
        fs.readFileSync(path.join(ROOT, file), 'utf8')
          .split('\n')
          .forEach((line, index) => {
            for (const [pattern, rule, applies] of CODE_RULES) {
              if (applies(file) && pattern.test(line)) failures.push(`${file}:${index + 1} - ${rule}`);
            }
          });
      }
    }
  };
  walk('src');
  for (const failure of failures) console.error(`ERROR: ${failure}`);
  if (!failures.length) console.log('Code rules OK.');
  return failures.length === 0;
}

async function verify() {
  if (checkHarness()) return 1;
  if (isGitRepo() && !run('git diff --check', 'git', ['diff', '--check'])) return 1;
  if (!codeRules()) return 1;

  const state = detectMode();
  console.log(`\n${describeMode(state)}`);
  if (state.mode === 'ADAPTATION') console.log('NOTE: before publishing, `bun run placeholders` must report zero.');
  if (!run('bun run check', 'bun', ['run', 'check'])) return 1;
  if (!run('bun run build', 'bun', ['run', 'build'])) return 1;
  const code = await smoke();
  if (code) return code;
  console.log('\nStatic checks and smoke OK. The look is not checked here: `bun run shot <path>`.');
  return 0;
}

const handlers = {
  context: () => context(args),
  instructions: () => instructions(args),
  brief: () => console.log(describeMode(detectMode())),
  check: () => checkHarness(),
  verify: () => verify(),
  smoke: () => smoke(),
};

if (!handlers[command]) {
  console.error('Usage: agent.mjs context|instructions|brief|check|verify|smoke');
  process.exit(1);
}
process.exitCode = (await handlers[command]()) ?? 0;

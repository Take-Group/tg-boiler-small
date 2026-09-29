---
name: diagnose
description: Find the cause of a bug (build error, blank or broken page, missing section, broken link, wrong look, error in the console) without changing anything - the cause and the smallest change scope. The fix is done by the fix skill.
---

# Diagnose

A read-only step. Fixing along the way hides whether the first guess was
wrong, so fixing is separate: [fix](../fix/SKILL.md).

## Limits

- No changes to code, config or copy. A temporary `console.log` or a
  scratchpad script is fine; remove it before the report and mention it.

## Finding the cause

1. Symptom, expected result, where: `bun run dev`, the build, or a published
   copy (the code on disk does not prove what is published).
2. Reproduce: `bun run build`, `bun run agent:smoke`,
   `bun run shot <path>` for the look, the exact error text.
3. Walk the chain for the symptom:
   - page: `src/pages/<page>.astro` -> copy in `src/content-data/` ->
     section in `components/sections/` -> base component in `ui/` ->
     `BaseLayout.astro`;
   - look: the component's variant -> tokens in `src/styles/globals.css`
     -> the class passed at the call site;
   - build or type error: the first error in the output, not the last.
4. The first link with a bad state is the cause; everything after it is an
   effect and gets no separate fix.

## Report

- **Symptom** and how you reproduced it (or that you could not).
- **Cause**: the first bad link and why.
- **Evidence**: error text word for word, smoke or shot output.
- **Change scope**: files of the smallest fix, what not to touch.
- **Proof**: the check that will show the fix works.

An unfound cause is a valid result: list what you ruled out. Never present a
guess as the cause.

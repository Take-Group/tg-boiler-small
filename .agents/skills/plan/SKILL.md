---
name: plan
description: Write and follow a build plan in plan/ for work longer than one session - checkboxes in plan/PLAN.md, one file per step, stops for the user's decisions. Use when a task has more than ~5 steps, the user asks for a plan, or plan/PLAN.md exists at session start.
---

# Build plan

A non-technical owner reads `plan/PLAN.md` to see where the work is. Keep it
short and true.

## Writing a plan

1. Split the work into steps a session can finish (usually 5-15). Each step
   has a result the user can see ("strona Cennik z tabelą cen"), not an
   activity ("praca nad cennikiem").
2. `plan/PLAN.md` is the only file with checkboxes, in the format of
   [plan-format](references/plan-format.md). Details of step NN go to
   `plan/steps/NN-<slug>.md`: goal, files, open questions, how to check it.
3. Mark `[STOP]` on items that need the user's data or decision, so the next
   session asks instead of guessing.
4. Plan text is in Polish (the owner reads it); file names in English.
5. Show the user the step list and wait for approval before building.

## Following a plan

1. Session start: `git status`, `bun run agent:context`, then the first
   unchecked `[ ]` in `plan/PLAN.md` and its step file.
2. At a `[STOP]` without an answer: ask, then do the next item that does not
   depend on it.
3. An item is `[x]` only after [verify](../verify/SKILL.md) passes for it.
   Check it off in the same change.
4. Decisions taken along the way go into the step file ("Decyzje"), not into
   chat only, so the next session knows them.
5. A plan that no longer matches reality is fixed first, then followed.

---
name: save-work
description: Save, publish or undo work with git for a non-technical owner - commit, push to GitHub, go back to an earlier version, see what changed. Use for "zapisz", "wrzuć na GitHuba", "cofnij", "co się zmieniło", and when a plan step is done.
---

# Saving work

The owner does not know git. Translate: commit = "zapisany punkt",
push = "wysłane na GitHuba", branch = "osobna wersja robocza".

## Save (commit)

1. After [verify](../verify/SKILL.md) passes. Work on `main` unless the
   user asks for a separate version.
2. Stage only this task's files by name (`git add <paths>`), never
   `git add -A` blindly. `git diff --cached --check`.
3. Message in English, imperative, describing the effect for the visitor:
   "Add pricing page with three packages". End with the attribution line
   your tool adds, if any.
4. Commit without asking when a verified plan step or a task the user asked
   for is complete; say it in the report in one line.

## Publish (push)

`git push` only when the user asks. Before the first push check the remote
(`git remote -v`); no remote = ask where the repo should live. Say what went
where: "wysłane na GitHuba, repo <owner>/<name>".

## Undo

- Uncommitted changes to one file: `git restore <file>`, after confirming
  with the user which change they mean. Show the diff first.
- A saved point: `git revert <commit>` creates a new point that undoes it.
  Never `git reset --hard` or force push without the user's explicit yes.

## What changed

`git log --oneline -10` and `git diff`, retold in plain Polish: which pages
and what a visitor will notice. No hashes unless asked.

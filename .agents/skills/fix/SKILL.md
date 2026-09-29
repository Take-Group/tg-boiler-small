---
name: fix
description: Fix a bug whose cause the diagnose skill confirmed - the smallest change and the proof named in the diagnosis. Use after diagnose, never instead of it.
---

# Fix

Entry condition: a [diagnose](../diagnose/SKILL.md) report with the cause,
change scope and proof. A cause named by the user or a log is a guess until
diagnose confirms it.

1. One sentence: the cause and the change scope. A fix that has to go beyond
   the scope means the diagnosis was wrong; go back to it instead.
2. The smallest change that removes the cause. Effects after it disappear
   with it, or are a separate bug with its own diagnosis.
3. Follow the skill that owns the area: copy [content](../content/SKILL.md),
   look [ui-components](../ui-components/SKILL.md), SEO [seo](../seo/SKILL.md),
   pages [new-page](../new-page/SKILL.md).
4. Repeat the reproduction from the diagnosis; it must pass now. A symptom
   that went away is not enough, the named proof counts.
5. A recurring trap worth remembering goes to the `AGENTS.md` of the folder
   it lives in ([harness](../harness/SKILL.md)).
6. [verify](../verify/SKILL.md). Report: cause, change, proof.

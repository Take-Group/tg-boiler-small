# Text budgets and slop patterns

## Budgets (Polish copy, per element)

| Element | Budget |
| --- | --- |
| Hero | H1 + one sentence (max ~15 words) + up to 2 buttons. No bullet row, no microcopy line. |
| Eyebrow | 1-2 words, only when it adds orientation |
| H2 | max ~8 words, says the message, not the topic ("Montaż w 3 dni", not "Informacje o montażu") |
| Section lead | one sentence, max ~15 words, or none |
| Card / tile title | 2-5 words |
| Card / tile text | max ~10 words, one line on desktop; none when the title and icon say it |
| Step (process) | icon + title + optional deadline; text max ~8 words |
| Stat label | max ~5 words |
| List item (checklist, warnings) | bold title + max ~10 words |
| Paragraph (about, callout) | max 2 sentences; never a 5-line block |
| Footnote | one line; long rules and source lists go into `<details>` |
| Buttons | one primary per section; secondary as a text link |
| Section count (landing page) | ~8-10 between hero and footer CTA |

## Slop patterns to remove

- Openers that restate the heading ("W tej sekcji...", "Poniżej znajdziesz...").
- Triads of vague benefits ("szybko, tanio i profesjonalnie").
- Sentences that announce a number instead of showing it ("Sprawdź, ile możesz
  zyskać") next to the number itself.
- The same caveat in several places (as-of date, "zależy od",
  "orientacyjnie"): keep it once, near the first number.
- Two sections answering the same question (a calculator and a worked example
  with the same numbers, a callout and an FAQ item on the same doubt).
- Lead + card text + footnote saying one thing three times.
- Icon + text cards where every text is a full sentence of 15+ words.
- Long dashes in copy (the root rule).
- Visual slop: decorative gradients, glows, grid patterns, gradient text.

## Keep (do not cut)

- Numbers the visitor decides on (prices, deadlines, limits),
  the as-of date and source once, legal disclaimers required on the page.
- Internal links (move them, never delete), H1, FAQ questions and answers.

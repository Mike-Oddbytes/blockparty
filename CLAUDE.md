# blockparty, working instructions

Read this before changing anything. Written for a fresh session with no prior
context on this repo.

## Shared rules come first

The SS6 folder's `CLAUDE.md` carries the rules that apply to every SS6 project:
who you are writing for, the writing conventions, and how work arrives from the
planner. Read it before this file. In short, and worth repeating here because
they get broken most often:

- Mike is PO and GTM lead. He is not an engineer and does not read code. Plain
  language, no jargon, no walking through code.
- Never use em dashes. Never use emojis.
- Log what you did in `CHANGELOG.md`, including what broke and what you could not
  verify.

## The name trap, read this twice

This repo is called `blockparty` and it was named before either product inside it.
It is **not** the Block Party local news initiative. Two unrelated things share it:

- **HB Daily** is the live product and almost certainly what your card is about.
  `hb-daily.html` is the whole game in one file. `hb-words.csv` is the word list.
  Live at https://mike-oddbytes.github.io/blockparty/hb-daily.html
- **I Win leftovers.** `group-chat-markets.jsx` and `PLAN.md` are from an unrelated
  prediction-markets concept that now has its own repo, `Mike-Oddbytes/i-win`.
  Ignore them here. They should be deleted once Mike says so.

Until Aug 6 2026 this file described I Win and told sessions not to touch
`hb-daily.html`, which is the opposite of the truth. If anything you read in this
repo contradicts that, trust this file and `CONTEXT.md`.

There is also a Lovable app called `blockparty-app` and another called
`localbrief`. Those are front doors for signups. Neither is this repo.

## What HB Daily is

A daily word game for Huntington Beach locals. A local Wordle: the word length
varies from four to seven letters, six guesses, an optional hint, streaks, stats and
share text. One new word a day. Every word has a short "why this word" note shown
after solving, which is the real point: the game is the habit and the local trivia
is what it carries.

Single file, no dependencies, nothing to build or install. Open it in a browser.

`CONTEXT.md` is the fuller handoff doc. `PRODUCT-ROADMAP.md` is the long-term
vision. The planner is the source of truth for what happens next and in what order.

## Decisions already made, do not reopen casually

1. **Game first.** The game is the front door. News and local content are layers on
   top of a proven habit, not the product.
2. **Huntington Beach only** until the habit is proven.
3. **No custom domain for the pilot.** Shares point at the GitHub Pages address.
   Deferred, not cancelled.
4. **No emojis anywhere,** including the share grid, which uses text characters.
5. **Crime content is a dry factual line, never a discussion thread.** This is the
   deliberate anti-Nextdoor decision.
6. **Leaderboards stay switched off** until roughly 50 players a day.
7. **Hand-curated before automated.** No newsroom cost structure, ever.

## Things worth knowing before you touch the file

The settings sit at the top of the script block:

- `EPOCH` is the date of puzzle number one, currently Aug 4 2026. The word of the
  day is worked out from how many days have passed since then.
- `SITE_URL` is added to the end of the share text. It is still the placeholder
  `hbdaily.com` and pointing it at the real address is an open planner card.
- `GRID_STYLE` is `"text"`. It can flip to coloured squares later, but those use
  emoji characters, so leave it alone unless Mike asks.

The word list exists twice: in `hb-words.csv` and as a copy inside the HTML. **Keep
them in step.** The CSV is the source of truth for word content. It currently covers
56 days and the blurbs have not been fact-checked yet.

To test without playing: add `?day=50` to jump to a puzzle, `?preview=win` or
`?preview=lose` to see the end-of-game screen without solving, and `?reset=1` to wipe
saved progress. They combine.

Saved progress lives in the browser only, under keys starting `hbd_`. There are no
accounts, so anything saved is lost if someone switches device. That is what Phase 3
is for.

## Before claiming anything works

The scoring was checked with unit tests and it matches standard Wordle rules. There
is no dictionary check, so any letters of the right length are accepted.

There is no test runner in this repo. If you change the game, open it in a browser
and actually play it, including the share button, and say in the recap which of
those you did and which you did not.

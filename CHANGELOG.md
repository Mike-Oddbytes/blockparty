# blockparty changelog

Newest first. Every session adds an entry. Record what broke and what could not be
verified, not only what shipped.

Note this repo holds HB Daily. The `group-chat-markets.jsx` and `PLAN.md` files are
leftovers from I Win, which now lives in its own repo.

## Aug 7 2026: Session 1B, share URL set

**Share links now point at the live game.** `SITE_URL` in `hb-daily.html` changed
from the placeholder `hbdaily.com` to the full live address,
`https://mike-oddbytes.github.io/blockparty/hb-daily.html`, and the stale
"placeholder" comment on that line was updated. Commit `135d2ce`.

The full path matters: the repo's front page (`index.html`) is the leftover I Win
prototype, so a link to just the site root would drop people into the wrong app.

**Verified on the live deployed page**, not just in the code. Opened it in preview
mode and confirmed the share text ends with the live address as a tappable https
link. Nothing else was touched; the word list (1C) and seeding copy are still open.

## Aug 6 2026: working instructions corrected, analytics parked

**No code changed.** `hb-daily.html` and `hb-words.csv` were not touched.

**`CLAUDE.md` in this repo described the wrong product.** It was titled "I Win,
working context" and described the prediction-markets app, left over from when I Win
lived here. Worse, it listed `hb-daily.html` and `hb-words.csv` under "a different
project, not part of I Win, do not touch". So any session following this repo's own
instructions was told to leave the HB Daily files alone, which are exactly the files
the Blockparty roadmap is about. Rewritten for HB Daily. Commit `6cba6a1`.

**Session 1A Analytics moved to Later in the planner.** It had been ticked as done,
but there is no analytics code anywhere in `hb-daily.html`, and `CONTEXT.md` agreed
it was outstanding. Mike had decided on Aug 4 that analytics was not needed yet, so
the card was parked rather than reopened. It is not pending work. Do not add
analytics unless Mike asks.

**Blockparty Phase 1 was rewritten in the planner.** It required analytics running
and the site being live, which no single card could deliver and which conflicted with
analytics being parked. It now reads: shares route to the live Pages URL, the word
list is fact-checked with 90 days of runway, and the seeding copy is ready to post.
That is the honest sum of the three remaining cards.

**The session prompts for this project now name HB Daily explicitly** and warn that
the Lovable app `blockparty-app` is a different thing.

### Still open, and worth knowing before the next session

- `SITE_URL` is still the placeholder `hbdaily.com`. Card 1B.
- The word list covers 56 days, not 90, and the blurbs have never been fact-checked.
  Card 1C needs 34 more words and a check of all 56 existing notes.
- The word list exists twice, in the CSV and inside the HTML. They must be kept in
  step and nothing enforces that.

## Aug 4 2026: HB Daily built and deployed

Built the game as a single file with no dependencies and put it on GitHub Pages.
Wrote the 56-word list with clues, categories and post-solve notes.

Session 1A was deferred that day. The repo location had to be found first, because
the card named a file that was not on the local disk.

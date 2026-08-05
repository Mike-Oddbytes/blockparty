# Blockparty - Project Context

Handoff doc for any Claude session or collaborator picking up this project. Read this first.

## What this is

Blockparty is a hyper-local infotainment product: local IG feed meets Nextdoor, anchored by daily games. The thesis: people do not want another local news site, they want a daily reason to feel connected to where they live. Games are the habit anchor and growth loop; news, openings, sports, and community content are retention layers that stack on top of a proven habit. Nextdoor owns local anxiety; Blockparty owns local pride.

Pilot market: Huntington Beach, CA. Strong identity (Surf City USA), ~200k population, deep local vocabulary, active FB groups and subreddit for seeding.

This is an Oddbytes / Search Squad Six (SS6) experiment. Mike Strouss is PO and GTM lead. Work is sequenced in the SS6 planner (behind auth, Blockparty project); one planner session card = one working session. Do only the card you are handed.

## Current state (as of Aug 4, 2026)

Live: https://mike-oddbytes.github.io/blockparty/hb-daily.html (GitHub Pages, deploy from main, root)

Key files: hb-daily.html is the entire game (single file, zero dependencies): HB Daily, a local Wordle with variable word length (4-7), 6 guesses, hints, streaks, stats, share text, daily rotation. hb-words.csv is the 56-word list with clues, categories, and post-solve blurbs; it is the source of truth for word content and the same data is embedded in the HTML as a JS array (keep them in sync). PRODUCT-ROADMAP.md is the full product vision and phase plan. group-chat-markets.jsx is an unrelated prototype from a different concept; ignore it for Blockparty work.

Not yet done: analytics on the page, SITE_URL still points at placeholder hbdaily.com, word list not fact-checked and covers only 56 days, no seeding/launch yet. The SS6 planner is the source of truth for what is next and in what order.

## Decisions already made (do not relitigate casually)

1. Game-first wedge. The daily game is the front door; news is a layer on it, not the product.
2. 2. Huntington Beach is the pilot. Single neighborhood until the habit is proven.
   3. 3. No custom domain for the pilot. Shares route to the GitHub Pages URL. Deferred, not cancelled.
      4. 4. No emojis anywhere: UI, share text, docs. The share grid uses text characters. GRID_STYLE in the HTML can flip to colored squares later if Mike decides the share loop needs them.
         5. 5. Crime content rule: dry factual digest lines only, never a discussion surface. This is the anti-Nextdoor design decision and it is deliberate.
            6. 6. Leaderboards stay dark until ~50 daily players. A 9-person leaderboard is worse than none.
               7. 7. Manual before automated. Hand-curated words and briefs until consumption is demonstrated. No newsroom cost structure, ever (Patch and DNAinfo died on content economics).
                  8. 8. Positive-first positioning: the good things about the neighborhood plus the need-to-know.
                    
                     9. ## Technical notes for hb-daily.html
                    
                     10. Constants at the top of the script block: EPOCH is the date of puzzle #1 (currently Aug 4, 2026); word of the day = days since epoch, modulo list length. SITE_URL is appended to share text (currently the hbdaily.com placeholder; pointing it at the Pages URL is an open planner card). GRID_STYLE is "text" (default) or "squares" for the share grid.
                    
                     11. URL test params: ?day=N jumps to puzzle N, ?preview=win or ?preview=lose simulates a finished game (nothing saved, banner shown), ?reset=1 wipes all saved state. Combinable, e.g. ?day=50&preview=win.
                    
                     12. localStorage keys are prefixed hbd_. Stats in hbd_stats (played, won, streak, maxStreak, lastWonDay, dist); per-day state in hbd_day_N. Streak counts consecutive puzzle numbers won; skipping a day breaks it.
                    
                     13. Scoring is standard Wordle two-pass (exact matches consume letters before presents). Verified with unit tests. No dictionary check on guesses; any letters of the right length are accepted.
                    
                     14. Share text format: "HB Daily #12 3/6" then a blank line, then the guess grid using # for correct, + for present, - for absent (one row per guess), then a blank line and the SITE_URL. An asterisk after the score marks a hint-assisted solve. Sharing uses navigator.share on mobile, clipboard with a hidden-textarea fallback on desktop, and the share text is always displayed in the result modal.
                    
                     15. ## Word list conventions (hb-words.csv)
                    
                     16. Columns: day, word, length, category, clue, blurb. Words are 4-7 letters, uppercase, alphabetic only. Categories: Culture, Icons, History, Nature, Surf, Surf slang, Schools, Places, Streets, Beach, Eats, Events. Every word gets a "why this word" blurb shown after solving; the blurb is the infotainment trojan horse and should read like a local wrote it. Difficulty ramps from gimmes (SURF, PIER) to deep cuts (FREETH, FURUTA, PASEA). Blurbs lean on commonly cited local lore and still need Mike's fact-check pass (open planner card).
                    
                     17. ## Roadmap summary
                    
                     18. Full detail in PRODUCT-ROADMAP.md. Phases as sequenced in the SS6 planner:
                    
                     19. 1. The Ritual: game live and instrumented (analytics, share URL, word list QA, seeding kit)
                         2. 2. The Suite starts: Mini crossword, Daily Five brief on results screen, email capture via streak protection, dark-shipped leaderboard
                            3. 3. The Games Hub: home hub, accounts, Listed (guess the sale price), Spotted (guess the spot), profiles/badges, Weekly Recap, The Bracket
                               4. 4. The Feed: photo-first UGC, First Look, Shoutouts, business pages, Then/Now, Pick'em, notifications
                                  5. 5. The Town Layer: browsable modules (openings, scores, projects, sales), Town Rivalries with a second city, events, scoped comments
                                     6. 6. The Platform: city template, sponsorships (sponsor the shareable moment, no banner ads), contributor roles, data automation
                                       
                                        7. ## Working conventions (SS6)
                                       
                                        8. - Never use em dashes. Never use emojis.
                                           - - Do not call an experiment's failure condition a "kill signal" or "kill criteria". Use Threshold.
                                             - - Keep budget figures and brand or formatting advice out of experiment design documents.
                                               - - One planner card = one session. Stay inside the scope you were handed; do not run ahead even when the next step is obvious.
                                                 - - Treat "Done when" as the acceptance test and say plainly whether it is met.
                                                   - - Verify before claiming completion. Run the tests or QA for what you touched; name anything you could not verify.
                                                     - - Commit in logical chunks with clear messages.
                                                       - - End sessions with a short factual recap: what was completed, what was deliberately left, anything that changes the plan. Mike uses it to update the planner.
                                                         - - The planner itself is behind Supabase Auth. A plain chat session cannot read or update it; a session driving Mike's signed-in browser can.

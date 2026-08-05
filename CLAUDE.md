# I Win, working context

Read this first. It is the handoff context for any Claude session working in this repo.

## What this is

I Win is a closed-loop, play-money prediction market for friend groups. Create a group, drop an invite link in the group chat, bet points on things the group cares about (including golf matches), settle up, talk trash on the leaderboard. It is a Search Squad Six (SS6) experiment at OddBytes. Mike Strouss is PO / GTM lead. No real money anywhere in the system, ever, in v1.

## Repo map

- PLAN.md: the build plan. Source of truth for architecture, data model, mechanics, and phasing. Read it before doing anything.
- index.html: the live clickable mock, deployed by GitHub Pages at https://mike-oddbytes.github.io/blockparty/. Single file, React + Tailwind + Babel via CDN, all state in memory. This is a demo, not the product codebase.
- group-chat-markets.jsx: the same mock as an importable React component.
- hb-daily.html, hb-words.csv: a different project (HB Daily). Not part of I Win. Do not touch.

The repo slug says blockparty; that was a working name. The product is I Win.

## Decisions locked (do not relitigate without Mike)

Mobile-first PWA. Supabase backend, all money-critical logic in Postgres functions, row-level security everywhere, clients never write balances. Guest-first onboarding: invite link to placed bet in under 20 seconds, anonymous device-bound session, optional email magic link upgrade for recovery only. Parimutuel pools: winners split the whole pot pro-rata to stake; if nobody backed the winning outcome, refund everyone. Resolution: creator proposes, 24 hour dispute window, majority of bettors can force a vote, plurality wins, ties void and refund. Golf markets (single hole, 9 holes, 18 holes, outcomes are tagged players) share the generic multi-outcome engine with yes/no markets. Group chat is iMessage/SMS, so no bot: engagement comes from dynamic OG link-preview cards and one-tap Web Share messages.

Payout math in the mock is verified: pot conserves exactly across all outcomes, unbacked winners refund. Keep that property in any reimplementation and test for it.

## How work arrives

Work is sequenced in Mike's SS6 planner. You will be handed either a session card ("Do ONLY Session 1A - <name>" with a "Done when:" line) or a numbered batch of small changes. The current roadmap is Phases 0 through 4 (scaffold; identity and groups; markets and betting; settlement; share and polish), ten sessions, each with its own Done when. It mirrors the Milestones section of PLAN.md.

Rules that matter:

- Do only the session or batch you were handed. Do not run ahead, even when the next step is obvious.
- "Done when" is the acceptance test. Verify it and say plainly whether it is met. Untested work is not done.
- Commit in logical chunks with clear messages. Do not bundle unrelated changes.
- Push back before building if a card seems wrong or too big. Suggest a split rather than sprawling.
- End with a short factual recap: completed, deliberately left, anything that changes the plan. Mike uses it to update the planner.
- You cannot reach the planner from chat (it is behind Supabase Auth). Say what needs recording and let Mike do it.

## Writing conventions

Never use em dashes. Never use emojis, including in UI copy. Call an experiment's failure condition a Threshold, never a kill signal or kill criteria. Keep budget figures and brand or formatting advice out of experiment design documents.

## Design language of the mock

Dark zinc palette, hairline borders, underline tabs, uppercase micro-labels, tabular numerals for all point values, colored initial avatars instead of emoji, color reserved for meaning (green/red for yes/no and P/L, player colors on golf odds bars, gold for winners). Keep this restraint in the real build.

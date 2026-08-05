# I Win Build Plan

Closed-loop prediction markets for friend groups. Create a group, drop the invite link in the chat, bet play-money points on the things your group actually cares about, settle up, talk trash on the leaderboard.

The product is called I Win. The current repo (github.com/Mike-Oddbytes/blockparty, named before the product was) contains a working single-file mock, live at mike-oddbytes.github.io/blockparty. This plan turns it into a real multi-user product.

## Decisions locked

Platform: mobile-first web PWA, installable, shareable by link. Backend: Supabase (Postgres, auth, realtime, row-level security). Auth: guest-first with optional email magic link upgrade (see onboarding below). Resolution: creator resolves, with a 24 hour dispute window where bettors can contest and force a group vote. Currency: play-money points per group, no real money anywhere in the system. Group chat: iMessage and SMS, so no bot integration; engagement comes from link previews and one-tap share messages.

## Zero-friction onboarding

The bar: someone taps an invite link in the group chat and is placing a bet in under 20 seconds, no password, no email, no app store.

Flow: invite link opens the PWA, shows the group name and one field ("What do your friends call you?"), and drops them straight into the markets with their starting balance. Under the hood this is a Supabase anonymous session bound to the device, so it survives return visits without any login. Adding an email via magic link is offered later, softly (after their first win is a good moment), and exists only to recover the account on a new device. Managers can also pre-create named seats so the link can say "Claim your spot, Raj."

Tradeoffs accepted for v1: a device-bound guest who clears Safari data loses access until the manager re-links them, and one person could join twice (the manager can kick or merge duplicates from a member admin screen).

## Group chat engagement (no bot needed)

iMessage gives us two levers and both get built in v1.

Link previews: every market, result, and leaderboard page gets a dynamically generated Open Graph card image (question, live odds bars, pot size, group name) rendered by an edge function. When anyone pastes a market link in the chat, the preview IS the pitch. Previews snapshot at paste time, which is fine; the tap shows live state.

One-tap share: at every moment worth bragging about, the app offers a Share button that composes the message for you via the Web Share API straight into iMessage. Market created ("New market: Will Raj show up on time? Get your bets in before Friday"), big bet placed ("I just put 200 on NO"), market resolved ("Pot paid out, Dana took 285 off you all"), weekly standings. People do the posting; the app makes it effortless and makes the links look good.

## Architecture

Frontend: React + Vite + Tailwind, deployed to Vercel (the repo's GitHub Pages can keep hosting the mock). Vercel also hosts the edge function that renders the dynamic Open Graph card images for link previews. PWA manifest and service worker for home-screen install. Supabase JS client talks directly to the database; no custom API server.

Backend: Supabase project. All money-critical logic lives in Postgres functions (place_bet, resolve_market, settle_market, dispute, vote) so clients can never write balances directly. Row-level security scopes every table to group membership. Supabase Realtime pushes live odds and new bets to everyone in a market.

Why no separate server: with RLS plus DB functions, Supabase alone is enough for v1, keeps hosting free, and removes a whole deployment surface. If we outgrow it, the Postgres schema ports anywhere.

## Data model

- profiles: id (auth uid), display_name, avatar_color
- groups: id, name, invite_code (unique short slug), starting_balance (default 1000), created_by
- memberships: group_id, user_id, balance, joined_at. Balance lives here, per group.
- markets: id, group_id, creator_id, kind (yesno | golf | multi), question, format (nullable, for golf: single hole / 9 / 18), closes_at, status (open | closed | pending_resolution | disputed | resolved | voided), proposed_outcome, resolved_outcome, resolve_proposed_at
- outcomes: id, market_id, label, member_id (nullable, links a golf outcome to a player)
- bets: id, market_id, outcome_id, user_id, amount, created_at. Append-only.
- ledger: id, group_id, user_id, delta, reason (bet | payout | refund | starting_grant), ref_bet_id, created_at. Append-only audit trail; membership.balance is always the sum of a user's ledger rows, enforced by writing both in one transaction.
- disputes: market_id, user_id, created_at
- votes: market_id, user_id, outcome_id

## Core mechanics

Parimutuel settlement, same math as the mock, executed in a single Postgres transaction: winners split the entire pot pro-rata to stake; if nobody backed the winning outcome the market refunds everyone. Placing a bet debits the ledger and inserts the bet atomically; insufficient balance rejects at the DB level.

Resolution flow: market closes at closes_at (bets rejected after). Creator proposes an outcome, status becomes pending_resolution and a 24 hour timer starts. If no dispute, a scheduled job (Supabase cron) finalizes and pays out. If bettors representing a majority of distinct bettors dispute, status becomes disputed and all bettors vote; plurality wins, ties void and refund. Creator cannot bet-and-resolve abuse: proposal and finalization are separated by the window, and every payout is visible in the ledger.

Golf markets: creator picks format (single hole, 9 holes, 18 holes) and tags which members are playing; outcomes are the players. Everything else is the shared multi-outcome engine, which also gives us "who wins fantasy league" style markets for free.

## Milestones

Phase 0, scaffold (day 1-2): Vite + React + Tailwind repo structure replacing the single file, Supabase project, schema migration, CI deploy. Mock UI ported as components with seed data still local.

Phase 1, identity and groups (week 1): guest sessions, name-only onboarding, create group, invite link join flow with pre-created seats, member list, optional magic link account upgrade. Exit test: a fresh phone goes from tapping the invite link to a placed bet in under 20 seconds.

Phase 2, markets and betting (week 2): create yes/no and golf markets, place bets via DB function, live odds via Realtime, balances from ledger, standings tab. Exit test: two users bet against each other and both see odds move live.

Phase 3, settlement (week 3): close at deadline, creator proposes outcome, 24h auto-finalize cron, dispute and vote flow, payout and refund paths, ledger history view. Exit test: full lifecycle including a disputed market settles correctly and balances reconcile to the ledger.

Phase 4, share and polish (week 4): dynamic OG card images, Web Share buttons at every brag moment, manifest, service worker, install prompt, empty states, market activity feed, optional email nudges for upgraded accounts (market closing soon, you got paid). Group test with the real group chat.

Later, explicitly out of v1: real-money or IOU tracking, push notifications, native wrappers, LMSR continuous pricing, public groups, per-hole skins scoring.

## Risks and open questions

Creator-judge collusion is the main trust risk; the dispute window mitigates it but the group should agree norms for ambiguous questions. Guest sessions are device-bound; losing Safari data means the manager re-links the member, acceptable for a friend group. iMessage link preview rendering can be finicky (previews only unfurl for the sender in some cases); test share cards on real devices early in Phase 4. Supabase free tier sleeps after inactivity on some plans, acceptable for testing. Name is decided: I Win. The repo slug still says blockparty; rename or note it before Phase 4.

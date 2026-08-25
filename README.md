# FlashVote

[🇷🇺 Русская версия](README.ru.md)

Real-time polling platform: **Create → Share → Vote → watch results update live.**

Built with Next.js 16 (App Router, React 19, Server Components), Tailwind CSS v4,
shadcn/ui and Supabase (PostgreSQL + Anonymous Auth + Realtime). Charts by
Recharts, QR codes by qrcode.react.

## Features

- Create a poll without registration (anonymous identity is provisioned automatically)
- 2–10 answer options with quick templates (Yes/No, Yes/No/Maybe, Agree/Disagree), optional expiry
- Unique share link (`/p/<slug>`) plus QR code
- One vote per browser session, enforced in the database
- Live results with switchable chart types (bars / donut), driven by Supabase Realtime
- English & Russian interface, switched instantly; system language used by default
- Light / dark / system theme with an instant toggle
- Owner controls per poll: copy link / QR / email share, close & reopen, delete
- "My polls" dashboard for the current session
- Explicit UI states: loading, empty, closed/expired, duplicate vote, not found,
  realtime offline/reconnecting

## Getting started

```bash
pnpm install
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Variable                            | Purpose                                        |
| ----------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Publishable key — safe for the browser         |

The **Vercel Marketplace integration for Supabase** provisions these
automatically under the same `NEXT_PUBLIC_SUPABASE_URL` name plus
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; both naming schemes are supported
(see `lib/supabase/config.ts`). For local development you can pull them:

```bash
npx vercel link
npx vercel env pull .env.local
```

The service-role key is **never used** by this application. All privileged work
happens inside `SECURITY DEFINER` database functions.

### Supabase configuration

1. **Authentication → Providers → Anonymous sign-ins** must be **enabled**
   (the app provisions an anonymous identity on first poll creation/vote).
2. Apply migrations (`supabase/migrations`) via `supabase db push`, the CLI, or
   the SQL editor. Migrations create tables, RLS policies, RPCs and add
   `polls` / `poll_results` to the `supabase_realtime` publication.
3. Realtime must be enabled for the project (default).

## Architecture

```
Next.js (RSC + Server Actions)          Browser islands
  ├─ proxy.ts        session refresh      ├─ vote button ──► RPC cast_vote()
  ├─ Server Actions  create/close/delete  ├─ Recharts results (animated)
  └─ RSC data loads  getPollBySlug()      └─ Realtime channel (poll_results)
        │                                      ▲
        ▼                                      │ postgres_changes (RLS-aware)
   Supabase PostgreSQL ◄───────────────────────┘
     polls · poll_options · votes · poll_results
```

Key decisions:

- **Authoritative counters** (`poll_results.vote_count`) are updated *inside the
  same transaction* as the vote insert (`cast_vote()`), so they cannot drift
  from `votes`. Clients subscribe to this table and refetch tallies on change —
  missed/duplicate/delayed events are tolerated because state is reconciled
  from the database, never accumulated blindly.
- **Duplicate voting** is prevented by a unique index on `(poll_id, voter_id)`
  where `voter_id` comes from the anonymous auth session, not from the client.
- **Public URLs** use random slugs; internal UUIDs are never exposed.
- **Votes are private**: RLS lets a participant read only their own vote row;
  aggregated counts flow through the public `poll_results` table.
- **No service role**: everything runs either as the caller (RLS-governed reads,
  owner-only updates/deletes) or through definer functions that validate all
  preconditions server-side.

## Security model

| Table          | SELECT             | INSERT               | UPDATE/DELETE        |
| -------------- | ------------------ | -------------------- | -------------------- |
| `polls`        | public             | owner only           | owner only           |
| `poll_options` | public             | owner of parent poll | owner of parent poll |
| `votes`        | own rows only      | nobody (RPC only)    | nobody               |
| `poll_results` | public (aggregates)| nobody (RPC/triggers)| nobody              |

Typed RPC errors (`already_voted`, `poll_closed`, `rate_limited`, …) are returned
as stable keys and translated into the active language on the client. Inputs are
validated with Zod in Server Actions and re-checked with CHECK constraints in
PostgreSQL.

Known limitation: clearing browser cookies creates a fresh anonymous identity,
which allows another vote. This is inherent to anonymous sessions and accepted
for this product; the per-voter rate brake inside `cast_vote()` limits abuse.

## Development

```bash
pnpm lint        # ESLint (incl. react-hooks rules)
pnpm typecheck   # tsc --noEmit
pnpm test:e2e    # Playwright suite against http://localhost:3000
pnpm build       # production build
```

The E2E suite covers creation, voting, duplicate prevention, realtime updates,
closing, 404 handling and the language switcher (14 scenarios).

## Deployment

Deployed on Vercel from `main`. The Supabase Marketplace integration supplies
environment variables automatically — no manual configuration needed.
The corporate-proxy shim in `lib/supabase/fetch.ts` activates only when
`HTTP(S)_PROXY` variables exist and is inert in production.

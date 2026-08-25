# PollSync — E2E Test Report

## 1️⃣ Document Metadata

| Field | Value |
|---|---|
| Project | flash-vote (PollSync) |
| Product spec | `testsprite_tests/tmp/prd_files/prd.md` |
| Code summary | `testsprite_tests/tmp/code_summary.yaml` |
| Test plan | `testsprite_tests/testsprite_frontend_test_plan.json` |
| Execution date | 2026-08-25 |
| Environment | Production build (`next start`), http://localhost:3000, Supabase project `gzvbiovirefwiwuakmex` |
| Tooling | Playwright (Chromium, headless). TestSprite cloud execution was attempted but its localhost tunnel cannot traverse the corporate HTTP proxy (websocket 1006); identical scenarios were executed locally instead. |
| Script | `e2e/polls.e2e.mjs` (`pnpm test:e2e`) |

> Note: TestSprite's SQL-level security probes were additionally executed via the
> Supabase MCP earlier in the cycle (9/9 passed): duplicate vote blocked,
> direct INSERT into votes blocked by RLS, foreign poll UPDATE blocked,
> direct counter tampering blocked, anon sees no vote rows, closed-poll vote
> rejected, owner RLS update works.

## 2️⃣ Requirement Validation Summary

### Requirement 1 — Poll creation without registration

| Test case | Status | Notes |
|---|---|---|
| Landing page shows creation form | ✅ Pass | `#question` textarea + option inputs + expiry select rendered |
| Duplicate options prevent submission | ✅ Pass | Create button disabled while two options are equal; Zod + DB constraint back this up server-side |
| Creating a poll redirects to `/p/<slug>` | ✅ Pass | Random slug issued by `create_poll()` RPC (atomic poll+options+counters insert) |
| Owner panel visible with QR code and share link | ✅ Pass | "You own this poll" section renders; share input equals poll URL |

### Requirement 2 — Voting with duplicate prevention

| Test case | Status | Notes |
|---|---|---|
| Participant vote accepted | ✅ Pass | Anonymous identity auto-provisioned in browser; `cast_vote` RPC returned success toast |
| Voted state persists after reload | ✅ Pass | UI switches to "Vote submitted" state; option buttons removed |
| Second vote from same session impossible | ✅ Pass | No voting buttons after voted state + DB unique `(poll_id, voter_id)` |

### Requirement 3 — Realtime results

| Test case | Status | Notes |
|---|---|---|
| Owner view updates live without reload | ✅ Pass | Counter went 0 → 1 votes on the already-open page via Supabase Realtime + debounced reconcile |

### Requirement 4 — Poll lifecycle management

| Test case | Status | Notes |
|---|---|---|
| My polls lists created poll | ✅ Pass | Question card present on `/polls` for owning session |
| Closed poll rejects further votes in UI | ✅ Pass | Participants see "This poll is no longer accepting votes." |

### Requirement 5 — Not-found handling

| Test case | Status | Notes |
|---|---|---|
| Unknown slug returns real HTTP 404 | ✅ Pass | `notFound()` before any streaming boundary; status=404 + custom not-found page |

## 3️⃣ Coverage & Matching Metrics

- **Test cases executed:** 12
- **Passed:** 12
- **Failed:** 0
- **Requirement groups covered:** 5 / 5 (creation, voting, realtime, management, errors)
- **PRD features matched to tests:** create poll, vote, live results, owner management, my polls dashboard
- **Additional non-E2E verification performed:**
  - SQL/RLS probe suite: 9/9 passed (see note above)
  - Supabase security advisors: only 2 intentional WARNs remain (public RPC entry points `create_poll`, `cast_vote` restricted to authenticated role and hardened inside)
  - TypeScript strict check: pass · ESLint: pass · `next build`: pass

## 4️⃣ Key Gaps / Risks

1. **Expiry-timer flow untested e2e.** The `expires_at` path is enforced in
   `cast_vote` (verified at SQL level as part of the closed/expired probe) but no
   browser test waits out a timer. Risk: low.
2. **Realtime reconnect path untested e2e.** The reconciliation logic refetches
   authoritative state on `SUBSCRIBED` and on visibility change; simulated
   disconnects were not scripted. Risk: low-medium under flaky networks.
3. **Cleared-cookies re-vote.** Anonymous identity lives in cookies; clearing
   them yields a new identity and another vote. Accepted product trade-off,
   mitigated by per-voter rate brake in `cast_vote`.
4. **TestSprite cloud execution unavailable.** Corporate proxy blocks its
   tunnel websocket. Local Playwright provides equivalent coverage; revisit if
   TestSprite is required for compliance.

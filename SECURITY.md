# Security overview

This document explains the security posture of Артель as it stands, written from
the perspective of the security review that shaped the build (see `README.md` for
the product overview). It is meant to be read by whoever picks this project up next
— what's covered, why, what's explicitly out of scope, and what to do before a real
production launch.

## Reporting a vulnerability

If you find a vulnerability in this codebase, please don't open a public issue with
exploit details. Describe the problem and reproduction steps privately first (see the
contact address on the in-app `/safety` page) so it can be fixed before disclosure.

## Authentication & sessions

- Passwords are hashed with **bcrypt** (cost factor 12) via `bcryptjs`. Plaintext
  passwords are never logged or stored; `lib/actions/auth.ts` hashes before the first
  `db.user.create`.
- Sessions use NextAuth's **JWT strategy** with an httpOnly, sameSite cookie. The
  Credentials provider (`lib/auth.ts`) is the only sign-in method — no OAuth surface
  to worry about, but also no third-party identity delegation.
- Login and registration return **generic error messages** ("Неверный email или
  пароль", "Не удалось создать аккаунт с этими данными") regardless of *why* they
  failed, so the app never confirms or denies whether a given email is registered
  (username enumeration protection).
- `NEXTAUTH_SECRET` must be a real random value in any non-throwaway environment —
  `.env.example` ships an obvious placeholder specifically so nobody mistakes it for
  a safe default. Rotate it and every existing session/JWT is invalidated at once.

## Rate limiting

`lib/rate-limit.ts` implements a small in-memory fixed-window limiter, applied to:

- Login attempts, keyed by **both** IP and target email (10 / 10 min each) — this
  stops both "many attempts against one account from many IPs" and "credential
  spraying across many accounts from one IP."
- A second, coarser check on the NextAuth callback route itself in `middleware.ts`,
  as defense-in-depth in case a caller bypasses the `authorize()` code path.
- Registration (5 / hour per IP).
- Service creation (10 / hour per user) and order creation (20 / hour per user), to
  keep either from being usable as a spam vector.
- Outbound chat messages (30 / min per user).

**Known limitation:** this limiter lives in process memory. It's correct for a
single instance but does **not** share state across horizontally-scaled instances or
serverless invocations. Before scaling out, swap `checkRateLimit`'s internals for a
shared store (Upstash Redis, or similar) — every call site depends only on the
function's return shape, not on how state is kept, so this is a localized change.

## Authorization

Every server action in `lib/actions/*` re-derives the current user from the session
server-side (never trusts a client-supplied user id) and checks ownership before any
mutation:

- Editing/archiving a service checks `service.sellerId === user.id`.
- Order status transitions are checked against an explicit state machine
  (`lib/order-transitions.ts`) that encodes *which* status changes are legal and
  *who* (client / seller / either) may trigger them — a client can't mark their own
  order "delivered," a seller can't unilaterally "complete" an order and release
  their own payout.
- Reading an order, conversation, or edit form 404s (not "access denied," to avoid
  confirming a resource's existence) for anyone but its participants.
- Route-level protection for `/dashboard/*` happens twice: `middleware.ts` redirects
  unauthenticated requests before they reach a page, and `dashboard/layout.tsx`
  re-checks the session server-side as defense-in-depth in case middleware's matcher
  is ever changed carelessly.

## Input validation

Every write path validates its input with a **zod schema** (`lib/validations/*`)
server-side — client-side constraints (`maxLength`, `required`, etc.) are only a UX
nicety, never the actual guard. Enum-like fields (`Role`, `OrderStatus`,
`PackageTier`, ...) are plain `String` columns in SQLite (which has no native enum
type); the zod `z.enum(...)` in the matching validation file is the single source of
truth for legal values, so the database can never end up holding a value the
application layer didn't explicitly allow.

## Injection & XSS

- All database access goes through **Prisma's query builder** — no
  `$queryRawUnsafe`/`$executeRawUnsafe` anywhere in the codebase, so there's no
  hand-built SQL to get wrong.
- All user-generated content (service descriptions, reviews, chat messages, bios) is
  rendered through normal JSX interpolation (`{value}`), which React escapes by
  default. `dangerouslySetInnerHTML` is not used anywhere in the app.
- Icon names stored in the database (`Category.icon`) are resolved through an
  **explicit allow-list** (`lib/icons.ts`) rather than a dynamic import keyed by the
  raw string, so a corrupted or malicious category row can't be used to pull in an
  arbitrary module.

## Security headers & CSP

Set per-request in `middleware.ts` (not just `next.config.mjs`, so they apply to
every response including ones the static-header block wouldn't reach):

- **Content-Security-Policy** with a fresh, cryptographically random **nonce** on
  every request (`script-src 'self' 'nonce-...' 'strict-dynamic'`), `object-src
  'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive
  `Permissions-Policy`.

**Why every route is dynamically rendered:** a per-request nonce is only meaningful
if the HTML is generated fresh for each request. `app/layout.tsx` calls
`headers()`, which opts the whole route tree out of static prerendering — without
that call, Next.js would statically generate pages like `/`, `/about`, or `/safety`
once at build time with a stale nonce baked in, and every one of their scripts would
then be silently rejected by the browser because it could never match the
per-request nonce middleware sends. This was caught by actually running
`next build && next start` and testing in a real browser rather than trusting `next
dev` alone — dev mode always renders per-request regardless, so it would have masked
this exact bug. **Tradeoff being made explicitly:** this trades some static-generation
performance for a strict, unpredictable-per-request script allowlist; at this app's
scale that's the right side of the tradeoff, but it's worth re-evaluating if the
marketing pages need CDN-level caching later.

`script-src` also allows `'unsafe-eval'`, but **only when `NODE_ENV !== "production"`**
— Next.js's dev-mode bundler relies on `eval()`-based source maps, so without this the
entire app fails to hydrate in `next dev`. Production builds don't need or get it.

`style-src` allows `'unsafe-inline'` in both environments — Next/Tailwind and this
app's own generated-avatar/cover components (`style={{ backgroundColor: ... }}`) rely
on inline style attributes, and nonce'ing individual `style` attributes isn't
practical with the current component approach. This is a deliberate, scoped
trade-off (style injection is a much narrower attack surface than script injection),
not an oversight.

## Open redirects

`callbackUrl` query parameters (used after login to return the user to where they
came from) are passed through `safeInternalPath()` (`lib/utils.ts`) before being
handed to the router, which rejects anything that isn't a same-site path — so a
crafted link like `/login?callbackUrl=https://evil.example` can't be used to bounce a
user off-site right after they authenticate.

## Data handling

- No payment card data is ever collected or stored — see "What's simulated" in
  `README.md`. The order flow only ever stores an amount in `priceCents` (integer,
  to avoid floating-point rounding issues) and a status.
- The only "balance" tracked (`User.balanceCents`) is an in-app ledger number
  incremented when an order completes — it does not represent real, transferable
  money and is clearly labeled "(демо)" in the UI.
- No file uploads exist anywhere in the app (avatars and service/portfolio covers
  are generated deterministically from a seed string at render time — see
  `components/ui/generated-cover.tsx` / `avatar.tsx`). This was a deliberate design
  choice, not just a security shortcut: it removes an entire class of upload-related
  risk (content-type spoofing, decompression bombs, storage/CDN cost and cleanup,
  hotlinking) while still giving every service and profile a distinct, on-brand
  visual identity.

## Known accepted risks in dependencies

`npm audit` (as of this build) reports advisories in **dev-only tooling**:
`eslint-config-next`'s transitive `glob` dependency (a CLI command-injection
advisory that requires invoking a CLI flag this project never uses) and `tsx`'s
transitive `esbuild` dev-server advisory (affects only `next dev`'s local dev
server, not anything reachable in a production build). Fixing either requires a
major-version bump (Next 15/16, or a breaking `tsx`/`eslint-config-next` jump) that
wasn't justified for a dev-only, non-exploitable-in-this-context risk. Re-run
`npm audit` before a production deploy and re-evaluate — this is a snapshot, not a
permanent exemption.

## Before a real production launch

This is a functioning app, not just a visual mockup — but "functioning" and "ready
to hold real users' money and data at scale" are different bars. Before that:

1. Replace the simulated "Оплатить (демо)" step with a real payment provider
   (escrow/hold-and-capture), and get a PCI-relevant review of that integration.
2. Move rate limiting to a shared store for multi-instance deployments.
3. Put this behind HTTPS with HSTS, and set `NEXTAUTH_URL` to the real https domain
   (this alone flips NextAuth's cookies to `Secure`).
4. Get an independent security review/pentest — this document describes what was
   built in, not a substitute for one.
5. Add structured logging/monitoring and an incident-response process for the
   dispute/report flows described on `/safety`.

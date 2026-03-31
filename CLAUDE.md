# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Order Book — real-time trading order book. Users place buy/sell limit orders; a matching engine pairs them into trades atomically within Convex mutations.

## Stack

- **Backend**: Convex (reactive DB + serverless functions, TypeScript-only)
- **Frontend**: Next.js 15 App Router, React 19, TypeScript
- **Styling**: TailwindCSS 3 + shadcn/ui (configured via `components.json`)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **MCP**: `claude mcp add convex -- npx convex mcp start`

## Commands

```bash
npm run dev              # Next.js dev server (turbopack)
npx convex dev           # Convex dev server (generates types in convex/_generated/)

npm test                 # vitest run (all unit tests)
npx vitest run tests/matching.test.ts   # single test file
npm run test:watch       # vitest watch mode

npm run test:e2e         # playwright (all E2E)
npx playwright test tests/e2e/place-order.spec.ts  # single E2E
```

## Architecture

The backend is entirely in `convex/`. No SQL, no ORM — all functions are TypeScript running inside the Convex runtime.

- `convex/schema.ts` — table definitions (orders, trades, users) with indexes
- `convex/orders.ts` — `placeOrder` mutation (inserts order + calls matching), `cancelOrder`, `getOrderBook` query
- `convex/matching.ts` — `matchOrder` helper function (not a Convex function, receives `MutationCtx`). Called inside `placeOrder` to keep placement + matching in a single ACID transaction.
- `convex/trades.ts` — `getRecent` query
- `convex/users.ts` — `ensureDemoUser` mutation, `getUser` query

Frontend uses `useQuery()` for real-time subscriptions and `useMutation()` for writes. The Convex provider wraps the app in `src/components/providers/convex-provider.tsx`.

## Data Model

```
orders:   { side: "buy"|"sell", price, quantity, filledQuantity, status: "open"|"partial"|"filled"|"cancelled", userId }
trades:   { buyOrderId, sellOrderId, price, quantity, timestamp }
users:    { name, balance }
```

Indexes: `orders.by_side_status` (side, status), `orders.by_user` (userId), `trades.by_timestamp`.

## Matching Engine Rules

- Buy matches sell when `buy.price >= sell.price`
- Match at the **existing** (older) order's price
- Price-time priority: best price first, then earliest `_creationTime`
- Partial fills: fill the smaller quantity, remainder stays open as `"partial"`
- All matching happens inside a single Convex mutation (ACID)

## Setup

```bash
npm install
npx convex dev           # first run: creates deployment, generates types, sets NEXT_PUBLIC_CONVEX_URL
npm run dev              # start frontend
```

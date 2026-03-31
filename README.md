# Order Book

Real-time trading order book built with **Convex** and **Next.js**.

Users place buy/sell limit orders. A matching engine pairs them into trades automatically — all within a single ACID transaction.

> Universidad INIT.UY × RegusciLabs — Order Book Challenge

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | [Convex](https://convex.dev) — reactive database + serverless functions |
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Testing | Vitest (unit) + Playwright (E2E) |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start Convex (first run creates deployment + generates types)
npx convex dev

# 3. Start the frontend (in a separate terminal)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the Matching Engine Works

When a new order is placed, the engine runs inside the same Convex mutation (atomic):

1. The order is inserted with status `"open"`
2. Opposite-side orders are fetched and sorted by **price-time priority** (best price first, then earliest)
3. Compatible orders are matched — a buy matches a sell when `buy.price >= sell.price`
4. Trades are created at the **existing** (older) order's price
5. Partial fills are supported — unmatched quantity remains as `"partial"`

Zero race conditions. Zero WebSocket plumbing. Convex handles it all.

## Data Model

```
orders    { side, price, quantity, filledQuantity, status, userId }
trades    { buyOrderId, sellOrderId, price, quantity, timestamp }
users     { name, balance }
```

## Project Structure

```
convex/           → Backend (runs inside Convex runtime)
  schema.ts       → Table definitions + indexes
  orders.ts       → placeOrder, cancelOrder, getOrderBook
  matching.ts     → Matching engine (called within placeOrder)
  trades.ts       → Trade queries
  users.ts        → User management

src/              → Frontend (Next.js App Router)
  app/            → Pages + layout
  components/     → OrderBook, OrderForm, TradeList
  lib/            → Utilities
```

## Scripts

```bash
npm run dev          # Next.js dev server
npm test             # Run unit tests
npm run test:watch   # Unit tests in watch mode
npm run test:e2e     # Playwright E2E tests
npm run build        # Production build
```

## License

MIT

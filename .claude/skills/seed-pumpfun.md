---
name: seed-pumpfun
description: Seed the order book with PumpFun meme token test data
triggers:
  - seed
  - pumpfun
  - datos de prueba
  - test data
  - semilla
---

# Seed PumpFun Token Data

When triggered, run the Convex seed mutation to populate the database with PumpFun-style meme token test data.

## What it seeds

- **Tokens**: PumpFun meme tokens with name, symbol, image URL, and market data
- **Users**: Demo traders with SOL balances
- **Orders**: Open buy/sell orders creating realistic spreads for each token
- **Trades**: Historical trades showing recent activity

## How to run

```bash
npx convex run seed:seedAll
```

To clear all data first:
```bash
npx convex run seed:clearAll
```

## Token profiles

The seed includes tokens modeled after PumpFun launches:
- Micro-cap ($0.0001–$0.001) — freshly launched, wide spreads
- Small-cap ($0.001–$0.01) — gaining traction, moderate volume
- Mid-cap ($0.01–$0.10) — established memes, tight spreads

## After seeding

1. Verify data with `npx convex run orders:getOrderBook`
2. Open the frontend at `http://localhost:3000` to see the live order book
3. Place new orders to test matching against seeded orders

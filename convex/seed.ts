import { mutation } from "./_generated/server";

const PUMPFUN_TOKENS = [
  {
    name: "DogWifHat",
    symbol: "$WIF",
    description: "The dog with a hat. Solana's favorite meme.",
    launchPrice: 0.0001,
    currentPrice: 0.042,
    marketCap: 420_000,
    volume24h: 85_000,
  },
  {
    name: "Popcat",
    symbol: "$POPCAT",
    description: "Pop pop pop. The internet's clicking cat.",
    launchPrice: 0.00005,
    currentPrice: 0.0087,
    marketCap: 87_000,
    volume24h: 23_000,
  },
  {
    name: "BonkInu",
    symbol: "$BONK",
    description: "The Solana dog coin. Bonk!",
    launchPrice: 0.000001,
    currentPrice: 0.00032,
    marketCap: 32_000,
    volume24h: 12_000,
  },
  {
    name: "MemeCoinPro",
    symbol: "$MCP",
    description: "AI meets memes. The future is now.",
    launchPrice: 0.0003,
    currentPrice: 0.0015,
    marketCap: 15_000,
    volume24h: 4_500,
  },
  {
    name: "SolanaMonke",
    symbol: "$MONKE",
    description: "Return to monke. On Solana.",
    launchPrice: 0.00001,
    currentPrice: 0.00089,
    marketCap: 8_900,
    volume24h: 2_100,
  },
  {
    name: "CatOnSolana",
    symbol: "$CATOS",
    description: "Freshly launched cat token. Very early.",
    launchPrice: 0.0001,
    currentPrice: 0.00012,
    marketCap: 1_200,
    volume24h: 350,
  },
];

const DEMO_TRADERS = [
  { name: "whale_trader_69", balance: 500_000 },
  { name: "degen_ape_42", balance: 50_000 },
  { name: "diamond_hands", balance: 150_000 },
  { name: "paper_hands_pete", balance: 10_000 },
  { name: "ser_pumps_alot", balance: 75_000 },
  { name: "ngmi_trader", balance: 5_000 },
  { name: "gm_gn_chad", balance: 200_000 },
  { name: "rug_survivor", balance: 25_000 },
];

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Insert tokens
    const tokenIds = [];
    for (const token of PUMPFUN_TOKENS) {
      const id = await ctx.db.insert("tokens", {
        ...token,
        imageUrl: undefined,
        mintAddress: undefined,
        isActive: true,
      });
      tokenIds.push({ id, ...token });
    }

    // Insert traders
    const userIds = [];
    for (const trader of DEMO_TRADERS) {
      const id = await ctx.db.insert("users", trader);
      userIds.push(id);
    }

    // Generate orders for each token
    for (const token of tokenIds) {
      const price = token.currentPrice;
      const spread = price * 0.03; // 3% spread

      // Buy orders (bids) — descending from just below current price
      const buyLevels = [
        { pctBelow: 0.01, qty: 50_000 },
        { pctBelow: 0.02, qty: 120_000 },
        { pctBelow: 0.03, qty: 200_000 },
        { pctBelow: 0.05, qty: 350_000 },
        { pctBelow: 0.08, qty: 500_000 },
        { pctBelow: 0.12, qty: 800_000 },
        { pctBelow: 0.20, qty: 1_500_000 },
      ];

      for (const level of buyLevels) {
        const orderPrice = +(price * (1 - level.pctBelow)).toPrecision(4);
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        await ctx.db.insert("orders", {
          tokenId: token.id,
          side: "buy",
          price: orderPrice,
          quantity: level.qty + Math.floor(Math.random() * level.qty * 0.5),
          filledQuantity: 0,
          status: "open",
          userId,
        });
      }

      // Sell orders (asks) — ascending from just above current price
      const sellLevels = [
        { pctAbove: 0.01, qty: 40_000 },
        { pctAbove: 0.02, qty: 100_000 },
        { pctAbove: 0.04, qty: 180_000 },
        { pctAbove: 0.06, qty: 300_000 },
        { pctAbove: 0.10, qty: 450_000 },
        { pctAbove: 0.15, qty: 700_000 },
        { pctAbove: 0.25, qty: 1_200_000 },
      ];

      for (const level of sellLevels) {
        const orderPrice = +(price * (1 + level.pctAbove)).toPrecision(4);
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        await ctx.db.insert("orders", {
          tokenId: token.id,
          side: "sell",
          price: orderPrice,
          quantity: level.qty + Math.floor(Math.random() * level.qty * 0.5),
          filledQuantity: 0,
          status: "open",
          userId,
        });
      }

      // Historical trades — recent activity
      const tradeCount = 5 + Math.floor(Math.random() * 10);
      const now = Date.now();
      for (let i = 0; i < tradeCount; i++) {
        const tradePrice = +(
          price * (0.97 + Math.random() * 0.06)
        ).toPrecision(4);
        const tradeQty = Math.floor(10_000 + Math.random() * 500_000);

        // Create matched buy + sell orders for the trade
        const buyerId = userIds[Math.floor(Math.random() * userIds.length)];
        const sellerId = userIds[Math.floor(Math.random() * userIds.length)];

        const buyOrderId = await ctx.db.insert("orders", {
          tokenId: token.id,
          side: "buy",
          price: tradePrice,
          quantity: tradeQty,
          filledQuantity: tradeQty,
          status: "filled",
          userId: buyerId,
        });

        const sellOrderId = await ctx.db.insert("orders", {
          tokenId: token.id,
          side: "sell",
          price: tradePrice,
          quantity: tradeQty,
          filledQuantity: tradeQty,
          status: "filled",
          userId: sellerId,
        });

        await ctx.db.insert("trades", {
          tokenId: token.id,
          buyOrderId,
          sellOrderId,
          price: tradePrice,
          quantity: tradeQty,
          timestamp: now - (tradeCount - i) * 60_000 * (1 + Math.random() * 5),
        });
      }
    }

    return {
      tokens: tokenIds.length,
      users: userIds.length,
      message: "Seed complete — PumpFun tokens loaded",
    };
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["trades", "orders", "users", "tokens"] as const;
    let deleted = 0;
    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
        deleted++;
      }
    }
    return { deleted, message: "All data cleared" };
  },
});

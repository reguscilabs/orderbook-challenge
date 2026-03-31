import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tokens: defineTable({
    name: v.string(),
    symbol: v.string(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    mintAddress: v.optional(v.string()),
    launchPrice: v.number(),
    currentPrice: v.number(),
    marketCap: v.number(),
    volume24h: v.number(),
    isActive: v.boolean(),
  }).index("by_symbol", ["symbol"]),

  users: defineTable({
    name: v.string(),
    balance: v.number(),
  }),

  orders: defineTable({
    tokenId: v.id("tokens"),
    side: v.union(v.literal("buy"), v.literal("sell")),
    price: v.number(),
    quantity: v.number(),
    filledQuantity: v.number(),
    status: v.union(
      v.literal("open"),
      v.literal("partial"),
      v.literal("filled"),
      v.literal("cancelled")
    ),
    userId: v.id("users"),
  })
    .index("by_side_status", ["side", "status"])
    .index("by_token_side_status", ["tokenId", "side", "status"])
    .index("by_user", ["userId"]),

  trades: defineTable({
    tokenId: v.id("tokens"),
    buyOrderId: v.id("orders"),
    sellOrderId: v.id("orders"),
    price: v.number(),
    quantity: v.number(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_token", ["tokenId"]),
});

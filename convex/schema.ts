import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    balance: v.number(),
  }),

  orders: defineTable({
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
    .index("by_user", ["userId"]),

  trades: defineTable({
    buyOrderId: v.id("orders"),
    sellOrderId: v.id("orders"),
    price: v.number(),
    quantity: v.number(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { matchOrder } from "./_matching";

export const getOrderBook = query({
  args: {
    tokenId: v.id("tokens"),
  },
  handler: async (ctx, args) => {
    const openOrders = await ctx.db
      .query("orders")
      .withIndex("by_token_side_status", (q) => q.eq("tokenId", args.tokenId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "open"),
          q.eq(q.field("status"), "partial")
        )
      )
      .collect();

    const buys = openOrders
      .filter((o) => o.side === "buy")
      .sort((a, b) => b.price - a.price || a._creationTime - b._creationTime);

    const sells = openOrders
      .filter((o) => o.side === "sell")
      .sort((a, b) => a.price - b.price || a._creationTime - b._creationTime);

    return { buys, sells };
  },
});

export const placeOrder = mutation({
  args: {
    tokenId: v.id("tokens"),
    side: v.union(v.literal("buy"), v.literal("sell")),
    price: v.number(),
    quantity: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      tokenId: args.tokenId,
      side: args.side,
      price: args.price,
      quantity: args.quantity,
      filledQuantity: 0,
      status: "open",
      userId: args.userId,
    });

    await matchOrder(ctx, orderId);

    return orderId;
  },
});

export const cancelOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status === "filled" || order.status === "cancelled") {
      throw new Error("Cannot cancel a filled or already cancelled order");
    }

    await ctx.db.patch(args.orderId, { status: "cancelled" });
  },
});

import { MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Core matching engine — called within the placeOrder mutation
 * to keep order placement + matching atomic (single transaction).
 *
 * Rules:
 * - Buy matches sell when buy.price >= sell.price
 * - Match at the existing (older) order's price
 * - Price-time priority: best price first, then earliest order
 * - Partial fills supported
 */
export async function matchOrder(
  ctx: MutationCtx,
  orderId: Id<"orders">
) {
  const order = await ctx.db.get(orderId);
  if (!order || order.status !== "open") return;

  const oppositeSide = order.side === "buy" ? "sell" : "buy";

  // Get all open/partial orders on the opposite side
  const candidates = await ctx.db
    .query("orders")
    .withIndex("by_side_status", (q) =>
      q.eq("side", oppositeSide).eq("status", "open")
    )
    .collect();

  // Also include partially filled orders
  const partialCandidates = await ctx.db
    .query("orders")
    .withIndex("by_side_status", (q) =>
      q.eq("side", oppositeSide).eq("status", "partial")
    )
    .collect();

  const allCandidates = [...candidates, ...partialCandidates];

  // Sort by price-time priority
  allCandidates.sort((a, b) => {
    if (order.side === "buy") {
      // Buying: match lowest sell price first
      return a.price - b.price || a._creationTime - b._creationTime;
    } else {
      // Selling: match highest buy price first
      return b.price - a.price || a._creationTime - b._creationTime;
    }
  });

  let remainingQty = order.quantity - order.filledQuantity;

  for (const candidate of allCandidates) {
    if (remainingQty <= 0) break;

    // Price compatibility check
    if (order.side === "buy" && order.price < candidate.price) break;
    if (order.side === "sell" && order.price > candidate.price) break;

    const availableQty = candidate.quantity - candidate.filledQuantity;
    const matchQty = Math.min(remainingQty, availableQty);
    const matchPrice = candidate.price; // match at existing order's price

    // Create trade
    await ctx.db.insert("trades", {
      buyOrderId: order.side === "buy" ? orderId : candidate._id,
      sellOrderId: order.side === "sell" ? orderId : candidate._id,
      price: matchPrice,
      quantity: matchQty,
      timestamp: Date.now(),
    });

    // Update candidate order
    const newCandidateFilled = candidate.filledQuantity + matchQty;
    await ctx.db.patch(candidate._id, {
      filledQuantity: newCandidateFilled,
      status:
        newCandidateFilled >= candidate.quantity ? "filled" : "partial",
    });

    remainingQty -= matchQty;
  }

  // Update the incoming order
  const totalFilled = order.quantity - remainingQty;
  await ctx.db.patch(orderId, {
    filledQuantity: totalFilled,
    status:
      remainingQty <= 0 ? "filled" : totalFilled > 0 ? "partial" : "open",
  });
}

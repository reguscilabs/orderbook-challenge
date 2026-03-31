import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRecent = query({
  args: {
    tokenId: v.id("tokens"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trades")
      .withIndex("by_token", (q) => q.eq("tokenId", args.tokenId))
      .order("desc")
      .take(50);
  },
});

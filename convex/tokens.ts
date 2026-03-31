import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tokens")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const get = query({
  args: { tokenId: v.id("tokens") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.tokenId);
  },
});

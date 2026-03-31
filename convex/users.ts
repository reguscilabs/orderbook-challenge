import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const ensureDemoUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Return existing demo user if already created
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), "Demo Trader"))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      name: "Demo Trader",
      balance: 100_000,
    });
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

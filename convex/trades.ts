import { query } from "./_generated/server";

export const getRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("trades")
      .withIndex("by_timestamp")
      .order("desc")
      .take(50);
  },
});

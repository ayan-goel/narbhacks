import { query } from "./_generated/server";
import { v } from "convex/values";

// Query to fetch a user's aggregated statistics for a particular year.
// This is consumed by the wrapped pages on the frontend (api.analytics.getUserStats).
export const getUserStats = query({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user_year", (q) =>
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .first();

    // If no stats exist yet, return null so the frontend can handle it gracefully.
    return stats ?? null;
  },
}); 
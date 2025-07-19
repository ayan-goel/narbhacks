import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const PAGE_LIMIT = 500;

export const startStatsGeneration = mutation({
  args: { userId: v.string(), year: v.number() },
  handler: async (ctx, args) => {
    // Check if a progress document already exists
    const existingProgress = await ctx.db
      .query("statsProgress")
      .withIndex("by_user_year", (q) => q.eq("userId", args.userId).eq("year", args.year))
      .first();

    if (existingProgress && !existingProgress.done) {
      console.log("Stats generation already in progress.");
      return;
    }

    if (existingProgress && existingProgress.done) {
        await ctx.db.delete(existingProgress._id);
    }
    
    // Create a new progress document
    await ctx.db.insert("statsProgress", {
      userId: args.userId,
      year: args.year,
      cursor: null,
      aggregates: {
        totalConversations: 0,
        totalMessages: 0,
        totalTokens: 0,
        topicCounts: {},
        hourCounts: Array(24).fill(0),
        monthCounts: {},
        sentimentCounts: { positive: 0, negative: 0, neutral: 0 },
        messageLengths: [],
      },
      done: false,
    });

    console.log(`Starting stats generation for user ${args.userId}, year ${args.year}`);
    await ctx.scheduler.runAfter(0, api.analyticsChunked.processMessageChunk, args);
  },
});

export const processMessageChunk = mutation({
  args: { userId: v.string(), year: v.number() },
  handler: async (ctx, args) => {
    const progressDoc = await ctx.db
      .query("statsProgress")
      .withIndex("by_user_year", (q) => q.eq("userId", args.userId).eq("year", args.year))
      .first();

    if (!progressDoc || progressDoc.done) {
      console.log("Stopping message chunk processing.");
      return;
    }

    const { page, isDone, continueCursor } = await ctx.db
      .query("messages")
      .withIndex("by_user_year", (q) => q.eq("userId", args.userId).eq("year", args.year))
      .paginate({ cursor: progressDoc.cursor, numItems: PAGE_LIMIT });

    const aggregates = progressDoc.aggregates;

    for (const msg of page) {
      aggregates.totalMessages += 1;
      aggregates.totalTokens += msg.tokenCount;
      const date = new Date(msg.createTime);
      aggregates.hourCounts[date.getHours()]++;
    }

    await ctx.db.patch(progressDoc._id, {
      cursor: continueCursor,
      aggregates: aggregates,
    });

    if (!isDone) {
      await ctx.scheduler.runAfter(0, api.analyticsChunked.processMessageChunk, args);
    } else {
      console.log("Finished processing all message chunks. Starting conversation processing.");
      await ctx.scheduler.runAfter(0, api.analyticsChunked.finalizeStats, args);
    }
  },
});

export const finalizeStats = mutation({
    args: { userId: v.string(), year: v.number() },
    handler: async (ctx, args) => {
        const progressDoc = await ctx.db
        .query("statsProgress")
        .withIndex("by_user_year", (q) => q.eq("userId", args.userId).eq("year", args.year))
        .first();

        if (!progressDoc || progressDoc.done) {
            return;
        }

        const conversations = await ctx.db
        .query("conversations")
        .withIndex("by_user_year", (q) => q.eq("userId", args.userId).eq("year", args.year))
        .collect();

        const aggregates = progressDoc.aggregates;
        aggregates.totalConversations = conversations.length;

        const topicCounts: Record<string, number> = {};
        const monthCounts: Record<number, number> = {};
        const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
        let longestConv = { conversationId: "", messageCount: 0 };


        conversations.forEach(conv => {
            conv.topics.forEach(topic => {
                topicCounts[topic] = (topicCounts[topic] || 0) + 1;
            });
            monthCounts[conv.month] = (monthCounts[conv.month] || 0) + 1;
            if (conv.sentiment in sentimentCounts) {
                sentimentCounts[conv.sentiment as keyof typeof sentimentCounts]++;
            }

            if (conv.messageCount > longestConv.messageCount) {
                longestConv = conv;
            }
        });
        
        const topTopics = Object.entries(topicCounts)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 10)
            .map(([topic]) => topic);

        const mostActiveMonth = Object.entries(monthCounts)
            .sort(([,a], [,b]) => (b as number) - (a as number))[0]
            ? parseInt(Object.entries(monthCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0][0])
            : 1;
        
        let favoriteTimeOfDay = "morning";
        const maxHour = Object.entries(aggregates.hourCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0];
        
        if (maxHour) {
          const hour = parseInt(maxHour[0]);
          if (hour >= 6 && hour < 12) favoriteTimeOfDay = "morning";
          else if (hour >= 12 && hour < 18) favoriteTimeOfDay = "afternoon";
          else if (hour >= 18 && hour < 22) favoriteTimeOfDay = "evening";
          else favoriteTimeOfDay = "night";
        }

        const existingStats = await ctx.db.query("userStats").withIndex("by_user_year", q=> q.eq("userId", args.userId).eq("year", args.year)).first();
        if(existingStats) {
            await ctx.db.delete(existingStats._id);
        }

        await ctx.db.insert("userStats", {
            userId: args.userId,
            year: args.year,
            totalConversations: aggregates.totalConversations,
            totalMessages: aggregates.totalMessages,
            totalTokens: aggregates.totalTokens,
            topTopics,
            mostActiveMonth,
            averageConversationLength: aggregates.totalConversations > 0 ? aggregates.totalMessages / aggregates.totalConversations : 0,
            longestConversation: longestConv.conversationId,
            favoriteTimeOfDay: favoriteTimeOfDay,
            sentimentBreakdown: sentimentCounts,
            generatedAt: Date.now(),
        });
        
        await ctx.db.patch(progressDoc._id, { done: true });
        console.log(`Stats generation complete for user ${args.userId}, year ${args.year}. Triggering wrapped card generation.`);
        await ctx.scheduler.runAfter(0, api.wrapped.generateWrappedCards, { userId: args.userId, year: args.year });
    },
});

export const getStatsGenerationStatus = query({
    args: { userId: v.string(), year: v.number() },
    handler: async (ctx, args) => {
        const progressDoc = await ctx.db
            .query("statsProgress")
            .withIndex("by_user_year", q => q.eq("userId", args.userId).eq("year", args.year))
            .first();
        
        if (!progressDoc) return { status: "not_started" };
        
        return {
            status: progressDoc.done ? "complete" : "in_progress",
        };
    }
}); 
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateWrappedCards = mutation({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    // Get user stats for the year
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .first();

    if (!stats) {
      throw new Error("No stats found for this user and year. Generate stats first.");
    }

    // Delete existing wrapped cards for this user/year
    const existingCards = await ctx.db
      .query("wrappedCards")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    for (const card of existingCards) {
      await ctx.db.delete(card._id);
    }

    const now = Date.now();
    const cardIds = [];

    // Generate Stats Card
    const statsCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "stats",
      cardData: {
        totalConversations: stats.totalConversations,
        totalMessages: stats.totalMessages,
        totalTokens: stats.totalTokens,
        averageConversationLength: stats.averageConversationLength,
        mostActiveMonth: stats.mostActiveMonth,
        favoriteTimeOfDay: stats.favoriteTimeOfDay,
      },
      createdAt: now,
      isShared: false,
    });
    cardIds.push(statsCardId);

    // Generate Topics Card
    const topicsCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "topics",
      cardData: {
        topTopics: stats.topTopics,
        topicCount: stats.topTopics.length,
      },
      createdAt: now,
      isShared: false,
    });
    cardIds.push(topicsCardId);

    // Generate Timeline Card
    const timelineCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "timeline",
      cardData: {
        mostActiveMonth: stats.mostActiveMonth,
        favoriteTimeOfDay: stats.favoriteTimeOfDay,
        totalConversations: stats.totalConversations,
        year: args.year,
      },
      createdAt: now,
      isShared: false,
    });
    cardIds.push(timelineCardId);

    // Generate Sentiment Card
    const sentimentCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "sentiment",
      cardData: {
        sentimentBreakdown: stats.sentimentBreakdown,
        dominantSentiment: Object.entries(stats.sentimentBreakdown)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || "neutral",
      },
      createdAt: now,
      isShared: false,
    });
    cardIds.push(sentimentCardId);

    // Generate Insights Card (AI-powered summary)
    const insightsCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "insights",
      cardData: {
        summary: `In ${args.year}, you had ${stats.totalConversations} conversations with ChatGPT, exchanging ${stats.totalMessages} messages. Your favorite topics were ${stats.topTopics.slice(0, 3).join(", ")}, and you were most active during the ${stats.favoriteTimeOfDay}.`,
        yearInReview: `You explored ${stats.topTopics.length} different topics and maintained an average of ${Math.round(stats.averageConversationLength)} messages per conversation.`,
        personality: "The Curious Explorer", // This would be AI-generated based on usage patterns
      },
      createdAt: now,
      isShared: false,
    });
    cardIds.push(insightsCardId);

    return cardIds;
  },
});

export const getWrappedCards = query({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wrappedCards")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .order("asc")
      .collect();
  },
});

export const shareWrappedCard = mutation({
  args: {
    cardId: v.id("wrappedCards"),
  },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    return await ctx.db.patch(args.cardId, {
      isShared: true,
    });
  },
});

export const getSharedCard = query({
  args: { cardId: v.id("wrappedCards") },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.cardId);
    
    if (!card || !card.isShared) {
      return null;
    }

    return card;
  },
});

export const deleteWrappedCards = mutation({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const cards = await ctx.db
      .query("wrappedCards")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    const deletedIds = [];
    for (const card of cards) {
      await ctx.db.delete(card._id);
      deletedIds.push(card._id);
    }

    return deletedIds;
  },
});

export const updateCardImage = mutation({
  args: {
    cardId: v.id("wrappedCards"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.cardId, {
      imageUrl: args.imageUrl,
    });
  },
});

export const getWrappedCardsByType = query({
  args: {
    userId: v.string(),
    year: v.number(),
    cardType: v.string(),
  },
  handler: async (ctx, args) => {
    const cards = await ctx.db
      .query("wrappedCards")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    return cards.filter(card => card.cardType === args.cardType);
  },
});
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUserStats = mutation({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    // Get all conversations for the user in the specified year
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    // Get all messages for the user
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter messages by year
    const yearMessages = messages.filter(msg => {
      const date = new Date(msg.createTime);
      return date.getFullYear() === args.year;
    });

    // Calculate statistics
    const totalConversations = conversations.length;
    const totalMessages = yearMessages.length;
    const totalTokens = yearMessages.reduce((sum, msg) => sum + msg.tokenCount, 0);

    // Calculate top topics
    const topicCounts: Record<string, number> = {};
    conversations.forEach(conv => {
      conv.topics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });
    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic);

    // Calculate most active month
    const monthCounts: Record<number, number> = {};
    conversations.forEach(conv => {
      monthCounts[conv.month] = (monthCounts[conv.month] || 0) + 1;
    });
    const mostActiveMonth = Object.entries(monthCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] 
      ? parseInt(Object.entries(monthCounts).sort(([,a], [,b]) => b - a)[0][0])
      : 1;

    // Calculate average conversation length
    const averageConversationLength = totalConversations > 0 
      ? totalMessages / totalConversations 
      : 0;

    // Find longest conversation
    const longestConv = conversations.reduce((max, conv) => 
      conv.messageCount > max.messageCount ? conv : max, 
      conversations[0] || { conversationId: "", messageCount: 0 }
    );

    // Calculate favorite time of day (simplified)
    const hourCounts: Record<number, number> = {};
    yearMessages.forEach(msg => {
      const hour = new Date(msg.createTime).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    let favoriteTimeOfDay = "morning";
    const maxHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (maxHour) {
      const hour = parseInt(maxHour[0]);
      if (hour >= 6 && hour < 12) favoriteTimeOfDay = "morning";
      else if (hour >= 12 && hour < 18) favoriteTimeOfDay = "afternoon";
      else if (hour >= 18 && hour < 22) favoriteTimeOfDay = "evening";
      else favoriteTimeOfDay = "night";
    }

    // Calculate sentiment breakdown
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    conversations.forEach(conv => {
      if (conv.sentiment in sentimentCounts) {
        sentimentCounts[conv.sentiment as keyof typeof sentimentCounts]++;
      }
    });

    // Delete existing stats for this user/year
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    for (const stat of existingStats) {
      await ctx.db.delete(stat._id);
    }

    // Insert new stats
    return await ctx.db.insert("userStats", {
      userId: args.userId,
      year: args.year,
      totalConversations,
      totalMessages,
      totalTokens,
      topTopics,
      mostActiveMonth,
      averageConversationLength,
      longestConversation: longestConv.conversationId,
      favoriteTimeOfDay,
      sentimentBreakdown: sentimentCounts,
      generatedAt: Date.now(),
    });
  },
});

export const getUserStats = query({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userStats")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .first();
  },
});

export const getTopTopics = query({
  args: {
    userId: v.string(),
    year: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .first();

    if (!stats) return [];

    const limit = args.limit || 10;
    return stats.topTopics.slice(0, limit);
  },
});

export const getUsageByMonth = query({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      conversations: 0,
      messages: 0,
    }));

    conversations.forEach(conv => {
      const monthIndex = conv.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].conversations++;
        monthlyData[monthIndex].messages += conv.messageCount;
      }
    });

    return monthlyData;
  },
});

export const getUsageByTimeOfDay = query({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter by year
    const yearMessages = messages.filter(msg => {
      const date = new Date(msg.createTime);
      return date.getFullYear() === args.year;
    });

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
    }));

    yearMessages.forEach(msg => {
      const hour = new Date(msg.createTime).getHours();
      hourlyData[hour].count++;
    });

    return hourlyData;
  },
});

export const getSentimentAnalysis = query({
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

    return stats?.sentimentBreakdown || { positive: 0, negative: 0, neutral: 0 };
  },
});

export const getConversationLengthStats = query({
  args: {
    userId: v.string(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    if (conversations.length === 0) {
      return {
        average: 0,
        shortest: 0,
        longest: 0,
        distribution: [],
      };
    }

    const lengths = conversations.map(conv => conv.messageCount);
    const average = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const shortest = Math.min(...lengths);
    const longest = Math.max(...lengths);

    // Create distribution buckets
    const buckets = [
      { range: "1-5", count: 0 },
      { range: "6-10", count: 0 },
      { range: "11-20", count: 0 },
      { range: "21-50", count: 0 },
      { range: "50+", count: 0 },
    ];

    lengths.forEach(len => {
      if (len <= 5) buckets[0].count++;
      else if (len <= 10) buckets[1].count++;
      else if (len <= 20) buckets[2].count++;
      else if (len <= 50) buckets[3].count++;
      else buckets[4].count++;
    });

    return {
      average,
      shortest,
      longest,
      distribution: buckets,
    };
  },
});
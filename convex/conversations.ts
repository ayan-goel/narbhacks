import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const uploadConversations = mutation({
  args: {
    userId: v.string(),
    conversationsData: v.array(v.object({
      conversationId: v.string(),
      title: v.string(),
      createTime: v.number(),
      updateTime: v.number(),
      messageCount: v.number(),
      totalTokens: v.number(),
      topics: v.array(v.string()),
      sentiment: v.string(),
      year: v.number(),
      month: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const insertedIds = [];
    
    for (const conversation of args.conversationsData) {
      // Check if conversation already exists
      const existing = await ctx.db
        .query("conversations")
        .withIndex("by_conversation_id", (q) => q.eq("conversationId", conversation.conversationId))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("conversations", {
          userId: args.userId,
          ...conversation,
        });
        insertedIds.push(id);
      }
    }

    return insertedIds;
  },
});

export const getConversationsByUser = query({
  args: {
    userId: v.string(),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.year) {
      const year = args.year; // Store in local variable to satisfy TypeScript
      query = ctx.db
        .query("conversations")
        .withIndex("by_user_year", (q) => 
          q.eq("userId", args.userId).eq("year", year)
        );
    }

    return await query.collect();
  },
});

export const getConversationById = query({
  args: { conversationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_conversation_id", (q) => q.eq("conversationId", args.conversationId))
      .first();
  },
});

export const deleteConversation = mutation({
  args: { conversationId: v.string() },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_conversation_id", (q) => q.eq("conversationId", args.conversationId))
      .first();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Delete all messages in the conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the conversation
    return await ctx.db.delete(conversation._id);
  },
});

export const updateConversationStats = mutation({
  args: {
    conversationId: v.string(),
    messageCount: v.number(),
    totalTokens: v.number(),
    topics: v.array(v.string()),
    sentiment: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_conversation_id", (q) => q.eq("conversationId", args.conversationId))
      .first();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return await ctx.db.patch(conversation._id, {
      messageCount: args.messageCount,
      totalTokens: args.totalTokens,
      topics: args.topics,
      sentiment: args.sentiment,
      updateTime: Date.now(),
    });
  },
});
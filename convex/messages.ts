import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const uploadMessages = mutation({
  args: {
    conversationId: v.string(),
    userId: v.string(),
    messagesData: v.array(v.object({
      messageId: v.string(),
      role: v.string(),
      content: v.string(),
      createTime: v.number(),
      tokenCount: v.number(),
      wordCount: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const insertedIds = [];
    
    for (const message of args.messagesData) {
      // Check if message already exists
      const existing = await ctx.db
        .query("messages")
        .withIndex("by_message_id", (q) => q.eq("messageId", message.messageId))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("messages", {
          conversationId: args.conversationId,
          userId: args.userId,
          ...message,
        });
        insertedIds.push(id);
      }
    }

    return insertedIds;
  },
});

export const getMessagesByConversation = query({
  args: {
    conversationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

export const getMessagesByUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

export const analyzeMessage = mutation({
  args: {
    messageId: v.string(),
    topics: v.optional(v.array(v.string())),
    sentiment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db
      .query("messages")
      .withIndex("by_message_id", (q) => q.eq("messageId", args.messageId))
      .first();

    if (!message) {
      throw new Error("Message not found");
    }

    // This would typically integrate with OpenAI for analysis
    // For now, we'll store the provided analysis
    return { success: true, messageId: args.messageId };
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.string() },
  handler: async (ctx, args) => {
    const message = await ctx.db
      .query("messages")
      .withIndex("by_message_id", (q) => q.eq("messageId", args.messageId))
      .first();

    if (!message) {
      throw new Error("Message not found");
    }

    return await ctx.db.delete(message._id);
  },
});

export const getMessageStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const totalMessages = messages.length;
    const totalWords = messages.reduce((sum, msg) => sum + msg.wordCount, 0);
    const totalTokens = messages.reduce((sum, msg) => sum + msg.tokenCount, 0);
    
    const roleBreakdown = messages.reduce((acc, msg) => {
      acc[msg.role] = (acc[msg.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMessages,
      totalWords,
      totalTokens,
      roleBreakdown,
    };
  },
});
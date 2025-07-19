import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const now = Date.now();
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    return await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Delete all user's conversations
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const conversation of conversations) {
      // Delete all messages in each conversation
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conversation.conversationId))
        .collect();

      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      await ctx.db.delete(conversation._id);
    }

    // Delete user stats
    const userStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const stat of userStats) {
      await ctx.db.delete(stat._id);
    }

    // Delete wrapped cards
    const wrappedCards = await ctx.db
      .query("wrappedCards")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const card of wrappedCards) {
      await ctx.db.delete(card._id);
    }

    // Finally delete the user
    return await ctx.db.delete(args.userId);
  },
});
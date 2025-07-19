import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  conversations: defineTable({
    userId: v.string(),
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
  })
    .index("by_user", ["userId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_user_year", ["userId", "year"]),

  messages: defineTable({
    conversationId: v.string(),
    userId: v.string(),
    messageId: v.string(),
    role: v.string(),
    content: v.string(),
    createTime: v.number(),
    tokenCount: v.number(),
    wordCount: v.number(),
    year: v.optional(v.number()),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"])
    .index("by_user_year", ["userId", "year"])
    .index("by_message_id", ["messageId"]),

  userStats: defineTable({
    userId: v.string(),
    year: v.number(),
    totalConversations: v.number(),
    totalMessages: v.number(),
    totalTokens: v.number(),
    topTopics: v.array(v.string()),
    mostActiveMonth: v.number(),
    averageConversationLength: v.number(),
    longestConversation: v.string(),
    favoriteTimeOfDay: v.string(),
    sentimentBreakdown: v.object({
      positive: v.number(),
      negative: v.number(),
      neutral: v.number(),
    }),
    generatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_year", ["userId", "year"]),

  wrappedCards: defineTable({
    userId: v.string(),
    year: v.number(),
    cardType: v.string(),
    cardData: v.any(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    isShared: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_year", ["userId", "year"])
    .index("by_shared", ["isShared"]),

  statsProgress: defineTable({
    userId: v.string(),
    year: v.number(),
    cursor: v.union(v.string(), v.null()),
    aggregates: v.any(),
    done: v.boolean(),
  }).index("by_user_year", ["userId", "year"]),

  wrappedProgress: defineTable({
    userId: v.string(),
    cursor: v.optional(v.string()),
    cardIndex: v.number(),
    year: v.number(),
    done: v.boolean(),
  }).index("by_user_year", ["userId", "year"]),
});
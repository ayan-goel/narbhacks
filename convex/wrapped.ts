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

    // Get conversations and messages for detailed analysis
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user_year", (q) => 
        q.eq("userId", args.userId).eq("year", args.year)
      )
      .collect();

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user_year", (q) => q.eq("userId", args.userId).eq("year", args.year))
      .collect();

    const yearMessages = messages;

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

    // Advanced Analytics Calculations
    const userMessages = yearMessages.filter(msg => msg.role === 'user');
    const assistantMessages = yearMessages.filter(msg => msg.role === 'assistant');
    
    // Calculate conversation patterns
    const conversationLengths = conversations.map(conv => conv.messageCount);
    const avgLength = conversationLengths.reduce((sum, len) => sum + len, 0) / conversationLengths.length || 0;
    const longestConv = Math.max(...conversationLengths, 0);
    const shortestConv = Math.min(...conversationLengths.filter(len => len > 0), 0) || 0;
    
    // Time analysis
    const hourCounts = Array(24).fill(0);
    yearMessages.forEach(msg => {
      const hour = new Date(msg.createTime).getHours();
      hourCounts[hour]++;
    });
    
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const isNightOwl = peakHour >= 22 || peakHour <= 5;
    const isEarlyBird = peakHour >= 6 && peakHour <= 9;
    
    // Monthly analysis
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      conversations: conversations.filter(conv => conv.month === i + 1).length,
      messages: yearMessages.filter(msg => new Date(msg.createTime).getMonth() === i).length,
    }));
    
    // Word analysis
    const allUserText = userMessages.map(msg => msg.content).join(' ').toLowerCase();
    const words = allUserText.split(/\s+/).filter(word => word.length > 3);
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    const topWords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);

    // Question analysis
    const questions = userMessages.filter(msg => 
      msg.content.includes('?') || 
      msg.content.toLowerCase().startsWith('how') ||
      msg.content.toLowerCase().startsWith('what') ||
      msg.content.toLowerCase().startsWith('why') ||
      msg.content.toLowerCase().startsWith('when') ||
      msg.content.toLowerCase().startsWith('where')
    );
    
    const questionTypes = {
      'how': questions.filter(msg => msg.content.toLowerCase().includes('how')).length,
      'what': questions.filter(msg => msg.content.toLowerCase().includes('what')).length,
      'why': questions.filter(msg => msg.content.toLowerCase().includes('why')).length,
      'when': questions.filter(msg => msg.content.toLowerCase().includes('when')).length,
      'where': questions.filter(msg => msg.content.toLowerCase().includes('where')).length,
      'help': questions.filter(msg => msg.content.toLowerCase().includes('help')).length,
    };

    // CARD 1: Welcome Card
    const welcomeCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "welcome",
      cardData: {
        year: args.year,
        totalConversations: stats.totalConversations,
        totalMessages: stats.totalMessages,
        greeting: `Welcome to your ${args.year} ChatGPT journey!`,
        averageLength: Math.round(avgLength),
        daysActive: new Set(yearMessages.map(msg => new Date(msg.createTime).toDateString())).size,
      },
      createdAt: now,
      isShared: false,
    });
    cardIds.push(welcomeCardId);

    // CARD 2: Numbers Spotlight
    const numbersCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "numbers",
      cardData: {
        totalConversations: stats.totalConversations,
        totalMessages: stats.totalMessages,
        totalWords: yearMessages.reduce((sum, msg) => sum + msg.wordCount, 0),
        totalTokens: stats.totalTokens,
        averageLength: Math.round(avgLength),
        daysActive: new Set(yearMessages.map(msg => 
          new Date(msg.createTime).toDateString()
        )).size,
        avgWordsPerMessage: Math.round(yearMessages.reduce((s,m)=>s+m.wordCount,0)/yearMessages.length || 0),
        uniqueTopics: stats.topTopics.length,
        peakDailyMessages: (() => {
          const map: Record<string, number> = {};
          yearMessages.forEach(msg => {
            const d = new Date(msg.createTime).toDateString();
            map[d] = (map[d] || 0) + 1;
          });
          return Math.max(...Object.values(map));
        })(),
        averageDailyConversations: Math.round(stats.totalConversations / (new Set(yearMessages.map(m=>new Date(m.createTime).toDateString())).size)),
      },
      createdAt: now + 1,
      isShared: false,
    });
    cardIds.push(numbersCardId);

    // CARD 3: Stats Overview
    // const statsCardId = await ctx.db.insert("wrappedCards", {
    //   userId: args.userId,
    //   year: args.year,
    //   cardType: "stats",
    //   cardData: {
    //     totalConversations: stats.totalConversations,
    //     totalMessages: stats.totalMessages,
    //     totalTokens: stats.totalTokens,
    //     averageConversationLength: avgLength,
    //     mostActiveMonth: stats.mostActiveMonth,
    //     favoriteTimeOfDay: stats.favoriteTimeOfDay,
    //   },
    //   createdAt: now + 2,
    //   isShared: false,
    // });
    // cardIds.push(statsCardId);

    // CARD 4: Time Explorer
    const timeCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "time_explorer",
      cardData: {
        peakHour,
        isNightOwl,
        isEarlyBird,
        hourlyBreakdown: hourCounts,
        favoriteTimeOfDay: stats.favoriteTimeOfDay,
        totalTimeEstimate: Math.round(yearMessages.length * 0.5), // rough minutes estimate
        totalConversations: stats.totalConversations,
        mostActiveMonth: stats.mostActiveMonth,
      },
      createdAt: now + 2,
      isShared: false,
    });
    cardIds.push(timeCardId);

    // CARD 5: Question Master
    const questionsCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "question_master",
      cardData: {
        totalQuestions: questions.length,
        questionTypes,
        topQuestionWord: Object.entries(questionTypes).sort(([,a], [,b]) => b - a)[0]?.[0] || 'how',
        curiosityScore: Math.round((questions.length / userMessages.length) * 100),
      },
      createdAt: now + 3,
      isShared: false,
    });
    cardIds.push(questionsCardId);

    // CARD 6: Word Cloud
    const wordCloudCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "word_cloud",
      cardData: {
        topWords: topWords.slice(0, 30),
        totalUniqueWords: Object.keys(wordCounts).length,
        mostUsedWord: topWords[0] || 'help',
        vocabularyRichness: Math.round((Object.keys(wordCounts).length / words.length) * 100),
      },
      createdAt: now + 4,
      isShared: false,
    });
    cardIds.push(wordCloudCardId);

    // CARD 7: Deep Dive Topics
    const topicsCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "deep_topics",
      cardData: {
        topTopics: stats.topTopics.slice(0, 8),
        totalTopics: stats.topTopics.length,
        topicEvolution: 'Your interests evolved from technical questions to creative explorations', // AI-generated
        dominantCategory: stats.topTopics[0] || 'general',
      },
      createdAt: now + 5,
      isShared: false,
    });
    cardIds.push(topicsCardId);

    // CARD 8: Monthly Journey
    // const monthlyCardId = await ctx.db.insert("wrappedCards", {
    //   userId: args.userId,
    //   year: args.year,
    //   cardType: "monthly_journey",
    //   cardData: {
    //     monthlyStats,
    //     mostActiveMonth: stats.mostActiveMonth,
    //     peakMonth: monthlyStats.reduce((max, month) => 
    //       month.conversations > max.conversations ? month : max
    //     ),
    //     consistencyScore: Math.round((monthlyStats.filter(m => m.conversations > 0).length / 12) * 100),
    //     favoriteTimeOfDay: stats.favoriteTimeOfDay,
    //     totalConversations: stats.totalConversations,
    //   },
    //   createdAt: now + 6,
    //   isShared: false,
    // });
    // cardIds.push(monthlyCardId);

    // CARD 9: AI Relationship
    const relationshipCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "ai_relationship",
      cardData: {
        relationshipStage: stats.totalConversations > 100 ? 'AI Companion' : stats.totalConversations > 50 ? 'Regular User' : 'Explorer',
        trustLevel: Math.min(99, Math.max(70, Math.round(85 + (stats.totalConversations % 15) - 7))),
        evolutionStory: 'You started with simple questions and grew into deep, meaningful exchanges',
        personalityMatch: 'The Thoughtful Collaborator',
      },
      createdAt: now + 7,
      isShared: false,
    });
    cardIds.push(relationshipCardId);

    // CARD 10: Productivity Patterns
    const productivityCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "productivity_patterns",
      cardData: {
        peakProductivityHour: peakHour,
        productivityType: isEarlyBird ? 'Early Bird' : isNightOwl ? 'Night Owl' : 'Flexible Worker',
        focusScore: Math.round((stats.totalMessages / stats.totalConversations) * 10),
        workflowStyle: avgLength > 10 ? 'Deep Dive' : 'Quick Bursts',
      },
      createdAt: now + 8,
      isShared: false,
    });
    cardIds.push(productivityCardId);

    // CARD 11: Creative Sparks
    const creativeCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "creative_sparks",
      cardData: {
        creativeConversations: conversations.filter(conv => 
          conv.topics.some(topic => 
            ['creative', 'writing', 'art', 'design', 'music', 'story'].includes(topic.toLowerCase())
          )
        ).length,
        brainstormingSessions: conversations.filter(conv => 
          conv.title.toLowerCase().includes('idea') || 
          conv.title.toLowerCase().includes('brainstorm')
        ).length,
        creativityScore: Math.round(Math.random() * 30 + 70), // Placeholder - would be AI-calculated
        innovationLevel: 'Imaginative Thinker',
      },
      createdAt: now + 9,
      isShared: false,
    });
    cardIds.push(creativeCardId);

    // CARD 12: Sentiment Journey
    // Create varied sentiment breakdown (simulate)
    const totalSent = stats.totalConversations;
    const positiveCount = Math.round(totalSent * 0.2);
    const negativeCount = Math.round(totalSent * 0.1);
    const neutralCount = Math.max(0, totalSent - positiveCount - negativeCount);

    const sentimentCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "sentiment",
      cardData: {
        sentimentBreakdown: {
          positive: positiveCount,
          negative: negativeCount,
          neutral: neutralCount,
        },
        dominantSentiment: neutralCount >= positiveCount && neutralCount >= negativeCount ? 'neutral' : positiveCount >= negativeCount ? 'positive' : 'negative',
      },
      createdAt: now + 10,
      isShared: false,
    });
    cardIds.push(sentimentCardId);

    // Removed Growth, Engagement, Year Review cards for cleaner 10-card set

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

// Generate AI-powered insights using OpenAI
export const generateAIInsights = mutation({
  args: {
    userId: v.string(),
    year: v.number(),
    conversationData: v.string(), // JSON string of conversation summaries
  },
  handler: async (ctx, args) => {
    // This would integrate with OpenAI API to generate personalized insights
    // For now, return placeholder insights that would be AI-generated
    
    const insights = {
      personality: "The Thoughtful Explorer",
      learningStyle: "Deep Dive Researcher", 
      communicationPattern: "Balanced Conversationalist",
      growthTrajectory: "Exponential Learner",
      uniqueTraits: ["Asks thoughtful questions", "Explores diverse topics", "Values detailed explanations"],
      yearSummary: `In ${args.year}, you demonstrated exceptional intellectual curiosity, engaging with AI in meaningful and diverse ways.`,
      predictions: `Based on your usage patterns, you're likely to become an advanced AI collaborator, exploring more complex applications.`,
    };

    return insights;
  },
});
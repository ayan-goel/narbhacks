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
      },
      createdAt: now + 1,
      isShared: false,
    });
    cardIds.push(numbersCardId);

    // CARD 3: Time Explorer
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
      },
      createdAt: now + 2,
      isShared: false,
    });
    cardIds.push(timeCardId);

    // CARD 4: Conversation Styles
    const stylesCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "conversation_styles",
      cardData: {
        averageMessageLength: Math.round(userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length || 0),
        shortConversations: conversationLengths.filter(len => len <= 5).length,
        longConversations: conversationLengths.filter(len => len >= 20).length,
        longestConversation: longestConv,
        communicationStyle: avgLength > 15 ? 'Deep Thinker' : avgLength > 8 ? 'Balanced Conversationalist' : 'Quick & Efficient',
      },
      createdAt: now + 3,
      isShared: false,
    });
    cardIds.push(stylesCardId);

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
      createdAt: now + 4,
      isShared: false,
    });
    cardIds.push(questionsCardId);

    // CARD 6: Word Cloud
    const wordCloudCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "word_cloud",
      cardData: {
        topWords: topWords.slice(0, 15),
        totalUniqueWords: Object.keys(wordCounts).length,
        mostUsedWord: topWords[0] || 'help',
        vocabularyRichness: Math.round((Object.keys(wordCounts).length / words.length) * 100),
      },
      createdAt: now + 5,
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
      createdAt: now + 6,
      isShared: false,
    });
    cardIds.push(topicsCardId);

    // CARD 8: Monthly Journey
    const monthlyCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "monthly_journey",
      cardData: {
        monthlyStats,
        mostActiveMonth: stats.mostActiveMonth,
        peakMonth: monthlyStats.reduce((max, month) => 
          month.conversations > max.conversations ? month : max
        ),
        consistencyScore: Math.round((monthlyStats.filter(m => m.conversations > 0).length / 12) * 100),
      },
      createdAt: now + 7,
      isShared: false,
    });
    cardIds.push(monthlyCardId);

    // CARD 9: AI Relationship
    const relationshipCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "ai_relationship",
      cardData: {
        relationshipStage: stats.totalConversations > 100 ? 'AI Companion' : stats.totalConversations > 50 ? 'Regular User' : 'Explorer',
        trustLevel: Math.min(100, Math.round((stats.totalMessages / 10))),
        evolutionStory: 'You started with simple questions and grew into deep, meaningful exchanges',
        personalityMatch: 'The Thoughtful Collaborator',
      },
      createdAt: now + 8,
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
      createdAt: now + 9,
      isShared: false,
    });
    cardIds.push(productivityCardId);

    // CARD 11: Learning Journey
    const learningCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "learning_journey",
      cardData: {
        learningStyle: questions.length > userMessages.length * 0.7 ? 'Curious Questioner' : 'Practical Implementer',
        knowledgeAreas: stats.topTopics.slice(0, 5),
        growthStory: `You explored ${stats.topTopics.length} different topics, showing incredible intellectual curiosity`,
        expertiseLevel: stats.totalMessages > 1000 ? 'Advanced' : stats.totalMessages > 500 ? 'Intermediate' : 'Beginner',
      },
      createdAt: now + 10,
      isShared: false,
    });
    cardIds.push(learningCardId);

    // CARD 12: Creative Sparks
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
      createdAt: now + 11,
      isShared: false,
    });
    cardIds.push(creativeCardId);

    // CARD 13: Problem Solver
    const problemSolverCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "problem_solver",
      cardData: {
        problemSolvingConversations: conversations.filter(conv =>
          conv.title.toLowerCase().includes('help') ||
          conv.title.toLowerCase().includes('fix') ||
          conv.title.toLowerCase().includes('issue')
        ).length,
        solutionStyle: 'Analytical Approach',
        challengeTypes: ['Technical', 'Creative', 'Research', 'Analysis'],
        persistenceLevel: Math.round((stats.averageConversationLength / 10) * 100),
      },
      createdAt: now + 12,
      isShared: false,
    });
    cardIds.push(problemSolverCardId);

    // CARD 14: Unique Moments
    const uniqueMomentsCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "unique_moments",
      cardData: {
        longestConversationTitle: conversations.find(conv => conv.messageCount === longestConv)?.title || 'Deep Conversation',
        firstConversationDate: new Date(Math.min(...conversations.map(conv => conv.createTime))).toLocaleDateString(),
        mostEngagingTopic: stats.topTopics[0] || 'AI',
        specialMilestone: `Your ${Math.floor(stats.totalConversations / 10) * 10}th conversation was a milestone!`,
      },
      createdAt: now + 13,
      isShared: false,
    });
    cardIds.push(uniqueMomentsCardId);

    // CARD 15: Sentiment Journey
    const sentimentCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "sentiment_journey",
      cardData: {
        sentimentBreakdown: stats.sentimentBreakdown,
        dominantSentiment: Object.entries(stats.sentimentBreakdown)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || "neutral",
        emotionalGrowth: 'Your conversations became more positive over time',
        moodPattern: 'Optimistic Explorer',
      },
      createdAt: now + 14,
      isShared: false,
    });
    cardIds.push(sentimentCardId);

    // CARD 16: AI Personality Match
    const personalityCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "ai_personality",
      cardData: {
        personalityType: 'The Thoughtful Explorer',
        traits: ['Curious', 'Analytical', 'Creative', 'Persistent'],
        description: 'You approach AI with thoughtful questions and dive deep into topics that interest you.',
        compatibility: '95% compatible with ChatGPT',
        strengths: ['Deep thinking', 'Great questions', 'Open minded'],
      },
      createdAt: now + 15,
      isShared: false,
    });
    cardIds.push(personalityCardId);

    // CARD 17: Growth Story
    const growthCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "growth_story",
      cardData: {
        evolutionPhases: ['Discovery', 'Exploration', 'Mastery'],
        currentPhase: stats.totalConversations > 100 ? 'Mastery' : stats.totalConversations > 30 ? 'Exploration' : 'Discovery',
        progressMetrics: {
          complexity: Math.round(avgLength * 10),
          diversity: stats.topTopics.length,
          consistency: Math.round((monthlyStats.filter(m => m.conversations > 0).length / 12) * 100),
        },
        nextLevel: 'Advanced AI Collaborator',
      },
      createdAt: now + 16,
      isShared: false,
    });
    cardIds.push(growthCardId);

    // CARD 18: Future Predictions
    const futureCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "future_predictions",
      cardData: {
        nextYearPrediction: 'You\'ll likely explore more creative and advanced AI applications',
        growthPotential: 'High - ready for complex AI collaborations',
        recommendedTopics: ['AI Ethics', 'Advanced Prompting', 'Creative AI'],
        projectedGrowth: Math.round(stats.totalConversations * 1.5),
      },
      createdAt: now + 17,
      isShared: false,
    });
    cardIds.push(futureCardId);

    // CARD 19: Community Insights
    const communityCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "community_insights",
      cardData: {
        percentileRank: Math.min(95, Math.round((stats.totalConversations / 10) + 50)),
        comparedToOthers: stats.totalConversations > 100 ? 'Top 10% of users' : stats.totalConversations > 50 ? 'Above average user' : 'Growing user',
        uniqueTraits: ['Deep conversations', 'Diverse interests'],
        communityRole: 'Thoughtful Contributor',
      },
      createdAt: now + 18,
      isShared: false,
    });
    cardIds.push(communityCardId);

    // CARD 20: Year in Review & Thanks
    const finalCardId = await ctx.db.insert("wrappedCards", {
      userId: args.userId,
      year: args.year,
      cardType: "year_review",
      cardData: {
        yearSummary: `${args.year} was your year of AI exploration. You had ${stats.totalConversations} meaningful conversations, explored ${stats.topTopics.length} topics, and grew into a thoughtful AI collaborator.`,
        biggestAchievement: 'Mastering the art of AI conversation',
        thanksMessage: 'Thank you for being part of the AI revolution',
        lookingForward: `Here's to an even more amazing ${args.year + 1}!`,
        totalJourney: {
          conversations: stats.totalConversations,
          messages: stats.totalMessages,
          topics: stats.topTopics.length,
          growth: 'Exponential',
        },
      },
      createdAt: now + 19,
      isShared: false,
    });
    cardIds.push(finalCardId);

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
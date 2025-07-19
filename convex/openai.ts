import { v } from "convex/values";
import OpenAI from "openai";
import { internal } from "./_generated/api";
import { internalAction, query } from "./_generated/server";
import { missingEnvVariableUrl } from "./utils";

export const openaiKeySet = query({
  args: {},
  handler: async () => {
    return !!process.env.OPENAI_API_KEY;
  },
});

export const analyzeConversationTopics = internalAction({
  args: {
    conversationData: v.object({
      title: v.string(),
      messages: v.array(v.object({
        role: v.string(),
        content: v.string(),
      })),
    }),
  },
  handler: async (ctx, { conversationData }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const error = missingEnvVariableUrl(
        "OPENAI_API_KEY",
        "https://platform.openai.com/account/api-keys"
      );
      console.error(error);
      return { topics: [], error };
    }

    const openai = new OpenAI({ apiKey });
    
    // Create a prompt to analyze the conversation for topics
    const conversationText = conversationData.messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    const prompt = `Analyze this ChatGPT conversation and extract the main topics discussed. Return up to 5 most relevant topics as a JSON array of strings.

Title: ${conversationData.title}
Conversation:
${conversationText.slice(0, 3000)} // Limit to avoid token limits

Return format: {"topics": ["topic1", "topic2", "topic3"]}`;

    try {
      const output = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to analyze conversations and extract topics. Always return valid JSON in the format: {\"topics\": [\"topic1\", \"topic2\"]}",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const messageContent = output.choices[0]?.message.content;
      if (!messageContent) {
        return { topics: [], error: "No content received from OpenAI" };
      }

      const parsedOutput = JSON.parse(messageContent);
      return { topics: parsedOutput.topics || [], error: null };
    } catch (error) {
      console.error("Error analyzing topics:", error);
      return { topics: [], error: "Failed to analyze topics" };
    }
  },
});

export const analyzeSentiment = internalAction({
  args: {
    messageContent: v.string(),
  },
  handler: async (ctx, { messageContent }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { sentiment: "neutral", error: "API key not set" };
    }

    const openai = new OpenAI({ apiKey });
    
    const prompt = `Analyze the sentiment of this message and return one of: "positive", "negative", or "neutral".

Message: ${messageContent.slice(0, 1000)}

Return format: {"sentiment": "positive|negative|neutral"}`;

    try {
      const output = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis assistant. Return only valid JSON in the format: {\"sentiment\": \"positive|negative|neutral\"}",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        max_tokens: 100,
      });

      const messageContent = output.choices[0]?.message.content;
      if (!messageContent) {
        return { sentiment: "neutral", error: "No content received" };
      }

      const parsedOutput = JSON.parse(messageContent);
      return { sentiment: parsedOutput.sentiment || "neutral", error: null };
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return { sentiment: "neutral", error: "Failed to analyze sentiment" };
    }
  },
});

export const generateInsights = internalAction({
  args: {
    userStats: v.object({
      totalConversations: v.number(),
      totalMessages: v.number(),
      totalTokens: v.number(),
      topTopics: v.array(v.string()),
      mostActiveMonth: v.number(),
      favoriteTimeOfDay: v.string(),
      averageConversationLength: v.number(),
      sentimentBreakdown: v.object({
        positive: v.number(),
        negative: v.number(),
        neutral: v.number(),
      }),
    }),
  },
  handler: async (ctx, { userStats }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { 
        insights: "Unable to generate insights without OpenAI API key",
        personality: "The Explorer",
        error: "API key not set" 
      };
    }

    const openai = new OpenAI({ apiKey });
    
    const prompt = `Based on this ChatGPT usage data, generate personalized insights and determine a personality type for this user.

Stats:
- Total conversations: ${userStats.totalConversations}
- Total messages: ${userStats.totalMessages}
- Average conversation length: ${userStats.averageConversationLength.toFixed(1)} messages
- Top topics: ${userStats.topTopics.slice(0, 5).join(", ")}
- Most active month: ${userStats.mostActiveMonth}
- Favorite time: ${userStats.favoriteTimeOfDay}
- Sentiment: ${userStats.sentimentBreakdown.positive} positive, ${userStats.sentimentBreakdown.negative} negative, ${userStats.sentimentBreakdown.neutral} neutral

Generate a fun, engaging summary of their ChatGPT usage personality and insights.

Return format: {
  "personality": "short personality type name",
  "insights": "engaging paragraph about their usage patterns",
  "yearInReview": "fun summary of their year with ChatGPT"
}`;

    try {
      const output = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a creative assistant that analyzes ChatGPT usage patterns and creates fun, engaging personality profiles. Keep it positive and entertaining like Spotify Wrapped.",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        max_tokens: 800,
      });

      const messageContent = output.choices[0]?.message.content;
      if (!messageContent) {
        return { 
          insights: "Unable to generate insights",
          personality: "The Explorer",
          error: "No content received" 
        };
      }

      const parsedOutput = JSON.parse(messageContent);
      return { 
        insights: parsedOutput.insights || "You're a curious ChatGPT user!",
        personality: parsedOutput.personality || "The Explorer",
        yearInReview: parsedOutput.yearInReview || "What a year of conversations!",
        error: null 
      };
    } catch (error) {
      console.error("Error generating insights:", error);
      return { 
        insights: "You had an amazing year exploring topics with ChatGPT!",
        personality: "The Explorer",
        yearInReview: "Your conversations showed curiosity and engagement.",
        error: "Failed to generate insights" 
      };
    }
  },
});

export const generateWrappedSummary = internalAction({
  args: {
    userStats: v.object({
      totalConversations: v.number(),
      totalMessages: v.number(),
      topTopics: v.array(v.string()),
      favoriteTimeOfDay: v.string(),
      year: v.number(),
    }),
  },
  handler: async (ctx, { userStats }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        summary: `In ${userStats.year}, you had ${userStats.totalConversations} conversations with ChatGPT!`,
        error: "API key not set"
      };
    }

    const openai = new OpenAI({ apiKey });
    
    const prompt = `Create a fun, engaging "wrapped" summary for this ChatGPT user's ${userStats.year} activity, similar to Spotify Wrapped style.

Stats:
- ${userStats.totalConversations} conversations
- ${userStats.totalMessages} messages
- Top topics: ${userStats.topTopics.slice(0, 3).join(", ")}
- Most active time: ${userStats.favoriteTimeOfDay}

Make it personal, fun, and celebratory. Use emojis and keep it under 150 words.

Return format: {"summary": "your wrapped summary text"}`;

    try {
      const output = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a creative copywriter creating engaging year-end summaries like Spotify Wrapped. Be fun, personal, and celebratory.",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const messageContent = output.choices[0]?.message.content;
      if (!messageContent) {
        return {
          summary: `🎉 In ${userStats.year}, you had ${userStats.totalConversations} amazing conversations with ChatGPT, exploring topics like ${userStats.topTopics.slice(0, 2).join(" and ")}!`,
          error: "No content received"
        };
      }

      const parsedOutput = JSON.parse(messageContent);
      return { 
        summary: parsedOutput.summary || `What a year! ${userStats.totalConversations} conversations and counting! 🚀`,
        error: null 
      };
    } catch (error) {
      console.error("Error generating wrapped summary:", error);
      return {
        summary: `🎉 In ${userStats.year}, you had ${userStats.totalConversations} conversations with ChatGPT, covering ${userStats.topTopics.length} different topics!`,
        error: "Failed to generate summary"
      };
    }
  },
});
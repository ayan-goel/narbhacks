import { action } from "./_generated/server";
import { v } from "convex/values";

export const generatePersonalityInsight = action({
  args: {
    userId: v.string(),
    conversationSummary: v.string(),
    topTopics: v.array(v.string()),
    questionPatterns: v.string(),
    communicationStyle: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `Based on this user's ChatGPT conversation patterns, generate a personalized AI personality analysis:

Conversation Summary: ${args.conversationSummary}
Top Topics: ${args.topTopics.join(", ")}
Question Patterns: ${args.questionPatterns}
Communication Style: ${args.communicationStyle}

Please provide:
1. A unique AI personality type (3-5 words, creative and specific)
2. 3-4 personality traits
3. A brief description of their AI interaction style (1-2 sentences)
4. Their learning approach
5. A prediction about their future AI usage

Format as JSON with keys: personalityType, traits, description, learningApproach, futurePrediction`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an AI personality analyst specializing in understanding how people interact with AI systems. Provide insightful, positive, and engaging personality analysis."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          personalityType: "The Thoughtful Explorer",
          traits: ["Curious", "Analytical", "Creative", "Persistent"],
          description: "You approach AI with thoughtful questions and show genuine curiosity about how technology can enhance your thinking.",
          learningApproach: "Deep dive researcher who likes to understand concepts thoroughly",
          futurePrediction: "You'll likely become an advanced AI collaborator, exploring creative applications"
        };
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Return fallback data
      return {
        personalityType: "The Thoughtful Explorer",
        traits: ["Curious", "Analytical", "Creative", "Persistent"],
        description: "You approach AI with thoughtful questions and show genuine curiosity about how technology can enhance your thinking.",
        learningApproach: "Deep dive researcher who likes to understand concepts thoroughly",
        futurePrediction: "You'll likely become an advanced AI collaborator, exploring creative applications"
      };
    }
  },
});

export const generateYearSummary = action({
  args: {
    userId: v.string(),
    totalConversations: v.number(),
    totalMessages: v.number(),
    topTopics: v.array(v.string()),
    mostActiveMonth: v.number(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return `${args.year} was your year of AI exploration. You had ${args.totalConversations} meaningful conversations, explored ${args.topTopics.length} topics, and grew into a thoughtful AI collaborator.`;
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const prompt = `Create an engaging, personalized year-in-review summary for a ChatGPT user:

Stats:
- ${args.totalConversations} total conversations
- ${args.totalMessages} total messages
- Most active in ${monthNames[args.mostActiveMonth - 1]}
- Top topics: ${args.topTopics.slice(0, 5).join(", ")}

Write a compelling 2-3 sentence summary that:
1. Captures their AI journey in ${args.year}
2. Highlights their growth and exploration
3. Uses an inspiring, positive tone
4. Mentions specific achievements or patterns

Make it feel personal and meaningful, like Spotify Wrapped.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a creative writer specializing in personalized year-in-review summaries. Write engaging, positive content that makes users feel proud of their AI journey."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content.replace(/"/g, '');
    } catch (error) {
      console.error("OpenAI API error:", error);
      return `${args.year} was your year of AI exploration. You had ${args.totalConversations} meaningful conversations, explored ${args.topTopics.length} topics, and grew into a thoughtful AI collaborator.`;
    }
  },
});

export const generateConversationInsight = action({
  args: {
    conversationTitle: v.string(),
    messageCount: v.number(),
    topics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return "This was one of your most engaging conversations, showing your curiosity and depth of thinking.";
    }

    const prompt = `Generate a brief, insightful comment about this ChatGPT conversation:

Title: "${args.conversationTitle}"
Messages: ${args.messageCount}
Topics: ${args.topics.join(", ")}

Write 1 sentence that captures what made this conversation special or interesting. Be positive and insightful.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content.replace(/"/g, '');
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "This was one of your most engaging conversations, showing your curiosity and depth of thinking.";
    }
  },
});

export const generateTopicEvolution = action({
  args: {
    topTopics: v.array(v.string()),
    totalConversations: v.number(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return "Your interests evolved from technical questions to creative explorations throughout the year.";
    }

    const prompt = `Analyze this user's topic evolution based on their most discussed ChatGPT topics:

Topics: ${args.topTopics.join(", ")}
Total Conversations: ${args.totalConversations}
Year: ${args.year}

Write 1 engaging sentence describing how their interests or approach evolved over time. Focus on growth, learning, or exploration patterns.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 80,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content.replace(/"/g, '');
    } catch (error) {
      console.error("OpenAI API error:", error);
      return "Your interests evolved from technical questions to creative explorations throughout the year.";
    }
  },
});
export interface ChatGPTMessage {
  id: string;
  author: {
    role: 'user' | 'assistant' | 'system';
    name?: string;
    metadata?: any;
  };
  create_time: number;
  update_time?: number;
  content: {
    content_type: string;
    parts: string[];
  };
  status: string;
  end_turn?: boolean;
  weight: number;
  metadata: any;
  recipient: string;
}

export interface ChatGPTConversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, {
    id: string;
    message: ChatGPTMessage | null;
    parent: string | null;
    children: string[];
  }>;
  moderation_results: any[];
  current_node: string;
  conversation_id: string;
}

export interface ProcessedMessage {
  messageId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createTime: number;
  tokenCount: number;
  wordCount: number;
}

export interface ProcessedConversation {
  conversationId: string;
  title: string;
  createTime: number;
  updateTime: number;
  messageCount: number;
  totalTokens: number;
  topics: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  year: number;
  month: number;
  messages: ProcessedMessage[];
}

export interface ParsedData {
  totalConversations: number;
  totalMessages: number;
  dateRange: {
    start: string;
    end: string;
  };
  topTopics: string[];
  estimatedProcessingTime: string;
  conversations: ProcessedConversation[];
}

/**
 * Estimates token count based on text length
 * Rough approximation: 1 token ≈ 4 characters
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Counts words in a text string
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Extracts topics from conversation title using simple keyword extraction
 */
export function extractTopicsFromTitle(title: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down',
    'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'now', 'help', 'me', 'please', 'you', 'i', 'my', 'your', 'his', 'her', 'its',
    'our', 'their', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is',
    'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'get',
    'got', 'make', 'made', 'go', 'went', 'come', 'came', 'see', 'saw', 'know', 'knew', 'take', 'took'
  ]);

  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !stopWords.has(word) && 
      !/^\d+$/.test(word)
    );

  // Return unique words, limited to 5
  return [...new Set(words)].slice(0, 5);
}

/**
 * Simple sentiment analysis based on keywords
 */
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = new Set([
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'perfect',
    'love', 'like', 'enjoy', 'happy', 'pleased', 'satisfied', 'excited', 'grateful', 'thankful',
    'helpful', 'useful', 'valuable', 'brilliant', 'impressive', 'outstanding', 'remarkable',
    'successful', 'effective', 'efficient', 'smooth', 'easy', 'simple', 'clear', 'beautiful',
    'nice', 'cool', 'fun', 'interesting', 'fascinating', 'inspiring', 'motivating', 'encouraging'
  ]);

  const negativeWords = new Set([
    'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'dislike', 'angry', 'frustrated',
    'annoyed', 'disappointed', 'sad', 'upset', 'worried', 'confused', 'difficult', 'hard', 'complex',
    'complicated', 'impossible', 'wrong', 'error', 'problem', 'issue', 'trouble', 'fail', 'failed',
    'broken', 'useless', 'worthless', 'stupid', 'dumb', 'ridiculous', 'nonsense', 'waste', 'boring',
    'slow', 'poor', 'weak', 'lacking', 'missing', 'incomplete', 'inadequate', 'insufficient'
  ]);

  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of words) {
    if (positiveWords.has(word)) positiveScore++;
    if (negativeWords.has(word)) negativeScore++;
  }

  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

/**
 * Processes messages from a conversation mapping
 */
export function processMessages(mapping: ChatGPTConversation['mapping']): ProcessedMessage[] {
  const messages: ProcessedMessage[] = [];
  
  for (const [nodeId, node] of Object.entries(mapping)) {
    if (!node.message || !node.message.content?.parts?.[0]) continue;
    
    const content = node.message.content.parts[0];
    if (!content || content.trim().length === 0) continue;

    // Skip system messages that are just metadata
    if (node.message.author.role === 'system' && content.trim() === '') continue;

    messages.push({
      messageId: nodeId,
      role: node.message.author.role,
      content: content,
      createTime: (node.message.create_time || 0) * 1000,
      tokenCount: estimateTokenCount(content),
      wordCount: countWords(content),
    });
  }

  // Sort by creation time
  return messages.sort((a, b) => a.createTime - b.createTime);
}

/**
 * Processes a single conversation
 */
export function processConversation(conversation: ChatGPTConversation): ProcessedConversation {
  const messages = processMessages(conversation.mapping);
  const createTime = conversation.create_time * 1000;
  const date = new Date(createTime);
  
  const totalTokens = messages.reduce((sum, msg) => sum + msg.tokenCount, 0);
  const topics = extractTopicsFromTitle(conversation.title);
  
  // Analyze sentiment based on user messages
  const userMessages = messages.filter(msg => msg.role === 'user');
  const allUserText = userMessages.map(msg => msg.content).join(' ');
  const sentiment = analyzeSentiment(allUserText);

  return {
    conversationId: conversation.conversation_id,
    title: conversation.title || 'Untitled Conversation',
    createTime,
    updateTime: (conversation.update_time || conversation.create_time) * 1000,
    messageCount: messages.length,
    totalTokens,
    topics,
    sentiment,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    messages,
  };
}

/**
 * Parses ChatGPT conversations JSON file
 */
export async function parseConversationsJSON(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rawConversations: ChatGPTConversation[] = JSON.parse(content);
        
        if (!Array.isArray(rawConversations)) {
          throw new Error('Invalid file format. Expected an array of conversations.');
        }

        const conversations = rawConversations.map(processConversation);
        const totalMessages = conversations.reduce((sum, conv) => sum + conv.messageCount, 0);
        
        // Extract date range
        const dates = conversations.map(conv => new Date(conv.createTime));
        const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));

        // Extract all topics
        const allTopics = conversations.flatMap(conv => conv.topics);
        const topicCounts = allTopics.reduce((acc, topic) => {
          acc[topic] = (acc[topic] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const topTopics = Object.entries(topicCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([topic]) => topic);

        // Estimate processing time
        const estimatedMinutes = Math.max(1, Math.ceil(conversations.length / 50));

        resolve({
          totalConversations: conversations.length,
          totalMessages,
          dateRange: {
            start: earliestDate.toLocaleDateString(),
            end: latestDate.toLocaleDateString(),
          },
          topTopics,
          estimatedProcessingTime: `${estimatedMinutes} minute${estimatedMinutes > 1 ? 's' : ''}`,
          conversations,
        });
      } catch (error) {
        reject(new Error(`Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validates the format of uploaded data
 */
export function validateDataFormat(data: any): { isValid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { isValid: false, error: 'Data must be an array of conversations' };
  }

  if (data.length === 0) {
    return { isValid: false, error: 'No conversations found in the file' };
  }

  // Check if conversations have required fields
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const conv = data[i];
    if (!conv.title || !conv.create_time || !conv.mapping) {
      return { 
        isValid: false, 
        error: `Invalid conversation format at index ${i}. Missing required fields.` 
      };
    }
  }

  return { isValid: true };
}

/**
 * Extracts metadata from conversations for preview
 */
export function extractMetadata(conversations: ProcessedConversation[]): {
  yearDistribution: Record<number, number>;
  monthDistribution: Record<number, number>;
  topicDistribution: Record<string, number>;
  sentimentDistribution: Record<string, number>;
  averageConversationLength: number;
  longestConversation: ProcessedConversation;
} {
  const yearDistribution: Record<number, number> = {};
  const monthDistribution: Record<number, number> = {};
  const topicDistribution: Record<string, number> = {};
  const sentimentDistribution: Record<string, number> = {};
  
  let totalMessages = 0;
  let longestConversation = conversations[0];

  for (const conv of conversations) {
    // Year distribution
    yearDistribution[conv.year] = (yearDistribution[conv.year] || 0) + 1;
    
    // Month distribution
    monthDistribution[conv.month] = (monthDistribution[conv.month] || 0) + 1;
    
    // Topic distribution
    for (const topic of conv.topics) {
      topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
    }
    
    // Sentiment distribution
    sentimentDistribution[conv.sentiment] = (sentimentDistribution[conv.sentiment] || 0) + 1;
    
    // Track messages and longest conversation
    totalMessages += conv.messageCount;
    if (conv.messageCount > longestConversation.messageCount) {
      longestConversation = conv;
    }
  }

  return {
    yearDistribution,
    monthDistribution,
    topicDistribution,
    sentimentDistribution,
    averageConversationLength: totalMessages / conversations.length,
    longestConversation,
  };
}
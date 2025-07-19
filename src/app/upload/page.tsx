"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FileUpload from "@/components/upload/FileUpload";
import UploadProgress from "@/components/upload/UploadProgress";
import DataPreview from "@/components/upload/DataPreview";
import UploadSuccess from "@/components/upload/UploadSuccess";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type UploadState = 'select' | 'preview' | 'uploading' | 'processing' | 'success' | 'error';

interface ParsedData {
  totalConversations: number;
  totalMessages: number;
  dateRange: {
    start: string;
    end: string;
  };
  topTopics: string[];
  estimatedProcessingTime: string;
  year: number;
  conversationsData: Array<{
    conversationId: string;
    title: string;
    createTime: number;
    updateTime: number;
    messageCount: number;
    totalTokens: number;
    topics: string[];
    sentiment: string;
    year: number;
    month: number;
    messages: Array<{
      messageId: string;
      role: string;
      content: string;
      createTime: number;
      tokenCount: number;
      wordCount: number;
    }>;
  }>;
}

export default function UploadPage() {
  const { user, isLoaded } = useUser();
  const [uploadState, setUploadState] = useState<UploadState>('select');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<any>(null);

  const createUser = useMutation(api.users.createUser);
  const uploadConversations = useMutation(api.conversations.uploadConversations);
  const uploadMessages = useMutation(api.messages.uploadMessages);
  const generateStats = useMutation(api.analyticsChunked.startStatsGeneration);
  const statsStatus = useQuery(
    api.analyticsChunked.getStatsGenerationStatus,
    user?.id && (uploadState === "processing" || uploadState === "success")
      ? {
    userId: user.id,
    year: parsedData?.year ?? new Date().getFullYear(),
        }
      : "skip"
  );
  const generateWrapped = useMutation(api.wrapped.generateWrappedCards);

  // When stats generation completes, trigger wrapped generation (if needed) and finalize flow
  useEffect(() => {
    const finalizeUpload = async () => {
      if (
        user &&
        uploadState === "processing" &&
        statsStatus?.status === "complete"
      ) {
        try {
          // Attempt to generate wrapped cards (may have already been generated server-side)
          await generateWrapped({
            userId: user.id,
            year: parsedData?.year ?? new Date().getFullYear(),
          });
        } catch (e) {
          // Ignore errors if wrapped already generated
          console.warn("generateWrapped returned an error (likely already generated). Continuing.");
        }

        setUploadResults({
          conversationsProcessed: parsedData!.totalConversations,
          messagesProcessed: parsedData!.totalMessages,
          topicsExtracted: parsedData!.topTopics.length,
          processingTime: parsedData!.estimatedProcessingTime,
        });

        setProgress(100);
        setUploadState("success");
      }
    };

    finalizeUpload();
  }, [statsStatus, uploadState, user, generateWrapped, parsedData]);

  const parseConversationsFile = async (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          if (!content || content.trim() === '') {
            throw new Error("The file appears to be empty. Please check your ChatGPT export file.");
          }

          let parsedData;
          try {
            parsedData = JSON.parse(content);
          } catch (jsonError) {
            throw new Error("The file is not valid JSON. Please make sure you're uploading the correct conversations.json file from ChatGPT.");
          }
          
          // Handle different possible formats
          let conversations;
          if (Array.isArray(parsedData)) {
            conversations = parsedData;
          } else if (parsedData.conversations && Array.isArray(parsedData.conversations)) {
            conversations = parsedData.conversations;
          } else if (typeof parsedData === 'object' && parsedData !== null) {
            // Sometimes the export might be a single object or have the conversations nested
            const keys = Object.keys(parsedData);
            if (keys.length === 0) {
              throw new Error("The JSON file appears to be empty or has no conversations.");
            }
            // Try to find conversations in common locations
            const possibleConversationKeys = ['data', 'conversations', 'chat_history', 'items'];
            let found = false;
            for (const key of possibleConversationKeys) {
              if (parsedData[key] && Array.isArray(parsedData[key])) {
                conversations = parsedData[key];
                found = true;
                break;
              }
            }
            if (!found) {
              throw new Error(`Unexpected file structure. Expected an array of conversations, but found: ${JSON.stringify(keys).substring(0, 100)}...`);
            }
          } else {
            throw new Error("Invalid file format. Expected an array of conversations or an object containing conversations.");
          }

          if (!conversations || conversations.length === 0) {
            throw new Error("No conversations found in the file. Please make sure you're uploading the correct ChatGPT export file.");
          }

          // Extract basic statistics
          const totalConversations = conversations.length;
          let totalMessages = 0;
          const topicCounts: Record<string, number> = {}; // Change to count frequency
          let earliestDate = new Date();
          let latestDate = new Date(0);

          const processedConversations = conversations.map((conv: any, index: number) => {
            // Handle different message formats
            let messages: any[] = [];
            
            if (conv.mapping && typeof conv.mapping === 'object') {
              // Standard ChatGPT format
              messages = Object.values(conv.mapping)
                .filter((node: any) => {
                  // Filter out nodes without messages, system messages, or empty content
                  if (!node.message) return false;
                  if (node.message.author?.role === 'system') return false;
                  if (!node.message.content?.parts?.[0]) return false;
                  if (node.message.content.parts[0] === '') return false;
                  if (node.message.content.content_type === 'user_editable_context') return false;
                  return true;
                })
                .map((node: any) => {
                  const contentPart = node.message.content.parts[0];
                  const content = typeof contentPart === 'string' ? contentPart : 
                                 typeof contentPart === 'object' && contentPart?.text ? contentPart.text :
                                 JSON.stringify(contentPart || '');
                  
                  return {
                    messageId: node.id || `msg_${index}_${Math.random()}`,
                    role: node.message.author?.role || 'unknown',
                    content,
                    createTime: (node.message.create_time ? node.message.create_time * 1000 : Date.now()),
                    tokenCount: Math.ceil((content?.length || 0) / 4),
                    wordCount: typeof content === 'string' ? content.split(' ').length : 0,
                  };
                });
            } else if (conv.messages && Array.isArray(conv.messages)) {
              // Alternative format
              messages = conv.messages.map((msg: any, msgIndex: number) => {
                const content = msg.content || msg.text || '';
                return {
                  messageId: msg.id || `msg_${index}_${msgIndex}`,
                  role: msg.role || msg.author?.role || 'unknown',
                  content: typeof content === 'string' ? content : JSON.stringify(content),
                  createTime: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
                  tokenCount: Math.ceil((typeof content === 'string' ? content.length : JSON.stringify(content).length) / 4),
                  wordCount: typeof content === 'string' ? content.split(' ').length : 0,
                };
              });
            }

            totalMessages += messages.length;

            // Handle ChatGPT timestamp format (seconds or milliseconds)
            const rawCreate = conv.create_time ?? Date.now();
            const createTime = rawCreate > 1e12 ? rawCreate : rawCreate * 1000;
            const rawUpdate = conv.update_time ?? rawCreate;
            const updateTime = rawUpdate > 1e12 ? rawUpdate : rawUpdate * 1000;

            const date = new Date(createTime);
            
            if (date < earliestDate) earliestDate = date;
            if (date > latestDate) latestDate = date;

            // Extract topics from title and count frequency
            const title = conv.title || "Untitled Conversation";
            const titleWords = title.toLowerCase().split(' ').filter((word: string) => word.length > 3);
            titleWords.forEach((word: string) => {
              topicCounts[word] = (topicCounts[word] || 0) + 1;
            });

            return {
              conversationId: conv.conversation_id || `conv_${index}`,
              title,
              createTime,
              updateTime,
              messageCount: messages.length,
              totalTokens: messages.reduce((sum: number, msg: any) => sum + (msg.tokenCount || 0), 0),
              topics: titleWords.slice(0, 3), // Keep first 3 for individual conversation
              sentiment: "neutral", // Will be analyzed later
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              messages, // Include the processed messages
            };
          });

          // Get top 10 most frequent topics
          const topTopics = Object.entries(topicCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([topic]) => topic);

          const estimatedMinutes = Math.max(1, Math.ceil(totalConversations / 500) * 2); // Doubled estimate for more realistic duration
          
          console.log(`Parsed ${totalConversations} conversations with ${totalMessages} total messages`);
          console.log(`Date range: ${earliestDate.toLocaleDateString()} to ${latestDate.toLocaleDateString()}`);
          console.log(`Top topics: ${topTopics.slice(0, 5).join(', ')}`);
          
          resolve({
            totalConversations,
            totalMessages,
            dateRange: {
              start: earliestDate.toLocaleDateString(),
              end: latestDate.toLocaleDateString(),
            },
            topTopics,
            estimatedProcessingTime: `${estimatedMinutes} minute${estimatedMinutes > 1 ? 's' : ''}`,
            year: latestDate.getFullYear(),
            conversationsData: processedConversations,
          });
        } catch (err) {
          console.error("Error parsing conversations file:", err);
          if (err instanceof Error) {
            reject(err);
          } else {
            reject(new Error("An unexpected error occurred while parsing the file. Please check the file format and try again."));
          }
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploadState('preview');
    setProgress(10);

    try {
      const data = await parseConversationsFile(file);
      setParsedData(data);
      setProgress(25);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
      setUploadState('error');
    }
  };

  const handleConfirmUpload = async () => {
    if (!user || !parsedData) return;

    let targetYear = parsedData.year;

    setUploadState('uploading');
    setProgress(30);

    try {
      // Create/update user
      await createUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || "",
      });
      setProgress(40);

      setUploadState('processing');
      
      // Upload conversations
      console.log(`Uploading ${parsedData.conversationsData.length} conversations...`);
      
      // Remove messages field from conversations data since it's stored separately
      const conversationsWithoutMessages = parsedData.conversationsData.map(conv => ({
        conversationId: conv.conversationId,
        title: conv.title,
        createTime: conv.createTime,
        updateTime: conv.updateTime,
        messageCount: conv.messageCount,
        totalTokens: conv.totalTokens,
        topics: conv.topics,
        sentiment: conv.sentiment,
        year: conv.year,
        month: conv.month,
      }));
      
      await uploadConversations({
        userId: user.id,
        conversationsData: conversationsWithoutMessages,
      });
      setProgress(70);

      // Upload messages
      console.log(`Uploading messages for ${parsedData.conversationsData.length} conversations...`);
      for (const conv of parsedData.conversationsData) {
        if (conv.messages && conv.messages.length > 0) {
          console.log(`Uploading ${conv.messages.length} messages for conversation: ${conv.title}`);
          await uploadMessages({
            conversationId: conv.conversationId,
            userId: user.id,
            messagesData: conv.messages,
          });
        }
      }
      setProgress(80);

      // Start statistics generation (runs asynchronously in the backend)
      console.log('Starting statistics generation...');
      await generateStats({
        userId: user.id,
        year: targetYear,
      });
      console.log('Statistics job started successfully!');
      setProgress(85);

      // Wrapped cards will be generated automatically once stats are done.
      // We will poll for completion via statsStatus below.
      
      // Leave the rest of the completion logic to the statsStatus watcher.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadState('error');
    }
  };

  const handleCancel = () => {
    setUploadState('select');
    setSelectedFile(null);
    setParsedData(null);
    setProgress(0);
    setError(null);
  };

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#10A37F]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to upload your data
          </h1>
          <Link
            href="/sign-in"
            className="inline-flex items-center px-4 py-2 bg-[#10A37F] text-white rounded-lg hover:bg-[#0d8f72] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 min-h-screen flex flex-col justify-start pt-20">
        {/* Welcome Header - only for initial select state */}
        {uploadState === 'select' && (
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-600 bg-clip-text text-transparent">
              Welcome, {user.firstName || "Explorer"}! 👋
            </span>
          </h1>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Your ChatGPT Data
          </h2>
          <p className="text-xl text-gray-600">
            Let&apos;s analyze your conversations and create your wrapped
          </p>
        </div>
        )}

        {/* Upload Flow */}
        {uploadState === 'select' && (
          <FileUpload onFileSelect={handleFileSelect} />
        )}

        {uploadState === 'preview' && parsedData && (
          <DataPreview
            data={parsedData}
            onConfirm={handleConfirmUpload}
            onCancel={handleCancel}
          />
        )}

        {(uploadState === 'uploading' || uploadState === 'processing') && (
          <UploadProgress
            progress={progress}
            status={uploadState}
            estimatedTime={parsedData?.estimatedProcessingTime}
            message={
              uploadState === 'uploading' 
                ? "Uploading your conversations..." 
                : "Analyzing your data and generating insights..."
            }
          />
        )}

        {uploadState === 'success' && uploadResults && (
          <UploadSuccess
            stats={uploadResults}
            year={parsedData!.year}
          />
        )}

        {uploadState === 'error' && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Upload Failed
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
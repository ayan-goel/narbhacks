"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
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
  conversationsData: any[];
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
  const generateStats = useMutation(api.analytics.generateUserStats);

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
          const topics: Set<string> = new Set();
          let earliestDate = new Date();
          let latestDate = new Date(0);

          const processedConversations = conversations.map((conv: any, index: number) => {
            // Handle different message formats
            let messages: any[] = [];
            
            if (conv.mapping && typeof conv.mapping === 'object') {
              // Standard ChatGPT format
              messages = Object.values(conv.mapping)
                .filter((node: any) => node.message?.content?.parts?.[0])
                                  .map((node: any) => {
                    const contentPart = node.message?.content?.parts?.[0];
                    const content = typeof contentPart === 'string' ? contentPart : 
                                   typeof contentPart === 'object' && contentPart?.text ? contentPart.text :
                                   JSON.stringify(contentPart || '');
                    
                    return {
                      messageId: node.id || `msg_${index}_${Math.random()}`,
                      role: node.message?.author?.role || 'unknown',
                      content,
                      createTime: (node.message?.create_time ? node.message.create_time * 1000 : Date.now()),
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

            // Handle different date formats
            let createTime = Date.now();
            if (conv.create_time) {
              createTime = typeof conv.create_time === 'number' ? conv.create_time * 1000 : new Date(conv.create_time).getTime();
            } else if (conv.created_at) {
              createTime = new Date(conv.created_at).getTime();
            } else if (conv.timestamp) {
              createTime = new Date(conv.timestamp).getTime();
            }

            const updateTime = conv.update_time ? conv.update_time * 1000 : 
                              conv.updated_at ? new Date(conv.updated_at).getTime() : createTime;

            const date = new Date(createTime);
            
            if (date < earliestDate) earliestDate = date;
            if (date > latestDate) latestDate = date;

            // Extract topics from title (simplified)
            const title = conv.title || conv.name || "Untitled Conversation";
            const titleWords = title.toLowerCase().split(' ') || [];
            titleWords.forEach((word: string) => {
              if (word.length > 3) topics.add(word);
            });

            return {
              conversationId: conv.conversation_id || conv.id || `conv_${index}`,
              title,
              createTime,
              updateTime,
              messageCount: messages.length,
              totalTokens: messages.reduce((sum: number, msg: any) => sum + (msg.tokenCount || 0), 0),
              topics: titleWords.filter((word: string) => word.length > 3).slice(0, 3),
              sentiment: "neutral", // Will be analyzed later
              year: date.getFullYear(),
              month: date.getMonth() + 1,
            };
          });

          const estimatedMinutes = Math.ceil(totalConversations / 100);
          
          resolve({
            totalConversations,
            totalMessages,
            dateRange: {
              start: earliestDate.toLocaleDateString(),
              end: latestDate.toLocaleDateString(),
            },
            topTopics: Array.from(topics).slice(0, 10),
            estimatedProcessingTime: `${estimatedMinutes} minute${estimatedMinutes > 1 ? 's' : ''}`,
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
      await uploadConversations({
        userId: user.id,
        conversationsData: parsedData.conversationsData,
      });
      setProgress(70);

      // Generate statistics
      const currentYear = new Date().getFullYear();
      await generateStats({
        userId: user.id,
        year: currentYear,
      });
      setProgress(90);

      setUploadResults({
        conversationsProcessed: parsedData.totalConversations,
        messagesProcessed: parsedData.totalMessages,
        topicsExtracted: parsedData.topTopics.length,
        processingTime: parsedData.estimatedProcessingTime,
      });

      setProgress(100);
      setUploadState('success');
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Upload Your ChatGPT Data
          </h1>
          <p className="text-xl text-gray-600">
            Let's analyze your conversations and create your wrapped
          </p>
        </div>

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
            year={new Date().getFullYear()}
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
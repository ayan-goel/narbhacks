"use client";

import { MessageSquare, Calendar, Hash, TrendingUp } from "lucide-react";

interface DataPreviewProps {
  data: {
    totalConversations: number;
    totalMessages: number;
    dateRange: {
      start: string;
      end: string;
    };
    topTopics: string[];
    estimatedProcessingTime: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DataPreview({ data, onConfirm, onCancel }: DataPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Data Preview
        </h2>
        <p className="text-gray-600">
          Here's what we found in your ChatGPT export
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#10A37F]/5 rounded-lg p-4 text-center">
          <MessageSquare className="h-8 w-8 text-[#10A37F] mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {data.totalConversations.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Conversations</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Hash className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {data.totalMessages.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Messages</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <span className="font-medium">Date Range:</span>
            <span className="ml-2 text-gray-600">
              {data.dateRange.start} to {data.dateRange.end}
            </span>
          </div>
        </div>

        {data.topTopics.length > 0 && (
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <span className="font-medium">Top Topics:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.topTopics.slice(0, 5).map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {topic}
                  </span>
                ))}
                {data.topTopics.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    +{data.topTopics.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Processing Time:</strong> {data.estimatedProcessingTime}
        </p>
        <p className="text-xs text-yellow-700 mt-1">
          We'll analyze your conversations, extract topics, and generate your wrapped cards.
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-[#10A37F] text-white rounded-lg hover:bg-[#0d8f72] transition-colors"
        >
          Process Data
        </button>
      </div>
    </div>
  );
}
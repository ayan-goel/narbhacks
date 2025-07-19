"use client";

import { CheckCircle, Sparkles, BarChart3, Share2 } from "lucide-react";
import Link from "next/link";

interface UploadSuccessProps {
  stats: {
    conversationsProcessed: number;
    messagesProcessed: number;
    topicsExtracted: number;
    processingTime: string;
  };
  year: number;
}

export default function UploadSuccess({ stats, year }: UploadSuccessProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Success! 🎉
        </h2>
        <p className="text-lg text-gray-600">
          Your ChatGPT data has been processed and your wrapped is ready!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700">
            {stats.conversationsProcessed.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">Conversations</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700">
            {stats.messagesProcessed.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">Messages</div>
        </div>
      </div>

      <div className="space-y-3 mb-8 text-sm text-gray-600">
        <p>✨ Extracted {stats.topicsExtracted} unique topics</p>
        <p>⚡ Processed in {stats.processingTime}</p>
        <p>🎨 Generated personalized wrapped cards</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/wrapped/${year}`}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-[#10A37F] text-white rounded-lg hover:bg-[#0d8f72] transition-colors"
        >
          <Sparkles className="h-5 w-5" />
          <span>View Your Wrapped</span>
        </Link>
        
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <BarChart3 className="h-5 w-5" />
          <span>Go to Dashboard</span>
        </Link>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Share2 className="h-4 w-4" />
          <span>Ready to share your ChatGPT Wrapped with friends?</span>
        </div>
      </div>
    </div>
  );
}
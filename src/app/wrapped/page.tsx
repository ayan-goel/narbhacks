"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar, Sparkles, ArrowRight, Upload } from "lucide-react";
import Link from "next/link";

export default function WrappedPage() {
  const { user } = useUser();
  const currentYear = new Date().getFullYear();

  // Get user stats to see which years have data
  const userStats = useQuery(
    api.analytics.getUserStats,
    user?.id ? { userId: user.id, year: currentYear } : "skip"
  );

  // For now, we'll just show available years based on current year
  // In a full implementation, you'd query for all years with data
  const availableYears = userStats ? [currentYear] : [];

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your wrapped
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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-[#10A37F]" />
            <h1 className="text-4xl font-bold text-gray-900">
              Your ChatGPT Wrapped
            </h1>
            <Sparkles className="h-8 w-8 text-[#10A37F]" />
          </div>
          <p className="text-xl text-gray-600">
            Discover your AI journey through the years
          </p>
        </div>

        {availableYears.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              Select a Year
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableYears.map((year) => (
                <Link
                  key={year}
                  href={`/wrapped/${year}`}
                  className="group bg-gradient-to-br from-[#10A37F] to-[#0d8f72] rounded-xl p-6 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="h-8 w-8 text-white/80" />
                    <ArrowRight className="h-6 w-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{year}</h3>
                  <p className="text-white/80 text-sm">
                    View your {year} ChatGPT wrapped
                  </p>
                  
                  {year === currentYear && (
                    <div className="mt-3 inline-flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1 text-xs">
                      <Sparkles className="h-3 w-3" />
                      <span>Latest</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Coming Soon Years */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Coming Soon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[currentYear - 1, currentYear - 2].map((year) => (
                  <div
                    key={year}
                    className="bg-gray-100 rounded-xl p-6 text-gray-400"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Calendar className="h-8 w-8" />
                      <div className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        Coming Soon
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{year}</h3>
                    <p className="text-sm">
                      Upload historical data to unlock
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 max-w-2xl mx-auto">
              <Upload className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Wrapped Available Yet
              </h2>
              
              <p className="text-gray-600 mb-6">
                Upload your ChatGPT conversation data to generate your first wrapped and discover 
                fascinating insights about your AI interactions.
              </p>
              
              <Link
                href="/upload"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#10A37F] text-white rounded-lg hover:bg-[#0d8f72] transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Your Data</span>
              </Link>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            💡 What is ChatGPT Wrapped?
          </h3>
          <p className="text-blue-800 text-sm mb-3">
            Just like Spotify Wrapped, ChatGPT Wrapped analyzes your conversation history and creates 
            beautiful, shareable cards showing your AI interaction patterns, favorite topics, and personality insights.
          </p>
          <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
            <li>📊 Usage statistics and conversation patterns</li>
            <li>🧠 Your most discussed topics and interests</li>
            <li>🎨 AI-generated personality insights</li>
            <li>📱 Beautiful, shareable cards for social media</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
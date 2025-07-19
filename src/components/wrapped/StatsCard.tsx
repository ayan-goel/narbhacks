"use client";

import WrappedCard from "./WrappedCard";
import { Sparkles, MessageSquare, Hash, TrendingUp } from "lucide-react";

interface StatsCardProps {
  data: {
    totalConversations: number;
    totalMessages: number;
    totalTokens: number;
    averageConversationLength: number;
    mostActiveMonth: number;
    favoriteTimeOfDay: string;
  };
  year: number;
  index?: number;
}

export default function StatsCard({ data, year, index }: StatsCardProps) {
  const getMonthName = (month: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "Unknown";
  };

  return (
    <WrappedCard backgroundColor="#10A37F" index={index}>
      <div className="space-y-6">
        <div className="text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Your {year}
          </h1>
          <h2 className="text-xl text-white/80">
            ChatGPT Wrapped
          </h2>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-white/80" />
            <div className="text-4xl font-bold text-white">
              {data.totalConversations.toLocaleString()}
            </div>
            <div className="text-white/70">conversations</div>
          </div>

          <div className="text-center">
            <Hash className="h-8 w-8 mx-auto mb-2 text-white/80" />
            <div className="text-4xl font-bold text-white">
              {data.totalMessages.toLocaleString()}
            </div>
            <div className="text-white/70">messages exchanged</div>
          </div>

          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-white/80" />
            <div className="text-2xl font-bold text-white">
              {Math.round(data.averageConversationLength)}
            </div>
            <div className="text-white/70">messages per conversation</div>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-center">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-sm text-white/70 mb-1">Most active month</div>
          <div className="text-lg font-semibold text-white">
            {getMonthName(data.mostActiveMonth)}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-sm text-white/70 mb-1">Favorite time</div>
          <div className="text-lg font-semibold text-white capitalize">
            {data.favoriteTimeOfDay}
          </div>
        </div>

        <div className="text-xs text-white/60 mt-4">
          Generated with ChatGPT Wrapped
        </div>
      </div>
    </WrappedCard>
  );
}
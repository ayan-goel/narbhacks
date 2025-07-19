"use client";

import WrappedCard from "./WrappedCard";
import { Calendar, Clock, TrendingUp } from "lucide-react";

interface TimelineCardProps {
  data: {
    mostActiveMonth: number;
    favoriteTimeOfDay: string;
    totalConversations: number;
    year: number;
  };
  year: number;
  index?: number;
}

export default function TimelineCard({ data, year, index }: TimelineCardProps) {
  const getMonthName = (month: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "Unknown";
  };

  const getTimeOfDayEmoji = (timeOfDay?: string) => {
    if (!timeOfDay) return '⏰';
    switch (timeOfDay.toLowerCase()) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌇';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  const getSeasonFromMonth = (month: number) => {
    if (month >= 3 && month <= 5) return { season: 'Spring', emoji: '🌸' };
    if (month >= 6 && month <= 8) return { season: 'Summer', emoji: '☀️' };
    if (month >= 9 && month <= 11) return { season: 'Fall', emoji: '🍂' };
    return { season: 'Winter', emoji: '❄️' };
  };

  const { season, emoji } = getSeasonFromMonth(data.mostActiveMonth);
  const timeEmoji = getTimeOfDayEmoji(data.favoriteTimeOfDay);

  // Mock timeline data - in real implementation, this would come from actual data
  const totalConvs = data.totalConversations ?? 0;

  const timelineEvents = [
    { month: 'Jan', conversations: Math.floor(totalConvs * 0.08) },
    { month: 'Feb', conversations: Math.floor(totalConvs * 0.07) },
    { month: 'Mar', conversations: Math.floor(totalConvs * 0.09) },
    { month: 'Apr', conversations: Math.floor(totalConvs * 0.08) },
    { month: 'May', conversations: Math.floor(totalConvs * 0.11) },
    { month: 'Jun', conversations: Math.floor(totalConvs * 0.09) },
    { month: 'Jul', conversations: Math.floor(totalConvs * 0.07) },
    { month: 'Aug', conversations: Math.floor(totalConvs * 0.08) },
    { month: 'Sep', conversations: Math.floor(totalConvs * 0.10) },
    { month: 'Oct', conversations: Math.floor(totalConvs * 0.09) },
    { month: 'Nov', conversations: Math.floor(totalConvs * 0.07) },
    { month: 'Dec', conversations: Math.floor(totalConvs * 0.07) },
  ];

  const maxConversations = Math.max(1, ...timelineEvents.map(e => e.conversations));

  return (
    <WrappedCard backgroundColor="#8B5CF6" index={index}>
      <div className="space-y-6">
        <div className="text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-white" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Your {year} Journey
          </h1>
          <p className="text-white/80">
            When you explored AI the most
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">{emoji}</span>
              <span className="font-semibold text-white">Peak Season</span>
            </div>
            <div className="text-xl font-bold text-white">
              {getMonthName(data.mostActiveMonth)}
            </div>
            <div className="text-white/70 text-sm">
              Your most active month
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">{timeEmoji}</span>
              <span className="font-semibold text-white">Golden Hour</span>
            </div>
            <div className="text-xl font-bold text-white capitalize">
              {data.favoriteTimeOfDay || 'Unknown'}
            </div>
            <div className="text-white/70 text-sm">
              Your preferred time
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white text-center mt-4">
          Monthly Activity
        </h3>
        
        <div className="space-y-2">
          {timelineEvents.map((event, idx) => {
            const height = maxConversations > 0 ? (event.conversations / maxConversations) * 40 : 10;
            const opacity = maxConversations > 0 ? 0.3 + (event.conversations / maxConversations) * 0.7 : 0.3;
            
            return (
              <div key={event.month} className="flex items-end space-x-2">
                <div className="w-8 text-xs text-white/70 text-center">
                  {event.month}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.round((event.conversations / maxConversations) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-8 text-xs text-white/70 text-right">
                  {isNaN(event.conversations) ? 0 : event.conversations}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-white/90 text-sm font-medium">Growth Story</span>
            </div>
            <p className="text-white/80 text-xs">
              You had consistent conversations throughout {year}, with a peak in {season.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="text-xs text-white/60 text-center">
          Generated with ChatGPT Wrapped
        </div>
      </div>
    </WrappedCard>
  );
}
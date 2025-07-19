"use client";

import WrappedCard from "./WrappedCard";
import { Heart, Meh, Frown } from "lucide-react";

interface SentimentCardProps {
  data: {
    sentimentBreakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
    dominantSentiment: string;
  };
  year: number;
  index?: number;
}

export default function SentimentCard({ data, year, index }: SentimentCardProps) {
  const total = data.sentimentBreakdown.positive + data.sentimentBreakdown.negative + data.sentimentBreakdown.neutral;
  
  const getSentimentPercentage = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return Heart;
      case 'negative': return Frown;
      default: return Meh;
    }
  };

  const sentiments = [
    { 
      name: 'Positive', 
      count: data.sentimentBreakdown.positive, 
      percentage: getSentimentPercentage(data.sentimentBreakdown.positive),
      color: '#10B981',
      icon: Heart,
    },
    { 
      name: 'Neutral', 
      count: data.sentimentBreakdown.neutral, 
      percentage: getSentimentPercentage(data.sentimentBreakdown.neutral),
      color: '#6B7280',
      icon: Meh,
    },
    { 
      name: 'Negative', 
      count: data.sentimentBreakdown.negative, 
      percentage: getSentimentPercentage(data.sentimentBreakdown.negative),
      color: '#EF4444',
      icon: Frown,
    },
  ].sort((a, b) => b.count - a.count);

  const DominantIcon = getSentimentIcon(data.dominantSentiment);

  return (
    <WrappedCard backgroundColor="#F59E0B" index={index}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {getSentimentEmoji(data.dominantSentiment)}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Your {year} Emotions
          </h1>
          <p className="text-white/80">
            How you felt during your AI conversations
          </p>
        </div>

        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DominantIcon className="h-6 w-6 text-white" />
            <span className="font-semibold text-white">Overall Mood</span>
          </div>
          <div className="text-xl font-bold text-white capitalize">
            {data.dominantSentiment}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white text-center mb-4">
          Sentiment Breakdown
        </h3>
        
        <div className="space-y-3">
          {sentiments.map((sentiment, idx) => {
            const Icon = sentiment.icon;
            return (
              <div key={sentiment.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    className="h-5 w-5 text-white" 
                    style={{ color: sentiment.color }}
                  />
                  <span className="text-white font-medium">{sentiment.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{sentiment.percentage}%</div>
                  <div className="text-white/70 text-sm">{sentiment.count} conversations</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/90 text-sm italic text-center">
              &quot;Your conversations show a balanced emotional journey through AI exploration&quot;
            </p>
          </div>
        </div>

        <div className="text-xs text-white/60 text-center mt-4">
          Generated with ChatGPT Wrapped
        </div>
      </div>
    </WrappedCard>
  );
}
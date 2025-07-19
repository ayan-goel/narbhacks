"use client";

import WrappedCard from "./WrappedCard";
import { Brain, Hash } from "lucide-react";

interface TopicsCardProps {
  data: {
    topTopics: string[];
    topicCount: number;
  };
  year: number;
  index?: number;
}

export default function TopicsCard({ data, year, index }: TopicsCardProps) {
  const displayTopics = data.topTopics.slice(0, 8);

  return (
    <WrappedCard backgroundColor="#6366F1" index={index}>
      <div className="space-y-6">
        <div className="text-center">
          <Brain className="h-12 w-12 mx-auto mb-4 text-white" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Your Mind in {year}
          </h1>
          <p className="text-white/80">
            The topics you explored most
          </p>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-white mb-2">
            {data.topicCount}
          </div>
          <div className="text-white/70">unique topics discussed</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white text-center mb-4">
          Your Top Topics
        </h3>
        
        <div className="space-y-3">
          {displayTopics.map((topic, idx) => (
            <div 
              key={idx}
              className="flex items-center space-x-3 bg-white/10 rounded-lg p-3"
            >
              <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {idx + 1}
                </span>
              </div>
              <span className="text-white font-medium capitalize">
                {topic}
              </span>
            </div>
          ))}
        </div>

        {data.topTopics.length > 8 && (
          <div className="text-center text-white/60 text-sm">
            +{data.topTopics.length - 8} more topics explored
          </div>
        )}

        <div className="text-xs text-white/60 text-center mt-6">
          Generated with ChatGPT Wrapped
        </div>
      </div>
    </WrappedCard>
  );
}
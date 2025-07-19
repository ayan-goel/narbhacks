"use client";

import WrappedCard from "./WrappedCard";
import { Lightbulb, User, Sparkles } from "lucide-react";

interface InsightsCardProps {
  data: {
    summary: string;
    yearInReview: string;
    personality: string;
  };
  year: number;
  index?: number;
}

export default function InsightsCard({ data, year, index }: InsightsCardProps) {
  return (
    <WrappedCard backgroundColor="#EC4899" index={index}>
      <div className="space-y-6">
        <div className="text-center">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-white" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Your {year} Insights
          </h1>
          <p className="text-white/80">
            What your conversations reveal
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <User className="h-5 w-5 text-white/80" />
              <span className="font-semibold text-white">Your AI Personality</span>
            </div>
            <div className="text-xl font-bold text-white">
              {data.personality}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Year in Review</span>
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {data.yearInReview}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Key Insights</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {data.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="bg-white/10 rounded-lg p-3 mb-4">
          <p className="text-white/80 text-sm italic">
            "Every conversation was a step in your AI journey"
          </p>
        </div>
        
        <div className="text-xs text-white/60">
          Generated with ChatGPT Wrapped
        </div>
      </div>
    </WrappedCard>
  );
}
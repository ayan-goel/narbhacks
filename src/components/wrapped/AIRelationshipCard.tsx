"use client";

import WrappedCard from "./WrappedCard";
import { motion } from "framer-motion";
import { Heart, User, Sparkles, TrendingUp } from "lucide-react";

interface AIRelationshipCardProps {
  data: {
    relationshipStage: string;
    trustLevel: number;
    evolutionStory: string;
    personalityMatch: string;
  };
  year: number;
  index?: number;
}

export default function AIRelationshipCard({ data, year, index }: AIRelationshipCardProps) {
  const getStageColor = (stage: string) => {
    if (stage.includes('Companion')) return 'from-pink-400 to-rose-500';
    if (stage.includes('Regular')) return 'from-purple-400 to-indigo-500';
    return 'from-blue-400 to-cyan-500';
  };

  const getHeartCount = (trustLevel: number) => {
    return Math.min(5, Math.max(1, Math.round(trustLevel / 20)));
  };

  return (
    <WrappedCard 
      backgroundGradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)" 
      index={index}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4"
          >
            <Heart className="h-8 w-8 text-white" fill="currentColor" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            AI Relationship
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80"
          >
            Your bond with AI in {year}
          </motion.p>
        </div>

        {/* Relationship Stage */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
        >
          <User className="h-8 w-8 mx-auto mb-3 text-white/80" />
          <div className="text-2xl font-bold text-white mb-2">
            {data.relationshipStage}
          </div>
          <div className="text-white/70 text-sm">
            Your relationship status with AI
          </div>
        </motion.div>

        {/* Trust Level */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">Trust Level</span>
            <span className="text-2xl font-bold text-white">{data.trustLevel}%</span>
          </div>
          
          <div className="flex justify-center space-x-2 mb-3">
            {Array.from({ length: 5 }, (_, i) => (
              <Heart 
                key={i}
                className={`h-6 w-6 ${i < getHeartCount(data.trustLevel) ? 'text-red-300' : 'text-white/30'}`}
                fill="currentColor"
              />
            ))}
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-red-300 to-pink-300 rounded-full transition-all duration-1000"
              style={{ width: `${data.trustLevel}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="space-y-4"
      >
        <div className="text-center">
          <div className="text-lg font-bold text-white mb-2">
            {data.personalityMatch}
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            {data.evolutionStory}
          </p>
        </div>
        
        <div className="text-xs text-white/60 text-center">
          Your AI journey continues to grow ✨
        </div>
      </motion.div>
    </WrappedCard>
  );
} 
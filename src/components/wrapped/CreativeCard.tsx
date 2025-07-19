"use client";

import WrappedCard from "./WrappedCard";
import { motion } from "framer-motion";
import { Palette, Lightbulb, Zap, Star, Sparkles } from "lucide-react";

interface CreativeCardProps {
  data: {
    creativeConversations: number;
    brainstormingSessions: number;
    creativityScore: number;
    innovationLevel: string;
  };
  year: number;
  index?: number;
}

export default function CreativeCard({ data, year, index }: CreativeCardProps) {
  const getCreativityEmoji = (score: number) => {
    if (score >= 90) return '🎨';
    if (score >= 75) return '✨';
    if (score >= 60) return '💡';
    return '🌟';
  };

  const getInnovationColor = (level: string) => {
    if (level.includes('Visionary')) return 'from-purple-400 to-pink-500';
    if (level.includes('Imaginative')) return 'from-pink-400 to-rose-500';
    return 'from-blue-400 to-purple-500';
  };

  return (
    <WrappedCard 
      backgroundGradient="linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" 
      index={index}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4"
          >
            <Palette className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Creative Spark
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80"
          >
            Your imagination in {year}
          </motion.p>
        </div>

        {/* Creative Stats */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Palette className="h-6 w-6 text-white/80" />
              <span className="text-white font-medium">Creative Conversations</span>
            </div>
            <span className="text-2xl font-bold text-white">{data.creativeConversations}</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Lightbulb className="h-6 w-6 text-white/80" />
              <span className="text-white font-medium">Brainstorm Sessions</span>
            </div>
            <span className="text-2xl font-bold text-white">{data.brainstormingSessions}</span>
          </motion.div>
        </div>

        {/* Creativity Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-3">{getCreativityEmoji(data.creativityScore)}</div>
          <div className="text-3xl font-bold text-white mb-2">
            {data.creativityScore}/100
          </div>
          <div className="text-white/70 text-sm mb-3">
            Your creativity score
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full transition-all duration-1000"
              style={{ width: `${data.creativityScore}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="h-5 w-5 text-white" />
            <span className="text-white font-bold">Innovation Level</span>
          </div>
          <div className="text-lg font-bold text-white">
            {data.innovationLevel}
          </div>
        </div>
        
        <div className="text-xs text-white/60">
          Keep creating magic with AI ✨
        </div>
      </motion.div>
    </WrappedCard>
  );
} 
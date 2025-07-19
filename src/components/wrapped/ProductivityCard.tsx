"use client";

import WrappedCard from "./WrappedCard";
import { motion } from "framer-motion";
import { Zap, Clock, Target, TrendingUp, Sun, Moon } from "lucide-react";

interface ProductivityCardProps {
  data: {
    peakProductivityHour: number;
    productivityType: string;
    focusScore: number;
    workflowStyle: string;
  };
  year: number;
  index?: number;
}

export default function ProductivityCard({ data, year, index }: ProductivityCardProps) {
  const getTimeIcon = (type: string) => {
    if (type.includes('Early')) return Sun;
    if (type.includes('Night')) return Moon;
    return Clock;
  };

  const getTimeEmoji = (hour: number) => {
    if (hour >= 6 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 18) return '☀️';
    if (hour >= 18 && hour < 22) return '🌅';
    return '🌙';
  };

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const TimeIcon = getTimeIcon(data.productivityType);

  return (
    <WrappedCard 
      backgroundGradient="linear-gradient(135deg, #4ade80 0%, #22c55e 100%)" 
      index={index}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4"
          >
            <Zap className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Productivity Master
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80"
          >
            Your peak performance patterns
          </motion.p>
        </div>

        {/* Peak Hour */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-3">{getTimeEmoji(data.peakProductivityHour)}</div>
          <div className="text-2xl font-bold text-white mb-2">
            {formatHour(data.peakProductivityHour)}
          </div>
          <div className="text-white/70 text-sm">
            Your peak productivity hour
          </div>
        </motion.div>

        {/* Productivity Type */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex items-center justify-center space-x-3 mb-3">
            <TimeIcon className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">{data.productivityType}</span>
          </div>
          <div className="text-white/70 text-sm text-center">
            Your natural rhythm type
          </div>
        </motion.div>

        {/* Focus Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-white/80" />
              <span className="text-white font-medium">Focus Score</span>
            </div>
            <span className="text-2xl font-bold text-white">{data.focusScore}/100</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full transition-all duration-1000"
              style={{ width: `${data.focusScore}%` }}
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
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-white/80" />
            <span className="text-white font-bold">Workflow Style</span>
          </div>
          <div className="text-lg font-bold text-white">
            {data.workflowStyle}
          </div>
        </div>
        
        <div className="text-xs text-white/60">
          Optimizing your AI productivity in {year} 🚀
        </div>
      </motion.div>
    </WrappedCard>
  );
} 
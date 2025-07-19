"use client";

import WrappedCard from "./WrappedCard";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Hash, MessageSquare, Type, Calendar, Clock, Zap, BookOpen, Sparkles } from "lucide-react";

interface NumbersCardProps {
  data: {
    totalConversations: number;
    totalMessages: number;
    totalWords: number;
    totalTokens: number;
    averageLength: number;
    daysActive: number;
    avgWordsPerMessage: number;
    uniqueTopics: number;
    peakDailyMessages: number;
    averageDailyConversations: number;
    // longestConv and shortestConv not passed currently but we can compute outside; skip.
  };
  year: number;
  index?: number;
}

function AnimatedCounter({ 
  from = 0, 
  to, 
  duration = 2,
  delay = 0,
  className = ""
}: { 
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const count = useMotionValue(from);
  const [displayValue, setDisplayValue] = useState<string | number>(from);

  useEffect(() => {
    const unsubscribe = count.onChange((latest) => {
      const formatted = latest < 1000 ? Math.round(latest) : 
        latest < 1000000 ? `${(latest / 1000).toFixed(1)}k` :
        `${(latest / 1000000).toFixed(1)}M`;
      setDisplayValue(formatted);
    });

    const controls = animate(count, to, { 
      duration,
      delay,
      ease: "easeOut" 
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [count, to, duration, delay]);

  return <span className={className}>{displayValue}</span>;
}

export default function NumbersCard({ data, year, index }: NumbersCardProps) {
  const stats = [
    {
      icon: MessageSquare,
      label: "Conversations",
      value: data.totalConversations,
      color: "from-blue-400 to-blue-600",
      delay: 0.2,
    },
    {
      icon: Hash,
      label: "Messages",
      value: data.totalMessages,
      color: "from-purple-400 to-purple-600",
      delay: 0.4,
    },
    {
      icon: Type,
      label: "Words",
      value: data.totalWords,
      color: "from-green-400 to-green-600",
      delay: 0.6,
    },
    {
      icon: Zap,
      label: "Tokens",
      value: data.totalTokens,
      color: "from-orange-400 to-orange-600",
      delay: 0.8,
    },
    {
      icon: Calendar,
      label: "Days Active",
      value: data.daysActive,
      color: "from-pink-400 to-pink-600",
      delay: 1.0,
    },
    {
      icon: Clock,
      label: "Avg Length",
      value: data.averageLength,
      color: "from-cyan-400 to-cyan-600",
      delay: 1.2,
      suffix: " msgs",
    },
    {
      icon: BookOpen,
      label: "Avg Words",
      value: data.avgWordsPerMessage,
      color: "from-teal-400 to-teal-600",
      delay: 1.4,
      suffix: " words",
    },
    {
      icon: Sparkles,
      label: "Topics",
      value: data.uniqueTopics,
      color: "from-indigo-400 to-fuchsia-600",
      delay: 1.6,
    },
    {
      icon: MessageSquare,
      label: "Peak Daily Msgs",
      value: data.peakDailyMessages,
      color: "from-lime-400 to-emerald-600",
      delay: 1.8,
    },
    {
      icon: Calendar,
      label: "Avg Daily Convos",
      value: data.averageDailyConversations,
      color: "from-sky-400 to-blue-600",
      delay: 2.0,
    },
  ];

  return (
    <WrappedCard 
      backgroundGradient="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" 
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
            <Hash className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            By the Numbers
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80"
          >
            Your {year} in impressive stats
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: stat.delay, duration: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-white/70 text-sm mb-1">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-bold text-white flex items-center">
                      <AnimatedCounter 
                        to={stat.value} 
                        delay={stat.delay + 0.5}
                        duration={1.5}
                      />
                      {stat.suffix && (
                        <span className="text-lg ml-1 text-white/80">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Highlight */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-6"
      >
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-white/90 text-sm mb-1">
            🏆 That's impressive!
          </div>
          <div className="text-white font-semibold">
            You're clearly an AI power user
          </div>
        </div>
      </motion.div>
    </WrappedCard>
  );
} 
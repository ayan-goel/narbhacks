"use client";

import WrappedCard from "./WrappedCard";
import { motion } from "framer-motion";
import { HelpCircle, Lightbulb, Search, Brain, Target } from "lucide-react";

interface QuestionMasterCardProps {
  data: {
    totalQuestions: number;
    questionTypes: {
      how: number;
      what: number;
      why: number;
      when: number;
      where: number;
      help: number;
    };
    topQuestionWord: string;
    curiosityScore: number;
  };
  year: number;
  index?: number;
}

export default function QuestionMasterCard({ data, year, index }: QuestionMasterCardProps) {
  const questionTypeData = Object.entries(data.questionTypes)
    .sort(([,a], [,b]) => b - a)
    .map(([type, count], idx) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: Math.round((count / data.totalQuestions) * 100) || 0,
      delay: idx * 0.2,
    }));

  const getCuriosityLevel = (score: number) => {
    if (score >= 80) return { level: "Extremely Curious", emoji: "🔥", color: "from-red-400 to-orange-500" };
    if (score >= 60) return { level: "Very Curious", emoji: "✨", color: "from-yellow-400 to-orange-500" };
    if (score >= 40) return { level: "Curious Explorer", emoji: "🌟", color: "from-blue-400 to-purple-500" };
    if (score >= 20) return { level: "Casual Questioner", emoji: "💭", color: "from-green-400 to-blue-500" };
    return { level: "Thoughtful", emoji: "🤔", color: "from-gray-400 to-blue-400" };
  };

  const curiosityInfo = getCuriosityLevel(data.curiosityScore);

  return (
    <WrappedCard 
      backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
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
            <HelpCircle className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Question Master
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80"
          >
            Your curiosity patterns revealed
          </motion.p>
        </div>

        {/* Main Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {data.totalQuestions.toLocaleString()}
            </div>
            <div className="text-white/80 text-lg">questions asked</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">{curiosityInfo.emoji}</div>
              <div className="text-white font-semibold text-sm">
                {curiosityInfo.level}
              </div>
              <div className="text-white/70 text-xs">
                {data.curiosityScore}% curiosity score
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Search className="h-6 w-6 mx-auto mb-2 text-white/80" />
              <div className="text-white font-semibold text-sm">
                &quot;{data.topQuestionWord}&quot;
              </div>
              <div className="text-white/70 text-xs">
                your favorite question word
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Question Types */}
      <div className="space-y-4">
        {/* Removed header per design update */}
        
        <div className="space-y-2 mt-4">
          {questionTypeData.slice(0, 4).map((item, idx) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + item.delay }}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-white font-medium">{item.type}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{item.count}</div>
                <div className="text-white/70 text-xs">{item.percentage}%</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-2xl p-4 text-center"
        >
          <Brain className="h-5 w-5 mx-auto mb-2 text-white/80" />
          <div className="text-white/90 text-sm font-medium">
            {data.curiosityScore >= 70 ? 
              "You're a natural born learner! 🎓" : 
              data.curiosityScore >= 50 ? 
              "Your curiosity drives great conversations 💡" :
              "You ask thoughtful, focused questions 🎯"
            }
          </div>
        </motion.div>
      </div>
    </WrappedCard>
  );
} 
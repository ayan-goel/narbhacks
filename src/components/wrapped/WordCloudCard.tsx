"use client";

import WrappedCard from "./WrappedCard";
import { motion } from "framer-motion";
import { Type, Sparkles, BookOpen } from "lucide-react";

interface WordCloudCardProps {
  data: {
    topWords: string[];
    totalUniqueWords: number;
    mostUsedWord: string;
    vocabularyRichness: number;
  };
  year: number;
  index?: number;
}

export default function WordCloudCard({ data, year, index }: WordCloudCardProps) {
  // Create word sizes and colors based on position/importance
  const wordElements = data.topWords.map((word, idx) => {
    const size = Math.max(12, 24 - idx * 1.5); // Decreasing size
    const colors = [
      'text-pink-300', 'text-blue-300', 'text-green-300', 'text-yellow-300',
      'text-purple-300', 'text-indigo-300', 'text-red-300', 'text-orange-300',
      'text-cyan-300', 'text-emerald-300', 'text-violet-300', 'text-rose-300',
    ];
    const color = colors[idx % colors.length];
    
    return {
      word,
      size,
      color,
      delay: idx * 0.1,
      // Random positioning for cloud effect
      x: (idx % 3) * 30 + Math.random() * 20,
      y: Math.floor(idx / 3) * 25 + Math.random() * 15,
    };
  });

  const getRichnessLevel = (score: number) => {
    if (score >= 80) return { level: "Linguistically Rich", emoji: "🎭" };
    if (score >= 60) return { level: "Diverse Vocabulary", emoji: "📚" };
    if (score >= 40) return { level: "Well-Spoken", emoji: "💬" };
    return { level: "Clear Communicator", emoji: "🗣️" };
  };

  const richnessInfo = getRichnessLevel(data.vocabularyRichness);

  return (
    <WrappedCard 
      backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
      index={index}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4"
          >
            <Type className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Your Words
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80"
          >
            The language that defines you
          </motion.p>
        </div>

        {/* Word Cloud */}
        <div className="relative h-40 bg-white/5 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 p-4">
            {wordElements.slice(0, 24).map((wordItem) => (
              <motion.div
                key={wordItem.word}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.8 + wordItem.delay,
                  type: "spring",
                  bounce: 0.4
                }}
                className={`absolute ${wordItem.color} font-bold pointer-events-none`}
                style={{
                  fontSize: `${wordItem.size}px`,
                  left: `${wordItem.x}%`,
                  top: `${wordItem.y}%`,
                  transform: `rotate(${Math.random() * 20 - 10}deg)`,
                }}
              >
                {wordItem.word}
              </motion.div>
            ))}
          </div>
          
          {/* Overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5" />
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="space-y-3"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              "{data.mostUsedWord}"
            </div>
            <div className="text-white/80 text-sm">your signature word</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <BookOpen className="h-5 w-5 mx-auto mb-1 text-white/80" />
              <div className="text-lg font-bold text-white">
                {data.totalUniqueWords.toLocaleString()}
              </div>
              <div className="text-white/70 text-xs">unique words</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-lg mb-1">{richnessInfo.emoji}</div>
              <div className="text-white font-semibold text-xs">
                {richnessInfo.level}
              </div>
              <div className="text-white/70 text-xs">
                {data.vocabularyRichness}% richness
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-sm rounded-2xl p-4">
          <Sparkles className="h-5 w-5 mx-auto mb-2 text-white/80" />
          <div className="text-white/90 text-sm font-medium">
            {data.vocabularyRichness >= 70 ? 
              "Your vocabulary shows remarkable diversity! 📖" : 
              data.vocabularyRichness >= 50 ? 
              "You express yourself with varied, rich language 🌟" :
              "You communicate with clear, focused language 💡"
            }
          </div>
        </div>
      </motion.div>
    </WrappedCard>
  );
} 
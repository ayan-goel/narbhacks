"use client";

import WrappedCard from "./WrappedCard";
import { motion } from "framer-motion";
import { Sparkles, Calendar, MessageSquare } from "lucide-react";

interface WelcomeCardProps {
  data: {
    year: number;
    totalConversations: number;
    totalMessages: number;
    greeting: string;
  };
  year: number;
  index?: number;
}

export default function WelcomeCard({ data, year, index }: WelcomeCardProps) {
  return (
    <WrappedCard 
      backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
      index={index}
    >
      <div className="space-y-8">
        {/* Animated Logo */}
        <div className="text-center">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="inline-block mb-6"
          >
            <Sparkles className="h-16 w-16 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Your {data.year}
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-2xl text-white/90 mb-2"
          >
            ChatGPT Wrapped
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-white/80 text-lg"
          >
            A journey through your AI conversations
          </motion.p>
        </div>

        {/* Quick Stats Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold text-white">
                {data.totalConversations.toLocaleString()}
              </div>
              <div className="text-white/70 text-sm">conversations</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold text-white">
                {data.totalMessages.toLocaleString()}
              </div>
              <div className="text-white/70 text-sm">messages</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <p className="text-white/90 text-lg font-medium">
            Ready to explore your AI journey?
          </p>
        </div>
        
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-white/60 text-sm"
        >
          Swipe to continue ✨
        </motion.div>
      </motion.div>
    </WrappedCard>
  );
} 
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WrappedCardProps {
  children: ReactNode;
  backgroundColor?: string;
  textColor?: string;
  index?: number;
}

export default function WrappedCard({ 
  children, 
  backgroundColor = "#1A1A1A",
  textColor = "white",
  index = 0
}: WrappedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="w-full max-w-md mx-auto aspect-[9/16] rounded-2xl shadow-2xl overflow-hidden"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="h-full p-8 flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}
"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface WrappedCardProps {
  children: ReactNode;
  backgroundColor?: string;
  backgroundGradient?: string;
  textColor?: string;
  index?: number;
  className?: string;
  animationDelay?: number;
}

export default function WrappedCard({ 
  children, 
  backgroundColor = "#1A1A1A",
  backgroundGradient,
  textColor = "white",
  index = 0,
  className = "",
  animationDelay = 0
}: WrappedCardProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        delay: animationDelay + (index * 0.1),
        ease: "easeOut",
        type: "spring",
        bounce: 0.4
      }
    });
  }, [controls, index, animationDelay]);

  const backgroundStyle = backgroundGradient 
    ? { background: backgroundGradient }
    : { backgroundColor };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={controls}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full max-w-md mx-auto aspect-[9/16] rounded-3xl shadow-2xl overflow-hidden
        relative border border-white/10 backdrop-blur-xl
        ${className}
      `}
      style={{ ...backgroundStyle, color: textColor }}
    >
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-full bg-gradient-to-tr from-white/10 to-transparent"
        />
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10" />
      
      {/* Content */}
      <div className="relative h-full p-8 flex flex-col justify-between z-10">
        {children}
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
    </motion.div>
  );
}
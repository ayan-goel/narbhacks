"use client";

import { ReactNode } from "react";

interface WrappedLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

export default function WrappedLayout({ 
  children, 
  backgroundColor = "#1A1A1A" 
}: WrappedLayoutProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
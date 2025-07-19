"use client";

import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10A37F] to-[#1A1A1A] flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  );
}
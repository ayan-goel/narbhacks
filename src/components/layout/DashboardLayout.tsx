"use client";

import { ReactNode } from "react";
import ModernHeader from "@/components/ModernHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background Elements - matching landing page */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <ModernHeader />
      <main className="container mx-auto px-4 py-6 pt-24">
        {children}
      </main>
    </div>
  );
}
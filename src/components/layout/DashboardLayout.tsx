"use client";

import { ReactNode } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";

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

      {/* Simplified Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-30 group-hover:opacity-100 blur transition duration-300"></div>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                ChatGPT Wrapped
              </span>
            </Link>

            {/* User Controls - Right */}
            <div className="flex items-center">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                    userButtonPopoverCard: "shadow-2xl",
                    userButtonPopoverActionButton: "hover:bg-purple-50"
                  }
                }}
                showName={false}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pt-24">
        {children}
      </main>
    </div>
  );
}
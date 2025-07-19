"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsOverview from "@/components/dashboard/StatsOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import { Loader2, Upload, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const currentYear = new Date().getFullYear();

  // Get user stats for current year
  const userStats = useQuery(
    api.analytics.getUserStats,
    user?.id ? { userId: user.id, year: currentYear } : "skip"
  );

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Welcome Back!
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Please sign in to access your personalized ChatGPT dashboard and explore your AI journey.
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>Sign In</span>
              <Sparkles className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasData = !!userStats;

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 mb-4 border border-purple-200/50">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              Your AI Dashboard
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Welcome back,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {user.firstName || "Explorer"}! 👋
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ready to dive into your ChatGPT insights and create something amazing?
          </p>
        </div>

        {hasData ? (
          <StatsOverview stats={userStats} year={currentYear} />
        ) : (
          <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Let's Create Your ChatGPT Wrapped! 🎁
              </h2>
              <p className="text-white/90 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
                Upload your ChatGPT conversation data to discover fascinating insights about your AI interactions, 
                generate beautiful wrapped cards, and see how you've grown with AI this year.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center space-x-3 bg-white text-purple-600 px-10 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <Upload className="h-6 w-6" />
                <span>Upload Your Data</span>
              </Link>
            </div>
          </div>
        )}

        <QuickActions hasData={hasData} currentYear={currentYear} />

        {/* Instructions for new users */}
        {!hasData && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-blue-900 text-xl">
                How to get your ChatGPT data:
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ol className="list-decimal list-inside space-y-3 text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600 mt-0.5">1.</span>
                  <span>Go to <strong>ChatGPT Settings</strong> (click your profile in ChatGPT)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600 mt-0.5">2.</span>
                  <span>Navigate to <strong>Data controls</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600 mt-0.5">3.</span>
                  <span>Click <strong>Export data</strong></span>
                </li>
              </ol>
              <ol className="list-decimal list-inside space-y-3 text-blue-800" start={4}>
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600 mt-0.5">4.</span>
                  <span>Download your <strong>conversations.json</strong> file</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-semibold text-blue-600 mt-0.5">5.</span>
                  <span>Upload it here to generate your wrapped!</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
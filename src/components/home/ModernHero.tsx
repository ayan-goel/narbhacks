"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function ModernHero() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-indigo-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-8 border border-purple-200/50">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              Your AI journey, beautifully visualized
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Your ChatGPT
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Wrapped
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your ChatGPT conversations into stunning visual insights. 
            Discover patterns, track your AI interactions, and share your journey 
            with beautiful wrapped cards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isSignedIn ? (
              <Link 
                href="/dashboard"
                className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/sign-in"
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link 
                  href="#how-it-works"
                  className="px-8 py-4 rounded-2xl font-semibold text-lg text-gray-700 hover:text-gray-900 hover:bg-white/50 transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
                >
                  <span>See how it works</span>
                </Link>
              </>
            )}
          </div>

          {/* Floating Cards Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
              {/* Stats Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 hover:rotate-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">Your Stats</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Conversations</span>
                    <span className="font-bold text-gray-800">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Messages</span>
                    <span className="font-bold text-gray-800">15,623</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Most Active</span>
                    <span className="font-bold text-gray-800">December</span>
                  </div>
                </div>
              </div>

              {/* Topics Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 hover:-rotate-1 md:translate-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">Top Topics</span>
                </div>
                <div className="space-y-2">
                  {["Programming", "Writing", "Learning", "Research"].map((topic, i) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                        i === 0 ? "from-purple-400 to-pink-500" :
                        i === 1 ? "from-blue-400 to-cyan-500" :
                        i === 2 ? "from-green-400 to-emerald-500" :
                        "from-orange-400 to-red-500"
                      }`}></div>
                      <span className="text-sm text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 hover:rotate-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">AI Insights</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "You're most creative in the evening, with 68% of your deep conversations happening after 6 PM."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function CTA() {
  const { isSignedIn } = useUser();

  const steps = [
    "Export your ChatGPT conversations",
    "Upload your data securely",
    "Get beautiful insights & wrapped cards"
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/30">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Simple 3-step process
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Start your journey in
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent">
              less than 5 minutes
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your ChatGPT conversations into stunning insights. 
            No setup required, no complex configurations.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={step}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 mx-auto">
                  {index === 2 ? (
                    <Sparkles className="h-6 w-6 text-white" />
                  ) : (
                    <span className="text-lg font-bold text-white">{index + 1}</span>
                  )}
                </div>
                <p className="text-white font-medium text-center">{step}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {isSignedIn ? (
              <Link 
                href="/upload"
                className="group bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Go to Upload</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/sign-in"
                  className="group bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link 
                  href="#features"
                  className="px-10 py-4 rounded-2xl font-semibold text-lg text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/30"
                >
                  Learn more
                </Link>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-white/60">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">100% Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">No Storage of Your Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
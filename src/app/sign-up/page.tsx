"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back to home</span>
      </Link>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              ChatGPT Wrapped
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-gray-600">
            Start your AI journey in seconds
          </p>
        </div>

        {/* Sign Up Component Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm normal-case",
                footerActionLink: "text-purple-600 hover:text-purple-700",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "border border-gray-300 hover:bg-gray-50 text-gray-700",
                card: "bg-transparent shadow-none",
                rootBox: "w-full",
                form: "space-y-6",
              },
              layout: {
                socialButtonsPlacement: "top",
              },
            }}
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              href="/sign-in" 
              className="font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mt-8 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Free forever</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>No credit card</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Setup in 2 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
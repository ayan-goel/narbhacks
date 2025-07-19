"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export default function ModernHeader() {
  const { user, isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              How it works
            </Link>
            {isSignedIn ? (
              <Link 
                href="/dashboard"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/sign-in"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100/50 hover:bg-gray-200/50 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/20">
          <div className="px-4 py-6 space-y-4">
            <Link 
              href="#features" 
              className="block text-gray-600 hover:text-gray-900 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="block text-gray-600 hover:text-gray-900 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How it works
            </Link>
            {isSignedIn ? (
              <Link 
                href="/dashboard"
                className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/sign-in"
                className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 
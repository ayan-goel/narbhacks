"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import WrappedLayout from "@/components/layout/WrappedLayout";
import StatsCard from "@/components/wrapped/StatsCard";
import TopicsCard from "@/components/wrapped/TopicsCard";
import InsightsCard from "@/components/wrapped/InsightsCard";
import SentimentCard from "@/components/wrapped/SentimentCard";
import TimelineCard from "@/components/wrapped/TimelineCard";
import { ChevronLeft, ChevronRight, Share2, Download, Home } from "lucide-react";
import Link from "next/link";

interface WrappedPageProps {
  params: { year: string };
}

export default function WrappedPage({ params }: WrappedPageProps) {
  const { user } = useUser();
  const year = parseInt(params.year);
  const [currentCard, setCurrentCard] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Get wrapped cards for the year
  const wrappedCards = useQuery(
    api.wrapped.getWrappedCards,
    user?.id ? { userId: user.id, year } : "skip"
  );

  // Get user stats for the year
  const userStats = useQuery(
    api.analytics.getUserStats,
    user?.id ? { userId: user.id, year } : "skip"
  );

  // Generate wrapped cards if they don't exist
  const generateWrapped = useMutation(api.wrapped.generateWrappedCards);

  useEffect(() => {
    if (user && userStats && (!wrappedCards || wrappedCards.length === 0)) {
      generateWrapped({ userId: user.id, year });
    }
  }, [user, userStats, wrappedCards, generateWrapped, year]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !wrappedCards?.length) return;

    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % wrappedCards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, wrappedCards?.length]);

  const nextCard = () => {
    if (!wrappedCards?.length) return;
    setCurrentCard((prev) => (prev + 1) % wrappedCards.length);
    setIsAutoPlaying(false);
  };

  const prevCard = () => {
    if (!wrappedCards?.length) return;
    setCurrentCard((prev) => (prev - 1 + wrappedCards.length) % wrappedCards.length);
    setIsAutoPlaying(false);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `My ${year} ChatGPT Wrapped`,
          text: `Check out my ${year} ChatGPT Wrapped! 🤖✨`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!user) {
    return (
      <WrappedLayout>
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your wrapped
          </h1>
          <Link
            href="/sign-in"
            className="inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </WrappedLayout>
    );
  }

  if (!userStats) {
    return (
      <WrappedLayout>
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">
            No data found for {year}
          </h1>
          <p className="text-white/80 mb-6">
            Upload your ChatGPT conversations to generate your wrapped
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center px-6 py-3 bg-[#10A37F] text-white rounded-lg hover:bg-[#0d8f72] transition-colors"
          >
            Upload Data
          </Link>
        </div>
      </WrappedLayout>
    );
  }

  if (!wrappedCards || wrappedCards.length === 0) {
    return (
      <WrappedLayout>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-xl font-bold">
            Generating your {year} wrapped...
          </h1>
        </div>
      </WrappedLayout>
    );
  }

  const currentCardData = wrappedCards[currentCard];

  const renderCard = () => {
    if (!currentCardData) return null;

    switch (currentCardData.cardType) {
      case 'stats':
        return (
          <StatsCard
            data={currentCardData.cardData}
            year={year}
            index={currentCard}
          />
        );
      case 'topics':
        return (
          <TopicsCard
            data={currentCardData.cardData}
            year={year}
            index={currentCard}
          />
        );
      case 'insights':
        return (
          <InsightsCard
            data={currentCardData.cardData}
            year={year}
            index={currentCard}
          />
        );
      case 'sentiment':
        return (
          <SentimentCard
            data={currentCardData.cardData}
            year={year}
            index={currentCard}
          />
        );
      case 'timeline':
        return (
          <TimelineCard
            data={currentCardData.cardData}
            year={year}
            index={currentCard}
          />
        );
      default:
        return (
          <div className="text-center text-white">
            <p>Card type not implemented: {currentCardData.cardType}</p>
          </div>
        );
    }
  };

  return (
    <WrappedLayout>
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="absolute top-6 right-6 z-10 flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isAutoPlaying 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isAutoPlaying ? 'Pause' : 'Auto-play'}
          </button>
        </div>

        {/* Card Navigation */}
        <button
          onClick={prevCard}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextCard}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Card Content */}
        <div className="w-full max-w-md mx-auto px-4">
          {renderCard()}
        </div>

        {/* Card Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {wrappedCards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentCard(index);
                setIsAutoPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCard ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Card Counter */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/80 text-sm">
          {currentCard + 1} of {wrappedCards.length}
        </div>
      </div>
    </WrappedLayout>
  );
}
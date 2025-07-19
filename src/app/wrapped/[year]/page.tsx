"use client";

import { useState, useEffect, use } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import WrappedLayout from "@/components/layout/WrappedLayout";
import StatsCard from "@/components/wrapped/StatsCard";
import TopicsCard from "@/components/wrapped/TopicsCard";
import InsightsCard from "@/components/wrapped/InsightsCard";
import SentimentCard from "@/components/wrapped/SentimentCard";
import TimelineCard from "@/components/wrapped/TimelineCard";
import WelcomeCard from "@/components/wrapped/WelcomeCard";
import NumbersCard from "@/components/wrapped/NumbersCard";
import QuestionMasterCard from "@/components/wrapped/QuestionMasterCard";
import WordCloudCard from "@/components/wrapped/WordCloudCard";
import AIRelationshipCard from "@/components/wrapped/AIRelationshipCard";
import ProductivityCard from "@/components/wrapped/ProductivityCard";
import CreativeCard from "@/components/wrapped/CreativeCard";
import { ChevronLeft, ChevronRight, Share2, Download, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface WrappedPageProps {
  params: Promise<{ year: string }>;
}

export default function WrappedPage({ params }: WrappedPageProps) {
  const { user } = useUser();
  const resolvedParams = use(params);
  const year = parseInt(resolvedParams.year);
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
    if (user && userStats && (!wrappedCards || wrappedCards.length < 15)) {
      generateWrapped({ userId: user.id, year });
    }
  }, [user, userStats, wrappedCards, generateWrapped, year]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !wrappedCards?.length) return;

    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % wrappedCards.length);
    }, 4000); // Longer delay for better reading

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
          <p className="text-white/80 mt-2">
            Creating {year > 2023 ? '20' : '5'} personalized cards just for you ✨
          </p>
        </div>
      </WrappedLayout>
    );
  }

  const currentCardData = wrappedCards[currentCard];

  const renderCard = () => {
    if (!currentCardData) return null;

    const cardProps = {
      data: currentCardData.cardData,
      year,
      index: currentCard,
    };

    switch (currentCardData.cardType) {
      case 'welcome':
        return <WelcomeCard {...cardProps} />;
      case 'numbers':
        return <NumbersCard {...cardProps} />;
      case 'stats':
        return <StatsCard {...cardProps} />;
      case 'time_explorer':
        return <TimelineCard {...cardProps} />;
      case 'conversation_styles':
        return <StatsCard {...cardProps} />; // Could create ConversationStylesCard later
      case 'question_master':
        return <QuestionMasterCard {...cardProps} />;
      case 'word_cloud':
        return <WordCloudCard {...cardProps} />;
      case 'topics':
      case 'deep_topics':
        return <TopicsCard {...cardProps} />;
      case 'monthly_journey':
      case 'timeline':
        return <TimelineCard {...cardProps} />;
      case 'ai_relationship':
        return <AIRelationshipCard {...cardProps} />;
      case 'productivity_patterns':
        return <ProductivityCard {...cardProps} />;
      case 'learning_journey':
      case 'growth_story':
      case 'future_predictions':
      case 'community_insights':
      case 'unique_moments':
        return <InsightsCard {...cardProps} />; // Keep for now, could create specific cards
      case 'creative_sparks':
        return <CreativeCard {...cardProps} />;
      case 'problem_solver':
        return <InsightsCard {...cardProps} />; // Could create ProblemSolverCard later
      case 'ai_personality':
        return <InsightsCard {...cardProps} />; // Could create PersonalityCard later
      case 'sentiment':
      case 'sentiment_journey':
        return <SentimentCard {...cardProps} />;
      case 'insights':
      case 'year_review':
        return <InsightsCard {...cardProps} />;
      default:
        return (
          <div className="text-center text-white p-8">
            <p className="text-lg">Card type: {currentCardData.cardType}</p>
            <p className="text-white/70">Coming soon...</p>
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
            href="/upload"
            className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Upload</span>
          </Link>
        </div>

        <div className="absolute top-6 right-6 z-10 flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-xl text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-4 py-2 rounded-xl backdrop-blur-xl transition-colors ${
              isAutoPlaying 
                ? 'bg-red-500/80 hover:bg-red-600/80 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isAutoPlaying ? 'Pause' : 'Auto-play'}
          </button>
        </div>

        {/* Card Navigation */}
        <button
          onClick={prevCard}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextCard}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Card Content */}
        <div className="w-full max-w-md mx-auto px-4">
          {renderCard()}
        </div>

        {/* Card Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-xs overflow-x-auto">
          {wrappedCards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentCard(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentCard ? 'bg-white w-6' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Card Counter */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 text-sm backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
          {currentCard + 1} of {wrappedCards.length}
        </div>
      </div>
    </WrappedLayout>
  );
}
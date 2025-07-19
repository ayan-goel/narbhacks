"use client";

import { MessageSquare, Hash, TrendingUp, Clock, Calendar, Sparkles } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalConversations: number;
    totalMessages: number;
    totalTokens: number;
    mostActiveMonth: number;
    favoriteTimeOfDay: string;
    averageConversationLength: number;
  };
  year: number;
}

export default function StatsOverview({ stats, year }: StatsOverviewProps) {
  const getMonthName = (month: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "Unknown";
  };

  const statCards = [
    {
      icon: MessageSquare,
      label: "Conversations",
      value: stats.totalConversations.toLocaleString(),
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      icon: Hash,
      label: "Messages",
      value: stats.totalMessages.toLocaleString(),
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: TrendingUp,
      label: "Tokens Used",
      value: stats.totalTokens.toLocaleString(),
      gradient: "from-purple-400 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      icon: Calendar,
      label: "Most Active",
      value: getMonthName(stats.mostActiveMonth),
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: Clock,
      label: "Favorite Time",
      value: stats.favoriteTimeOfDay,
      gradient: "from-green-400 to-teal-500",
      bgGradient: "from-green-50 to-teal-50",
    },
    {
      icon: Sparkles,
      label: "Avg Length",
      value: `${Math.round(stats.averageConversationLength)} msgs`,
      gradient: "from-pink-400 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent mb-4">
          Your {year} ChatGPT Journey
        </h2>
        <p className="text-xl text-gray-600">
          Here's how you've been exploring AI this year
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="flex items-center space-x-4">
                <div className={`relative p-3 rounded-xl bg-gradient-to-r ${card.gradient} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                  <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-xl opacity-30 group-hover:opacity-100 blur transition duration-300`}></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h3 className="text-2xl font-bold">
              Amazing Progress! 🚀
            </h3>
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>
          <p className="text-white/90 text-lg">
            You've had {stats.totalConversations} conversations with AI this year - that's incredible dedication to learning and exploring!
          </p>
        </div>
      </div>
    </div>
  );
}
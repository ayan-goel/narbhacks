"use client";

import { Upload, Sparkles, Share2, Download, BarChart3, Calendar } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  hasData?: boolean;
  currentYear: number;
}

export default function QuickActions({ hasData = false, currentYear }: QuickActionsProps) {
  const actions = [
    {
      icon: Upload,
      title: "Upload New Data",
      description: "Upload your latest ChatGPT export",
      href: "/upload",
      gradient: "from-green-500 to-emerald-600",
      available: true,
    },
    {
      icon: Sparkles,
      title: "Generate Wrapped",
      description: `Create your ${currentYear} wrapped`,
      href: `/wrapped/${currentYear}`,
      gradient: "from-purple-500 to-pink-600",
      available: hasData,
    },
    {
      icon: BarChart3,
      title: "View Analytics",
      description: "Explore detailed statistics",
      href: "/analytics",
      gradient: "from-blue-500 to-cyan-600",
      available: hasData,
    },
    {
      icon: Share2,
      title: "Share Wrapped",
      description: "Share your wrapped with friends",
      href: "/share",
      gradient: "from-pink-500 to-rose-600",
      available: hasData,
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Download your analysis",
      href: "/export",
      gradient: "from-green-500 to-teal-600",
      available: hasData,
    },
    {
      icon: Calendar,
      title: "Previous Years",
      description: "View past wrapped",
      href: "/wrapped",
      gradient: "from-orange-500 to-red-600",
      available: hasData,
    },
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;

          const cardContent = (
            <div
              className={`
                relative p-6 rounded-2xl transition-all duration-300 border overflow-hidden
                ${action.available 
                  ? `bg-white/70 backdrop-blur-xl shadow-xl border-white/20 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02]`
                  : 'bg-gray-100/50 backdrop-blur-sm shadow-sm border-gray-200/50'
                }
              `}
            >
              {/* Background gradient for available actions */}
              {action.available && (
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              )}

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className={`
                  relative p-3 rounded-xl transition-all duration-300
                  ${action.available 
                    ? `bg-gradient-to-r ${action.gradient} group-hover:scale-110 shadow-lg` 
                    : 'bg-gray-300'
                  }
                `}>
                  <Icon className={`h-8 w-8 ${action.available ? 'text-white' : 'text-gray-500'}`} />
                  {action.available && (
                    <div className={`absolute -inset-1 bg-gradient-to-r ${action.gradient} rounded-xl opacity-30 group-hover:opacity-100 blur transition duration-300`}></div>
                  )}
                </div>
                
                <div>
                  <h4 className={`font-bold text-lg mb-1 ${
                    action.available 
                      ? 'text-gray-800 group-hover:bg-gradient-to-r group-hover:from-gray-800 group-hover:to-gray-900 group-hover:bg-clip-text group-hover:text-transparent' 
                      : 'text-gray-500'
                  }`}>
                    {action.title}
                  </h4>
                  <p className={`text-sm ${
                    action.available 
                      ? 'text-gray-600' 
                      : 'text-gray-400'
                  }`}>
                    {action.description}
                  </p>
                </div>
                
                {!action.available && (
                  <span className="text-xs bg-gray-200/80 text-gray-500 px-3 py-1 rounded-full border border-gray-300/50">
                    Upload data first
                  </span>
                )}
              </div>
            </div>
          );

          return action.available ? (
            <Link
              key={index}
              href={action.href}
              className="relative group cursor-pointer"
            >
              {cardContent}
            </Link>
          ) : (
            <div
              key={index}
              className="relative group cursor-not-allowed"
            >
              {cardContent}
            </div>
          );
        })}
      </div>

      {!hasData && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-amber-200/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-amber-800 text-lg">Ready to get started?</span>
          </div>
          <p className="text-amber-700 leading-relaxed">
            Upload your ChatGPT conversation data to unlock all features and create your personalized wrapped experience! It's the first step to discovering amazing insights about your AI journey.
          </p>
        </div>
      )}
    </div>
  );
}
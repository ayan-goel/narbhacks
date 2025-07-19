"use client";

import { BarChart3, Brain, Share2, Upload, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Simply export your ChatGPT conversations and upload them to get started. We support the official ChatGPT export format.",
    color: "from-green-400 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Beautiful Analytics",
    description: "Get stunning visual insights into your AI conversations. Track usage patterns, favorite topics, and conversation trends.",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Our AI analyzes your conversations to provide personalized insights about your thinking patterns and interests.",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Share2,
    title: "Share Your Journey",
    description: "Create beautiful wrapped cards to share your AI journey on social media. Perfect for showcasing your year in AI.",
    color: "from-orange-400 to-red-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process thousands of conversations in seconds. Our optimized platform handles large datasets with ease.",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your conversations are processed securely and never stored permanently. We respect your privacy and data.",
    color: "from-indigo-400 to-purple-500"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-6 border border-purple-200/50">
            <Zap className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              Powerful Features
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Everything you need to
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              understand your AI journey
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From simple uploads to beautiful insights, we've got everything covered 
            to make your ChatGPT data come alive.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to explore your AI journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your ChatGPT conversations and discover insights you never knew existed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                Get Started Free
              </button>
              <button className="text-gray-700 hover:text-gray-900 font-medium">
                Learn more →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
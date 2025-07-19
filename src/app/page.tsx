"use client";

import ModernHero from "@/components/home/ModernHero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import ModernHeader from "@/components/ModernHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <ModernHeader />
      <ModernHero />
      <Features />
      <CTA />
    </main>
  );
}

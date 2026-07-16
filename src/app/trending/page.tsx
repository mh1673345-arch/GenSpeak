"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { TrendingList } from "../../components/TrendingList";
import { WordData } from "../../data/mockWords";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { AuroraBackground } from "../../components/AuroraBackground";
import { Flame, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TrendingPage() {
  const router = useRouter();
  const [words, setWords] = useState<WordData[]>([]);

  useEffect(() => {
    fetch("/api/word?trending=true")
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setWords(data);
        }, 0);
      })
      .catch(err => console.error("Failed to fetch trending page words:", err));
  }, []);

  // Custom cursor mouse glow tracking coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - 250);
    mouseY.set(clientY - top - 250);
  };

  const handleSelectWord = (word: WordData) => {
    router.push(`/word/${word.slug}`);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col bg-brand-black relative overflow-x-hidden"
    >
      <AuroraBackground />

      <motion.div
        className="absolute pointer-events-none w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary-blue/10 to-transparent blur-[100px] z-0"
        style={{ x: springX, y: springY }}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col gap-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-primary-blue flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            POP CULTURE METRICS
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Emerging <span className="text-gradient">Trends.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            Real-time slang statistics compiled across major streaming communities, social applications, and online gaming lobbies.
          </p>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2 items-start">
          {/* Trending list on the left */}
          <div className="lg:col-span-2">
            <TrendingList 
              words={words} 
              onSelectWord={handleSelectWord}
            />
          </div>

          {/* Editorial / Info Card on the right */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="rounded-2xl glass-panel p-6 bg-[#090D1A]/30 border border-white/5 relative overflow-hidden flex flex-col gap-4">
              <span className="text-[10px] font-mono text-primary-blue uppercase font-bold tracking-wider">HOW IT WORKS</span>
              <h3 className="font-display font-bold text-base text-white leading-snug">
                Lexical Velocity Tracking
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Our database aggregates search queries, public forum comments, and content captions to rank terms by relative momentum (Lexical Velocity) rather than total raw search count. This highlights fast-growing subculture terms before they enter mainstream channels.
              </p>
            </div>

            <div className="rounded-2xl glass-panel p-6 bg-[#090D1A]/30 border border-white/5 relative overflow-hidden flex flex-col gap-4">
              <span className="text-[10px] font-mono text-primary-pink uppercase font-bold tracking-wider">DAILY BRIEFING</span>
              <h3 className="font-display font-bold text-base text-white leading-snug">
                Grammar Compression
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Explore the morphophonemic rules of slang truncation, compounding, and affixation forming the basis of today&apos;s cultural changes.
              </p>
              <Link
                href="/word/rizz"
                className="text-xs font-semibold text-primary-blue font-display flex items-center gap-1 mt-1 hover:underline cursor-pointer"
              >
                <span>Read rizz case-study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

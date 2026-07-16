"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { cultureTimeline } from "@/data/mockInternetCulture";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";

export default function TimelinePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3 max-w-2xl text-center items-center mx-auto">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] flex items-center gap-1.5 justify-center">
            <Terminal className="w-3.5 h-3.5" />
            GENSPEAK HISTORICAL MATRIX
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Internet <span className="text-gradient">Timeline.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2 max-w-md">
            Scroll through the evolution of internet slang, landmark platform updates, and key viral subculture shifts from 2005 to today.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-white/5 pl-6 md:pl-8 ml-2 md:ml-6 flex flex-col gap-10 mt-8">
          {cultureTimeline.map((item, index) => (
            <div key={index} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#050505] border border-white/20 group-hover:border-[#FF8A3D] transition-colors flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A] animate-pulse" />
              </div>

              <div className="flex flex-col gap-2 bg-[#111217]/25 border border-white/[0.04] p-5 rounded-2xl backdrop-blur-sm">
                <span className="text-xs font-mono font-black text-[#FF8A3D]">
                  {item.year}
                </span>
                <h3 className="font-display font-bold text-sm text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[#9EA3B0] leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

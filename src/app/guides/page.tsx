"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Terminal } from "lucide-react";
import { cultureGuides } from "@/data/mockInternetCulture";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";

export default function GuidesHub() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            GENSPEAK ACADEMIC GUIDES
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Editorial <span className="text-gradient">Guides.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            In-depth breakdowns explaining internet subcultures, linguistic roots, acronyms, and modern child online behavior for parents and teachers.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {cultureGuides.map((guide) => (
            <Link
              href={`/guides/${guide.slug}`}
              key={guide.slug}
              className="group relative rounded-2xl border border-white/5 bg-[#111217]/30 backdrop-blur-md p-6 flex flex-col gap-6 justify-between transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_25px_rgba(255,106,26,0.08)] overflow-hidden cursor-pointer"
            >
              <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-gradient-to-tr from-[#FF6A1A]/10 to-transparent blur-[35px] pointer-events-none" />

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-2.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-primary-pink" />
                  <span>{guide.readTime}</span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-bold text-base text-white group-hover:text-primary-pink transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#9EA3B0] leading-relaxed font-sans">
                    {guide.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform relative z-10">
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 text-primary-pink" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

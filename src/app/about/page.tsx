"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            MISSION BRIEF
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            About <span className="text-gradient">GenSpeak.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            GenSpeak is the internet culture wiki and translation framework translating digital language, memes, and trends for students, parents, developers, and educators.
          </p>
        </div>

        <article className="flex flex-col gap-8 text-slate-300 font-sans text-sm leading-relaxed max-w-2xl">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-black text-xl text-white">Our Mission</h2>
            <p>
              In a world where language shifts in weeks rather than centuries, communication gaps widen rapidly between online subcultures and the rest of the world. GenSpeak translates digital language, memes, and online trends in real-time, helping bridge communication barriers.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-black text-xl text-white">Why Context Matters</h2>
            <p>
              Slang expressions are heavily dependent on context, platforms, and tone. Traditional dictionaries fail to capture this complexity, translating words without explain their cultural connotations. GenSpeak solves this by indexing metadata parameters including origin timelines, emojis, and cringe valuations.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}

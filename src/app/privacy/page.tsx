"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            REGULATORY BRIEFING
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Privacy <span className="text-gradient">Policy.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            Last Updated: July 15, 2026. Review our commitment to user data security, collection transparency, and tracking limitations.
          </p>
        </div>

        <article className="flex flex-col gap-8 text-slate-300 font-sans text-sm leading-relaxed max-w-2xl">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-black text-xl text-white">1. Data We Collect</h2>
            <p>
              We collect minimal analytic metadata to understand platform metrics and optimize translation response latency. This includes click logs and search queries to catalog trending words. We do not sell user data to advertising trackers.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-black text-xl text-white">2. Cookies</h2>
            <p>
              We use lightweight functional session cookies to store interface themes (like the dark mode toggle) and user-voted dictionary terms.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}

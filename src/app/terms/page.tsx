"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            TERMS & CONDITIONS
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Terms of <span className="text-gradient">Service.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            Last Updated: July 15, 2026. Review user conduct guidelines, trademark allocations, and dictionary licensing terms.
          </p>
        </div>

        <article className="flex flex-col gap-8 text-slate-300 font-sans text-sm leading-relaxed max-w-2xl">
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-black text-xl text-white">1. Acceptable Use</h2>
            <p>
              Users are encouraged to query definitions and request AI decoder translations. You agree not to execute scraping programs or bulk automated queries that trigger rate limits on our backend translators.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-display font-black text-xl text-white">2. Intellectual Property</h2>
            <p>
              The visual system layouts, monogram logo, and curated databases are owned by GenSpeak Inc. Editorial definitions can be quoted or referenced on blogs with clickable back-attribution.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}

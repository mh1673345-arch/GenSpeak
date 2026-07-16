"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Clock, Terminal } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/AuroraBackground";
import { getIcon } from "@/lib/getIcon";
import { cultureCategories, cultureGuides } from "@/data/mockInternetCulture";
import { InternetPlanet, TrackedNode } from "@/components/InternetPlanet";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function InternetCultureHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackedNodes, setTrackedNodes] = useState<TrackedNode[]>([]);

  // Filter categories and guides based on search query (show limited items for preview)
  const previewCategories = cultureCategories
    .filter(
      (cat) =>
        cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 4);

  const previewGuides = cultureGuides
    .filter(
      (guide) =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 3);

  const getGlowColor = (slug: string) => {
    switch (slug) {
      case "basics":
      case "gen-z":
      case "tiktok":
      case "music":
        return "from-[#FF6A1A]/35 via-primary-pink/10 to-transparent";
      case "gen-alpha":
      case "memes":
      case "brainrot":
      case "youtube":
        return "from-[#FFB347]/30 via-[#FF8A3D]/10 to-transparent";
      case "gaming":
      case "discord":
      case "ai":
      case "crypto":
        return "from-[#4D9EFF]/30 via-primary-blue/10 to-transparent";
      default:
        return "from-[#FF6A1A]/20 to-transparent";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      {/* Cinematic Ambient background */}
      <AuroraBackground />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-8 flex flex-col items-center text-center gap-5 z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF8A3D] flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          GENSPEAK CULTURAL ARCHIVE
        </span>

        <h1 className="text-5xl sm:text-7xl font-black font-display tracking-tight leading-[0.92]">
          Explore <span className="text-gradient">Internet Culture</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#9EA3B0] font-sans max-w-xl leading-relaxed">
          Discover how the internet creates language, communities, memes, trends and digital identities.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-lg mt-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, platforms, or guidelines..."
            className="w-full bg-[#111217]/50 border border-white/5 pl-11 pr-4 py-3 rounded-full text-xs text-white placeholder-slate-500 outline-none focus:border-[#FF6A1A]/40 transition-colors backdrop-blur-md"
          />
        </div>
      </section>

      {/* EXPLORE THE INTERNET: INTERACTIVE DYNAMIC MAP */}
      <section className="relative max-w-6xl mx-auto px-6 py-6 z-10 flex flex-col items-center text-center gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-wider">
            INTERACTIVE GRAPHIC
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display">
            Explore the Digital Universe
          </h2>
        </div>

        {/* Render Planet with absolute button indicators */}
        <div className="relative w-full h-[480px] pointer-events-none select-none my-4 overflow-hidden">
          <InternetPlanet onTrackNodes={setTrackedNodes} />

          {/* SVG lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {trackedNodes.map((node) => {
              if (!node.visible) return null;
              const isLeft = node.x < 1200 / 2;
              const badgeX = isLeft ? node.x - 65 : node.x + 65;
              const badgeY = node.y - 25;

              return (
                <line
                  key={node.id}
                  x1={badgeX}
                  y1={badgeY}
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(255, 106, 26, 0.25)"
                  strokeWidth="1.1"
                  strokeDasharray="2 3"
                />
              );
            })}
          </svg>

          {/* Badges absolute container overlay */}
          {trackedNodes.map((node) => {
            if (!node.visible) return null;
            const isLeft = node.x < 600;
            const leftPos = isLeft ? node.x - 130 : node.x + 65;
            const topPos = node.y - 35;

            // Map standard nodes to culture page category slugs
            const routeSlug = node.id === "communities" ? "history" : node.id;

            return (
              <div
                key={node.id}
                className="absolute z-20 pointer-events-auto"
                style={{
                  left: `${leftPos}px`,
                  top: `${topPos}px`,
                }}
              >
                <Link
                  href={`/categories/${routeSlug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B0B0F]/90 border border-white/5 text-[9px] font-mono uppercase tracking-widest text-[#9EA3B0] hover:text-white hover:border-[#FF6A1A]/30 transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB347]" />
                  {node.label}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED CATEGORIES PREVIEW */}
      <section className="relative max-w-7xl mx-auto px-6 py-12 z-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              COLLECTIONS PREVIEW
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Culture Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF8A3D] hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewCategories.map((cat) => (
            <Link
              href={`/categories/${cat.slug}`}
              key={cat.slug}
              className="group relative rounded-2xl border border-white/5 bg-[#111217]/30 backdrop-blur-md p-6 flex flex-col gap-4 justify-between transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_25px_rgba(255,106,26,0.08)] hover:-translate-y-1 overflow-hidden cursor-pointer"
            >
              {/* Inner ambient glow */}
              <div className={`absolute -bottom-16 -left-16 -right-16 h-36 bg-gradient-to-tr ${getGlowColor(cat.slug)} opacity-25 blur-[35px] rounded-full pointer-events-none group-hover:opacity-40 transition-opacity duration-300`} />

              <div className="flex flex-col gap-3 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#FF8A3D] transition-colors">
                  {getIcon(cat.iconName)}
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#9EA3B0] leading-relaxed font-sans line-clamp-3">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Counts footer */}
              <div className="flex items-center justify-between border-t border-white/[0.03] pt-4 relative z-10 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                <span>{cat.wordCount} words</span>
                <span>{cat.articleCount} articles</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED GUIDES PREVIEW */}
      <section className="relative max-w-7xl mx-auto px-6 py-12 z-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              FEATURED KNOWLEDGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Editorial Guides
            </h2>
          </div>
          <Link
            href="/guides"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary-pink hover:underline"
          >
            <span>View All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewGuides.map((guide) => (
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
      </section>

      {/* DEDICATED TIMELINE REDIRECT SECTION */}
      <section className="relative max-w-4xl mx-auto px-6 py-12 z-10 flex flex-col gap-6 text-center items-center">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          HISTORICAL INDEX
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
          The Timeline of Internet Speak
        </h2>
        <p className="text-xs text-[#9EA3B0] font-sans max-w-md leading-relaxed">
          Unlock the complete history of how standard messaging text formats, gaming servers, and Web3 trends transformed vocabulary.
        </p>
        <Link
          href="/timeline"
          className="px-6 py-3 rounded-full bg-[#111217] border border-white/8 text-[#FF8A3D] font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#111217]/80 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          View Full Interactive Timeline
        </Link>
      </section>

      <Footer />
    </div>
  );
}

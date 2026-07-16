"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ArrowRight, Zap } from "lucide-react";
import { cultureCategories, cultureGuides } from "@/data/mockInternetCulture";
import { mockWords } from "@/data/mockWords";
import { getIcon } from "@/lib/getIcon";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export default function CultureTopicDetail({ params }: TopicPageProps) {
  const { topic } = use(params);

  // Find the selected topic detail (mapped to cultureCategories database)
  const category = cultureCategories.find((cat) => cat.slug === topic);

  if (!category) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Topic Not Found</h1>
        <Link href="/internet-culture" className="mt-4 text-xs font-mono text-primary-pink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Culture Hub</span>
        </Link>
      </main>
    );
  }

  // Get mock words that match the selected category
  const popularWords = mockWords.filter((w) => w.categorySlug === category.slug || category.popularWordSlugs.includes(w.slug));

  // Find related guides
  const relatedGuides = cultureGuides.filter((guide) => 
    guide.suggestedWordSlugs.some((wordSlug) => 
      category.popularWordSlugs.includes(wordSlug)
    )
  );

  // Find other categories
  const otherCategories = cultureCategories.filter((cat) => cat.slug !== topic).slice(0, 3);

  // Generate dynamic Schema markup metadata tags
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${category.title} - GenSpeak Internet Culture`,
    "description": category.description,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://genspeak.app" },
        { "@type": "ListItem", "position": 2, "name": "Internet Culture", "item": "https://genspeak.app/internet-culture" },
        { "@type": "ListItem", "position": 3, "name": category.title, "item": `https://genspeak.app/internet-culture/${category.slug}` }
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      {/* Inject Structured SEO schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        
        {/* BREADCRUMB NAVIGATION */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/internet-culture" className="hover:text-white transition-colors">
            Culture Hub
          </Link>
          <span>/</span>
          <span className="text-[#FF8A3D]">{category.title}</span>
        </nav>

        {/* HERO TITLE BLOCK */}
        <section className="flex flex-col gap-5 max-w-3xl">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#FF8A3D] shadow-lg">
            {getIcon(category.iconName)}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight text-white">
            {category.title}
          </h1>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed font-sans">
            {category.introduction}
          </p>
        </section>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main article content column */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* History Section */}
            <div className="flex flex-col gap-4">
              <h2 className="font-display font-black text-xl text-white">Historical Origins & Development</h2>
              <p className="text-xs sm:text-sm text-[#9EA3B0] leading-relaxed font-sans">
                {category.historyText}
              </p>
            </div>

            {/* Popular slang words index */}
            <div className="flex flex-col gap-6">
              <h2 className="font-display font-black text-xl text-white">Most Popular Slang & Acronyms</h2>
              <div className="flex flex-col gap-3">
                {popularWords.length > 0 ? (
                  popularWords.map((word) => (
                    <Link
                      href={`/word/${word.slug}`}
                      key={word.id}
                      className="group p-5 rounded-2xl border border-white/5 bg-[#111217]/20 flex items-center justify-between hover:border-[#FF6A1A]/30 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-display font-bold text-sm text-white group-hover:text-[#FF8A3D] transition-colors">
                          {word.term}
                        </span>
                        <span className="text-xs text-[#9EA3B0] line-clamp-1">
                          {word.definition}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No slang listed yet for this topic.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar utilities */}
          <div className="flex flex-col gap-8">
            
            {/* Featured Guides block */}
            <div className="rounded-2xl border border-white/5 bg-[#111217]/30 p-5 flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary-pink" />
                Featured Guides
              </h3>
              <div className="flex flex-col gap-3">
                {relatedGuides.length > 0 ? (
                  relatedGuides.map((guide) => (
                    <Link
                      href={`/guides/${guide.slug}`}
                      key={guide.slug}
                      className="flex flex-col gap-1 hover:opacity-85 text-xs text-slate-300"
                    >
                      <span className="text-xs font-bold text-white line-clamp-1">{guide.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{guide.readTime}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-500 italic">No specific guides yet.</p>
                )}
              </div>
            </div>

            {/* Other Topics */}
            <div className="rounded-2xl border border-white/5 bg-[#111217]/30 p-5 flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary-pink" />
                Related Topics
              </h3>
              <div className="flex flex-col gap-3">
                {otherCategories.map((cat) => (
                  <Link
                    href={`/internet-culture/${cat.slug}`}
                    key={cat.slug}
                    className="flex items-center gap-2 hover:opacity-85 text-xs text-[#9EA3B0]"
                  >
                    <span className="text-[#FF8A3D]">{getIcon(cat.iconName)}</span>
                    <span className="hover:text-white transition-colors">{cat.title}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}

"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, User, Calendar, ArrowRight } from "lucide-react";
import { cultureGuides } from "@/data/mockInternetCulture";
import { mockWords } from "@/data/mockWords";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export default function CultureGuideDetail({ params }: GuidePageProps) {
  const { slug } = use(params);

  // Find the selected guide
  const guide = cultureGuides.find((g) => g.slug === slug);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll progress computation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!guide) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Guide Not Found</h1>
        <Link href="/guides" className="mt-4 text-xs font-mono text-primary-pink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guides</span>
        </Link>
      </main>
    );
  }

  // Get matching slang dictionary definitions
  const suggestedWords = mockWords.filter((w) => guide.suggestedWordSlugs.includes(w.slug));

  // Generate dynamic Schema markup metadata tags
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "author": { "@type": "Person", "name": guide.author },
    "datePublished": guide.publishedDate,
    "publisher": {
      "@type": "Organization",
      "name": "GenSpeak",
      "logo": { "@type": "ImageObject", "url": "https://genspeak.app/logo.png" }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      {/* Inject Structured SEO schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Dynamic top progress indicator */}
      <div 
        className="fixed top-[64px] left-0 h-1 bg-[#FF6A1A] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        
        {/* BREADCRUMB NAVIGATION */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/guides" className="hover:text-white transition-colors">
            Guides Hub
          </Link>
          <span>/</span>
          <span className="text-[#FF8A3D]">{guide.title}</span>
        </nav>

        {/* HERO TITLE BLOCK */}
        <section className="flex flex-col gap-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-primary-pink" />
              {guide.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FFB347]" />
              {guide.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#4D9EFF]" />
              {guide.readTime}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight text-white mt-2">
            {guide.title}
          </h1>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed font-sans italic">
            {guide.description}
          </p>
        </section>

        {/* CORE CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Table of contents sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28 bg-[#111217]/25 border border-white/5 p-5 rounded-2xl">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#FF8A3D]" />
              Table of Contents
            </h3>
            <ul className="flex flex-col gap-3 text-xs font-mono text-slate-500">
              {guide.sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="hover:text-white transition-colors">
                    {sec.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#suggested" className="hover:text-white transition-colors">
                  Suggested Words
                </a>
              </li>
            </ul>
          </div>

          {/* Main article content column */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <article className="flex flex-col gap-10 text-slate-300 font-sans text-sm leading-relaxed max-w-2xl">
              {guide.sections.map((sec) => (
                <section key={sec.id} id={sec.id} className="flex flex-col gap-4 pt-4 border-t border-white/[0.03] first:border-0 first:pt-0 scroll-mt-24">
                  <h2 className="font-display font-black text-xl text-white">
                    {sec.title}
                  </h2>
                  <p className="whitespace-pre-line text-sm sm:text-base">
                    {sec.content}
                  </p>
                </section>
              ))}
            </article>

            {/* Suggested Dictionary definitions */}
            <div id="suggested" className="flex flex-col gap-6 pt-10 border-t border-white/5 scroll-mt-24">
              <h2 className="font-display font-black text-xl text-white">Suggested Dictionary Words</h2>
              <div className="flex flex-col gap-3">
                {suggestedWords.map((word) => (
                  <Link
                    href={`/word/${word.slug}`}
                    key={word.id}
                    className="group p-5 rounded-2xl border border-white/5 bg-[#111217]/25 flex items-center justify-between hover:border-[#FF6A1A]/30 transition-all cursor-pointer"
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

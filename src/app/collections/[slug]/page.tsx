"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, FolderOpen, ArrowRight } from "lucide-react";
import { mockCollections } from "@/data/mockCollections";
import { mockWords } from "@/data/mockWords";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = use(params);

  // Find collection metadata
  const collection = mockCollections.find((col) => col.slug === slug);

  if (!collection) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Collection Not Found</h1>
        <Link href="/collections" className="mt-4 text-xs font-mono text-primary-pink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </Link>
      </main>
    );
  }

  // Get matching slang words belonging to this collection
  const matchingWords = mockWords.filter((w) => collection.wordSlugs.includes(w.slug));

  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        
        {/* BREADCRUMB NAVIGATION */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/collections" className="hover:text-white transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-[#FF8A3D]">{collection.title}</span>
        </nav>

        {/* HERO TITLE BLOCK */}
        <section className="flex flex-col gap-4 max-w-3xl">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#FF8A3D] shadow-lg">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight text-white mt-2">
            {collection.title}
          </h1>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed font-sans">
            {collection.description}
          </p>
        </section>

        {/* Matching Slang Cards Grid */}
        <div className="flex flex-col gap-4 max-w-3xl mt-4">
          <h2 className="font-display font-black text-xl text-white">Slang Terms in Deck</h2>
          <div className="flex flex-col gap-3">
            {matchingWords.length > 0 ? (
              matchingWords.map((word) => (
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
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No terms in this curated deck.</p>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

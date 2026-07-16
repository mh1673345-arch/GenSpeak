"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cultureCategories } from "@/data/mockInternetCulture";
import { mockWords } from "@/data/mockWords";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getIcon } from "@/lib/getIcon";
import { AuroraBackground } from "@/components/AuroraBackground";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = use(params);

  // Find category details
  const category = cultureCategories.find((cat) => cat.slug === slug);

  if (!category) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <Link href="/categories" className="mt-4 text-xs font-mono text-primary-pink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </main>
    );
  }

  // Get matching slang words belonging to this category
  const matchingWords = mockWords.filter((w) => w.categorySlug === category.slug || category.popularWordSlugs.includes(w.slug));

  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        
        {/* BREADCRUMB NAVIGATION */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/categories" className="hover:text-white transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-[#FF8A3D]">{category.title}</span>
        </nav>

        {/* HERO TITLE BLOCK */}
        <section className="flex flex-col gap-4 max-w-3xl">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#FF8A3D] shadow-lg">
            {getIcon(category.iconName)}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight text-white mt-2">
            {category.title}
          </h1>
          <p className="text-sm sm:text-base text-[#9EA3B0] leading-relaxed font-sans">
            {category.introduction}
          </p>
        </section>

        {/* Matching Slang Cards Grid */}
        <div className="flex flex-col gap-4 max-w-3xl mt-4">
          <h2 className="font-display font-black text-xl text-white">Slang Terms Mapped</h2>
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
              <p className="text-xs text-slate-500 italic">No terms mapped yet under this subculture catalog.</p>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

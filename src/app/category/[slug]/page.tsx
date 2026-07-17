import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { db } from "../../../lib/db";
import { mapDbWordToWordData } from "../../../lib/mapper";
import Link from "next/link";
import { BookOpen, Compass, ArrowRight, Home } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await db.category.findMany({
      select: { slug: true }
    });
    return categories.map((cat) => ({
      slug: cat.slug,
    }));
  } catch (err) {
    console.warn("Failed to generate static category params due to DB network issues. Falling back to dynamic rendering.", err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await db.category.findUnique({
    where: { slug }
  });
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} Dictionary - GenSpeak`,
    description: cat.description || "Browse GenSpeak glossary.",
    openGraph: {
      title: `${cat.name} Dictionary | GenSpeak`,
      description: cat.description || "Browse GenSpeak glossary.",
      type: "website",
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await db.category.findUnique({
    where: { slug }
  });
  
  if (!category) {
    notFound();
  }

  // Filter words belonging to this category
  const dbWords = await db.word.findMany({
    where: {
      categories: {
        some: { slug }
      }
    },
    include: {
      categories: true,
      examples: true,
      synonyms: true,
      antonyms: true,
      timelineEvents: true,
      votes: true,
      comments: true,
    }
  });

  const words = dbWords.map(mapDbWordToWordData);

  // Fetch db collections and filter related collections
  const dbCollections = await db.collection.findMany({
    include: {
      words: true,
      guides: true
    }
  });

  const relatedCollections = dbCollections
    .filter(col => col.words.some(w => words.some(word => word.slug === w.slug)))
    .map(col => ({
      id: col.id,
      title: col.title,
      slug: col.slug,
      description: col.description,
      bannerGradient: col.bannerGradient || "from-primary-purple to-primary-pink",
      articles: col.guides.map(g => ({
        title: g.title,
        readTime: g.readTime,
        link: `/guides/${g.slug}`
      }))
    }));

  // Structured Data Schema (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Glossary Index`,
    "description": category.description,
    "url": `https://genspeak.app/category/${slug}`,
    "about": {
      "@type": "Thing",
      "name": category.name
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] relative overflow-hidden grid-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Glow overlays */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-primary-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="w-3 h-3" />
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-bold">Category</span>
          <span>/</span>
          <span className="text-slate-450">{category.name}</span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-slate-950/40 border border-white/5 p-8 md:p-12 mb-12 overflow-hidden">
          <div className="absolute -right-32 -top-32 w-80 h-80 bg-primary-purple/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-2xl flex flex-col gap-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-purple">
              EXPLORE INDEX
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-display">
              {category.name}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
              {category.description} Explore verified etymology histories, dialogue examples, and plain language explanations curated by our lexicography editors.
            </p>
          </div>
        </div>

        {/* Category Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Glossary Queue */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-purple" />
                <span>Verified Glossary ({words.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {words.map((word) => (
                <Link
                  key={word.id}
                  href={`/word/${word.slug}`}
                  className="group rounded-2xl glass-panel p-5 border border-white/5 hover:border-primary-purple/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-display font-black text-white text-lg tracking-tight group-hover:text-primary-purple transition-colors text-left uppercase">
                      {word.term}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      {word.votes} Votes
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2 text-left">
                    {word.definition}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mt-auto border-t border-white/5 pt-2">
                    <span>Pronounced:</span>
                    <span className="text-slate-300 italic">{word.pronunciation}</span>
                  </div>
                </Link>
              ))}

              {words.length === 0 && (
                <div className="col-span-2 text-center py-12 text-slate-500 font-mono text-xs">
                  No verified slangs registered under this category yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Collections */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-accent-cyan" />
                <span>Curated Collections</span>
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {relatedCollections.map((col) => (
                <div 
                  key={col.id} 
                  className="rounded-2xl glass-panel p-5 border border-white/5 flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${col.bannerGradient}`} />
                  <div className="flex flex-col gap-1 pl-2">
                    <span className="font-display font-bold text-sm text-white text-left">{col.title}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans text-left">{col.description}</p>
                  </div>
                  
                  {/* Article suggestions */}
                  <div className="pl-2 border-t border-white/5 pt-2.5 flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide text-left font-bold">Learn More:</span>
                    {col.articles.map((art, idx) => (
                      <Link 
                        key={idx} 
                        href={art.link} 
                        className="text-xs text-slate-400 hover:text-white flex items-center justify-between group/link text-left"
                      >
                        <span className="truncate">{art.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-600 group-hover/link:text-white transition-colors shrink-0 ml-2" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {relatedCollections.length === 0 && (
                <div className="text-center py-8 text-slate-500 font-mono text-xs border border-dashed border-white/5 rounded-2xl">
                  No collection guides associated.
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

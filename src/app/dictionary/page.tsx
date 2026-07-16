"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { WordData } from "../../data/mockWords";
import { SearchBox } from "../../components/SearchBox";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "../../components/AuroraBackground";
import { BookOpen, Compass } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DictionaryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [wordsList, setWordsList] = useState<WordData[]>([]);

  useEffect(() => {
    fetch("/api/word")
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setWordsList(data);
        }, 0);
      })
      .catch(err => console.error("Failed to load dictionary list:", err));
  }, []);

  // Custom cursor mouse glow tracking coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - 250);
    mouseY.set(clientY - top - 250);
  };

  const handleSelectWord = (word: WordData) => {
    router.push(`/word/${word.slug}`);
  };

  const filteredWords = selectedCategory === "All" 
    ? wordsList 
    : wordsList.filter(w => w.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ["All", "Slang", "Memes", "Acronyms"];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col bg-brand-black relative overflow-x-hidden"
    >
      <AuroraBackground />

      <motion.div
        className="absolute pointer-events-none w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary-blue/10 to-transparent blur-[100px] z-0"
        style={{ x: springX, y: springY }}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col gap-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-primary-blue flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            THE INTERNET ENCYCLOPEDIA
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Slang <span className="text-gradient">Dictionary.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            The definitive peer-reviewed glossary database for modern internet slangs, viral memes, and digital acronyms. Search or select a category below.
          </p>
        </div>

        {/* Global Search Component */}
        <div className="w-full max-w-2xl mt-4">
          <SearchBox onSelectWord={handleSelectWord} />
        </div>

        {/* Filter categories */}
        <div className="flex gap-2 items-center border-b border-white/5 pb-4 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary-blue text-white font-bold"
                  : "bg-slate-900/40 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Spacious Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <AnimatePresence mode="popLayout">
            {filteredWords.map((word) => (
              <motion.div
                layout
                key={word.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  href={`/word/${word.slug}`}
                  className="group block p-6 rounded-2xl glass-panel border border-white/5 hover:border-primary-blue/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-xl text-white group-hover:text-primary-blue transition-colors">
                        {word.term}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                        {word.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans font-medium line-clamp-2 mt-1">
                      {word.definition}
                    </p>
                    <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      <span>View Full Breakdown</span>
                      <Compass className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </main>

      <Footer />
    </div>
  );
}

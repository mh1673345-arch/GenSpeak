"use client";

import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { Translator } from "../../components/Translator";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { AuroraBackground } from "../../components/AuroraBackground";
import { Terminal } from "lucide-react";

export default function DecoderPage() {
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
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-primary-blue flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            AI ASSISTANCE STUDIO
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Bilingual Slang <span className="text-gradient">Decoder.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            Translate internet slang into standard English or reverse-engineer standard phrases into digital slang. Dive deep into meme explanations, emoji sentiments, and daily platform logs.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full mt-4"
        >
          <Translator />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

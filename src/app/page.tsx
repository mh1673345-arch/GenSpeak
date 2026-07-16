"use client";

import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StorytellingJourney } from "../components/StorytellingJourney";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { AuroraBackground } from "../components/AuroraBackground";
import { useRouter } from "next/navigation";
import { WordData } from "../data/mockWords";

export default function Home() {
  const router = useRouter();
  
  // Custom cursor mouse glow tracking coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    // Offset coordinates to keep cursor in center of 500px glow circle
    mouseX.set(clientX - left - 250);
    mouseY.set(clientY - top - 250);
  };

  const handleSelectWord = (word: WordData) => {
    router.push(`/word/${word.slug}`);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden"
    >
      {/* 1. BRAND BACKGROUND GLOW EFFECTS */}
      <AuroraBackground />

      <motion.div
        className="absolute pointer-events-none w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary-blue/10 to-transparent blur-[100px] z-0"
        style={{ x: springX, y: springY }}
      />

      {/* Main Navbar */}
      <Navbar />

      {/* Immersive Scroll Storytelling Journey */}
      <StorytellingJourney onSelectWord={handleSelectWord} />

      {/* Main Footer */}
      <Footer />
    </div>
  );
}


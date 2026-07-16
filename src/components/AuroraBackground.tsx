"use client";

import React from "react";
import { motion } from "framer-motion";

export function AuroraBackground() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      
      {/* 1. MASSIVE DELPHI-STYLE SUN DOME CEILING */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] md:w-[70vw] h-[28vh] rounded-b-[50%] bg-[#FF6A1A] opacity-85 blur-[100px] animate-breath" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] md:w-[65vw] h-[23vh] rounded-b-[50%] bg-[#FFB347] opacity-95 blur-[60px]" />
      
      {/* Dome rim edge accent */}
      <div className="absolute top-[28vh] left-1/2 -translate-x-1/2 w-[82vw] md:w-[68vw] h-[2px] bg-gradient-to-r from-transparent via-[#FFB347]/50 to-transparent opacity-80" />
      <div className="absolute top-[28vh] left-1/2 -translate-x-1/2 w-[82vw] md:w-[68vw] h-[8px] bg-gradient-to-r from-transparent via-[#FF6A1A]/20 to-transparent blur-[3px]" />

      {/* 2. DUST/SPACE AMBIENCE */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => {
          const randomDuration = 12 + (i % 4) * 6;
          const randomDelay = (i % 3) * 2.5;
          const size = i % 3 === 0 ? "w-0.5 h-0.5" : i % 3 === 1 ? "w-1 h-1" : "w-1.5 h-1.5";
          
          return (
            <motion.div
              key={i}
              animate={{
                opacity: [0.08, 0.32, 0.08],
                y: [0, -25, 0],
              }}
              transition={{
                duration: randomDuration,
                delay: randomDelay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full bg-[#FFB347]/20 blur-[0.25px]"
              style={{
                left: `${10 + i * 7.8}%`,
                top: `${20 + (i * 8.2) % 65}%`,
                width: size === "w-0.5 h-0.5" ? 1.5 : size === "w-1 h-1" ? 2.5 : 4,
                height: size === "w-0.5 h-0.5" ? 1.5 : size === "w-1 h-1" ? 2.5 : 4,
              }}
            />
          );
        })}
      </div>

      {/* 3. DEEP REFLECTIVE FLOOR GRADIENT */}
      <div className="absolute bottom-0 left-0 right-0 h-[38vh] bg-gradient-to-t from-[#FF6A1A]/12 via-[#FF8A3D]/4 to-transparent pointer-events-none opacity-85 z-10" />
      
      {/* Planetary Horizon Glow boundary sheen */}
      <div className="absolute bottom-[38vh] left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB347]/10 to-transparent" />
    </div>
  );
}

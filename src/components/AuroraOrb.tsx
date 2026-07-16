"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface AuroraOrbProps {
  size?: number;
  className?: string;
  glowOpacity?: number;
}

export function AuroraOrb({ size = 180, className = "", glowOpacity = 0.45 }: AuroraOrbProps) {
  const [mounted, setMounted] = React.useState(false);

  // Mouse coordinates tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Easing spring configuration (Linear/Apple style)
  const springConfig = { stiffness: 45, damping: 22 };
  const sX = useSpring(mouseX, springConfig);
  const sY = useSpring(mouseY, springConfig);

  // Transform coordinates to visual offset ranges
  const translateX = useTransform(sX, [-400, 400], [-12, 12]);
  const translateY = useTransform(sY, [-400, 400], [-12, 12]);

  React.useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 1. Luminous Deep Ambient glow under-layer */}
      <motion.div
        style={{
          width: size * 1.3,
          height: size * 1.3,
          opacity: glowOpacity,
          x: translateX,
          y: translateY
        }}
        className="absolute rounded-full bg-gradient-to-tr from-primary-blue via-primary-purple to-accent-mint blur-[45px] pointer-events-none z-0"
      />

      {/* 2. Glassmorphic Orb Body */}
      <motion.div
        style={{ 
          width: size, 
          height: size,
          x: translateX,
          y: translateY
        }}
        animate={{
          y: [0, -6, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative rounded-full border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md shadow-2xl flex items-center justify-center overflow-hidden z-10"
      >
        {/* Luminous Inner Reflection ring */}
        <div className="absolute inset-[1px] rounded-full bg-gradient-to-tl from-transparent via-white/10 to-white/20 pointer-events-none" />
        
        {/* Soft Core Pulse */}
        <div className="w-1/2 h-1/2 rounded-full bg-gradient-radial from-primary-blue/30 via-primary-purple/20 to-transparent blur-[8px] animate-pulse" />

        {/* Diagonal Sheen */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none" />
      </motion.div>
    </div>
  );
}

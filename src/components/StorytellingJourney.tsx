"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { 
  Cpu, Terminal, Globe, TrendingUp, 
  BookOpen, FolderOpen, History, Grid, ArrowRight,
  Sparkles, Award, Zap, Star, ArrowUpRight
} from "lucide-react";
import { SearchBox } from "./SearchBox";
import { WordData, mockWords } from "../data/mockWords";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TrackedNode } from "./InternetPlanet";
import { useAuth } from "../context/AuthContext";
import dynamic from "next/dynamic";

const InternetPlanet = dynamic(() => import("./InternetPlanet").then(mod => mod.InternetPlanet), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] flex items-center justify-center text-slate-500 font-mono text-[10px] tracking-widest animate-pulse">
      INITIALIZING DIGITAL CULTURE MATRIX...
    </div>
  )
});

interface StorytellingJourneyProps {
  onSelectWord: (word: WordData) => void;
}

// =========================================================
// PREMIUM 3D GLASS CHAMBER CARD COMPONENT
// =========================================================
interface Glass3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowGradient?: string;
}

function Glass3DCard({ children, className = "", glowGradient = "" }: Glass3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-160, 160], [8, -8]), { stiffness: 85, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-160, 160], [-8, 8]), { stiffness: 85, damping: 20 });

  const shineX = useSpring(useTransform(x, [-160, 160], [-70, 70]), { stiffness: 85, damping: 20 });
  const shineY = useSpring(useTransform(y, [-160, 160], [-70, 70]), { stiffness: 85, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: "1000px" }} className="w-full flex justify-center">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative border border-white/[0.08] bg-[#111217]/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/15 hover:shadow-[0_0_40px_rgba(255,106,26,0.15)] overflow-hidden ${className}`}
      >
        <motion.div
          style={{ x: shineX, y: shineY }}
          className="absolute -inset-24 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_50%)] mix-blend-overlay z-20"
        />

        {glowGradient && (
          <div 
            className={`absolute -bottom-24 -left-24 -right-24 h-56 bg-gradient-to-tr ${glowGradient} opacity-40 blur-[45px] rounded-full animate-pulse-slow pointer-events-none mix-blend-screen z-0`}
          />
        )}
        
        <div style={{ transform: "translateZ(24px)", transformStyle: "preserve-3d" }} className="w-full h-full relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// Daily Challenge dataset
const DAILY_CHALLENGES = [
  {
    id: "challenge-1",
    type: "Guess the Slang",
    question: "Which term describes 'having smooth charisma and charm'?",
    options: ["cooked", "mewing", "rizz", "npc"],
    answer: "rizz",
    xp: 50
  },
  {
    id: "challenge-2",
    type: "Match the Emoji",
    question: "Which term matches this emoji combination: 🤫🤫?",
    options: ["rizz", "mewing", "cooked", "skibidi"],
    answer: "mewing",
    xp: 50
  },
  {
    id: "challenge-3",
    type: "Finish the Meme",
    question: "Complete the trending phrase: 'Skibidi ___________'",
    options: ["Toilet", "Sigma", "Rizz", "Gyatt"],
    answer: "Toilet",
    xp: 50
  },
  {
    id: "challenge-4",
    type: "Internet IQ",
    question: "Who popularized the term 'rizz' on Twitch in late 2021?",
    options: ["Kai Cenat", "Ninja", "PewDiePie", "xQc"],
    answer: "Kai Cenat",
    xp: 50
  }
];

export function StorytellingJourney({ onSelectWord }: StorytellingJourneyProps) {
  const router = useRouter();
  const { user, addXp, incrementStreak } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [trackedNodes, setTrackedNodes] = useState<TrackedNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);

  // Daily Challenge state
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const todayIndex = new Date().getDate() % DAILY_CHALLENGES.length;
  const activeChallenge = DAILY_CHALLENGES[todayIndex];

  // Curated list of 8 words for Featured Words section
  const featuredSlangs = mockWords.filter((w) => 
    ["rizz", "skibidi", "gyatt", "sigma", "npc", "delulu", "cooked", "aura"].includes(w.slug)
  );

  const journeyCards = [
    {
      title: "Interactive Planet",
      description: "Navigate our 3D nodes to discover language categorized by online communities.",
      href: "/timeline",
      icon: <Globe className="w-5 h-5" />,
      glow: "from-primary-blue/35 via-[#FF6A1A]/10 to-transparent"
    },
    {
      title: "AI Decoder Desk",
      description: "Chat with the GenSpeak companion to explain chat logs, emojis, and memes.",
      href: "/decoder",
      icon: <Cpu className="w-5 h-5" />,
      glow: "from-[#FF6A1A]/35 via-primary-pink/10 to-transparent"
    },
    {
      title: "Guides",
      description: "Read in-depth editorial articles designed for parents and teachers.",
      href: "/internet-culture",
      icon: <BookOpen className="w-5 h-5" />,
      glow: "from-[#FFB347]/30 via-[#FF8A3D]/10 to-transparent"
    },
    {
      title: "Collections",
      description: "Navigate curated slang listings grouped by platform and usage.",
      href: "/dictionary",
      icon: <FolderOpen className="w-5 h-5" />,
      glow: "from-[#FF6A1A]/35 via-primary-pink/10 to-transparent"
    },
    {
      title: "Internet Timeline",
      description: "Scroll through the chronological checkpoints of digital culture.",
      href: "/internet-culture",
      icon: <History className="w-5 h-5" />,
      glow: "from-[#FFB347]/30 via-[#FF8A3D]/10 to-transparent"
    },
    {
      title: "Categories",
      description: "Discover slang terms categorized by subcultures and contexts.",
      href: "/internet-culture",
      icon: <Grid className="w-5 h-5" />,
      glow: "from-[#4D9EFF]/35 via-primary-blue/10 to-transparent"
    }
  ];

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
  }, []);

  // Update container width for precise marker lines positioning
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Load daily challenge complete status from localStorage
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const savedStatus = localStorage.getItem(`genspeak_challenge_${todayStr}`);
    if (savedStatus) {
      const parsed = JSON.parse(savedStatus);
      setTimeout(() => {
        setChallengeCompleted(true);
        setSelectedOption(parsed.option);
      }, 0);
    }
  }, []);

  const handleSelectOption = (opt: string) => {
    if (challengeCompleted) return;
    setSelectedOption(opt);
    const correct = opt === activeChallenge.answer;
    setChallengeCompleted(true);

    const todayStr = new Date().toISOString().split("T")[0];
    localStorage.setItem(`genspeak_challenge_${todayStr}`, JSON.stringify({ option: opt, correct }));

    if (correct) {
      if (user) {
        addXp(activeChallenge.xp);
        incrementStreak();
      }
      alert(`Correct! You earned +${activeChallenge.xp} XP and updated your learning streak!`);
    } else {
      alert("Incorrect answer. Try again tomorrow!");
    }
  };

  // Framer motion scroll velocity mapping for rising words
  const { scrollY } = useScroll();

  const yRizz = useTransform(scrollY, [0, 600], [0, -140]);
  const opacityRizz = useTransform(scrollY, [0, 450], [0.8, 0]);

  const ySkibidi = useTransform(scrollY, [0, 600], [0, -220]);
  const opacitySkibidi = useTransform(scrollY, [0, 480], [0.75, 0]);

  const yMewing = useTransform(scrollY, [0, 600], [0, -180]);
  const opacityMewing = useTransform(scrollY, [0, 460], [0.85, 0]);

  const yNPC = useTransform(scrollY, [0, 600], [0, -260]);
  const opacityNPC = useTransform(scrollY, [0, 500], [0.7, 0]);

  // Framer Motion reveal presets
  const heroReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center bg-[#050505] overflow-hidden">
      
      {/* LANDING PORTAL HERO */}
      <section className="relative w-full h-[860px] sm:h-[880px] lg:h-[920px] flex flex-col items-center justify-start pt-[90px] md:pt-[110px] lg:pt-[160px] pb-10 overflow-hidden">
        
        {/* Core central light flare behind the planet */}
        <div className="absolute top-[340px] md:top-[370px] lg:top-[400px] left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-gradient-radial from-[#FF6A1A]/10 via-[#8A6CFF]/0.03 to-transparent blur-[120px] pointer-events-none z-0" />

        {/* Shifting Floating Slangs background overlay */}
        {mounted && (
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <motion.div 
              style={{ y: yRizz, opacity: opacityRizz, left: "15%", bottom: "35%" }}
              className="absolute font-mono font-bold text-[10px] uppercase text-[#9EA3B0] bg-[#111217]/50 border border-white/[0.06] px-3.5 py-1.5 rounded-full backdrop-blur-md will-change-[transform,opacity]"
            >
              Rizz
            </motion.div>
            <motion.div 
              style={{ y: ySkibidi, opacity: opacitySkibidi, left: "20%", top: "25%" }}
              className="absolute font-mono font-bold text-[10px] uppercase text-[#9EA3B0] bg-[#111217]/50 border border-white/[0.06] px-3.5 py-1.5 rounded-full backdrop-blur-md will-change-[transform,opacity]"
            >
              Skibidi
            </motion.div>
            <motion.div 
              style={{ y: yMewing, opacity: opacityMewing, left: "80%", top: "30%" }}
              className="absolute font-mono font-bold text-[10px] uppercase text-[#9EA3B0] bg-[#111217]/50 border border-white/[0.06] px-3.5 py-1.5 rounded-full backdrop-blur-md will-change-[transform,opacity]"
            >
              Mewing
            </motion.div>
            <motion.div 
              style={{ y: yNPC, opacity: opacityNPC, left: "75%", bottom: "45%" }}
              className="absolute font-mono font-bold text-[10px] uppercase text-[#9EA3B0] bg-[#111217]/50 border border-white/[0.06] px-3.5 py-1.5 rounded-full backdrop-blur-md will-change-[transform,opacity]"
            >
              NPC
            </motion.div>
          </div>
        )}

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={heroReveal}
          className="relative w-full max-w-4xl px-4 flex flex-col items-center text-center gap-6 z-20 mt-2 animate-fade-in"
        >
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] bg-[#FF8A3D]/5 border border-[#FF8A3D]/10 px-2.5 py-0.5 rounded-full">
            THE INTERNET PLANET
          </span>

          <h1 className="text-5xl sm:text-7xl md:text-[80px] font-black font-display tracking-tight text-white leading-[1.05] pb-2 max-w-4xl">
            Understand Internet Culture. <br />
            <span className="text-gradient">Speak the Language.</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#9EA3B0] font-sans max-w-xl leading-relaxed tracking-wide">
            Your gateway to internet slang, memes, acronyms, and the ever-evolving digital world.
          </p>
        </motion.div>

        {/* The Internet Planet 3D Canvas element wrapper */}
        <div className="absolute w-full h-[680px] top-[250px] md:top-[285px] lg:top-[320px] pointer-events-none select-none z-30">
          <InternetPlanet onTrackNodes={setTrackedNodes} />

          {/* Connected SVG lines drawing overlay */}
          {mounted && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {trackedNodes.map((node) => {
                if (!node.visible) return null;
                const isLeft = node.x < width / 2;
                const badgeX = isLeft ? node.x - 70 : node.x + 70;
                const badgeY = node.y - 30;

                return (
                  <line
                    key={node.id}
                    x1={badgeX}
                    y1={badgeY}
                    x2={node.x}
                    y2={node.y}
                    stroke="rgba(255, 106, 26, 0.22)"
                    strokeWidth="1.0"
                    strokeDasharray="2 3"
                  />
                );
              })}
            </svg>
          )}

          {/* Floating badge indicators absolute overlay */}
          {mounted && trackedNodes.map((node) => {
            if (!node.visible) return null;
            const isLeft = node.x < width / 2;
            const leftPos = isLeft ? node.x - 145 : node.x + 70;
            const topPos = node.y - 42;

            return (
              <div
                key={node.id}
                className="absolute z-20 pointer-events-auto transition-all duration-75"
                style={{
                  left: `${leftPos.toFixed(1)}px`,
                  top: `${topPos.toFixed(1)}px`,
                }}
              >
                <button
                  onClick={() => router.push(`/category/${node.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090A0F]/90 border border-white/[0.08] backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-[#9EA3B0] hover:text-white hover:border-[#FF6A1A]/35 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6)] cursor-pointer hover:shadow-[#FF6A1A]/5 hover:scale-[1.02]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A1A] animate-pulse" />
                  {node.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* Interaction controls block overlaid on center of planet */}
        <div className="relative w-full max-w-xl mx-auto flex flex-col items-center gap-6 z-30 mt-[140px] md:mt-[170px] lg:mt-[200px]">
          <div className="w-full">
            <SearchBox onSelectWord={onSelectWord} />
          </div>

          <div className="flex gap-4 items-center justify-center">
            <Link 
              href="/dictionary" 
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(255,106,26,0.5)] hover:scale-[1.02] active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,106,26,0.25)]"
            >
              Explore Dictionary
            </Link>
            <Link 
              href="/ai-decoder" 
              className="px-6 py-3 rounded-full bg-[#121319] border border-white/20 text-slate-200 hover:text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#15161f] hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Try AI Decoder
            </Link>
          </div>
        </div>

        {/* Horizon Portal */}
        <div className="absolute bottom-[280px] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          <div className="w-[45px] h-[72px] rounded-t-[4px] bg-gradient-to-t from-[#FF6A1A] to-[#FFB347] shadow-[0_0_35px_rgba(255,106,26,0.65)] relative overflow-hidden flex items-end justify-center">
            <svg viewBox="0 0 100 100" className="w-5 h-10 text-[#050505] fill-current opacity-90 mb-0.5">
              <circle cx="50" cy="25" r="12" />
              <path d="M50 40c-10 0-15 8-15 18v25h8V60h14v23h8V58c0-10-5-18-15-18z" />
            </svg>
          </div>
          <div className="w-[45px] h-[45px] rounded-b-[4px] bg-gradient-to-b from-[#FF6A1A]/25 to-transparent scale-y-[-1] opacity-60 blur-[1px] mt-[1px]" />
        </div>

        {/* Volumetric Dark Fading Mask at fold bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent z-20 pointer-events-none" />

        <div className="h-24 w-full" />
      </section>

      {/* NEW SECTION: TODAY'S INTERNET EXPERIENCES */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-12 z-20 flex flex-col gap-8 text-left mt-24">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            TODAY&apos;S DIGITAL PULSE
          </span>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">
            Today&apos;s Internet
          </h2>
          <p className="text-xs text-slate-400 max-w-md font-sans">
            Your live daily briefing on trending slangs, memes, gaming overlays, and interactive cultural challenges.
          </p>
        </div>

        {/* Grids items layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Interactive Daily Challenge widget (Takes 2 columns) */}
          <div className="md:col-span-2 rounded-3xl border border-white/5 bg-[#111217]/20 p-6 flex flex-col justify-between gap-6 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-primary-pink/10 to-transparent blur-2xl rounded-full" />
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-primary-pink uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 animate-bounce" />
                  {activeChallenge.type}
                </span>
                <span className="text-[10px] font-mono font-bold text-accent-cyan bg-accent-cyan/5 px-2.5 py-1 rounded border border-accent-cyan/15">
                  +{activeChallenge.xp} XP REWARD
                </span>
              </div>

              <h4 className="font-display font-bold text-lg text-white leading-snug">{activeChallenge.question}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {activeChallenge.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const isAnswer = opt === activeChallenge.answer;

                  let borderClass = "border-white/5 bg-black/35 hover:border-white/15 text-slate-300";
                  if (challengeCompleted) {
                    if (isAnswer) borderClass = "border-green-500/35 bg-green-500/10 text-green-400";
                    else if (isSelected) borderClass = "border-red-500/35 bg-red-500/10 text-red-400";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      disabled={challengeCompleted}
                      className={`w-full py-3.5 px-4 rounded-xl border text-xs font-mono font-bold tracking-wider transition-all duration-300 flex items-center gap-3 justify-start ${
                        !challengeCompleted ? "cursor-pointer active:scale-95" : "cursor-not-allowed"
                      } ${borderClass}`}
                    >
                      <span className="w-5 h-5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-[10px]">{String.fromCharCode(65 + idx)}</span>
                      <span className="truncate">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2 text-[10px] font-mono text-slate-500 relative z-10">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-orange" />
                Active Streak: {user ? user.streak : 0} days
              </span>
              <span>Refreshes daily at midnight</span>
            </div>
          </div>

          {/* Card 2: Trending Word of the Day */}
          <div className="rounded-3xl border border-white/5 bg-[#111217]/20 p-6 flex flex-col justify-between gap-5 text-left relative overflow-hidden">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#FF8A3D] uppercase">Trending Word</span>
              <h4 className="font-display font-black text-2xl text-white uppercase mt-1">rizz</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1.5">
                Clipping of &apos;charisma&apos;, representing the capacity to attract or seduce others through charm.
              </p>
            </div>
            <Link
              href="/word/rizz"
              className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF8A3D] hover:text-white flex items-center gap-1.5 w-fit"
            >
              <span>Explore Etymology</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Meme of the Day */}
          <div className="rounded-3xl border border-white/5 bg-[#111217]/20 p-6 flex flex-col justify-between gap-4 text-left">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#4D9EFF] uppercase">Meme of the Day</span>
              <h4 className="font-display font-bold text-base text-white mt-1">Skibidi Toilet</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-0.5">
                The absurdist YouTube Shorts series by DaFuq!?Boom! that triggered a massive lexical shift in Gen Alpha subculture.
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Platform: YouTube</span>
              <span>Status: Viral</span>
            </div>
          </div>

          {/* Card 4: AI Buzzword */}
          <div className="rounded-3xl border border-white/5 bg-[#111217]/20 p-6 flex flex-col justify-between gap-4 text-left">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#FFB347] uppercase">AI Buzzword</span>
              <h4 className="font-display font-bold text-base text-white mt-1">RAG Context Mapping</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-0.5">
                Retrieval-Augmented Generation: feeding structured database entries as ground truth context to prevent LLM hallucinations.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Utility: Hallucination protection</span>
          </div>

          {/* Card 5: Personalization / Recs block */}
          <div className="rounded-3xl border border-white/5 bg-[#111217]/20 p-6 flex flex-col justify-between gap-4 text-left relative overflow-hidden">
            {user ? (
              <>
                <div className="flex flex-col gap-2 z-10">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#FF8A3D] uppercase">Recommended for {user.name.split(" ")[0]}</span>
                  <h4 className="font-display font-bold text-base text-white mt-1">Discover Mewing & Mogging</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-0.5">
                    Based on your saved search of Gen Alpha brainrot categories, read the complete guide to looksmaxing.
                  </p>
                </div>
                <Link
                  href="/category/brainrot"
                  className="text-[10px] font-mono font-bold uppercase text-[#FF8A3D] hover:text-white flex items-center gap-1 mt-1 z-10"
                >
                  <span>View Recommendations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase font-bold">Personalization Desk</span>
                  <h4 className="font-display font-bold text-base text-white mt-1">Unlock Slang Recs</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans mt-0.5">
                    Log in to unlock personalized slang recommendations, track streaks, and earn daily XP badges!
                  </p>
                </div>
                <Link
                  href="/login"
                  className="px-4 py-2 text-center rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider text-white transition-colors"
                >
                  Sign In Account
                </Link>
              </>
            )}
          </div>

        </div>
      </section>

      {/* NEW SECTION: TRENDING TODAY MODULE */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-12 z-20 flex flex-col gap-8 text-left border-t border-white/5 pt-16">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-[#4D9EFF] uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 animate-pulse" />
            FASTEST CLIPS AND SEARCHES
          </span>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">
            Trending Today
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          
          {/* Col 1: Fastest Growing */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Fastest Growing</h4>
            {[
              { term: "rizz", pct: "+94%" },
              { term: "skibidi", pct: "+88%" },
              { term: "mewing", pct: "+76%" }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-sans">
                <Link href={`/word/${item.term}`} className="text-white hover:text-[#FF8A3D] font-bold lowercase">{item.term}</Link>
                <span className="font-mono text-green-400 font-bold bg-green-400/5 px-2 py-0.5 rounded text-[10px]">{item.pct}</span>
              </div>
            ))}
          </div>

          {/* Col 2: Most Searched */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Most Searched</h4>
            {[
              { term: "gyatt", count: "4.3k searches" },
              { term: "sigma", count: "3.2k searches" },
              { term: "npc", count: "2.1k searches" }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-sans">
                <Link href={`/word/${item.term}`} className="text-white hover:text-[#FF8A3D] font-bold lowercase">{item.term}</Link>
                <span className="font-mono text-slate-500 text-[10px]">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Col 3: Newest Guides */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Newest Guides</h4>
            {[
              { title: "Understanding Brainrot", slug: "complete-guide-to-gen-z-slang" },
              { title: "Parenting in Slang Era", slug: "complete-guide-to-gen-z-slang" }
            ].map((item, idx) => (
              <Link 
                key={idx} 
                href={`/guides/${item.slug}`} 
                className="text-xs text-white hover:text-[#FF8A3D] font-sans font-bold leading-normal text-left"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Col 4: Popular Collections */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Popular Decks</h4>
            {[
              { title: "Top TikTok Slang", slug: "top-tiktok-slang" },
              { title: "Popular Gaming Jargons", slug: "top-tiktok-slang" }
            ].map((item, idx) => (
              <Link 
                key={idx} 
                href={`/collections/${item.slug}`} 
                className="text-xs text-white hover:text-[#FF8A3D] font-sans font-bold leading-normal text-left"
              >
                {item.title}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* NEW SECTION: EDITOR'S PICKS */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-12 z-20 flex flex-col gap-8 text-left border-t border-white/5 pt-16">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            HAND-PICKED CULTURAL STANDARDS
          </span>
          <h2 className="text-3xl font-black font-display text-white tracking-tight">
            Editor&apos;s Picks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { type: "FEATURED SLANG", title: "sigma", desc: "Originally referencing independent personality archetypes, ironized globally as cool indicator.", link: "/word/sigma", label: "Read Slang Definition" },
            { type: "FEATURED GUIDE", title: "Complete Gen Z Slang", desc: "Our ultimate handbook designed for parents and teachers to understand slang syntaxes.", link: "/guides/complete-guide-to-gen-z-slang", label: "Open Handbook Guide" },
            { type: "FEATURED DECK", title: "TikTok Virals 2026", desc: "A curated collection mapping vertical loop audio trends and commenting slangs.", link: "/collections/top-tiktok-slang", label: "View Collection Deck" }
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-white/5 bg-[#111217]/10 p-6 flex flex-col justify-between gap-5 text-left hover:border-[#FF8A3D]/20 transition-colors">
              <div className="flex flex-col gap-2">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{item.type}</span>
                <h4 className="font-display font-bold text-lg text-white capitalize mt-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-0.5">{item.desc}</p>
              </div>
              <Link
                href={item.link}
                className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#FF8A3D] hover:text-white flex items-center gap-1.5 w-fit"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CHOOSE YOUR JOURNEY SECTION */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 items-center text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5 justify-center">
            <Terminal className="w-3.5 h-3.5 text-primary-pink animate-pulse" />
            NAVIGATION MATRIX
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white">
            Choose Your Journey
          </h2>
          <p className="text-xs text-[#9EA3B0] font-sans max-w-sm">
            Select a pathway to explore the terminology, AI assistance systems, and cultural historical logs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeyCards.map((card, i) => (
            <Link 
              href={card.glow ? card.href : "/"} 
              key={i} 
              className="block group cursor-pointer"
            >
              <Glass3DCard 
                glowGradient={card.glow}
                className="w-full min-h-[170px] rounded-2xl p-6 flex flex-col gap-4 justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary-pink transition-colors">
                    {card.icon}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="font-display font-bold text-base text-white group-hover:text-primary-pink transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#9EA3B0] font-sans leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-primary-pink group-hover:translate-x-1 transition-all" />
                </div>
              </Glass3DCard>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED WORDS SECTION */}
      <section className="relative max-w-6xl mx-auto px-6 py-16 z-20 flex flex-col gap-10">
        <div className="flex flex-col gap-2 items-center text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            LEXICON SPOTLIGHT
          </span>
          <h2 className="text-3xl font-black font-display text-white">
            Featured Words
          </h2>
          <p className="text-xs text-[#9EA3B0] font-sans max-w-sm">
            Read a preview of highly popular slang expressions shaping modern conversation networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSlangs.map((word) => (
            <Link 
              href={`/word/${word.slug}`} 
              key={word.id}
              className="group p-5 rounded-2xl border border-white/5 bg-[#111217]/25 backdrop-blur-md flex flex-col justify-between gap-4 hover:border-primary-pink/30 hover:shadow-[0_0_20px_rgba(255,106,26,0.06)] transition-all cursor-pointer min-h-[140px]"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.02] border border-white/5 w-fit">
                  {word.category}
                </span>
                <h3 className="font-display font-bold text-base text-white group-hover:text-primary-pink transition-colors">
                  {word.term}
                </h3>
                <p className="text-xs text-[#9EA3B0] leading-relaxed font-sans line-clamp-2">
                  {word.definition}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform pt-2">
                <span>View Term</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary-pink" />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <Link 
            href="/dictionary" 
            className="px-6 py-2.5 rounded-full border border-white/5 bg-[#111217] text-slate-400 hover:text-white hover:border-white/10 font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer"
          >
            Explore Complete Dictionary
          </Link>
        </div>
      </section>

    </div>
  );
}

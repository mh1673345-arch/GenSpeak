"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { 
  Cpu, Terminal, Globe, TrendingUp, 
  BookOpen, FolderOpen, History, Grid, ArrowRight,
  Sparkles, Award, Zap, Star, ArrowUpRight, ShieldCheck, Layers, Users, RotateCw, Search, ChevronRight, Activity, Clock
} from "lucide-react";
import { SearchBox } from "./SearchBox";
import { WordData, mockWords } from "../data/mockWords";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TrackedNode } from "./InternetPlanet";
import { useAuth } from "../context/AuthContext";
import dynamic from "next/dynamic";
import { AnimatedCounter } from "./AnimatedCounter";

const STATS = [
  { value: 50, suffix: "+", label: "New slang terms every month", desc: "Our lexicography team maps modern online vernacular." },
  { value: 5, suffix: "B+", label: "Internet users globally", desc: "Connecting distinct cultures across global networks." },
  { value: 1000, suffix: "+", label: "Memes born every week", desc: "Absurdist imagery and visual formats mutating daily." },
  { value: 10, suffix: "M+", label: "AI prompts written daily", desc: "Humanity learning to communicate with machines." },
  { value: 300, suffix: "+", label: "New abbreviations annually", desc: "Accelerating the speed of digital text communication." }
];

const GENSPEAK_BENEFITS = [
  { title: "Internet slang", desc: "Understand rising Gen Alpha & Gen Z vernacular.", glow: "rgba(255, 106, 26, 0.04)" },
  { title: "Meme culture", desc: "Decipher visual formats, cultural origins, and variations.", glow: "rgba(138, 108, 255, 0.04)" },
  { title: "AI terminology", desc: "Understand prompts, LLM parameters, and agentic workflows.", glow: "rgba(56, 189, 248, 0.04)" },
  { title: "Gaming language", desc: "Decode esports jargons, MMO acronyms, and speedruns.", glow: "rgba(244, 63, 94, 0.04)" },
  { title: "Creator economy", desc: "Understand stream vernacular, algorithms, and monetization.", glow: "rgba(234, 179, 8, 0.04)" },
  { title: "Business buzzwords", desc: "Decode startup pitches, VC jargons, and corporate speak.", glow: "rgba(16, 185, 129, 0.04)" },
  { title: "Crypto vocabulary", desc: "Understand DeFi protocols, Web3 parameters, and NFT tags.", glow: "rgba(168, 85, 247, 0.04)" },
  { title: "Tech communities", desc: "Understand developer lingo and GitHub/Reddit subcultures.", glow: "rgba(100, 116, 139, 0.04)" }
];

const TIMELINE_STEPS = [
  { platform: "Reddit", desc: "Memes and subculture jokes are incubated.", label: "Incubation" },
  { platform: "Twitter/X", desc: "Text reactions and cultural commentary scale.", label: "Amplification" },
  { platform: "TikTok", desc: "Vertical videos and loop audio trends expand.", label: "Saturation" },
  { platform: "Discord", desc: "Private server slang goes viral locally.", label: "Codification" },
  { platform: "YouTube", desc: "Essays and shorts review cultural shifts.", label: "Mainstreaming" },
  { platform: "Instagram", desc: "Aesthetic lifestyle formats adapt terms.", label: "Commercialization" },
  { platform: "Mainstream", desc: "Corporate marketing and news anchors adopt terms.", label: "Adoption" }
];

const TRENDING_WORDS_LIST = [
  { term: "rizz", popularity: "98%", category: "slang", definition: "Charm or attractiveness, especially the ability to romance a partner." },
  { term: "skibidi", popularity: "92%", category: "brainrot", definition: "A general modifier meaning cool, bad, or interesting depending on context." },
  { term: "gyatt", popularity: "89%", category: "slang", definition: "An exclamation of surprise or approval, often referring to physical appearance." },
  { term: "sigma", popularity: "87%", category: "memes", definition: "An independent, successful male who lives outside of societal expectations." },
  { term: "mewing", popularity: "85%", category: "brainrot", definition: "A tongue placement technique meant to define the jawline, popularized in looksmaxing." },
  { term: "delulu", popularity: "82%", category: "tiktok", definition: "Short for delusional; believing or hoping for something unrealistic." },
  { term: "cap", popularity: "80%", category: "slang", definition: "To lie or exaggerate; 'no cap' means telling the truth." },
  { term: "fanum tax", popularity: "78%", category: "tiktok", definition: "The act of stealing food from a friend, popularized by streamer Fanum." },
  { term: "looksmaxing", popularity: "75%", category: "memes", definition: "The practice of attempting to maximize one's physical attractiveness." },
  { term: "npc", popularity: "74%", category: "gaming", definition: "Non-playable character; used to describe someone who lacks independent thought." }
];

const FEATURED_COLLECTIONS_LIST = [
  { title: "Gen Z Dictionary", count: 245, readTime: "12 min", difficulty: "Intermediate", glow: "rgba(255, 106, 26, 0.04)", slug: "slang" },
  { title: "AI Glossary", count: 89, readTime: "6 min", difficulty: "Advanced", glow: "rgba(138, 108, 255, 0.04)", slug: "ai" },
  { title: "Crypto Terms", count: 76, readTime: "5 min", difficulty: "Advanced", glow: "rgba(56, 189, 248, 0.04)", slug: "crypto" },
  { title: "Gaming Slang", count: 186, readTime: "10 min", difficulty: "Beginner", glow: "rgba(244, 63, 94, 0.04)", slug: "gaming" },
  { title: "Discord Language", count: 112, readTime: "8 min", difficulty: "Beginner", glow: "rgba(100, 116, 139, 0.04)", slug: "history" },
  { title: "TikTok Dictionary", count: 154, readTime: "9 min", difficulty: "Beginner", glow: "rgba(234, 179, 8, 0.04)", slug: "brainrot" },
  { title: "Startup Buzzwords", count: 64, readTime: "4 min", difficulty: "Intermediate", glow: "rgba(16, 185, 129, 0.04)", slug: "slang" }
];

const EDUCATIONAL_CARDS = [
  { title: "How memes evolve", desc: "Visual replication, mutation, and decay in the attention economy.", category: "Memeology", link: "/guides/complete-guide-to-gen-z-slang" },
  { title: "History of internet slang", desc: "From 1980s Usenet acronyms (LOL, BRB) to modern brainrot.", category: "Linguistics", link: "/guides/complete-guide-to-gen-z-slang" },
  { title: "Understanding Gen Alpha", desc: "Mapped behaviors of the first iPad-native generation.", category: "Sociology", link: "/guides/complete-guide-to-gen-z-slang" },
  { title: "Why words go viral", desc: "Emotional valence, community status, and algorithmic amplification.", category: "Virality", link: "/guides/complete-guide-to-gen-z-slang" },
  { title: "How AI changed language", desc: "The blending of natural language and prompt mechanics.", category: "AI & Tech", link: "/guides/complete-guide-to-gen-z-slang" },
  { title: "Internet timeline", desc: "Decades of digital shift, from IRC chatrooms to agentic nets.", category: "Chronology", link: "/timeline" }
];

const TRUST_CARDS = [
  { title: "Community Reviewed", desc: "Verified by a global moderator panel of cultural translators.", icon: "👥" },
  { title: "AI Assisted", desc: "Cross-validated with state-of-the-art language models for accuracy.", icon: "🤖" },
  { title: "Human Curated", desc: "Vetted by digital sociologists and expert lexicographers.", icon: "✍️" },
  { title: "Updated Frequently", desc: "Real-time updates parsing active internet chats and memes.", icon: "🔄" },
  { title: "Research Based", desc: "Aligned with corpus studies on modern computer-mediated speech.", icon: "🔬" },
  { title: "Cross Referenced", desc: "Directly linked with originating platforms and context sources.", icon: "🔗" }
];

const DID_YOU_KNOW_FACTS = [
  { fact: "LOL entered the Oxford English Dictionary in 2011.", category: "Etymology" },
  { fact: "The word 'meme' was coined by Richard Dawkins in 1976, long before the internet existed.", category: "History" },
  { fact: "The first set of emojis was created in 1999 by Shigetaka Kurita in Japan for mobile carriers.", category: "Design" },
  { fact: "Rickrolling began in 2007 as a bait-and-switch link on 4chan pointing to Rick Astley's song.", category: "Memeology" }
];

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

  const [factIndex, setFactIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % DID_YOU_KNOW_FACTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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

      {/* SECTION 1 — INTERNET TODAY */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest bg-[#FF8A3D]/5 border border-[#FF8A3D]/10 px-2.5 py-0.5 rounded-full">
            Modern Digital Pulse
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            The Internet Never Stops Changing
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Language shifts at the speed of online discourse. Here is a snapshot of current internet culture metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
          {STATS.map((stat, idx) => (
            <div key={idx} className="rounded-2xl border border-white/[0.05] bg-[#0C0D12]/40 p-6 flex flex-col justify-between gap-4 text-left transition-all duration-300 hover:border-white/[0.12] hover:bg-[#12131C]/60 hover:scale-[1.02] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-black text-white leading-none font-display">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-xs font-mono font-bold text-[#FF8A3D] mt-2 leading-tight">
                  {stat.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 — WHY GENSPEAK? */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-[#8A6CFF] uppercase tracking-widest bg-[#8A6CFF]/5 border border-[#8A6CFF]/10 px-2.5 py-0.5 rounded-full">
            Wiki & Translator Core
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            More than a Dictionary
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            GenSpeak goes beyond static lexical lookups. We track, explain, and contextualize shifting online dialects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GENSPEAK_BENEFITS.map((benefit, idx) => (
            <div 
              key={idx} 
              style={{ boxShadow: `inset 0 0 20px ${benefit.glow}, 0 4px 24px rgba(0,0,0,0.5)` }}
              className="rounded-2xl border border-white/[0.06] bg-[#090A0F]/90 p-6 flex flex-col justify-between gap-4 text-left hover:border-white/[0.14] transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex flex-col gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A1A] animate-pulse" />
                <h4 className="font-display font-bold text-base text-white capitalize mt-1">
                  {benefit.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-0.5">
                  {benefit.desc}
                </p>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                Covered Index
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — HOW INTERNET CULTURE SPREADS */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest bg-[#FF8A3D]/5 border border-[#FF8A3D]/10 px-2.5 py-0.5 rounded-full">
            Cultural Propagation Flow
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            How Internet Culture Spreads
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Slang expressions mutate and travel across platform gateways before entering mainstream vocabulary.
          </p>
        </div>

        {/* Scrollable horizontal wrapper with track lines */}
        <div className="relative w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="flex gap-6 min-w-[1000px] px-4 justify-between relative py-4">
            
            {/* SVG Connecting Timeline Track */}
            <div className="absolute top-12 left-12 right-12 h-[1px] bg-gradient-to-r from-orange-500 via-[#8A6CFF] to-pink-500 pointer-events-none opacity-20 z-0" />
            
            {TIMELINE_STEPS.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center text-center gap-4 relative z-10 max-w-[160px] group">
                {/* Platform Node Dot */}
                <div className="w-16 h-16 rounded-2xl bg-[#090A0F]/90 border border-white/[0.08] flex flex-col items-center justify-center text-white group-hover:border-[#FF6A1A]/40 transition-all duration-300 shadow-xl group-hover:scale-110 relative group-hover:shadow-[#FF6A1A]/5">
                  <span className="text-sm font-mono font-bold">0{idx + 1}</span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 tracking-wider">{step.platform.split("/")[0]}</span>
                  <div className="absolute inset-0 rounded-2xl bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,106,26,0.1),transparent)]" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono text-[#FF8A3D] uppercase tracking-wider font-bold">{step.platform}</span>
                  <span className="text-[9px] font-mono text-slate-500">{step.label}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TRENDING TODAY */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-400/5 border border-cyan-400/10 px-2.5 py-0.5 rounded-full">
            Realtime Popularity Ranks
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            Trending Today
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            The ten fastest growing searches and expressions adopted in active conversations today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TRENDING_WORDS_LIST.map((word, idx) => (
            <Link 
              key={idx}
              href={`/word/${word.term}`}
              className="group rounded-2xl border border-white/[0.05] bg-[#0B0C10]/60 p-5 flex flex-col justify-between gap-4 text-left transition-all duration-300 hover:border-[#FF6A1A]/30 hover:bg-[#121319]/70 hover:scale-[1.02] shadow-[0_4px_24px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.02] border border-white/5">
                    {word.category}
                  </span>
                  <span className="text-[9px] font-mono text-green-400 font-bold bg-green-400/5 px-1.5 py-0.5 rounded">
                    {word.popularity}
                  </span>
                </div>
                <h3 className="font-display font-black text-lg text-white group-hover:text-[#FF8A3D] transition-colors mt-1">
                  {word.term}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                  {word.definition}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF8A3D] group-hover:translate-x-1 transition-transform pt-1">
                <span>View Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 5 — FEATURED COLLECTIONS */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest bg-pink-400/5 border border-pink-400/10 px-2.5 py-0.5 rounded-full">
            Curated Lexicon Decks
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            Featured Collections
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Hand-picked decks compiling terms and definitions grouped by platform and community usage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {FEATURED_COLLECTIONS_LIST.map((col, idx) => (
            <Link 
              key={idx}
              href={`/category/${col.slug}`}
              className="group block cursor-pointer"
            >
              <div 
                style={{ boxShadow: `inset 0 0 20px ${col.glow}, 0 4px 24px rgba(0,0,0,0.5)` }}
                className="rounded-2xl border border-white/[0.06] bg-[#090A0F]/95 p-6 flex flex-col justify-between gap-5 text-left hover:border-[#FF6A1A]/35 transition-all duration-300 hover:scale-[1.02] min-h-[190px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>{col.count} Words</span>
                    <span>{col.readTime} Read</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#FF8A3D] transition-colors mt-2">
                    {col.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    {col.difficulty}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF8A3D] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 6 — LEARN INTERNET CULTURE */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest bg-[#FF8A3D]/5 border border-[#FF8A3D]/10 px-2.5 py-0.5 rounded-full">
            Educational Library
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            Learn Internet Culture
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Articles and deep-dives mapping modern sociolinguistics, viral cycles, and online behaviors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDUCATIONAL_CARDS.map((card, idx) => (
            <Link 
              key={idx}
              href={card.link}
              className="group rounded-2xl border border-white/[0.05] bg-[#0A0B10]/60 p-6 flex flex-col justify-between gap-5 text-left transition-all duration-300 hover:border-white/[0.14] hover:bg-[#12131C]/60 hover:scale-[1.02] shadow-[0_4px_24px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-[#FF8A3D] uppercase tracking-widest font-bold">
                  {card.category}
                </span>
                <h3 className="font-display font-bold text-base text-white mt-1 group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-0.5">
                  {card.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FF8A3D] group-hover:translate-x-1 transition-transform pt-3 border-t border-white/5">
                <span>Read Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 7 — DAILY DISCOVERY */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-[#8A6CFF] uppercase tracking-widest bg-[#8A6CFF]/5 border border-[#8A6CFF]/10 px-2.5 py-0.5 rounded-full">
            Daily Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            Daily Discovery
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Our featured cultural word breakdown loaded with origin history, examples, and etymology details.
          </p>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-[#0A0B10]/80 p-8 flex flex-col md:flex-row gap-8 items-stretch justify-between relative overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.6)] text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF6A1A]/10 to-transparent blur-3xl rounded-full" />
          
          <div className="flex-1 flex flex-col justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest font-bold">Word of the Day</span>
              <h3 className="text-4xl font-black text-white font-display uppercase tracking-tight mt-1">rizz</h3>
              <p className="text-sm text-slate-300 font-sans leading-relaxed mt-2">
                Coined as a clipping of the word &ldquo;charisma&rdquo;, representing the capacity to attract or seduce others through verbal charm, swagger, and nonverbal signals.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">History & Origin</span>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Coined around mid-2021 by online streamer Kai Cenat on Twitch, spreading rapidly into TikTok comment sections and viral clips, eventually being crowned Oxford Dictionary Word of the Year in 2023.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6 relative z-10">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-[#FF8A3D] uppercase tracking-widest font-bold">Usage Example</span>
              <p className="text-xs text-slate-300 italic font-serif leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/[0.03]">
                &ldquo;He got so much unspoken rizz that he didn&apos;t even need to introduce himself to get an invite.&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Related Expressions</span>
              <div className="flex flex-wrap gap-2">
                {["rizzler", "unspoken rizz", "w-rizz", "l-rizz", "rizzing up"].map((rel, idx) => (
                  <Link 
                    href="/word/rizz" 
                    key={idx}
                    className="text-[10px] font-mono text-slate-400 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-lg hover:border-[#FF6A1A]/30 hover:text-white transition-colors cursor-pointer"
                  >
                    {rel}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-4 text-[10px] font-mono text-slate-500">
              <span>Etymology Index: 100%</span>
              <Link href="/word/rizz" className="text-[#FF8A3D] font-bold hover:underline">Explore Etymology &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — DID YOU KNOW? */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest bg-pink-400/5 border border-pink-400/10 px-2.5 py-0.5 rounded-full">
            Random Trivia Logs
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            Did You Know?
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Decades of shifting culture produce weird, fascinating trivia. Here is an index of online historical milestones.
          </p>
        </div>

        <div className="max-w-2xl mx-auto w-full rounded-2xl border border-white/[0.06] bg-[#0A0B10]/90 p-8 flex flex-col justify-between gap-6 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-h-[180px] text-center items-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent blur-2xl rounded-full" />
          
          <div className="flex flex-col gap-2 z-10">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded-full w-fit mx-auto">
              {DID_YOU_KNOW_FACTS[factIndex].category}
            </span>
            <p className="text-lg font-display text-white font-bold leading-relaxed mt-2">
              &ldquo;{DID_YOU_KNOW_FACTS[factIndex].fact}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-1.5 z-10 mt-2">
            {DID_YOU_KNOW_FACTS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFactIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  factIndex === idx ? "bg-[#FF6A1A] w-4" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — TRUST */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
        <div className="flex flex-col gap-2 text-center items-center">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-400/5 border border-emerald-400/10 px-2.5 py-0.5 rounded-full">
            Why GenSpeak is Reliable
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">
            Reliable Internet Linguistics
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Linguistic shifts are parsed with rigorous checks to prevent bias, mistranslations, and hallucinated meanings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_CARDS.map((card, idx) => (
            <div key={idx} className="rounded-2xl border border-white/[0.05] bg-[#0A0B10]/40 p-6 flex items-start gap-4 text-left transition-all duration-300 hover:border-white/[0.12] hover:bg-[#12131C]/40 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              <span className="text-2xl p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                {card.icon}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display font-bold text-sm text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW NAVIGATION MATRIX */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 z-20 flex flex-col gap-10 border-t border-white/5 pt-20">
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
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#FF6A1A] transition-colors">
                    {card.icon}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="font-display font-bold text-base text-white group-hover:text-[#FF6A1A] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#9EA3B0] font-sans leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#FF6A1A] group-hover:translate-x-1 transition-all" />
                </div>
              </Glass3DCard>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

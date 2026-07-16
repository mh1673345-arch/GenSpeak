"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";
import { 
  Sparkles, Flame, LogOut, Plus, BookOpen, Compass, Award, Search,
  Trash2, Terminal, Target, ShieldCheck, Clock, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ----------------------------------------------------
// MINI EVOLVING PLANET CANVAS COMPONENT
// ----------------------------------------------------
interface EvolvingPlanetProps {
  streak: number;
  savedCount: number;
}

function EvolvingPlanet({ streak, savedCount }: EvolvingPlanetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Evolving stats mapping
  const starsCount = 40 + streak * 8;
  const satellitesCount = Math.min(6, Math.max(1, savedCount));
  const glowHue = 25 + Math.min(45, savedCount * 5); // Shifts from warm orange to gold/yellow

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let rotation = 0;
    const size = 180;
    
    // Setup high DPI canvas support
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const radius = 45 + Math.min(10, streak * 0.5);

      // 1. Draw volumetric cosmic gas aura backdrop
      const auraGrad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.6);
      auraGrad.addColorStop(0, `hsla(${glowHue}, 100%, 55%, 0.08)`);
      auraGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.04)"); // Purple outer gas
      auraGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw static deterministic background stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < starsCount; i++) {
        const starX = (Math.abs(Math.sin(i * 12.98)) * size) % size;
        const starY = (Math.abs(Math.cos(i * 78.23)) * size) % size;
        const sizeStar = 0.5 + (Math.abs(Math.sin(i * 4.5)) % 0.8);
        const blink = 0.3 + Math.abs(Math.sin(Date.now() * 0.002 + i)) * 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${blink * 0.5})`;
        ctx.fillRect(starX, starY, sizeStar, sizeStar);
      }

      // 3. Draw orbits & Satellites (grows as user bookmarks terms)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 0.75;
      
      for (let s = 0; s < satellitesCount; s++) {
        const orbitRadius = radius + 15 + s * 10;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw satellite dot
        const satAngle = (Date.now() * 0.0006 * (1 + s * 0.2)) % (Math.PI * 2);
        const satX = cx + Math.cos(satAngle) * orbitRadius;
        const satY = cy + Math.sin(satAngle) * orbitRadius;

        ctx.fillStyle = `hsla(${glowHue + s * 15}, 100%, 65%, 0.85)`;
        ctx.beginPath();
        ctx.arc(satX, satY, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Small glowing trace line
        ctx.strokeStyle = `hsla(${glowHue + s * 15}, 100%, 65%, 0.15)`;
        ctx.beginPath();
        ctx.moveTo(satX, satY);
        ctx.lineTo(satX - Math.cos(satAngle + 0.15) * 4, satY - Math.sin(satAngle + 0.15) * 4);
        ctx.stroke();
      }

      // 4. Draw Core Planet Sphere
      rotation += 0.004;
      const sphereGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, radius);
      sphereGrad.addColorStop(0, `hsla(${glowHue}, 100%, 60%, 0.9)`);
      sphereGrad.addColorStop(0.6, "rgba(20, 20, 28, 0.95)"); // Dark solid space core
      sphereGrad.addColorStop(1, "rgba(5, 5, 8, 1)");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 5. Draw glowing surface grid nodes
      for (let g = 0; g < 14; g++) {
        const theta = (g * 1.8) + rotation;
        const phi = Math.sin(g * 2.3) * radius * 0.6;
        const nodeX = cx + Math.cos(theta) * Math.sqrt(radius * radius - phi * phi) * 0.85;
        const nodeY = cy + phi;
        
        const opacity = 0.1 + Math.abs(Math.sin(Date.now() * 0.001 + g)) * 0.6;
        ctx.fillStyle = `hsla(${glowHue}, 100%, 65%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [streak, savedCount, glowHue, starsCount, satellitesCount]);

  return (
    <div className="w-[180px] h-[180px] shrink-0 bg-transparent flex items-center justify-center relative">
      {/* Outer spinning ring overlay */}
      <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.03] animate-spin" style={{ animationDuration: "25s" }} />
      <canvas ref={canvasRef} className="w-[180px] h-[180px] block" />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { 
    user, logout, unsaveWord, createCustomCollection 
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"journey" | "library" | "achievements">("journey");

  // Dynamic user progress attributes derived from auth context state
  const learnedCount = user ? 240 + user.savedWords.length * 4 : 0;
  const categoriesCount = user ? 6 + user.customCollections.length : 0;
  const guidesCount = user ? 12 + user.savedGuides.length : 0;
  const levelVal = user ? 8 + Math.floor(user.savedWords.length * 1.5) : 0;
  const xpPercent = user ? (user.savedWords.length * 20) % 100 : 0;

  // Track coordinates for cursor light hover
  const glowX = useRef(0);
  const glowY = useRef(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    glowX.current = e.clientX - rect.left;
    glowY.current = e.clientY - rect.top;
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050505] text-white relative overflow-hidden font-sans">
        <AuroraBackground />
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary-pink">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-display">Authentication Required</h1>
          <p className="text-xs text-slate-500 max-w-xs">
            Sign in to start cataloging terms, tracking stats, and unlocking culture badges.
          </p>
          <Link 
            href="/login" 
            className="px-5 py-2.5 rounded-xl bg-primary-pink text-white font-display font-semibold text-xs shadow-lg hover:shadow-primary-pink/20 transition-all active:scale-95"
          >
            Sign In Now
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter saved words based on search query
  const filteredWords = user.savedWords.filter(w => 
    w.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionTitle.trim()) return;
    createCustomCollection(newCollectionTitle.trim());
    setNewCollectionTitle("");
    setShowCreateModal(false);
  };

  // 12 collectible achievement cards mappings
  const achievementsList = [
    { key: "first-save", title: "🌟 First Word Saved", desc: "Saved your first slang phrase to favorites", unlocked: user.savedWords.length > 0 },
    { key: "streak-7", title: "🔥 7-Day Streak", desc: "Maintained a 7-day learning streak active", unlocked: user.streak >= 7 },
    { key: "100-words", title: "📚 100 Words Mastered", desc: "Completed cataloging 100 vocabulary terms", unlocked: learnedCount >= 250 },
    { key: "explorer", title: "🌍 Internet Explorer", desc: "Unlocked multiple subculture categories portals", unlocked: user.savedTopics.length > 0 },
    { key: "ai-expert", title: "🤖 AI Expert", desc: "Used the Bilingual AI slang companion to decode text", unlocked: true },
    { key: "meme-master", title: "😂 Meme Master", desc: "Finished analyzing structural meme culture timeline logs", unlocked: user.savedWords.includes("skibidi") },
    { key: "gaming-guru", title: "🎮 Gaming Guru", desc: "Cataloged multiplayer competitive lobby jargon", unlocked: user.savedWords.includes("sigma") }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col bg-[#050505] text-white relative overflow-hidden"
    >
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col gap-12 relative z-10">
        
        {/* 1. Dashboard Hero Header (Welcome Greeting & Evolving Journey Planet) */}
        <section className="glass-panel border border-white/[0.08] bg-[#0E0E12]/80 backdrop-blur-md rounded-3xl p-6.5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gold radial lighting backdrop */}
          <div className="absolute right-[10%] top-[-20%] w-[220px] h-[220px] rounded-full bg-[#FF6A1A]/5 blur-[70px] pointer-events-none" />
          
          <div className="flex flex-col gap-3.5 max-w-xl text-center md:text-left">
            <span className="mx-auto md:mx-0 text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] bg-[#FF6A1A]/10 px-3 py-1 rounded-full border border-[#FF6A1A]/10 w-fit flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              YOUR INTERNET JOURNEY
            </span>
            
            {/* Premium Hugging Mascots above greeting */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="flex items-center justify-center md:justify-start mt-1 relative select-none w-fit mx-auto md:mx-0"
            >
              {/* Reduced motion check & gentle float animation wrapper */}
              <motion.div
                animate={{
                  y: typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : [0, -5, 0]
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative flex items-center gap-1.5"
              >
                {/* Tiny sparkles overlays */}
                <span className="absolute -top-2 -right-3 text-[11px] text-[#FF8A3D] animate-pulse">✨</span>
                <span className="absolute -bottom-1 -left-3 text-[9px] text-[#8B5CF6] animate-pulse" style={{ animationDelay: "1s" }}>✨</span>
                
                <Image 
                  src="/genspeak_mascots.png" 
                  alt="Original GenSpeak Mascots sharing a warm hug" 
                  width={112}
                  height={56}
                  priority
                  className="h-14 w-auto object-contain rounded-2xl drop-shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-white/[0.05] bg-[#0E0E12]/50 p-1"
                />
              </motion.div>
            </motion.div>

            <div className="flex flex-col gap-1.5 mt-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-none text-white">
                Welcome back, {user.name.split(" ")[0]}!
              </h1>
              <p className="text-xs font-bold font-display text-[#FF8A3D] tracking-widest uppercase">
                Ready to explore the Internet today?
              </p>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              You are exploring the digital frontier. Evolve your internet planet by bookmarking terms, reading subculture guides, and translating slangs.
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 text-xs font-mono text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Evolving Planet Component */}
          <EvolvingPlanet streak={user.streak} savedCount={user.savedWords.length} />
        </section>

        {/* 2. Navigation Dashboard Tabs */}
        <section className="flex flex-col gap-8">
          <div className="flex border-b border-white/5 pb-2.5 text-xs font-mono uppercase tracking-widest gap-6">
            {[
              { id: "journey", label: "My Journey 🧭" },
              { id: "library", label: "Personal Library 🔖" },
              { id: "achievements", label: "Achievements 🏆" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "journey" | "library" | "achievements")}
                className={`pb-2 relative cursor-pointer font-bold ${
                  activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeDashTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A1A]"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* -------------------------------------------------- */}
            {/* SUB-VIEW 1: MY JOURNEY PORTAL                     */}
            {/* -------------------------------------------------- */}
            {activeTab === "journey" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-10"
              >
                {/* Stats and Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Progress Card with circular ring */}
                  <div className="glass-panel border border-white/[0.08] bg-[#0E0E12]/80 backdrop-blur-md rounded-2xl p-5.5 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Journey Progress</span>
                      <span className="text-lg font-bold font-display text-white mt-1">Level {levelVal}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-sans">Current Rank</span>
                        <span className="text-xs font-bold text-[#FF8A3D] font-mono">Internet Explorer</span>
                        <span className="text-[9px] text-slate-500 mt-1 uppercase font-mono">Next: Culture Expert</span>
                      </div>

                      {/* Circular progress ring */}
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-900"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <motion.path
                            className="text-[#FF8A3D]"
                            strokeWidth="2.5"
                            strokeDasharray={`${xpPercent}, 100`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{ strokeDasharray: `${xpPercent}, 100` }}
                            transition={{ duration: 1 }}
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold font-mono text-white">{xpPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Evolving stats recap */}
                  <div className="glass-panel border border-white/[0.08] bg-[#0E0E12]/80 backdrop-blur-md rounded-2xl p-5.5 flex flex-col justify-between min-h-[200px]">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Milestone metrics</span>
                      <span className="text-xs text-slate-400 mt-0.5">Your catalog stats are growing automatically:</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="flex flex-col gap-0.5 border-l-2 border-[#FF6A1A]/40 pl-2.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">WORDS LEARNED</span>
                        <span className="text-xl font-bold font-display text-white">{learnedCount}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l-2 border-primary-blue/40 pl-2.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">PORTALS SAVED</span>
                        <span className="text-xl font-bold font-display text-white">{categoriesCount}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 border-l-2 border-primary-purple/40 pl-2.5 col-span-2">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">GUIDES COMPLETED</span>
                        <span className="text-xl font-bold font-display text-white">{guidesCount} / 16</span>
                      </div>
                    </div>
                  </div>

                  {/* Learning Streak card */}
                  <div className="glass-panel border border-white/[0.08] bg-[#0E0E12]/80 backdrop-blur-md rounded-2xl p-5.5 flex flex-col justify-between min-h-[200px]">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">Streak Shield</span>
                        <span className="text-2xl font-black font-display text-white mt-1">🔥 {user.streak} Days</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#FF6A1A]/10 flex items-center justify-center text-[#FF8A3D]">
                        <Flame className="w-4.5 h-4.5" />
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-[#FF8A3D] font-mono leading-relaxed mt-2">
                      Streak active! Complete a daily guide or check trends to advance to level {levelVal + 1}.
                    </p>
                  </div>

                </div>

                {/* Evolving Learning Timeline & Recap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Journey Timeline */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="font-display font-bold text-sm text-white">Journey History Log</h3>
                      <Clock className="w-4 h-4 text-slate-500" />
                    </div>

                    <div className="flex flex-col gap-5 mt-2 relative pl-4 border-l border-white/5">
                      {user.recentActivity.map((activity) => (
                        <div key={activity.id} className="relative flex flex-col gap-1 animate-in fade-in duration-300">
                          {/* Dot marker */}
                          <div className="absolute left-[-20.5px] top-1.5 w-2 h-2 rounded-full bg-[#FF6A1A] border border-white/10" />
                          
                          <span className="text-xs text-slate-300 font-sans leading-relaxed">{activity.text}</span>
                          <span className="text-[8px] font-mono text-slate-500 uppercase">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Recap: This Week on GenSpeak */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="font-display font-bold text-sm text-white">This Week on GenSpeak</h3>
                      <Target className="w-4 h-4 text-slate-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="p-3.5 rounded-xl border border-white/5 bg-[#111217]/25 flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">MOST VIEWED WORD</span>
                        <span className="text-xs font-bold text-white uppercase font-display">rizz</span>
                      </div>
                      <div className="p-3.5 rounded-xl border border-white/5 bg-[#111217]/25 flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">FAVORITE SUBCULTURE</span>
                        <span className="text-xs font-bold text-white uppercase font-display">TikTok Culture</span>
                      </div>
                      <div className="p-3.5 rounded-xl border border-white/5 bg-[#111217]/25 flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">HOURS EXPLORED</span>
                        <span className="text-xs font-bold text-white uppercase font-mono">4.2 hours</span>
                      </div>
                      <div className="p-3.5 rounded-xl border border-white/5 bg-[#111217]/25 flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-slate-500 uppercase">NEW DECK CREATED</span>
                        <span className="text-xs font-bold text-white uppercase font-display">Ultimate Slang</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Quick Actions List */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-display font-bold text-sm text-white border-b border-white/5 pb-2">Quick Navigation Shortcuts</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                    {[
                      { title: "Continue Learning", desc: "Resume guides pathways", icon: <BookOpen className="w-4 h-4 text-primary-blue" />, href: "/guides" },
                      { title: "Open AI Decoder", desc: "Translate slang inputs", icon: <Terminal className="w-4 h-4 text-primary-pink" />, href: "/ai-decoder" },
                      { title: "Daily Challenge", desc: "Master words of the day", icon: <Target className="w-4 h-4 text-accent-orange" />, href: "/dictionary" },
                      { title: "Trending Today", desc: "View dynamic platform stats", icon: <Compass className="w-4 h-4 text-accent-cyan" />, href: "/trending" }
                    ].map((act, i) => (
                      <Link 
                        key={i} 
                        href={act.href}
                        className="p-4 rounded-xl border border-white/5 bg-[#111217]/20 hover:border-[#FF6A1A]/35 transition-all flex flex-col gap-2.5 group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {act.icon}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-display font-bold text-xs text-white group-hover:text-[#FF8A3D] transition-colors">{act.title}</span>
                          <span className="text-[9px] font-sans text-slate-500 leading-tight">{act.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recommended Curations */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-display font-bold text-sm text-white border-b border-white/5 pb-2">AI Recommended Discoveries</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    {[
                      { type: "slang", name: "Sigma", desc: "Independent lone-wolf slang concept.", slug: "/word/sigma" },
                      { type: "guide", name: "Understanding Brainrot", desc: "Absurdist vertical loop media slang.", slug: "/guides/understanding-brainrot" },
                      { type: "collection", name: "Top TikTok Slang", desc: "Primary list of vertical-reel tags.", slug: "/collections/top-tiktok-slang" }
                    ].map((rec, i) => (
                      <Link 
                        key={i} 
                        href={rec.slug}
                        className="p-4 rounded-xl border border-white/5 bg-[#111217]/15 flex flex-col gap-2 hover:border-[#FF6A1A]/20 transition-colors"
                      >
                        <span className="text-[8px] font-mono text-slate-500 uppercase">{rec.type} recommendation</span>
                        <span className="font-display font-bold text-xs text-white capitalize">{rec.name}</span>
                        <p className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5">{rec.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* -------------------------------------------------- */}
            {/* SUB-VIEW 2: PERSONAL LIBRARY                      */}
            {/* -------------------------------------------------- */}
            {activeTab === "library" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8"
              >
                {/* Search Bar for Library */}
                <div className="relative flex items-center max-w-md">
                  <Search className="absolute left-4 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saved words, decks..."
                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/30 transition-colors font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Saved Words List */}
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h4 className="font-display font-bold text-xs text-slate-400">Bookmarked Words</h4>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{filteredWords.length} items</span>
                    </div>

                    {filteredWords.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredWords.map((word) => (
                          <div 
                            key={word}
                            className="p-4.5 rounded-xl border border-white/5 bg-[#111217]/25 flex items-center justify-between group"
                          >
                            <Link href={`/word/${word}`} className="flex flex-col gap-0.5 capitalize">
                              <span className="font-display font-bold text-xs text-white group-hover:text-[#FF8A3D] transition-colors">{word}</span>
                              <span className="text-[9px] font-mono text-slate-500 lowercase">Dictionary entry</span>
                            </Link>
                            <button
                              onClick={() => unsaveWord(word)}
                              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-primary-pink transition-all cursor-pointer border border-white/5"
                              title="Delete bookmark"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No saved words found matching query.</p>
                    )}
                  </div>

                  {/* Decks & Custom collections sidebar */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h4 className="font-display font-bold text-xs text-slate-400">Custom Decks</h4>
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="text-[9px] font-mono text-[#FF8A3D] hover:underline uppercase font-bold"
                      >
                        + Create
                      </button>
                    </div>

                    <div className="flex flex-col gap-3.5">
                      {user.customCollections.map((deck) => (
                        <div 
                          key={deck.id}
                          className="p-4 rounded-xl border border-white/5 bg-[#111217]/25 flex flex-col gap-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-xs text-white capitalize">{deck.title}</span>
                            <span className="text-[8px] font-mono text-slate-500 uppercase">{deck.words.length} items</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {deck.words.length > 0 ? (
                              deck.words.map(w => (
                                <Link 
                                  key={w} 
                                  href={`/word/${w}`}
                                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[#FF8A3D]"
                                >
                                  #{w}
                                </Link>
                              ))
                            ) : (
                              <span className="text-[9px] text-slate-500 italic">No terms cataloged.</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------- */}
            {/* SUB-VIEW 3: ACHIEVEMENTS GALLERY                  */}
            {/* -------------------------------------------------- */}
            {activeTab === "achievements" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
                {achievementsList.map((item) => (
                  <div 
                    key={item.key}
                    className={`relative p-5 rounded-2xl border flex items-center gap-4 transition-all overflow-hidden ${
                      item.unlocked 
                        ? "bg-[#111217]/40 border-white/[0.06] hover:border-[#FF6A1A]/35" 
                        : "bg-slate-950/20 border-white/[0.02] opacity-40 select-none"
                    }`}
                  >
                    {/* Shimmer background overlay if unlocked */}
                    {item.unlocked && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: "3.5s" }} />
                    )}

                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-xl shrink-0">
                      {item.unlocked ? <ShieldCheck className="w-6 h-6 text-[#FF8A3D]" /> : "🔒"}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="font-display font-bold text-xs text-white">{item.title}</span>
                      <span className="text-[10px] font-sans text-slate-500 leading-tight">{item.desc}</span>
                      <span className="text-[8px] font-mono uppercase text-slate-400 mt-1">
                        {item.unlocked ? "Mastered ✓" : "Locked"}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* CREATE CUSTOM COLLECTION DECK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel border border-white/[0.08] bg-[#0E0E12] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-display font-black text-sm text-white">Create Custom Slang Deck</span>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">Deck Title</label>
                <input
                  type="text"
                  required
                  value={newCollectionTitle}
                  onChange={(e) => setNewCollectionTitle(e.target.value)}
                  placeholder="e.g. TikTok slang for content essays"
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/30 transition-colors font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#FF6A1A] hover:bg-[#FF6A1A]/95 text-white font-display font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Generate Deck</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

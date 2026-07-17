"use client";

import React, { useState, useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, Search, Bell, ChevronDown, LogOut, 
  Menu, X, Settings, User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // State hooks for menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse coords tracker for dynamic glass reflections
  const navRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Close menus when navigation occurs
  useEffect(() => {
    setTimeout(() => {
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
      setNotificationsDropdownOpen(false);
    }, 0);
  }, [pathname]);

  // Dispatch custom keyboard event to open spotlight search
  const triggerSpotlightSearch = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  // Dynamic notification counters
  const unreadNotifications = user?.notifications.filter(n => !n.read) || [];
  const hasUnread = unreadNotifications.length > 0;

  // Active page matching helpers
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dictionary", label: "Dictionary" },
    { href: "/ai-decoder", label: "Decoder" },
    { href: "/internet-culture", label: "Culture" },
    { href: "/trending", label: "Trends" },
    { href: "/guides", label: "Guides" },
    { href: "/collections", label: "Collections" }
  ];

  return (
    <>
      <header 
        ref={navRef}
        onMouseMove={handleMouseMove}
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl group transition-all duration-500 ease-out ${isScrolled ? "top-2" : "top-4"}`}
      >
        {/* Floating gradient border container */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent shadow-2xl relative overflow-hidden">
          
          {/* Mouse tracking radial orange halo backdrop */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-[radial-gradient(120px_circle_at_var(--x)_var(--y),rgba(255,106,26,0.06),transparent)]"
            style={{
              // @ts-expect-error - Custom CSS properties are not typed in React.CSSProperties
              "--x": `${mousePos.x}px`,
              "--y": `${mousePos.y}px`
            }}
          />

          {/* Inner dark glass panel */}
          <div className={`rounded-[15px] transition-all duration-500 ease-out px-4 sm:px-6 flex items-center justify-between relative z-10 ${isScrolled ? "py-1.5 bg-black/92 backdrop-blur-2xl shadow-inner border border-white/[0.03]" : "py-2.5 bg-[#09090b]/80 backdrop-blur-md"}`}>
            
            {/* LEFT: Logo and taglines */}
            <div className="flex flex-col select-none relative group/logo shrink-0">
              <div className="absolute inset-0 bg-[#FF6A1A]/10 blur-md rounded-full scale-75 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
              <Logo size={26} />
              <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1.5 ml-1">
                Understand the internet
              </span>
            </div>

            {/* CENTER: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 relative">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold relative transition-all duration-200 ${
                      isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {/* Hover and Active sliding background pills */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-white/[0.04] border border-white/[0.04] rounded-lg shadow-inner z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE: Action panel */}
            <div className="flex items-center gap-3">
              
              {/* Premium AI Translate CTA button */}
              <Link 
                href="/ai-decoder"
                className="relative hidden sm:flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-transparent text-xs font-semibold text-white shadow-lg hover:shadow-[#FF6A1A]/15 transition-all overflow-hidden group/cta hover:-translate-y-0.5 active:scale-95 duration-200 shrink-0 cursor-pointer"
              >
                {/* Gradient ring */}
                <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-[#FF6A1A] via-primary-pink to-primary-purple pointer-events-none" />
                <div className="absolute inset-[1px] rounded-full bg-[#0a0a0c] group-hover/cta:bg-[#111115] transition-colors" />
                
                <span className="relative z-10 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D] animate-pulse" />
                  <span>AI Translate</span>
                </span>
              </Link>

              {/* Spotlight Search Toggle */}
              <button
                onClick={triggerSpotlightSearch}
                className="w-8 h-8 rounded-full border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 cursor-pointer"
                title="Search (Ctrl+K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notifications Toggle Panel */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsDropdownOpen(!notificationsDropdownOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-8 h-8 rounded-full border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 relative cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {hasUnread && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6A1A] rounded-full border border-[#09090b] animate-pulse" />
                  )}
                </button>

                {/* Notifications dropdown menu */}
                <AnimatePresence>
                  {notificationsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3.5 w-64 rounded-xl border border-white/[0.06] bg-[#0E0E12]/95 backdrop-blur-md p-3.5 shadow-2xl z-50 flex flex-col gap-2.5"
                    >
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">Notifications</span>
                      {user ? (
                        <div className="flex flex-col gap-2">
                          {user.notifications.slice(0, 3).map((n) => (
                            <div key={n.id} className="text-[10px] text-slate-300 font-sans border-b border-white/5 pb-2 last:border-b-0 leading-normal flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 bg-[#FF8A3D] rounded-full shrink-0 mt-1" />
                              <span>{n.text}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Sign in to view notification logs.</span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Capsule dropdown trigger */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotificationsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.08] hover:shadow-[#FF6A1A]/5 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    {/* Slow-spinning custom planetary avatar visual */}
                    <div className="relative w-6.5 h-6.5 rounded-full overflow-hidden shrink-0 border border-white/10 select-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6A1A] to-primary-purple animate-spin" style={{ animationDuration: "12s" }} />
                      <div className="absolute inset-[2px] rounded-full bg-slate-950 flex items-center justify-center font-display font-black text-[9px] text-[#FF8A3D]">
                        GP
                      </div>
                      {/* Active online glowing status indicator */}
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[#09090b]" />
                    </div>

                    <span className="hidden md:inline text-xs font-semibold text-slate-300 group-hover:text-white font-sans shrink-0">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer font-sans"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}

                {/* Profile menu dropdown content */}
                <AnimatePresence>
                  {profileDropdownOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3.5 w-52 rounded-xl border border-white/[0.06] bg-[#0E0E12]/95 backdrop-blur-md p-3.5 shadow-2xl z-50 flex flex-col gap-3.5"
                    >
                      <div className="flex flex-col gap-0.5 border-b border-white/5 pb-2.5">
                        <span className="font-display font-bold text-xs text-white capitalize">{user.name}</span>
                        <span className="text-[9px] font-mono text-slate-500 lowercase leading-none">{user.email}</span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs font-sans text-slate-400">
                        <Link href="/dashboard" className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors">
                          <UserIcon className="w-4 h-4 text-slate-500" />
                          <span>My Profile</span>
                        </Link>
                        <Link href="/admin" className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors">
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          router.push("/login");
                        }}
                        className="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-display font-semibold text-xs border border-red-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger Button on smaller viewports */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 rounded-full border border-white/[0.04] bg-white/[0.02] lg:hidden flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-out mobile navigation drawer overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 lg:hidden rounded-2xl border border-white/[0.08] bg-[#09090b]/95 backdrop-blur-md p-6 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3 text-sm font-semibold font-display text-slate-400">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-2 px-3 rounded-lg transition-colors ${
                      isActive ? "bg-white/[0.04] text-white" : "hover:bg-white/[0.02] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/ai-decoder"
              className="py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-primary-pink text-white font-display font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Slang Translator</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

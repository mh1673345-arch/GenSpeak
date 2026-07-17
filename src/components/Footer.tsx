"use client";

import React, { useState } from "react";
import { Logo } from "./Logo";
import { Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer id="newsletter" className="w-full border-t border-white/5 bg-[#050505] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-start text-left">
          
          {/* Brand Bio (takes 2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Logo />
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-sans">
              GenSpeak is the internet culture wiki and translation framework translating digital language, memes, and trends for students, parents, developers, and educators.
            </p>
            {/* Newsletter Box inside Brand Column */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/5 p-5 bg-[#0A0B10]/60 max-w-sm">
              <h4 className="font-display font-bold text-xs uppercase text-slate-300 tracking-wider">Stay Culturally Updated</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans font-medium">
                Join 15,000+ subscribers who receive our weekly breakdown of internet slang and rising TikTok trends.
              </p>
              {submitted ? (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] mt-1 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscription successful!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    required
                    className="flex-1 bg-black/50 border border-white/5 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-primary-pink/40 font-sans"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-gradient-to-r from-[#FF6A1A] to-[#FF8A3D] text-white transition-all duration-300 active:scale-95 cursor-pointer hover:brightness-110"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[10px] font-mono font-bold text-[#FF8A3D] uppercase tracking-widest">Popular Searches</span>
            <div className="flex flex-col gap-2 text-xs">
              {["rizz", "skibidi", "gyatt", "sigma", "npc"].map((term) => (
                <Link key={term} href={`/word/${term}`} className="text-slate-500 hover:text-white transition-colors capitalize font-sans">{term}</Link>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[10px] font-mono font-bold text-[#8A6CFF] uppercase tracking-widest">Top Categories</span>
            <div className="flex flex-col gap-2 text-xs">
              {[
                { name: "Memes", slug: "memes" },
                { name: "Gaming", slug: "gaming" },
                { name: "TikTok", slug: "tiktok" },
                { name: "AI", slug: "ai" },
                { name: "Discord", slug: "discord" }
              ].map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="text-slate-500 hover:text-white transition-colors font-sans">{cat.name}</Link>
              ))}
            </div>
          </div>

          {/* Newest Words */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest">Newest Words</span>
            <div className="flex flex-col gap-2 text-xs">
              {["fanum tax", "looksmaxing", "mogging", "delulu", "cooked"].map((term) => (
                <Link key={term} href={`/word/${term}`} className="text-slate-500 hover:text-white transition-colors capitalize font-sans">{term}</Link>
              ))}
            </div>
          </div>

          {/* Learning & Company */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Resources</span>
            <div className="flex flex-col gap-2 text-xs">
              <Link href="/guides/complete-guide-to-gen-z-slang" className="text-slate-500 hover:text-white transition-colors font-sans">Guides & Ebooks</Link>
              <Link href="/timeline" className="text-slate-500 hover:text-white transition-colors font-sans">Internet Timeline</Link>
              <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors font-sans">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-500 hover:text-white transition-colors font-sans">Terms of Use</Link>
              <a href="https://github.com/mh1673345-arch/GenSpeak.git" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors font-mono text-[10px]">GitHub Repository</a>
            </div>
          </div>

        </div>

        {/* Lower footer copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600">
          <span>&copy; {new Date().getFullYear()} GenSpeak Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Built by elite start-up teams</span>
            <span>v1.0.0-PROTOTYPE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

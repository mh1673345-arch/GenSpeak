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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Brand Bio */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-sans">
              GenSpeak is the internet culture wiki and translation framework translating digital language, memes, and trends for students, parents, developers, and educators.
            </p>
          </div>

          {/* Quick Sitemap Links */}
          <div className="grid grid-cols-2 gap-4 lg:justify-items-center">
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-400 font-display uppercase tracking-widest">Platform</span>
              <Link href="/ai-decoder" className="text-xs text-slate-500 hover:text-white transition-colors">Translator</Link>
              <Link href="/dictionary" className="text-xs text-slate-500 hover:text-white transition-colors">Slang Wiki</Link>
              <Link href="/internet-culture" className="text-xs text-slate-500 hover:text-white transition-colors">Culture Hub</Link>
              <Link href="/trending" className="text-xs text-slate-500 hover:text-white transition-colors">Pop Trends</Link>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-400 font-display uppercase tracking-widest">Legal</span>
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Use</Link>
              <Link href="/contact" className="text-xs text-slate-500 hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="flex flex-col gap-3 rounded-2xl glass-panel p-5 relative overflow-hidden bg-slate-950/40">
            <h4 className="font-display font-bold text-xs uppercase text-slate-300 tracking-wider">Stay Culturally Updated</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Join 15,000+ subscribers who receive our weekly breakdown of internet slang and rising TikTok trends.
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-accent-mint/10 border border-accent-mint/20 text-accent-mint text-xs mt-1 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Subscription successful! Thank you.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
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
                  className="p-2 rounded-xl bg-primary-pink hover:bg-primary-pink/90 text-white transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lower footer copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-600">
          <span>&copy; {new Date().getFullYear()} GenSpeak Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Built by the elite startup team</span>
            <span>v1.0.0-PROTOTYPE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

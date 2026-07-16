"use client";

import React, { useState } from "react";
import { Terminal, Send, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-black relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-none">
            Contact <span className="text-gradient">GenSpeak.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans leading-relaxed mt-2">
            Have ideas, vocabulary submissions, or partnership inquiries? Get in touch with our editorial accelerator team.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-accent-mint/10 border border-accent-mint/20 text-accent-mint text-xs max-w-md animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you! Your message was submitted successfully. Our coordinators will reach out.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md bg-[#111217]/20 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Your Name</label>
              <input
                type="text"
                required
                className="bg-black/50 border border-white/5 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-primary-pink/40"
                placeholder="Alex Mercer"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Your Email</label>
              <input
                type="email"
                required
                className="bg-black/50 border border-white/5 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-primary-pink/40"
                placeholder="name@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Your Message</label>
              <textarea
                required
                rows={4}
                className="bg-black/50 border border-white/5 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-primary-pink/40 resize-none"
                placeholder="Describe your inquiry..."
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary-pink text-white font-display font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-primary-pink/90 hover:scale-[1.02] active:scale-95 cursor-pointer mt-2"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

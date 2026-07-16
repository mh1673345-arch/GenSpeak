"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Mail, Lock, Sparkles, Send, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "magic">("password");
  
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      login("Credentials", email);
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setMagicLinkSent(true);
      setIsLoading(false);
      // Auto login after 2 seconds to simulate clicking the link
      setTimeout(() => {
        login("Magic Link", email);
        router.push("/dashboard");
      }, 1500);
    }, 1000);
  };

  const handleSocialLogin = (provider: "Google" | "GitHub") => {
    setIsLoading(true);
    setTimeout(() => {
      login(provider, provider === "Google" ? "google-user@genspeak.app" : "github-user@genspeak.app");
      setIsLoading(false);
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white relative overflow-hidden">
      <AuroraBackground />
      <Navbar />

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-24 md:py-32 flex flex-col justify-center gap-8 relative z-10 font-sans">
        
        {/* Intro Header */}
        <div className="flex flex-col gap-2.5 text-center">
          <span className="mx-auto text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF8A3D] bg-[#FF6A1A]/10 px-3 py-1 rounded-full border border-[#FF6A1A]/10 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Join the Universe
          </span>
          <h1 className="text-3xl font-black font-display tracking-tight text-white mt-1">
            Welcome to GenSpeak
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Log in to save slang terms, unlock badges, customize collections, and track your internet culture mastery progress.
          </p>
        </div>

        {/* Auth Glass Box */}
        <div className="glass-panel border border-white/[0.08] bg-[#0E0E12]/80 backdrop-blur-md rounded-3xl p-6.5 shadow-2xl flex flex-col gap-5">
          
          {/* Tabs for Credentials vs Magic Link */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/5">
            <button
              onClick={() => { setLoginMethod("password"); setMagicLinkSent(false); }}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                loginMethod === "password" ? "bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/15" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Credentials
            </button>
            <button
              onClick={() => { setLoginMethod("magic"); setMagicLinkSent(false); }}
              className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer ${
                loginMethod === "magic" ? "bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/15" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Magic Link
            </button>
          </div>

          {magicLinkSent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 flex flex-col items-center justify-center gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-accent-mint/15 text-accent-mint flex items-center justify-center border border-accent-mint/20 animate-pulse">
                <Check className="w-6 h-6" />
              </div>
              <span className="font-display font-black text-sm text-white">Magic Link Sent!</span>
              <p className="text-xs text-slate-400 max-w-[240px]">
                We sent a secure sign-in link to your email. We are simulating verification, redirecting shortly...
              </p>
            </motion.div>
          ) : (
            <form 
              onSubmit={loginMethod === "password" ? handleCredentialsSubmit : handleMagicLinkSubmit}
              className="flex flex-col gap-4"
            >
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/30 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input (only for Credentials) */}
              {loginMethod === "password" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wide flex items-center justify-between">
                    <span>Password</span>
                    <a href="#" className="text-[9px] hover:text-[#FF8A3D] text-slate-500 lowercase">Forgot password?</a>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#FF6A1A]/30 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-pink to-primary-purple text-white font-display font-semibold text-xs transition-all active:scale-[0.98] disabled:opacity-50 hover:shadow-[0_0_20px_rgba(255,106,26,0.25)] flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <span>{isLoading ? "Signing in..." : loginMethod === "password" ? "Sign In" : "Send Link"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Social Auth Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-mono text-slate-600 uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin("Google")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-white/5 bg-slate-950 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-[#4285F4]" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.535 0-6.403-2.868-6.403-6.403s2.868-6.403 6.403-6.403c1.582 0 3.03.578 4.16 1.54l3.197-3.197C19.263 2.052 15.932 1 12.24 1 5.866 1 .697 6.168.697 12.54s5.169 11.54 11.543 11.54c6.702 0 11.458-4.708 11.458-11.666 0-.79-.084-1.522-.24-2.129H12.24z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin("GitHub")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-white/5 bg-slate-950 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}

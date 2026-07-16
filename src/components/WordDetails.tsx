"use client";

import React, { useState } from "react";
import { 
  Volume2, Bookmark, Share2, AlertTriangle, CheckCircle, 
  ThumbsUp, MessageSquare, HelpCircle, Check 
} from "lucide-react";
import { WordData } from "../data/mockWords";
import { mockCollections } from "../data/mockCollections";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

interface WordDetailsProps {
  word: WordData;
}

export function WordDetails({ word }: WordDetailsProps) {
  const [activeExplainTab, setActiveExplainTab] = useState<"eli10" | "parent" | "teacher">("eli10");
  const { user, saveWord, unsaveWord } = useAuth();
  const [votes, setVotes] = useState(word.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const bookmarked = user ? user.savedWords.includes(word.slug) : false;
  const [copiedLink, setCopiedLink] = useState(false);
  const [comments, setComments] = useState<string[]>([
    "This literally resolved my confusion during a TikTok stream last night.",
    "Finally, a clean breakdown of this without corporate cringe.",
    "The origin section is super accurate."
  ]);
  const [newComment, setNewComment] = useState("");

  const associatedCollections = mockCollections.filter((col) =>
    col.wordSlugs.includes(word.slug)
  );

  const getEli10 = (slug: string) => {
    switch (slug) {
      case "rizz":
        return "It's like having a magical invisible magnet that makes everyone want to be your friend and laugh at your jokes because you're super friendly and cool!";
      case "skibidi":
        return "A funny nonsense word that kids use to describe something that is either super cool or really silly and weird, like a goofy cartoon character.";
      case "gyatt":
        return "A big exclamation shout that people make when they are super surprised or see something really cool or large.";
      case "sigma":
        return "Like a cool, quiet superhero who does their own thing, stays focused on their goals, and doesn't need to brag to be awesome.";
      case "delulu":
        return "Believing in something so much that it's like pretending you have superpowers—it's silly but sometimes fun to imagine!";
      default:
        return "A playful internet expression to describe someone having fun or acting a bit silly online.";
    }
  };

  const handleVote = () => {
    if (hasVoted) {
      setVotes((prev) => prev - 1);
      setHasVoted(false);
    } else {
      setVotes((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://genspeak.app/word/${word.slug}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.term);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [newComment, ...prev]);
    setNewComment("");
  };

    const difficulty = word.difficulty || "Intermediate";
    const popularityStatus = word.popularityStatus || "Common";
    const commonMistakes = word.commonMistakes || "Using the term out of casual context.";
    const funFact = word.funFact || "Internet culture terms develop rapidly across social platform threads.";
    const didYouKnow = word.didYouKnow || "These expressions often clip formal syllables to optimize typing speeds.";

    return (
      <div className="w-full flex flex-col gap-8 animate-in fade-in duration-300">
        
        {/* Safety Notes Banner */}
        {word.safetyNotes && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-550 text-xs flex items-center gap-3 text-left"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
            <div className="flex flex-col">
              <span className="font-bold uppercase tracking-wider text-[9px] font-mono text-red-400">SAFETY NOTES BULLETIN</span>
              <span className="mt-0.5">{word.safetyNotes}</span>
            </div>
          </motion.div>
        )}
        
        {/* 1. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex flex-col gap-2">
            {/* Category Tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                {word.category}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                {difficulty}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                {popularityStatus}
              </span>
              <span className="text-[10px] text-slate-500 font-mono ml-1">/word/{word.slug}</span>
            </div>

          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-display">
              {word.term}
            </h1>
            
            {/* Audio Button */}
            <button 
              onClick={handleSpeak}
              className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 active:scale-95 cursor-pointer"
              title="Listen Pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-slate-500 italic mt-2">
              Pronounced: {word.ipa || word.pronunciation}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (!user) {
                alert("Please Sign In to save words to your dashboard!");
                return;
              }
              if (bookmarked) {
                unsaveWord(word.slug);
              } else {
                saveWord(word.slug);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold font-display tracking-wide transition-all duration-300 active:scale-95 cursor-pointer ${
              bookmarked 
                ? "bg-accent-mint/10 border-accent-mint/30 text-accent-mint" 
                : "bg-slate-900 border-white/5 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-accent-mint text-accent-mint" : ""}`} />
            <span>{bookmarked ? "Bookmarked" : "Save Word"}</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 text-xs font-semibold font-display tracking-wide transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-accent-mint" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? "Copied!" : "Share Slang"}</span>
          </button>
        </div>
      </div>

      {/* 2. CORE INFORMATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Areas */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Quick Definition Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-primary-blue/10 to-accent-mint/5 border border-primary-blue/10 p-6 flex flex-col gap-3 relative overflow-hidden"
          >
            <div className="absolute -right-16 -top-16 w-36 h-36 bg-accent-mint/10 rounded-full blur-2xl" />
            <h3 className="font-display font-bold text-xs uppercase text-primary-blue tracking-widest">Core Definition</h3>
            <p className="text-xl font-sans font-semibold leading-relaxed text-white">
              {word.definition}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mt-2">
              {word.meaning}
            </p>
          </motion.div>

          {/* AI Semantic Context */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl glass-panel p-5 flex flex-col gap-3 border-l-2 border-accent-cyan"
          >
            <h3 className="font-display font-bold text-xs uppercase text-accent-cyan tracking-widest flex items-center gap-2">
              <span>Linguistic Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              {word.aiExplanation}
            </p>
            <div className="flex gap-2 items-center text-xs text-slate-400 mt-1 border-t border-white/5 pt-2">
              <span className="font-semibold text-slate-500 font-display">Plain Meaning:</span>
              <span>&quot;{word.aiTranslation}&quot;</span>
            </div>
          </motion.div>

          {/* Audience Explanations Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl glass-panel p-5 flex flex-col gap-4 border-l-2 border-primary-pink"
          >
            <div className="flex border-b border-white/5 pb-2 gap-4 text-[9px] font-mono font-bold tracking-widest uppercase text-left">
              {[
                { id: "eli10", label: "👶 Kids (ELI10)" },
                { id: "parent", label: "👪 Parents" },
                { id: "teacher", label: "🍎 Teachers" }
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setActiveExplainTab(t.id as "eli10" | "parent" | "teacher")}
                  className={`pb-1 transition-all ${
                    activeExplainTab === t.id ? "text-primary-pink border-b border-primary-pink" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans text-left">
              {activeExplainTab === "eli10" && (word.eli10 || getEli10(word.slug))}
              {activeExplainTab === "parent" && (word.parentExplanation || `A contemporary youth slang representing ${word.definition}. Used casually in digital messages.`)}
              {activeExplainTab === "teacher" && (word.teacherExplanation || `Educational guide context: frequently used to express peer sentiment inside vertical feeds.`)}
            </p>
          </motion.div>

          {/* Origin Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <h4 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider">Etymology & Origin</h4>
            <div className="rounded-2xl glass-panel p-5 text-sm leading-relaxed text-slate-300">
              {word.origin}
            </div>
          </motion.div>

          {/* Historical Timeline */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            <h4 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider">Development Timeline</h4>
            <div className="relative pl-6 border-l border-white/10 flex flex-col gap-6 mt-2 ml-3">
              {word.history.map((event, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Circle Pin */}
                  <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-primary-blue border-2 border-brand-black" />
                  
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-semibold text-slate-500">{event.date}</span>
                    <span className="font-display font-bold text-sm text-white mt-0.5">{event.title}</span>
                    <span className="text-xs text-slate-400 mt-1 leading-relaxed">{event.content}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Usage Context Tables */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <h4 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider">Usage Scenarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ y: -4, borderColor: "rgba(0,102,255,0.3)" }}
                className="rounded-xl bg-slate-900/60 border border-white/5 p-4 transition-all duration-300"
              >
                <span className="font-display text-xs font-bold text-primary-blue uppercase tracking-wide">TikTok Usage</span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{word.tiktokUsage}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.3)" }}
                className="rounded-xl bg-slate-900/60 border border-white/5 p-4 transition-all duration-300"
              >
                <span className="font-display text-xs font-bold text-accent-mint uppercase tracking-wide">Gaming Lobbies</span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{word.gamingUsage}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4, borderColor: "rgba(6,182,212,0.3)" }}
                className="rounded-xl bg-slate-900/60 border border-white/5 p-4 transition-all duration-300"
              >
                <span className="font-display text-xs font-bold text-accent-cyan uppercase tracking-wide">Discord Servers</span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{word.discordUsage}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Example Dialogue Blocks */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            <h4 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider">Conversation Examples</h4>
            <div className="flex flex-col gap-3">
              {word.examples.map((ex, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  className="rounded-xl bg-slate-950/60 border border-white/5 p-4 flex flex-col gap-1.5"
                >
                  <p className="text-sm font-sans font-medium text-slate-200 italic">&quot;{ex.text}&quot;</p>
                  <span className="text-[10px] font-mono text-slate-500 uppercase self-end">Context: {ex.context}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Sidebar Info Panels */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Metrics */}
          <div className="rounded-2xl glass-panel p-5 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">Engagement</h4>
            
            {/* Voting Component */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex flex-col">
                <span className="font-mono text-lg font-bold text-white">{votes.toLocaleString()}</span>
                <span className="text-[10px] font-mono text-slate-500">COMMUNITY VOTES</span>
              </div>

              <button 
                onClick={handleVote}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all duration-300 active:scale-95 cursor-pointer ${
                  hasVoted
                    ? "bg-primary-blue text-white shadow-[0_0_15px_rgba(0,102,255,0.3)]"
                    : "bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:border-slate-700"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{hasVoted ? "Voted W" : "Vote W"}</span>
              </button>
            </div>

            {/* Popularity Indicators */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Platform Relevance</span>
              {word.popularity.map((pop, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-400 font-medium">{pop.platform}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary-blue to-accent-mint"
                        style={{ width: `${pop.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-300 font-semibold">{pop.score}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Popularity Meter */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Popularity Status</span>
              <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                <span className={popularityStatus === "Viral" ? "text-primary-pink" : "text-slate-600"}>🔥 VIRAL</span>
                <span className={popularityStatus === "Growing" ? "text-primary-blue" : "text-slate-600"}>📈 GROWING</span>
                <span className={popularityStatus === "Common" ? "text-accent-cyan" : "text-slate-600"}>😎 COMMON</span>
                <span className={popularityStatus === "Declining" ? "text-accent-orange" : "text-slate-600"}>📉 DECLINING</span>
              </div>
            </div>
          </div>

          {/* Guidelines Checklist */}
          <div className="rounded-2xl glass-panel p-5 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">Linguistic Etiquette</h4>
            
            {/* When to Use */}
            <div className="flex gap-2.5 items-start">
              <CheckCircle className="w-4 h-4 text-accent-mint shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-slate-200">When To Use</span>
                <span className="text-slate-400 mt-1 leading-relaxed">{word.whenToUse}</span>
              </div>
            </div>

            {/* When NOT to Use */}
            <div className="flex gap-2.5 items-start">
              <AlertTriangle className="w-4 h-4 text-accent-orange shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-slate-200">When NOT To Use</span>
                <span className="text-slate-400 mt-1 leading-relaxed">{word.whenNotToUse}</span>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="flex gap-2.5 items-start border-t border-white/5 pt-3">
              <AlertTriangle className="w-4 h-4 text-primary-pink shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-slate-200">Common Mistakes</span>
                <span className="text-slate-400 mt-1 leading-relaxed">{commonMistakes}</span>
              </div>
            </div>
          </div>

          {/* Related Metadata Tags */}
          <div className="rounded-2xl glass-panel p-5 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">Semantic Associations</h4>
            
            {/* Synonyms */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Synonyms</span>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map((syn, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-default">
                    {syn}
                  </span>
                ))}
              </div>
            </div>

            {/* Antonyms (Opposites) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Antonyms (Opposites)</span>
              <div className="flex flex-wrap gap-1.5">
                {word.antonyms.map((ant, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-default">
                    {ant}
                  </span>
                ))}
              </div>
            </div>

            {/* Emojis */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Associated Emojis</span>
              <div className="flex gap-2 text-xl">
                {word.emojis.map((emoji, idx) => (
                  <span key={idx} className="hover:scale-110 transition-transform duration-200 cursor-default">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Memes */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Associated Memes</span>
              <div className="flex flex-wrap gap-1">
                {word.memes.map((meme, idx) => (
                  <span key={idx} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#090D1A] border border-white/5 text-slate-400">
                    #{meme}
                  </span>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
              <span className="text-[10px] font-mono text-primary-blue uppercase tracking-wide">💡 Fun Fact</span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{funFact}</p>
            </div>

            {/* Did You Know */}
            <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
              <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-wide">❓ Did You Know?</span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{didYouKnow}</p>
            </div>
          </div>

        </div>

      </div>

      {/* 3. FAQ SECTION */}
      <div className="flex flex-col gap-4">
        <h3 className="font-display font-bold text-lg text-white">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {word.faq.map((item, idx) => (
            <div key={idx} className="rounded-2xl glass-panel p-5 flex flex-col gap-2 bg-[#090D1A]/50">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4.5 h-4.5 text-primary-blue shrink-0 mt-0.5" />
                <h5 className="font-display font-bold text-sm text-slate-200">{item.q}</h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-7">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DISCOVERY: CURATED COLLECTIONS */}
      {associatedCollections.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
          <h3 className="font-display font-bold text-lg text-white">Curated Slang Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {associatedCollections.map((col) => (
              <div 
                key={col.id} 
                className="rounded-2xl glass-panel p-5 border border-white/5 flex flex-col gap-3 relative overflow-hidden bg-slate-900/10"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${col.bannerGradient}`} />
                <div className="flex flex-col gap-1 pl-2">
                  <span className="font-display font-bold text-sm text-white">{col.title}</span>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{col.description}</p>
                </div>
                
                {/* Related Articles */}
                <div className="pl-2 border-t border-white/5 pt-2.5 flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">Included Articles:</span>
                  {col.articles.map((art, idx) => (
                    <div 
                      key={idx} 
                      className="text-xs text-slate-400 flex items-center justify-between"
                    >
                      <span>{art.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono italic shrink-0">{art.readTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COMMENTS ENGINE */}
      <div className="flex flex-col gap-6 border-t border-white/5 pt-6">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          <h3 className="font-display font-bold text-lg text-white">
            Community Comments ({comments.length})
          </h3>
        </div>

        {/* Input Comment Form */}
        <form onSubmit={handleAddComment} className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your context or correction with the community..."
            className="w-full bg-slate-950/60 border border-white/5 p-4 rounded-2xl text-sm placeholder-slate-600 outline-none resize-none h-20 focus:border-primary-blue/40 font-sans"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="self-end px-5 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-slate-700 text-xs font-semibold font-display text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            Post Comment
          </button>
        </form>

        {/* Comments Feed List */}
        <div className="flex flex-col gap-4 mt-2">
          {comments.map((comment, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-900/30 border border-white/[0.02]">
              {/* Fake Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-blue/20 to-accent-mint/30 flex items-center justify-center shrink-0 border border-white/10">
                <span className="text-[10px] font-bold font-mono text-white">U{idx+1}</span>
              </div>
              
              <div className="flex flex-col text-sm gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-xs text-slate-300">AnonymousUser_{idx + 923}</span>
                  <span className="text-[9px] font-mono text-slate-500">2 hours ago</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">{comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

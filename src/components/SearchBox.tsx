"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, CornerDownLeft, Sparkles, Mic, MicOff, Trash2, X, ArrowRight
} from "lucide-react";
import { WordData } from "../data/mockWords";
import { executeAIRequest } from "../lib/aiService";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchBoxProps {
  onSelectWord?: (word: WordData) => void;
}

interface SearchItem {
  id: string;
  type: "word" | "guide" | "collection" | "category" | "timeline" | "emoji";
  title: string;
  subtitle: string;
  slug: string;
  emoji?: string;
}

// Emojis, guides, and categories are fetched dynamically from the database.

export function SearchBox({ onSelectWord }: SearchBoxProps) {
  const router = useRouter();
  
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  
  // AI Answers
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const [results, setResults] = useState<SearchItem[]>([]);
  const [trendingWords, setTrendingWords] = useState<WordData[]>([]);
  const [hoverMousePos, setHoverMousePos] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  
  const handleTriggerMouseMove = (e: React.MouseEvent) => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setHoverMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Load search history and trending words on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const history = localStorage.getItem("genspeak_search_history");
      if (history) {
        Promise.resolve().then(() => {
          setRecentSearches(JSON.parse(history));
        });
      }
    }
    fetch("/api/word?trending=true")
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setTrendingWords(data);
        }, 0);
      })
      .catch(err => console.error("Failed to load trending words:", err));
  }, []);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Web Speech API Voice search initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      interface SpeechRecognitionEvent {
        results: {
          [index: number]: {
            [index: number]: {
              transcript: string;
            };
          };
        };
      }
      interface SpeechRecognitionInstance {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onstart: () => void;
        onend: () => void;
        onerror: (event: { error: string }) => void;
        onresult: (event: SpeechRecognitionEvent) => void;
        start: () => void;
        stop: () => void;
      }
      const globalWindow = window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
      };
      const SpeechRecognition = globalWindow.SpeechRecognition || globalWindow.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onerror = (e: { error: string }) => {
          setIsListening(false);
          console.warn("Speech Recognition Error:", e);
          if (e.error === "not-allowed") {
            alert("Microphone permission was denied. Please allow microphone access in your browser settings.");
          }
        };
        rec.onresult = (event: SpeechRecognitionEvent) => {
          const speechToText = event.results[0][0].transcript;
          setQuery(speechToText);
        };
        recognitionRef.current = rec;
      }
    }
  }, []);

  // Debounced AI Search response mapping
  useEffect(() => {
    if (!query.trim()) {
      Promise.resolve().then(() => {
        setAiAnswer(null);
      });
      return;
    }

    const isQuestion = /what|explain|how|why|define|💀/i.test(query) || 
                       (query.trim().length <= 2 && /\p{Emoji}/u.test(query));
    if (!isQuestion) {
      Promise.resolve().then(() => {
        setAiAnswer(null);
      });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await executeAIRequest("slangTranslate", query);
        setAiAnswer(res.content);
      } catch (e) {
        console.error(e);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setTimeout(() => {
        setResults([]);
      }, 0);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (e) {
        console.error("Failed to query database search results:", e);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);



  // Database search results are retrieved and updated dynamically in useEffect above.

  // Focus input automatically on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchItem) => {
    // Add to history
    const updatedHistory = [item.title, ...recentSearches.filter(t => t !== item.title)].slice(0, 4);
    setRecentSearches(updatedHistory);
    localStorage.setItem("genspeak_search_history", JSON.stringify(updatedHistory));

    setIsOpen(false);
    setQuery("");

    // Trigger select callback if present, or push route directly
    if (item.type === "word" && onSelectWord) {
      fetch(`/api/word?id=${item.id}`)
        .then(res => res.json())
        .then(w => {
          onSelectWord(w);
        })
        .catch(err => console.error("Failed to load select word details:", err));
      return;
    }

    // Direct routing
    if (item.type === "word") {
      router.push(`/word/${item.slug}`);
    } else if (item.type === "guide") {
      router.push(`/guides/${item.slug}`);
    } else if (item.type === "collection") {
      router.push(`/collections/${item.slug}`);
    } else if (item.type === "category") {
      router.push(`/categories/${item.slug}`);
    } else if (item.type === "timeline") {
      router.push(`/timeline`);
    } else if (item.type === "emoji") {
      // Find matching word for emoji, or route to list
      router.push(`/word/rizz`);
    }
  };

  const handleSurpriseMe = () => {
    fetch("/api/word?random=true")
      .then(res => res.json())
      .then(w => {
        setIsOpen(false);
        setQuery("");
        if (onSelectWord) {
          onSelectWord(w);
        } else {
          router.push(`/word/${w.slug}`);
        }
      })
      .catch(err => console.error("Failed to load random surprise slang:", err));
  };

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    setTimeout(() => {
      if (recognitionRef.current && !isListening) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Speech start deferred error:", err);
        }
      }
    }, 200);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("genspeak_search_history");
  };

  // Text highlighting utility
  function highlightText(text: string, highlight: string) {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-amber-500/20 text-[#FF8A3D] rounded-sm px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div 
        ref={triggerRef}
        onMouseMove={handleTriggerMouseMove}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-5 py-4.5 rounded-2xl border border-white/[0.06] bg-[#0E0F14]/65 backdrop-blur-lg cursor-text transition-all duration-300 hover:border-white/[0.14] hover:bg-[#121319]/80 hover:shadow-[0_8px_32px_rgba(255,106,26,0.06)] relative overflow-hidden group shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      >
        {/* Cursor tracking halo reflection overlay */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-[radial-gradient(100px_circle_at_var(--x)_var(--y),rgba(255,106,26,0.04),transparent)]"
          style={{
            "--x": `${hoverMousePos.x}px`,
            "--y": `${hoverMousePos.y}px`
          } as React.CSSProperties}
        />
        <Search className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors relative z-10" />
        <span className="flex-1 text-slate-500 text-left text-sm md:text-base select-none font-sans relative z-10">
          Search slang, guides, collections... (Press <kbd className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">⌘K</kbd>)
        </span>
        <Mic onClick={handleMicClick} className="w-4 h-4 text-slate-400 hover:text-white transition-colors cursor-pointer relative z-10" />
      </div>

      {/* Full-screen command palette overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            
            {/* Modal Backdrop (Blurs & Dims background) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#050505]/90 backdrop-blur-lg"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl rounded-3xl border border-white/[0.08] bg-[#0B0B0F]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
            >
              
              {/* Input header */}
              <div className="flex items-center gap-3 px-5 py-4.5 border-b border-white/5 bg-white/[0.01]">
                <Search className="w-5 h-5 text-[#FF8A3D]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type slang keyword (e.g. 'what is rizz', '💀')..."
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-500 outline-none text-base font-sans"
                />
                
                {/* Voice button */}
                <button 
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                    isListening ? "bg-[#FF6A1A]/20 text-[#FF8A3D] animate-pulse" : "text-slate-400 hover:text-white"
                  }`}
                  title="Voice Speech Search"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded bg-slate-900 border border-white/5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions / Results container */}
              <div className="max-h-[420px] overflow-y-auto p-3 no-scrollbar flex flex-col gap-6">
                
                {/* AI Instant Explanation Card if query contains questions */}
                {aiAnswer && (
                  <div className="rounded-2xl border border-[#FF6A1A]/15 bg-[#FF6A1A]/5 p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#FF8A3D] uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        AI Search explanation
                      </span>
                      <span className="text-[8px] font-mono text-slate-500 uppercase">Provider: Gemini/Claude</span>
                    </div>
                    <p className="text-xs text-white leading-relaxed font-sans mt-1 whitespace-pre-line">{aiAnswer}</p>
                    
                    {/* Recommendations block inside AI search card */}
                    <div className="flex flex-wrap gap-2 items-center text-[10px] text-slate-500 border-t border-white/[0.04] pt-3.5 mt-1 font-mono">
                      <span className="uppercase font-bold mr-1">Related:</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-white">rizz</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-white">gyatt</span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-white">sigma</span>
                    </div>
                  </div>
                )}

                {/* 1. Empty State suggestions (only when query is empty) */}
                {!query && (
                  <div className="flex flex-col gap-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="flex flex-col gap-2 px-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                            Recent Searches
                          </span>
                          <button
                            onClick={handleClearHistory}
                            className="text-[9px] font-mono font-bold text-slate-500 hover:text-white transition-all cursor-pointer flex items-center gap-1 bg-transparent border-0 outline-none"
                          >
                            <Trash2 className="w-3 h-3 text-slate-500 hover:text-white" /> CLEAR
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term, index) => (
                            <button
                              key={index}
                              onClick={() => setQuery(term)}
                              className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Header buttons */}
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                        Quick Exploration
                      </span>
                      <button
                        onClick={handleSurpriseMe}
                        className="text-[9px] font-mono font-bold text-[#FF8A3D] bg-[#FF6A1A]/10 px-3 py-1 rounded-full border border-[#FF6A1A]/20 hover:bg-[#FF6A1A]/20 transition-all cursor-pointer"
                      >
                        🎲 SURPRISE ME
                      </button>
                    </div>

                    {/* Popular / Trending slang grids */}
                    <div className="grid grid-cols-2 gap-3 px-2">
                      {trendingWords.map((word) => (
                        <div
                          key={word.id}
                          onClick={() => {
                            setIsOpen(false);
                            router.push(`/word/${word.slug}`);
                          }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer"
                        >
                          <span className="text-lg">{word.emojis?.[0] || "💬"}</span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold font-display text-white text-left uppercase">{word.term}</span>
                            <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 text-left">{word.definition}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Guides & Collections empty state shortcuts */}
                    <div className="flex flex-col gap-3 px-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                        Featured Guides
                      </span>
                      <div
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/guides/complete-guide-to-gen-z-slang");
                        }}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#FF6A1A]/5 to-transparent border border-white/5 hover:border-white/10 transition-all cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📚</span>
                          <div className="flex flex-col">
                            <span className="font-bold text-white font-display">The Complete Guide to Gen Z Slang</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">Linguistic guide charting Gen Z conversations</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Results List */}
                {query && (
                  <div className="flex flex-col gap-1">
                    <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-500 tracking-widest flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF8A3D]" />
                      Search Results ({results.length})
                    </div>

                    {results.length > 0 ? (
                      results.map((item, idx) => {
                        const isActive = idx === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                              isActive
                                ? "bg-white/[0.03] border-l-2 border-[#FF8A3D] text-white"
                                : "text-slate-300 hover:bg-white/[0.01]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{item.emoji || "💬"}</span>
                              <div className="flex flex-col">
                                <span className="font-display font-bold text-sm flex items-center gap-2">
                                  {highlightText(item.title, query)}
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase font-extrabold tracking-wider ${
                                    item.type === "word" 
                                      ? "bg-[#FF6A1A]/10 text-[#FF8A3D] border border-[#FF6A1A]/20" 
                                      : item.type === "guide"
                                      ? "bg-[#4D9EFF]/10 text-[#4D9EFF] border border-[#4D9EFF]/20"
                                      : "bg-white/5 text-slate-400 border border-white/10"
                                  }`}>
                                    {item.type}
                                  </span>
                                </span>
                                <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                  {highlightText(item.subtitle, query)}
                                </span>
                              </div>
                            </div>

                            {isActive && (
                              <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-white/5">
                                <span>Navigate</span>
                                <CornerDownLeft className="w-2.5 h-2.5 text-[#FF8A3D]" />
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-12 text-center text-slate-500 font-sans flex flex-col items-center gap-2">
                        <span className="text-2xl">🤷‍♂️</span>
                        <p className="font-semibold text-white text-sm">No direct entries for &quot;{query}&quot;</p>
                        <p className="text-xs text-slate-500 max-w-xs">AI search explanation will generate answers dynamically above.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Modal footer keyboard shortcuts */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 bg-white/[0.01] text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-white/5">↑↓</kbd> Move
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-white/5">Enter</kbd> Open
                  </span>
                </div>
                <span>ESC to Close</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

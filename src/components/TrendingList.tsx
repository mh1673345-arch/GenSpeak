"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, Flame } from "lucide-react";
import { WordData } from "../data/mockWords";

interface TrendingListProps {
  words: WordData[];
  onSelectWord: (word: WordData) => void;
  activeWordId?: string;
}

export function TrendingList({ words, onSelectWord, activeWordId }: TrendingListProps) {
  // Mini sparkline component using standard CSS lines
  const renderSparkline = (trend: "UP" | "DOWN" | "STABLE") => {
    let path = "M 0 15 Q 10 5, 20 18 T 40 5";
    let stroke = "stroke-primary-blue";
    if (trend === "UP") {
      path = "M 0 20 Q 10 18, 20 8 T 40 2";
      stroke = "stroke-accent-mint";
    } else if (trend === "DOWN") {
      path = "M 0 2 Q 10 8, 20 15 T 40 20";
      stroke = "stroke-primary-pink";
    }
    
    return (
      <svg className="w-10 h-6 overflow-visible" fill="none">
        <path d={path} strokeWidth="2" strokeLinecap="round" className={stroke} />
      </svg>
    );
  };

  return (
    <div className="w-full rounded-2xl glass-panel p-5 md:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-primary-pink" />
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Emerging Hot Topics</h4>
        </div>
        <span className="text-[10px] font-mono text-slate-500">REALTIME</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {words.slice(0, 5).map((word, index) => {
          const mainTrend = word.popularity[0] || { trend: "STABLE", score: 50 };
          const isActive = word.id === activeWordId;

          return (
            <div
              key={word.id}
              onClick={() => onSelectWord(word)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                isActive 
                  ? "bg-slate-900 border border-primary-blue/30 shadow-[0_4px_20px_-5px_rgba(0,102,255,0.15)]" 
                  : "bg-[#090D1A]/40 border border-white/[0.02] hover:border-slate-800 hover:bg-slate-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono text-xs font-bold w-5 text-center ${
                  index === 0 
                    ? "text-primary-pink" 
                    : index === 1 
                      ? "text-primary-blue" 
                      : "text-slate-500"
                }`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm text-slate-200">{word.term}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">{word.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Mini Graph */}
                {renderSparkline(mainTrend.trend)}

                <div className="flex items-center gap-1">
                  {mainTrend.trend === "UP" && (
                    <TrendingUp className="w-3.5 h-3.5 text-accent-mint" />
                  )}
                  {mainTrend.trend === "DOWN" && (
                    <TrendingDown className="w-3.5 h-3.5 text-primary-pink" />
                  )}
                  {mainTrend.trend === "STABLE" && (
                    <Minus className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  
                  <span className="font-mono text-[11px] font-semibold text-slate-300">
                    {mainTrend.score}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

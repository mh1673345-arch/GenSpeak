import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <div className={cn("flex items-center gap-2.5 justify-center", className)}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

import React from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your search queries or adding a custom slang definition.",
  icon = <Search className="w-8 h-8 text-slate-600" />,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-950/40 border border-white/5 text-center min-h-[220px]",
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 mb-3.5">
        {icon}
      </div>
      <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed font-sans">
        {description}
      </p>
    </div>
  );
}

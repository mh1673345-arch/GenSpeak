import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "purple" | "pink" | "mint" | "cyan" | "orange" | "slate";
}

export function Badge({
  className,
  children,
  variant = "purple",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "text-[10px] px-2.5 py-1 rounded-full font-mono uppercase font-bold tracking-wider border",
        
        variant === "purple" && "bg-primary-purple/10 text-primary-purple border-primary-purple/20",
        variant === "pink" && "bg-primary-pink/10 text-primary-pink border-primary-pink/20",
        variant === "mint" && "bg-accent-mint/10 text-accent-mint border-accent-mint/20",
        variant === "cyan" && "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
        variant === "orange" && "bg-accent-orange/10 text-accent-orange border-accent-orange/20",
        variant === "slate" && "bg-slate-900/60 text-slate-400 border-white/5",
        
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

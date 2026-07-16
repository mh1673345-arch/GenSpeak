import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  children,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-display font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2",
        
        // Variants
        variant === "primary" && "bg-gradient-to-r from-primary-purple to-primary-pink text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02]",
        variant === "secondary" && "bg-slate-900 border border-white/5 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800",
        variant === "outline" && "border border-primary-purple/20 bg-primary-purple/5 text-primary-purple hover:bg-primary-purple/10 hover:border-primary-purple/35",
        variant === "ghost" && "text-slate-400 hover:text-white hover:bg-white/5",
        
        // Sizes
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4.5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3.5 text-base",
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

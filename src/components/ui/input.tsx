import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 text-white placeholder-slate-600 outline-none text-sm transition-all duration-300 font-sans focus:border-primary-purple/40 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-primary-pink/50 focus:border-primary-pink/60 focus:shadow-[0_0_15px_rgba(236,72,153,0.15)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-[10px] font-mono text-primary-pink uppercase tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

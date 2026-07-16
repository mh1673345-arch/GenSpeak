import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  interactive?: boolean;
}

export function Card({ 
  className, 
  children, 
  glowColor, 
  interactive = false, 
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl glass-panel p-6 relative overflow-hidden transition-all duration-300",
        interactive && "hover:border-primary-purple/30 hover:shadow-[0_12px_40px_-12px_rgba(139,92,246,0.15)] hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {glowColor && (
        <div 
          className="absolute -right-16 -top-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: glowColor }}
        />
      )}
      {children}
    </div>
  );
}

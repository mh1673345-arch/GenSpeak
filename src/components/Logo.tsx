import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: number;
}

export function Logo({ className = "", iconOnly = false, size = 32 }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 select-none cursor-pointer ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full transform hover:scale-105 transition-transform duration-300"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6A1A" /> {/* Aurora Orange */}
              <stop offset="50%" stopColor="#FF8A3D" /> {/* Glow Orange */}
              <stop offset="100%" stopColor="#FFB347" /> {/* Warm Gold */}
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Outer Monogram 'G' Chat Bubble shape */}
          <path 
            d="M50 15C30.67 15 15 30.67 15 50s15.67 35 35 35c8.3 0 15.9-2.88 21.9-7.7L85 85V65h-5.9C83.2 60.5 85 55.4 85 50c0-19.33-15.67-35-35-35zm0 15c11.05 0 20 8.95 20 20s-8.95 20-20 20-20-8.95-20-20 8.95-20 20-20z" 
            fill="url(#brand-grad)"
          />
          {/* Central AI Spark */}
          <path 
            d="M50 38l2.5 7.5 7.5 2.5-7.5 2.5-2.5 7.5-2.5-7.5-7.5-2.5 7.5-2.5 2.5-7.5z" 
            fill="#FFB347" 
            filter="url(#glow)"
          />
        </svg>
      </div>
      
      {!iconOnly && (
        <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Gen<span className="text-primary-pink font-black">Speak</span>
        </span>
      )}
    </Link>
  );
}

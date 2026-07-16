import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2", className)}>
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center gap-2">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              {isLast || !item.href ? (
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

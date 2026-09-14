import Link from "next/link";

import { CategoryIcon } from "@/components/category-icon";
import { Badge } from "@/components/ui/badge";
import { TrendPill } from "@/components/ui/trend";
import { getCategoryBySlug, type Term } from "@/lib/dictionary";
import { cn } from "@/lib/utils";

type TermCardProps = {
  term: Term;
  /** Adds the rank number used on the trending board. */
  rank?: number;
  className?: string;
};

export function TermCard({ term, rank, className }: TermCardProps) {
  const category = getCategoryBySlug(term.category);

  return (
    <Link
      href={`/meaning/${term.slug}`}
      style={{ "--cat": category?.hue } as React.CSSProperties}
      className={cn(
        "card focus-ring group relative flex flex-col gap-3 p-5 hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            {rank ? (
              <span className="font-mono text-xs text-ink-subtle tabular-nums">
                {String(rank).padStart(2, "0")}
              </span>
            ) : null}
            <h3 className="truncate font-display text-2xl leading-tight tracking-tight">
              {term.term}
            </h3>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-subtle">
            /{term.pronunciation}/ &middot; {term.partOfSpeech}
          </p>
        </div>
        <TrendPill value={term.trend} className="shrink-0" />
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{term.definition}</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <Badge variant="category" className="gap-1.5">
          <CategoryIcon name={category?.icon ?? "Sparkles"} className="size-3" />
          {category?.name}
        </Badge>
        <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
          est. {term.firstSeen}
        </span>
      </div>
    </Link>
  );
}

/** Denser row variant for lists and A-Z indexes. */
export function TermRow({ term, rank }: { term: Term; rank?: number }) {
  const category = getCategoryBySlug(term.category);

  return (
    <Link
      href={`/meaning/${term.slug}`}
      style={{ "--cat": category?.hue } as React.CSSProperties}
      className="focus-ring group flex items-center gap-4 border-b border-line px-2 py-4 transition-colors last:border-b-0 hover:bg-canvas-subtle"
    >
      {rank ? (
        <span className="w-6 shrink-0 font-mono text-xs text-ink-subtle tabular-nums">
          {String(rank).padStart(2, "0")}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-display text-xl tracking-tight group-hover:text-accent">
            {term.term}
          </span>
          <span className="font-mono text-[11px] text-ink-subtle">/{term.pronunciation}/</span>
          <Badge variant="category" size="sm">
            {category?.name}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-ink-muted">{term.definition}</p>
      </div>
      <TrendPill value={term.trend} className="hidden shrink-0 sm:inline-flex" />
    </Link>
  );
}

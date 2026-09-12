"use client";

import { CornerDownLeft, LoaderCircle, Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import type { SearchHit } from "@/app/api/search/route";
import { useSearch } from "@/components/search-provider";
import { categoryMap } from "@/content/categories";
import { cn } from "@/lib/utils";

/**
 * Owns only the global shortcut. The panel is mounted on open and unmounted on
 * close, so its state starts fresh every time without any reset effects.
 */
export function SearchDialog({ termCount }: { termCount: number }) {
  const { open, setOpen } = useSearch();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  if (!open) return null;
  return <SearchPanel termCount={termCount} onClose={() => setOpen(false)} />;
}

function SearchPanel({ termCount, onClose }: { termCount: number; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  // Freeze the page behind the overlay for as long as the panel is mounted.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Debounced and cancellable, so fast typing never renders a stale response.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { results: SearchHit[] };
        setHits(data.results);
        setActive(0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setHits([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 140 : 0);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (slug: string) => {
      onClose();
      router.push(`/term/${slug}`);
    },
    [router, onClose],
  );

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % Math.max(hits.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + hits.length) % Math.max(hits.length, 1));
    } else if (event.key === "Enter" && hits[active]) {
      event.preventDefault();
      go(hits[active].slug);
    } else if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <div
      className="animate-fade fixed inset-0 z-100 flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search the dictionary"
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-sm"
      />

      <div className="animate-in-up relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-elevated shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          {loading ? (
            <LoaderCircle className="size-4 shrink-0 animate-spin text-ink-subtle" aria-hidden />
          ) : (
            <Search className="size-4 shrink-0 text-ink-subtle" aria-hidden />
          )}
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Search ${termCount} entries...`}
            aria-label="Search terms"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-subtle"
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-subtle sm:block">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {!query ? (
            <p className="flex items-center gap-2 px-3 py-2 font-mono text-[11px] tracking-widest text-ink-subtle uppercase">
              <TrendingUp className="size-3" aria-hidden /> Trending now
            </p>
          ) : null}

          {hits.length === 0 && !loading ? (
            <p className="px-3 py-8 text-center text-sm text-ink-muted">
              No entry for <span className="text-ink">{query}</span> yet.{" "}
              <button
                type="button"
                className="text-accent underline underline-offset-4"
                onClick={() => {
                  onClose();
                  router.push(`/submit?term=${encodeURIComponent(query)}`);
                }}
              >
                Submit it
              </button>
            </p>
          ) : null}

          {hits.map((hit, i) => (
            <button
              key={hit.slug}
              type="button"
              data-index={i}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(hit.slug)}
              style={{ "--cat": categoryMap.get(hit.category)?.hue } as React.CSSProperties}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                i === active ? "bg-canvas-subtle" : "hover:bg-canvas-subtle",
              )}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-[hsl(var(--cat)_75%_55%)]" />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="truncate font-display text-lg tracking-tight">{hit.term}</span>
                  <span className="shrink-0 font-mono text-[10px] text-ink-subtle">
                    {hit.partOfSpeech}
                  </span>
                </span>
                <span className="line-clamp-1 block text-xs text-ink-muted">{hit.definition}</span>
              </span>
              {i === active ? (
                <CornerDownLeft className="size-3.5 shrink-0 text-ink-subtle" aria-hidden />
              ) : null}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10px] text-ink-subtle">
          <span>GenSpeak dictionary</span>
          <span className="flex gap-3">
            <span>UP DOWN to move</span>
            <span>ENTER to open</span>
          </span>
        </div>
      </div>
    </div>
  );
}

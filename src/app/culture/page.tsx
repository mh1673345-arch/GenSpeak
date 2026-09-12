import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CategoryIcon } from "@/components/category-icon";
import { Container } from "@/components/ui/container";
import { scenes } from "@/content/scenes";
import { getTerm } from "@/lib/dictionary";

export const metadata: Metadata = {
  title: "Internet cultures",
  description:
    "The scenes that actually produced internet language: Usenet, imageboards, Black Twitter, ballroom, Tumblr, Twitch, stan fandom, fanfiction, crypto and AI.",
  alternates: { canonical: "/culture" },
};

export default function CulturePage() {
  return (
    <Container className="py-14">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
          Where the words come from
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
          Internet cultures
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted text-pretty">
          Words are not invented by platforms. They are invented by communities and then
          distributed by platforms, which is why credit so often lands in the wrong place. These
          are the scenes that did the inventing.
        </p>
      </header>

      <div className="mt-14 space-y-5">
        {scenes.map((scene) => {
          const sample = scene.terms
            .map((slug) => getTerm(slug))
            .filter(Boolean)
            .slice(0, 6);

          return (
            <Link
              key={scene.slug}
              href={`/culture/${scene.slug}`}
              style={{ "--cat": scene.hue } as React.CSSProperties}
              className="card cat-glow focus-ring group relative block overflow-hidden p-7 hover:-translate-y-0.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="cat-tint grid size-12 shrink-0 place-items-center rounded-xl border">
                    <CategoryIcon name={scene.icon} className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-3xl tracking-tight">{scene.name}</h2>
                    <p className="mt-0.5 text-sm text-ink-subtle">{scene.tagline}</p>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-ink-subtle tabular-nums">
                  {scene.years}
                </span>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-muted">
                {scene.summary}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {sample.map((term) => (
                  <span
                    key={term!.slug}
                    className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-subtle"
                  >
                    {term!.term}
                  </span>
                ))}
                <ArrowRight
                  className="size-3.5 text-ink-subtle transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}

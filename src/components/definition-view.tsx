"use client";

import { BookOpen, Sprout } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const modes = [
  { id: "formal", label: "Definition", icon: BookOpen },
  { id: "eli10", label: "Explain like I am 10", icon: Sprout },
] as const;

type Mode = (typeof modes)[number]["id"];

export function DefinitionView({ definition, eli10 }: { definition: string; eli10: string }) {
  const [mode, setMode] = useState<Mode>("formal");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Definition style"
        className="inline-flex rounded-full border border-line bg-canvas-subtle p-1"
      >
        {modes.map((item) => {
          const selected = mode === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setMode(item.id)}
              className={cn(
                "focus-ring flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition",
                selected
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-subtle hover:text-ink-muted",
              )}
            >
              <item.icon className="size-3.5" aria-hidden />
              {item.label}
            </button>
          );
        })}
      </div>

      <p
        key={mode}
        className="animate-fade mt-6 max-w-2xl font-display text-2xl leading-snug tracking-tight text-pretty sm:text-3xl"
      >
        {mode === "formal" ? definition : eli10}
      </p>
    </div>
  );
}

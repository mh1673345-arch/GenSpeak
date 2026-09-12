"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="focus-ring grid size-9 place-items-center rounded-full border border-line text-ink-muted transition hover:border-line-strong hover:text-ink"
    >
      {/* Both icons are rendered and CSS picks one, so the control never flashes
          the wrong state while the theme is resolving on hydration. */}
      <Sun className="size-4 dark:hidden" aria-hidden />
      <Moon className="hidden size-4 dark:block" aria-hidden />
    </button>
  );
}

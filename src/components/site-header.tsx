"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useSearch } from "@/components/search-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dictionary", label: "Dictionary" },
  { href: "/categories", label: "Categories" },
  { href: "/culture", label: "Cultures" },
  { href: "/history", label: "History" },
  { href: "/trending", label: "Trending" },
  { href: "/quiz", label: "Quiz" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-canvas/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center gap-3">
        <Link href="/" className="focus-ring group flex items-center gap-2.5 rounded-lg">
          <span className="grid size-8 place-items-center rounded-lg bg-ink font-display text-lg leading-none text-canvas">
            G
          </span>
          <span className="font-display text-xl tracking-tight">GenSpeak</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const activeLink = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring rounded-full px-3 py-1.5 text-sm transition-colors",
                  activeLink ? "bg-canvas-subtle text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="focus-ring flex h-9 items-center gap-2 rounded-full border border-line pr-1.5 pl-3 text-sm text-ink-subtle transition hover:border-line-strong hover:text-ink-muted"
          >
            <Search className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] sm:block">
              CTRL K
            </kbd>
          </button>

          <ThemeToggle />

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="focus-ring grid size-9 place-items-center rounded-full border border-line text-ink-muted lg:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div className="animate-fade border-t border-line bg-canvas lg:hidden">
          <Container className="flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="focus-ring rounded-lg px-2 py-3 text-sm text-ink-muted hover:bg-canvas-subtle hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="focus-ring rounded-lg px-2 py-3 text-sm text-accent"
            >
              Submit a term
            </Link>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

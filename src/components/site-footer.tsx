import Link from "next/link";

import { Container } from "@/components/ui/container";
import { categories } from "@/content/categories";
import { getStats } from "@/lib/dictionary";

const product = [
  { href: "/dictionary", label: "Full dictionary" },
  { href: "/trending", label: "Trending now" },
  { href: "/categories", label: "Browse categories" },
  { href: "/culture", label: "Internet cultures" },
  { href: "/history", label: "History of the language" },
  { href: "/quiz", label: "Daily quiz" },
  { href: "/random", label: "Random entry" },
  { href: "/about", label: "About GenSpeak" },
  { href: "/submit", label: "Submit a term" },
];

export function SiteFooter() {
  const stats = getStats();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line bg-canvas-subtle">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-ink font-display text-lg leading-none text-canvas">
              G
            </span>
            <span className="font-display text-xl tracking-tight">GenSpeak</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            A reference for how the internet actually talks. {stats.terms} entries, each with an
            origin, a plain-language version and real usage.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {product.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-muted transition hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <h3 className="font-mono text-[11px] tracking-[0.18em] text-ink-subtle uppercase">
            Categories
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-ink-muted transition hover:text-ink"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 font-mono text-[11px] text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} GenSpeak. Descriptive, not prescriptive.</p>
          <p>
            {stats.terms} entries &middot; {stats.categories} categories &middot; {stats.oldest}
            &ndash;{stats.newest}
          </p>
        </Container>
        <Container className="border-t border-line py-4 text-center font-mono text-[11px] text-ink-subtle">
          <p>Founded by M. Hassan Bin Asif</p>
        </Container>
      </div>
    </footer>
  );
}

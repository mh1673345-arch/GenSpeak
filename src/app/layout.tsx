import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

import { SearchDialog } from "@/components/search-dialog";
import { SearchProvider } from "@/components/search-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { getStats } from "@/lib/dictionary";
import { getBaseRobots, getSiteUrl } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GenSpeak - The internet culture dictionary",
    template: "%s | GenSpeak",
  },
  description:
    "A modern reference for internet slang, meme formats, AI vocabulary, gaming language and online trends. Every entry has an origin, a plain-language explanation and real usage.",
  keywords: [
    "internet slang dictionary",
    "meme dictionary",
    "AI terminology",
    "gen z slang meaning",
    "internet culture",
  ],
  openGraph: {
    type: "website",
    siteName: "GenSpeak",
    title: "GenSpeak - The internet culture dictionary",
    description:
      "Look up what the internet is saying. Slang, memes, AI vocabulary and platform language, defined properly.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "GenSpeak - The internet culture dictionary",
    description: "Look up what the internet is saying, defined properly.",
  },
  robots: getBaseRobots(),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#09080d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const stats = getStats();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <AuthProvider>
          <ThemeProvider>
            <SearchProvider>
              <a
                href="#main"
                className="focus-ring sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
              >
                Skip to content
              </a>
              <SiteHeader />
              <main id="main" className="flex-1">
                {children}
              </main>
              <SiteFooter />
              <SearchDialog termCount={stats.terms} />
            </SearchProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

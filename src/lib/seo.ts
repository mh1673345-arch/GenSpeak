import type { Metadata } from "next";

import type { Term } from "@/content/types";

/**
 * Resolves the canonical site base URL.
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL
 * 2. SITE_URL
 * 3. VERCEL_PROJECT_PRODUCTION_URL (production custom domain)
 * 4. Safe fallback: https://genspeak.app
 */
export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    "https://genspeak.app";

  let normalized = envUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return normalized.replace(/\/+$/, "");
}

/**
 * Detects whether the current execution is inside a Vercel preview deployment.
 */
export function isPreviewDeployment(): boolean {
  return (
    process.env.VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
  );
}

/**
 * Central robots policy:
 * Previews must be index: false, follow: false.
 * Production defaults to index: true, follow: true.
 */
export function getBaseRobots(): Metadata["robots"] {
  if (isPreviewDeployment()) {
    return {
      index: false,
      follow: false,
    };
  }
  return {
    index: true,
    follow: true,
  };
}

/**
 * Builds a natural, intent-focused description from term content.
 */
export function buildTermDescription(term: Term): string {
  const intro = `${term.term} meaning: ${term.definition}`;
  if (term.eli10 && intro.length < 120) {
    const combined = `${intro} In simple terms: ${term.eli10}`;
    return combined.length > 160 ? `${combined.slice(0, 157).trim()}...` : combined;
  }
  return intro.length > 160 ? `${intro.slice(0, 157).trim()}...` : intro;
}

/**
 * Builds canonical metadata for term pages under /meaning/[slug].
 */
export function buildTermMetadata(term: Term): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/meaning/${term.slug}`;
  const title = `${term.term} Meaning: What Does ${term.term} Mean in Slang? | GenSpeak`;
  const description = buildTermDescription(term);

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "GenSpeak",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: getBaseRobots(),
  };
}

/**
 * Serializes JSON-LD safely by unicode-escaping '<' characters to avoid
 * breaking out of HTML <script> tags or triggering security scanners.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Builds Schema.org DefinedTerm and BreadcrumbList JSON-LD objects.
 */
export function buildTermJsonLd(term: Term, categoryName?: string) {
  const siteUrl = getSiteUrl();
  const termUrl = `${siteUrl}/meaning/${term.slug}`;

  const definedTerm = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    termCode: term.slug,
    url: termUrl,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "GenSpeak Internet Culture Dictionary",
      url: `${siteUrl}/dictionary`,
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dictionary",
        item: `${siteUrl}/dictionary`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName ?? "Category",
        item: `${siteUrl}/category/${term.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: term.term,
        item: termUrl,
      },
    ],
  };

  return [definedTerm, breadcrumbs];
}

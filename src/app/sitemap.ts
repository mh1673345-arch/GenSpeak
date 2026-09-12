import type { MetadataRoute } from "next";

import { categories } from "@/content/categories";
import { scenes } from "@/content/scenes";
import { getAllTerms, getTagCounts } from "@/lib/dictionary";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://genspeak.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/dictionary",
    "/categories",
    "/culture",
    "/history",
    "/trending",
    "/quiz",
    "/about",
    "/submit",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${base}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const sceneRoutes = scenes.map((scene) => ({
    url: `${base}/culture/${scene.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const termRoutes = getAllTerms().map((term) => ({
    url: `${base}/term/${term.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tagRoutes = getTagCounts()
    .filter((entry) => entry.count >= 2)
    .map((entry) => ({
      url: `${base}/tag/${encodeURIComponent(entry.tag)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...categoryRoutes, ...sceneRoutes, ...termRoutes, ...tagRoutes];
}

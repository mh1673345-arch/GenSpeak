import { MetadataRoute } from "next";
import { db } from "../lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://genspeak.app";

  // Base static sitemap pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dictionary`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-decoder`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/internet-culture`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  try {
    // Query dynamic metadata nodes asynchronously from the SQLite database
    const [dbWords, dbCategories, dbCollections, dbGuides] = await Promise.all([
      db.word.findMany({ select: { slug: true, updatedAt: true } }),
      db.category.findMany({ select: { slug: true } }),
      db.collection.findMany({ select: { slug: true, updatedAt: true } }),
      db.guide.findMany({ select: { slug: true, updatedAt: true } })
    ]);

    const wordPages = dbWords.map((word) => ({
      url: `${baseUrl}/word/${word.slug}`,
      lastModified: word.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categoryPages = dbCategories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));

    const collectionPages = dbCollections.map((col) => ({
      url: `${baseUrl}/collections/${col.slug}`,
      lastModified: col.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const guidePages = dbGuides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: guide.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [
      ...staticPages,
      ...wordPages,
      ...categoryPages,
      ...collectionPages,
      ...guidePages
    ];
  } catch (error) {
    console.error("Failed to compile dynamic sitemap coordinates:", error);
    return staticPages;
  }
}

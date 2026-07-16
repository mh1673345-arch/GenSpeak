import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin", // Protect admin directories from crawling
    },
    sitemap: "https://genspeak.app/sitemap.xml",
  };
}

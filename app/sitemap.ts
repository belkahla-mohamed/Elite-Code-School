import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elitecodeschool.ma";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/curricula", "/portfolios", "/contact", "/inscription", "/login"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  return staticPages;
}

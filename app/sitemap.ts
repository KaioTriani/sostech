import type { MetadataRoute } from "next";
import { products } from "@/content/produtos";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/assistencia/`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/loja/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...products.map((p) => ({ url: `${site.url}/produto/${p.slug}/`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}

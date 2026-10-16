import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { listEntries } from "@/lib/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages: MetadataRoute.Sitemap = ["", "/journal"].map((p) => ({
    url: `${base}/es${p}`,
    alternates: { languages: { es: `${base}/es${p}`, en: `${base}/en${p}` } },
  }));
  const entries = listEntries("es").map((e) => ({
    url: `${base}/es/journal/${e.slug}`,
    lastModified: e.date || undefined,
    alternates: { languages: { es: `${base}/es/journal/${e.slug}`, en: `${base}/en/journal/${e.slug}` } },
  }));
  return [...pages, ...entries];
}

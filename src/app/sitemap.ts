import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { listEntries } from "@/lib/journal";

/** Todo lo que Google tiene que encontrar: la portada, la cámara, la call, el journal y cada entrada. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  const both = (p: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) =>
    (["es", "en"] as const).map((lang) => ({
      url: `${base}/${lang}${p}`,
      lastModified: now,
      changeFrequency,
      priority: lang === "es" ? priority : priority - 0.1,
      alternates: { languages: { es: `${base}/es${p}`, en: `${base}/en${p}` } },
    }));
  // Cada texto en español; en inglés solo si existe la traducción (si no, Google la vería duplicada)
  const translated = new Set(listEntries("en").filter((e) => !e.fallback).map((e) => e.slug));
  const entries = listEntries("es").flatMap((e) =>
    (translated.has(e.slug) ? (["es", "en"] as const) : (["es"] as const)).map((lang) => ({
      url: `${base}/${lang}/journal/${e.slug}`,
      lastModified: e.date ? new Date(e.date) : now,
      changeFrequency: "monthly" as const,
      priority: lang === "es" ? 0.8 : 0.6,
      alternates: { languages: { es: `${base}/es/journal/${e.slug}`, en: `${base}/en/journal/${e.slug}` } },
    })),
  );
  return [...both("", 1, "weekly"), ...both("/journal", 0.9, "weekly"), ...both("/onda", 0.6, "monthly"), ...both("/foto", 0.7, "monthly"), ...both("/charlemos", 0.6, "monthly"), ...entries];
}

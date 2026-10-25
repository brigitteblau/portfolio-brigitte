import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { listEntries } from "@/lib/journal";
import { listEscritos } from "@/lib/escritos";

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
  const entries = listEntries("es").flatMap((e) =>
    (["es", "en"] as const).map((lang) => ({
      url: `${base}/${lang}/journal/${e.slug}`,
      lastModified: e.date ? new Date(e.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: { es: `${base}/es/journal/${e.slug}`, en: `${base}/en/journal/${e.slug}` } },
    })),
  );
  const escritos = listEscritos("es").flatMap((e) =>
    (["es", "en"] as const).map((lang) => ({
      url: `${base}/${lang}/escritos/${e.slug}`,
      lastModified: e.date ? new Date(e.date) : now,
      changeFrequency: "monthly" as const,
      priority: lang === "es" ? 0.9 : 0.6,
      alternates: { languages: { es: `${base}/es/escritos/${e.slug}`, en: `${base}/en/escritos/${e.slug}` } },
    })),
  );
  return [...escritos, ...both("", 1, "weekly"), ...both("/onda", 0.8, "monthly"), ...both("/journal", 0.8, "weekly"), ...both("/foto", 0.7, "monthly"), ...both("/charlemos", 0.6, "monthly"), ...entries];
}

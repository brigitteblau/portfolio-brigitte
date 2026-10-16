import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "./i18n";

/**
 * Journal: cada entrada es un archivo en src/content/journal/
 *   mi-entrada.es.mdx   (obligatorio)
 *   mi-entrada.en.mdx   (opcional; si falta, se muestra la versión en español)
 */
const DIR = path.join(process.cwd(), "src", "content", "journal");

export type EntryMeta = {
  slug: string;
  title: string;
  date: string;
  kind: "post" | "fotos" | "video";
  cover?: string;
  excerpt?: string;
  tags: string[];
  minutes: number;
  fallback: boolean;
  draft: boolean;
};

function read(slug: string, lang: Locale) {
  const file = path.join(DIR, `${slug}.${lang}.mdx`);
  if (!fs.existsSync(file)) return null;
  return matter(fs.readFileSync(file, "utf8"));
}

/** Slugs publicados (sin borradores). */
export function publishedSlugs(): string[] {
  return slugs().filter((s) => !getEntry(s, "es")?.meta.draft);
}

export function slugs(): string[] {
  try {
    return Array.from(
      new Set(
        fs
          .readdirSync(DIR)
          .filter((f) => f.endsWith(".mdx"))
          .map((f) => f.replace(/\.(es|en)\.mdx$/, "")),
      ),
    );
  } catch {
    return [];
  }
}

export function getEntry(slug: string, lang: Locale) {
  let parsed = read(slug, lang);
  let fallback = false;
  if (!parsed) {
    parsed = read(slug, "es");
    fallback = lang !== "es";
  }
  if (!parsed) return null;
  const d = parsed.data as Record<string, unknown>;
  const meta: EntryMeta = {
    slug,
    title: String(d.title ?? slug),
    date: d.date instanceof Date ? d.date.toISOString().slice(0, 10) : String(d.date ?? ""),
    kind: (d.kind as EntryMeta["kind"]) ?? "post",
    cover: d.cover ? String(d.cover) : undefined,
    excerpt: d.excerpt && !String(d.excerpt).trim().startsWith("✎") ? String(d.excerpt) : undefined,
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
    minutes: Math.max(1, Math.round(parsed.content.split(/\s+/).filter(Boolean).length / 200)),
    fallback,
    // Borradores: `draft: true` en el frontmatter → no se publican.
    draft: d.draft === true,
  };
  return { meta, content: parsed.content };
}

export function listEntries(lang: Locale): EntryMeta[] {
  return slugs()
    .map((s) => getEntry(s, lang)?.meta)
    .filter((m): m is EntryMeta => !!m && !m.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

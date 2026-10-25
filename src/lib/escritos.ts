import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "./i18n";

/**
 * Escritos (la portada sobria): cada texto es un archivo en src/content/escritos/
 *   mi-texto.es.md   (obligatorio)
 *   mi-texto.en.md   (opcional; si falta, se muestra en español)
 * Con `draft: true` en el encabezado no se publica.
 */
const DIR = path.join(process.cwd(), "src", "content", "escritos");

export type Escrito = { slug: string; title: string; date: string; excerpt?: string; minutes: number; fallback: boolean; draft: boolean };

function read(slug: string, lang: Locale) {
  const file = path.join(DIR, `${slug}.${lang}.md`);
  return fs.existsSync(file) ? matter(fs.readFileSync(file, "utf8")) : null;
}

export function getEscrito(slug: string, lang: Locale) {
  let parsed = read(slug, lang);
  const fallback = !parsed && lang !== "es";
  if (!parsed) parsed = read(slug, "es");
  if (!parsed) return null;
  const d = parsed.data as Record<string, unknown>;
  const meta: Escrito = {
    slug,
    title: String(d.title ?? slug),
    date: d.date instanceof Date ? d.date.toISOString().slice(0, 10) : String(d.date ?? ""),
    excerpt: d.excerpt ? String(d.excerpt) : undefined,
    minutes: Math.max(1, Math.round(parsed.content.split(/\s+/).filter(Boolean).length / 200)),
    fallback,
    draft: d.draft === true,
  };
  return { meta, content: parsed.content };
}

export function listEscritos(lang: Locale): Escrito[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR);
  } catch {
    return [];
  }
  const slugs = Array.from(new Set(files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.(es|en)\.md$/, ""))));
  return slugs
    .map((s) => getEscrito(s, lang)?.meta)
    .filter((m): m is Escrito => !!m && !m.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

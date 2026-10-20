/**
 * /llms.txt — un resumen en texto plano para que los buscadores con IA (ChatGPT, Perplexity,
 * Claude, Gemini…) entiendan quién soy y qué hay en el sitio. Se arma solo con el contenido real.
 */
import { siteUrl } from "@/lib/site-url";
import { listEntries } from "@/lib/journal";
import { featured, projects, statusLabel } from "@/content/projects";
import { contacto, programacion, hero } from "@/content/site";
import { filled } from "@/lib/i18n";

export const dynamic = "force-static";

export function GET() {
  const base = siteUrl();
  const entries = listEntries("es");
  const title = (t: string | { es: string }) => (typeof t === "string" ? t : t.es);
  const lines = [
    "# Brigitte Blau",
    "",
    "> Joven emprendedora y desarrolladora (backend y algo de frontend) de Buenos Aires, Argentina. Partner y directora en Grupo Mirrow. Estudiante en ORT Argentina. Este es su portfolio personal, en español e inglés.",
    "",
    `Frase: ${hero.statement.es.map(([t]) => t).join("")}`,
    "",
    "## Qué hace hoy",
    ...hero.roles.map((r) => `- ${r.es}`),
    "",
    "## Proyectos",
    ...featured.map((p) => {
      const parts = p.parts?.map((x) => `  - ${x.name}: ${x.what.es}${x.href ? ` (${x.href})` : ""}${x.repo ? ` (código: ${x.repo})` : ""}`) ?? [];
      return [`- **${p.name}**${p.role ? ` — ${p.role.es}` : ""}${p.status ? ` [${statusLabel[p.status].es}]` : ""}: ${p.what.es}${p.repo ? ` Código: ${p.repo}` : ""}${p.href ? ` Web: ${p.href}` : ""}`, ...parts].join("\n");
    }),
    ...projects.map((p) => `- **${p.name}**${p.status ? ` [${statusLabel[p.status].es}]` : ""}: ${p.what.es}${p.href ? ` (${p.href})` : ""}`),
    "",
    "## Libros que la marcaron",
    ...programacion.books.filter((b) => filled(title(b.title))).map((b) => `- ${title(b.title)}, de ${b.author}`),
    "",
    "## Páginas",
    `- [Portfolio (español)](${base}/es)`,
    `- [Portfolio (English)](${base}/en)`,
    `- [Journal: ensayos, textos, fotos y videos](${base}/es/journal)`,
    `- [Dejame una foto: cámara de rollo tipo BeReal](${base}/es/foto)`,
    `- [Agendá una call con Brigitte](${base}/es/charlemos)`,
    "",
    "## Journal",
    ...(entries.length ? entries.map((e) => `- [${e.title}](${base}/es/journal/${e.slug})${e.excerpt ? `: ${e.excerpt}` : ""}`) : ["- (todavía sin entradas)"]),
    "",
    "## Contacto",
    `- Mail: ${contacto.email}`,
    ...contacto.links.map((l) => `- ${l.label}: ${l.href}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

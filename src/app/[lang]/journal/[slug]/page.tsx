import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { locales, type Locale } from "@/lib/i18n";
import { getEntry, listEntries, publishedSlugs } from "@/lib/journal";
import { siteUrl } from "@/lib/site-url";
import { Shell, fmtDate, prose } from "@/components/Sobrio";

export const dynamicParams = false;

export function generateStaticParams() {
  const all = publishedSlugs();
  return locales.flatMap((lang) => all.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/journal/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const entry = getEntry(slug, lang as Locale);
  if (!entry || entry.meta.draft) return { title: "Journal" };
  const { meta } = entry;
  const es = lang === "es";
  const description = meta.excerpt ?? (es ? `Un texto de Brigitte Blau.` : `Writing by Brigitte Blau.`);
  return {
    title: meta.title,
    description,
    keywords: ["Brigitte Blau", ...meta.tags],
    alternates: {
      canonical: `/${lang}/journal/${slug}`,
      // Si no hay versión en inglés, la buena es la de español
      languages: meta.fallback ? { es: `/es/journal/${slug}` } : { es: `/es/journal/${slug}`, en: `/en/journal/${slug}` },
    },
    robots: meta.fallback ? { index: false, follow: true } : undefined,
    authors: [{ name: "Brigitte Blau", url: `${siteUrl()}/${lang}` }],
    openGraph: {
      type: "article",
      title: meta.title,
      description,
      url: `/${lang}/journal/${slug}`,
      authors: ["Brigitte Blau"],
      publishedTime: meta.date || undefined,
      tags: meta.tags,
    },
    twitter: { card: "summary_large_image", title: meta.title, description },
  };
}

/** Componentes que se pueden usar dentro de un .mdx (versión sobria). */
const components = {
  Video: ({ src }: { src: string }) => <video src={src} controls playsInline muted loop className="mt-6 w-full rounded-[14px]" />,
  Nota: ({ children }: { children: React.ReactNode }) => <aside className="mt-5 border-l-2 border-[#E8A9BC] pl-4 text-[#55555a]">{children}</aside>,
  Fotos: ({ children }: { children: React.ReactNode }) => (
    <div className="mt-6 grid grid-cols-2 gap-2 [&_p]:contents [&_img]:!m-0 [&_img]:aspect-square [&_img]:w-full [&_img]:object-cover">{children}</div>
  ),
};

export default async function JournalEntry({ params }: PageProps<"/[lang]/journal/[slug]">) {
  const { lang: l, slug } = await params;
  const lang = l as Locale;
  const es = lang === "es";
  const entry = getEntry(slug, lang);
  if (!entry || entry.meta.draft) notFound();
  const { meta, content } = entry;
  const others = listEntries(lang).filter((e) => e.slug !== slug).slice(0, 3);

  const url = `${siteUrl()}/${lang}/journal/${slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: meta.title,
        description: meta.excerpt,
        datePublished: meta.date || undefined,
        dateModified: meta.date || undefined,
        inLanguage: meta.fallback ? "es" : lang,
        url,
        mainEntityOfPage: url,
        image: `${url}/opengraph-image`,
        keywords: ["Brigitte Blau", ...meta.tags].join(", "),
        wordCount: content.split(/\s+/).filter(Boolean).length,
        author: { "@type": "Person", "@id": `${siteUrl()}/#brigitte`, name: "Brigitte Blau", url: `${siteUrl()}/${lang}` },
        publisher: { "@type": "Person", "@id": `${siteUrl()}/#brigitte`, name: "Brigitte Blau" },
        isPartOf: { "@type": "Blog", name: es ? "Journal de Brigitte Blau" : "Brigitte Blau's journal", url: `${siteUrl()}/${lang}/journal` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Brigitte Blau", item: `${siteUrl()}/${lang}` },
          { "@type": "ListItem", position: 2, name: "Journal", item: `${siteUrl()}/${lang}/journal` },
          { "@type": "ListItem", position: 3, name: meta.title, item: url },
        ],
      },
    ],
  };

  return (
    <Shell lang={lang} other={`/${es ? "en" : "es"}/journal/${slug}`} back={{ href: `/${lang}/journal`, label: "Journal" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="mx-auto max-w-[38rem] px-6 pb-24 pt-16 text-[16px] leading-[1.75] sm:pt-20">
        <article>
          <header>
            <h1 className="text-[1.5rem] font-medium leading-tight tracking-[-0.01em]">{meta.title}</h1>
            <p className="mt-2 text-[0.9rem] text-[#86868b]">
              {meta.date && <time dateTime={meta.date}>{fmtDate(meta.date, lang)}</time>} · {es ? "por" : "by"}{" "}
              <Link href={`/${lang}`} rel="author" className="hover:text-[#1d1d1f]">
                Brigitte Blau
              </Link>
              {(meta.kind === "post" || meta.kind === "ensayo") && ` · ${meta.minutes} ${es ? "min de lectura" : "min read"}`}
            </p>
            {meta.fallback && <p className="mt-3 text-[0.9rem] text-[#86868b]">This entry is only available in Spanish for now.</p>}
          </header>
          <div className={`mt-6 ${prose}`}>
            <MDXRemote source={content} components={components} />
          </div>
        </article>

        {others.length > 0 && (
          <nav className="mt-16 border-t border-[#ececec] pt-6" aria-label={es ? "Más del journal" : "More from the journal"}>
            <p className="text-[0.9rem] text-[#86868b]">{es ? "Más del journal" : "More from the journal"}</p>
            <ul className="mt-3 space-y-2">
              {others.map((e) => (
                <li key={e.slug}>
                  <Link href={`/${lang}/journal/${e.slug}`} className="text-[#9C4F68] underline decoration-[#E8A9BC] decoration-[1.5px] underline-offset-[5px] hover:decoration-[#9C4F68]">
                    {e.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className="mt-12 text-[0.9rem] text-[#86868b]">
          {es ? "Escrito por" : "Written by"}{" "}
          <Link href={`/${lang}`} className="text-[#9C4F68] hover:underline">
            Brigitte Blau
          </Link>
          {" · "}
          <Link href={`/${lang}#contacto`} className="text-[#9C4F68] hover:underline">
            {es ? "Escribime o agendá una call" : "Write to me or book a call"}
          </Link>
        </p>
      </main>
    </Shell>
  );
}

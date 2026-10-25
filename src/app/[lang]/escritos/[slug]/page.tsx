import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { locales, type Locale } from "@/lib/i18n";
import { getEscrito, listEscritos } from "@/lib/escritos";
import { siteUrl } from "@/lib/site-url";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => listEscritos("es").map((e) => ({ lang, slug: e.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/escritos/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const e = getEscrito(slug, lang as Locale);
  if (!e) return {};
  return {
    title: e.meta.title,
    description: e.meta.excerpt,
    alternates: { canonical: `/${lang}/escritos/${slug}`, languages: { es: `/es/escritos/${slug}`, en: `/en/escritos/${slug}` } },
    authors: [{ name: "Brigitte Blau" }],
    openGraph: { type: "article", title: e.meta.title, description: e.meta.excerpt, publishedTime: e.meta.date || undefined, authors: ["Brigitte Blau"] },
  };
}

const prose =
  "[&_p]:mt-5 [&_h2]:mt-12 [&_h2]:mb-1 [&_h2]:font-medium [&_strong]:font-medium [&_em]:italic " +
  "[&_a]:text-[#9C4F68] [&_a]:underline [&_a]:decoration-[#E8A9BC] [&_a]:decoration-[1.5px] [&_a]:underline-offset-[5px] hover:[&_a]:decoration-[#9C4F68] " +
  "[&_blockquote]:mt-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#E8A9BC] [&_blockquote]:pl-4 [&_blockquote]:text-[#55555a] " +
  "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1.5";

export default async function EscritoPage({ params }: PageProps<"/[lang]/escritos/[slug]">) {
  const { lang: l, slug } = await params;
  const lang = l as Locale;
  const e = getEscrito(slug, lang);
  if (!e || e.meta.draft) notFound();
  const { meta, content } = e;
  const es = lang === "es";
  const date = meta.date
    ? new Intl.DateTimeFormat(es ? "es-AR" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(meta.date))
    : "";

  return (
    <div className="min-h-screen bg-white text-[16px] leading-[1.75] text-[#1d1d1f] antialiased">
      <style>{"body{background:#fff}"}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: meta.title,
            description: meta.excerpt,
            datePublished: meta.date,
            inLanguage: "es",
            author: { "@type": "Person", name: "Brigitte Blau", url: siteUrl() },
            mainEntityOfPage: `${siteUrl()}/${lang}/escritos/${slug}`,
          }),
        }}
      />
      <main className="mx-auto max-w-[38rem] px-6 pb-24 pt-10">
        <Link href={`/${lang}`} className="text-[0.9rem] text-[#86868b] hover:text-[#1d1d1f]">
          ← Brigitte Blau
        </Link>
        <h1 className="mt-16 text-[1.5rem] font-medium leading-tight tracking-[-0.01em]">{meta.title}</h1>
        <p className="mt-2 text-[0.9rem] text-[#86868b]">
          {date && <time dateTime={meta.date}>{date}</time>} · {meta.minutes} {es ? "min de lectura" : "min read"}
          {meta.fallback && " · Only in Spanish for now"}
        </p>
        <article className={`mt-6 ${prose}`}>
          <MDXRemote source={content} />
        </article>
        <p className="mt-16 border-t border-[#ececec] pt-6 text-[0.9rem] text-[#86868b]">
          {es ? "Escrito por" : "Written by"} Brigitte Blau ·{" "}
          <Link href={`/${lang}`} className="text-[#9C4F68] hover:underline">
            {es ? "volver al inicio" : "back home"}
          </Link>
        </p>
      </main>
    </div>
  );
}

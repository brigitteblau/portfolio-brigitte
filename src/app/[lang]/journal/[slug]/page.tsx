import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { locales, type Locale } from "@/lib/i18n";
import { getEntry, listEntries, publishedSlugs } from "@/lib/journal";
import { journal as J } from "@/content/site";

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
  return {
    title: meta.title,
    description: meta.excerpt ?? (lang === "es" ? `Del journal de Brigitte Blau.` : `From Brigitte Blau's journal.`),
    alternates: {
      canonical: `/${lang}/journal/${slug}`,
      languages: { es: `/es/journal/${slug}`, en: `/en/journal/${slug}` },
    },
    openGraph: {
      type: "article",
      title: meta.title,
      publishedTime: meta.date || undefined,
      images: meta.cover ? [{ url: meta.cover }] : undefined,
    },
  };
}

/** Componentes que podés usar dentro de un .mdx */
const components = {
  Video: ({ src }: { src: string }) => <video src={src} poster={src.replace(/\.\w+$/, ".jpg")} controls playsInline muted loop autoPlay className="mx-auto max-h-[80vh] w-auto max-w-full rounded-[16px]" />,
  Nota: ({ children }: { children: React.ReactNode }) => (
    <aside className="my-8 border-l-4 border-pink pl-5 font-mono text-[0.95rem] leading-relaxed">{children}</aside>
  ),
  Fotos: ({ children }: { children: React.ReactNode }) => <div className="my-6 grid grid-cols-2 gap-3 [&_p]:contents [&_img]:!m-0 [&_img]:aspect-square [&_img]:object-cover">{children}</div>,
};

export default async function JournalEntry({ params }: PageProps<"/[lang]/journal/[slug]">) {
  const { lang: l, slug } = await params;
  const lang = l as Locale;
  const entry = getEntry(slug, lang);
  if (!entry || entry.meta.draft) notFound();
  const { meta, content } = entry;
  const all = listEntries(lang);
  const pos = all.findIndex((e) => e.slug === slug);
  const newer = pos > 0 ? all[pos - 1] : undefined;
  const older = pos >= 0 && pos < all.length - 1 ? all[pos + 1] : undefined;
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <main id="main" className="min-h-[100svh] px-3 pb-10 pt-16 text-ink sm:px-6">
      <article className="slide mx-auto max-w-[52rem] px-5 py-10 sm:px-12 sm:py-14">
        <Link href={`/${lang}/journal`} className="inline-block rounded-full bg-sky px-4 py-1.5 text-[0.9rem] font-semibold hover:bg-blue hover:text-cream">
          ← {J.back[lang]}
        </Link>
        <header className="mt-8">
          {meta.date && (
            <p className="flex flex-wrap gap-x-3 font-mono text-[0.8rem] text-ink/60">
              <time dateTime={meta.date}>{fmt.format(new Date(meta.date))}</time>
              {meta.kind === "post" && <span>{meta.minutes} {J.readTime[lang]}</span>}
              {meta.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </p>
          )}
          <h1 className="mt-2 text-[clamp(2.6rem,7vw,4.8rem)] font-black leading-[0.95] tracking-[-0.045em]">{meta.title}</h1>
          {meta.fallback && <p className="mt-4 rounded-[10px] bg-yellow/40 px-3 py-2 text-[0.95rem]">{J.onlyIn[lang]}</p>}
        </header>
        {meta.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={meta.cover} alt="" className="mt-8 max-h-[60vh] w-full rounded-[18px] object-cover" />
        )}
        <div className="prose-journal mt-10 font-serif text-[1.2rem] leading-[1.7]">
          <MDXRemote source={content} components={components} />
        </div>
        {(newer || older) && (
          <nav className="mt-16 grid gap-6 border-t-2 border-ink/80 pt-6 sm:grid-cols-2" aria-label="Journal">
            {older ? (
              <Link href={`/${lang}/journal/${older.slug}`} className="group">
                <span className="font-mono text-[0.75rem] text-ink/60">← {J.prev[lang]}</span>
                <span className="mt-1 block font-serif text-[1.5rem] italic leading-tight group-hover:text-blue">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link href={`/${lang}/journal/${newer.slug}`} className="group sm:text-right">
                <span className="font-mono text-[0.75rem] text-ink/60">{J.next[lang]} →</span>
                <span className="mt-1 block font-serif text-[1.5rem] italic leading-tight group-hover:text-blue">{newer.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>
    </main>
  );
}

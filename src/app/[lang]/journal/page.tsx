import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { listEntries } from "@/lib/journal";
import { journal as J } from "@/content/site";
import { Asterisk } from "@/components/Stickers";

export const metadata: Metadata = { title: "Journal" };

const kindLabel = {
  post: { es: "post", en: "post" },
  fotos: { es: "fotos", en: "photos" },
  video: { es: "video", en: "video" },
};

export default async function JournalIndex({ params }: PageProps<"/[lang]/journal">) {
  const lang = (await params).lang as Locale;
  const entries = listEntries(lang);
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <main className="dot-paper min-h-[100svh] px-5 pb-24 pt-28 text-navy sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="relative flex flex-wrap items-end justify-between gap-6 border-b border-navy/15 pb-8">
          <div>
            <h1 className="font-serif text-[clamp(4.5rem,14vw,11rem)] italic leading-[0.85] tracking-[-0.04em]">{J.title[lang]}</h1>
            <p className="mt-5 max-w-[42ch] text-[1.15rem] leading-snug">{J.intro[lang]}</p>
          </div>
          <Asterisk className="w-16 animate-[spin_24s_linear_infinite] text-cobalt sm:w-24" />
        </header>

        {entries.length === 0 ? (
          <p className="mt-16 font-mono text-[0.95rem]">{J.empty[lang]}</p>
        ) : (
          <ol className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((e, i) => (
              <li key={e.slug}>
                <Link href={`/${lang}/journal/${e.slug}`} className="group block">
                  <article>
                    <div className="aspect-[4/5] overflow-hidden" style={{ background: ["#2b44ff", "#0d1124", "#d9dbe2"][i % 3] }}>
                      {e.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                      )}
                    </div>
                    <p className="mt-3 flex justify-between font-mono text-[0.78rem] text-navy/60">
                      <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time>
                      <span>{kindLabel[e.kind][lang]}</span>
                    </p>
                    <h2 className="mt-1 font-serif text-[1.9rem] italic leading-[1.05] group-hover:text-cobalt">{e.title}</h2>
                    {e.excerpt && <p className="mt-2 text-[1rem] leading-snug text-navy/75">{e.excerpt}</p>}
                  </article>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { listEntries } from "@/lib/journal";
import { journal as J } from "@/content/site";
import { Asterisk } from "@/components/Stickers";

export async function generateMetadata({ params }: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Journal",
    description: lang === "es" ? "Lo que pienso, lo que veo y lo que voy aprendiendo." : "What I think, what I see, and what I'm learning.",
    alternates: { canonical: `/${lang}/journal`, languages: { es: "/es/journal", en: "/en/journal" } },
  };
}

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
    <main className="min-h-[100svh] bg-white px-5 pb-24 pt-28 text-navy sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="relative flex flex-wrap items-end justify-between gap-6 border-b border-navy/15 pb-8">
          <div>
            <h1 className="font-serif text-[clamp(4.5rem,14vw,11rem)] italic leading-[0.85] tracking-[-0.04em]">{J.title[lang]}</h1>
            <p className="mt-5 max-w-[42ch] text-[1.15rem] leading-snug">{J.intro[lang]}</p>
          </div>
          <Asterisk className="w-16 animate-[spin_24s_linear_infinite] text-cobalt sm:w-24" />
        </header>

        {entries.length === 0 ? (
          <p className="mt-16 font-serif text-[1.6rem] italic">{J.empty[lang]}</p>
        ) : (
          <>
            {/* La más reciente, grande */}
            {(() => {
              const e = entries[0];
              return (
                <Link href={`/${lang}/journal/${e.slug}`} className="group mt-12 grid items-end gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
                  <div className="aspect-[16/10] overflow-hidden bg-[#d9dbe2]">
                    {e.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-[0.78rem] text-navy/60">
                      {J.latest[lang]} · <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time>
                    </p>
                    <h2 className="mt-2 font-serif text-[clamp(2.4rem,5vw,4.2rem)] italic leading-[0.98] tracking-[-0.02em] group-hover:text-cobalt">{e.title}</h2>
                    {e.excerpt && <p className="mt-3 max-w-[40ch] text-[1.1rem] leading-snug text-navy/80">{e.excerpt}</p>}
                    {e.tags.length > 0 && <p className="mt-3 font-mono text-[0.78rem] text-navy/60">{e.tags.map((t) => `#${t}`).join("  ")}</p>}
                  </div>
                </Link>
              );
            })()}
            {entries.length > 1 && (
              <ol className="mt-16 grid gap-x-8 gap-y-12 border-t border-navy/15 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {entries.slice(1).map((e, i) => (
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
          </>
        )}
      </div>
    </main>
  );
}

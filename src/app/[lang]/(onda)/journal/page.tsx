import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { listEntries } from "@/lib/journal";
import { journal as J } from "@/content/site";
import { Sparkle, Tag } from "@/components/Stickers";

export async function generateMetadata({ params }: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Journal",
    description:
      lang === "es"
        ? "El journal de Brigitte Blau: ensayos, textos, fotos y videos sobre programar, emprender y lo que voy pensando."
        : "Brigitte Blau's journal: essays, writing, photos and videos about coding, building things and what I'm thinking about.",
    alternates: { canonical: `/${lang}/journal`, languages: { es: "/es/journal", en: "/en/journal" } },
  };
}

const kindLabel = {
  post: { es: "post", en: "post" },
  fotos: { es: "fotos", en: "photos" },
  video: { es: "video", en: "video" },
  ensayo: { es: "ensayo", en: "essay" },
};

export default async function JournalIndex({ params }: PageProps<"/[lang]/journal">) {
  const lang = (await params).lang as Locale;
  const entries = listEntries(lang);
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <main id="main" className="min-h-[100svh] px-3 pb-10 pt-16 text-ink sm:px-6">
      <div className="slide mx-auto max-w-[1300px] px-5 py-10 sm:px-10 sm:py-14">
        <header className="relative flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink/80 pb-8">
          <div>
            <h1 className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(4.5rem,14vw,11rem)] font-black italic leading-[0.85] tracking-[-0.06em]">{J.title[lang]}</h1>
            <p className="mt-4 max-w-[42ch] text-[1.15rem] font-medium leading-snug">{J.intro[lang]}</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkle className="h-10 w-10" />
            <Tag color="var(--pink)">{lang === "es" ? "fotos · videos · posts" : "photos · videos · posts"}</Tag>
          </div>
        </header>

        {entries.length === 0 ? (
          <p className="mt-16 font-hand text-[2rem]">{J.empty[lang]}</p>
        ) : (
          <>
            {/* La más reciente, grande */}
            {(() => {
              const e = entries[0];
              return (
                <Link href={`/${lang}/journal/${e.slug}`} className="group mt-12 grid items-end gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
                  <div className="aspect-[16/10] overflow-hidden rounded-[18px] bg-blue-soft">
                    {e.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-[0.78rem] text-ink/60">
                      {J.latest[lang]} · <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time>
                    </p>
                    <h2 className="mt-2 text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-[0.95] tracking-[-0.04em] group-hover:text-blue">{e.title}</h2>
                    {e.excerpt && <p className="mt-3 max-w-[40ch] text-[1.1rem] leading-snug text-ink/80">{e.excerpt}</p>}
                    {e.tags.length > 0 && <p className="mt-3 font-mono text-[0.78rem] text-ink/60">{e.tags.map((t) => `#${t}`).join("  ")}</p>}
                  </div>
                </Link>
              );
            })()}
            {entries.length > 1 && (
              <ol className="mt-16 grid gap-x-8 gap-y-12 border-t-2 border-ink/80 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {entries.slice(1).map((e, i) => (
                  <li key={e.slug}>
                    <Link href={`/${lang}/journal/${e.slug}`} className="group block">
                      <article>
                        <div className="aspect-[4/5] overflow-hidden rounded-[18px]" style={{ background: ["var(--blue-soft)", "var(--pink)", "var(--yellow)"][i % 3] }}>
                          {e.cover && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={e.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                          )}
                        </div>
                        <p className="mt-3 flex justify-between font-mono text-[0.78rem] text-ink/60">
                          <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time>
                          <span>{kindLabel[e.kind][lang]}</span>
                        </p>
                        <h2 className="mt-1 text-[1.7rem] font-black leading-[1] tracking-[-0.03em] group-hover:text-blue">{e.title}</h2>
                        {e.excerpt && <p className="mt-2 text-[1rem] leading-snug text-ink/75">{e.excerpt}</p>}
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

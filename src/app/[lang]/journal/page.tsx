import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { listEntries } from "@/lib/journal";
import { journal as J } from "@/content/site";
import { Clip, Flower } from "@/components/Stickers";

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
    <main className="dot-paper min-h-[100svh] px-4 pb-24 pt-24 text-navy">
      <div className="mx-auto max-w-5xl">
        <header className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-hand text-[clamp(4.5rem,13vw,9rem)] leading-[0.8]">{J.title[lang]}</h1>
            <p className="mt-4 max-w-[40ch] text-[1.15rem] leading-snug">{J.intro[lang]}</p>
          </div>
          <Flower className="sticker w-24 rotate-12 sm:w-32" look />
        </header>

        {entries.length === 0 ? (
          <p className="mt-16 font-hand text-[1.8rem]">{J.empty[lang]}</p>
        ) : (
          <ol className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {entries.map((e, i) => (
              <li key={e.slug} style={{ rotate: `${[-1.5, 1.2, 0.6, -0.8][i % 4]}deg` }}>
                <Link href={`/${lang}/journal/${e.slug}`} className="group block rounded-lg">
                  <article className="relative bg-white p-3 shadow-[4px_6px_0_rgba(22,32,74,.15)] transition-transform group-hover:-translate-y-1">
                    <Clip className="absolute -top-5 left-6 w-12" color={["var(--pink)", "var(--yellow)", "#7fd1a8", "var(--folder)"][i % 4]} />
                    <div className="aspect-[16/10] overflow-hidden" style={{ background: ["#ffcc33", "#8ec5f0", "#f592bd", "#ff6a2b"][i % 4] }}>
                      {e.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="px-1 pb-1 pt-3">
                      <p className="flex justify-between text-[0.85rem] text-navy/60">
                        <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time>
                        <span>{kindLabel[e.kind][lang]}</span>
                      </p>
                      <h2 className="mt-1 font-serif text-[1.9rem] italic leading-[1.05]">{e.title}</h2>
                      {e.excerpt && <p className="mt-2 text-[1rem] leading-snug text-navy/80">{e.excerpt}</p>}
                    </div>
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

"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { EntryMeta } from "@/lib/journal";
import { sigue as S, journal as J } from "@/content/site";
import { Polaroid, Tag } from "../Stickers";

/* ───────────────────────── Journal ───────────────────────── */
function Journal({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const list = entries.slice(0, 3);
  return (
    <div className="slide relative overflow-hidden px-5 py-10 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Tag color="var(--pink)">{S.journalLead[lang]}</Tag>
          <h2 id="sigue-title" className="mt-4 max-w-[16ch] text-[clamp(2.4rem,5.5vw,5rem)] font-black leading-[0.92] tracking-[-0.045em]">
            {S.title[lang]}
          </h2>
        </div>
        <Link href={`/${lang}/journal`} className="rounded-full bg-ink px-5 py-2.5 font-semibold text-cream hover:bg-blue">
          {S.allEntries[lang]} →
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="mt-8 font-hand text-[1.8rem]">{J.empty[lang]}</p>
      ) : (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e, i) => (
            <li key={e.slug}>
              <Link href={`/${lang}/journal/${e.slug}`} className="group block">
                <Polaroid rotate={[-3, 2, -1.5][i % 3]} holder={i % 2 ? "pin" : "clip"} className="transition-transform duration-300 group-hover:-translate-y-1" caption={e.title}>
                  {e.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.cover} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[4/3] items-end bg-blue-soft p-4 font-serif text-[2rem] italic leading-none">{e.title}</div>
                  )}
                </Polaroid>
                <p className="mt-3 text-center font-mono text-[0.75rem] text-ink/60">
                  <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time> · {e.minutes} {J.readTime[lang]}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Sigue({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  return (
    <section id="sigue" className="relative px-3 py-6 sm:px-6" aria-labelledby="sigue-title">
      <div className="mx-auto max-w-[1500px]">
        <Journal lang={lang} entries={entries} />
      </div>
    </section>
  );
}

/** El journal en versión chiquita, para ir junto a las carpetas ("Yep! Esta soy yo"). */
export function JournalMini({ lang, entries }: { lang: Locale; entries: EntryMeta[] }) {
  const fmt = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const list = entries.slice(0, 4);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink/50">journal</p>
        <Link href={`/${lang}/journal`} className="text-[0.9rem] font-semibold hover:text-pink">
          {S.allEntries[lang]} →
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="mt-6 text-ink/60">{J.empty[lang]}</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
          {list.map((e) => (
            <li key={e.slug}>
              <Link href={`/${lang}/journal/${e.slug}`} className="group flex items-center gap-4 py-4">
                <span className="block h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-pink/15">
                  {e.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[1.15rem] font-bold leading-tight group-hover:text-pink">{e.title}</span>
                  <span className="mt-0.5 block text-[0.8rem] text-ink/50">
                    <time dateTime={e.date}>{e.date ? fmt.format(new Date(e.date)) : ""}</time>
                    {e.excerpt ? ` · ${e.excerpt}` : ""}
                  </span>
                </span>
                <span className="text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-pink" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

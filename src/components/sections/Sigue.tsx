"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { EntryMeta } from "@/lib/journal";
import { bereal as B, dejame as D, sigue as S, journal as J } from "@/content/site";
import FilmCamera from "../FilmCamera";
import { Doodle, Polaroid, Sticky, Tag } from "../Stickers";

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
      <div className="mx-auto max-w-[1500px] space-y-6">
        <Journal lang={lang} entries={entries} />
        <div id="dejame" className="slide relative scroll-mt-16 overflow-hidden px-5 py-10 sm:px-10">
          <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-3">
            <h2 className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(3.4rem,9vw,8rem)] font-black italic leading-[0.85] tracking-[-0.06em]">{D.title[lang]}</h2>
            <Sticky color="#f4a3d0" rotate={4} className="mb-3 max-w-[16rem] !text-[1.35rem]">
              {B.title[lang]} ✨
            </Sticky>
          </div>
          <p className="mb-8 max-w-[52ch] text-[1.1rem] leading-snug">{B.intro[lang]}</p>
          <FilmCamera lang={lang} />
          <Doodle kind="curl" className="absolute right-8 top-10 hidden w-24 lg:block" />
        </div>
      </div>
    </section>
  );
}

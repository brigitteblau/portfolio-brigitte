"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { dejame as D } from "@/content/onda";
import FilmCamera from "../FilmCamera";
import { Hand, Pix, Polaroid } from "./Kit";

/** Dejame una foto: el espejo en el medio y un muro de polaroids alrededor. La tuya se pega ahí (solo en tu pantalla). */
export default function Dejame({ lang }: { lang: Locale }) {
  const [mine, setMine] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: Event) => setMine((e as CustomEvent<string>).detail);
    window.addEventListener("photo:taken", on);
    return () => window.removeEventListener("photo:taken", on);
  }, []);

  const [a, b, c, d] = D.wall;
  return (
    <section id="dejame" aria-label={D.title[lang]} className="relative scroll-mt-14 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1300px]">
        <div className="text-center">
          <Hand className="text-[1.7rem]">{D.kicker[lang]}</Hand>
          <Pix className="mt-1 text-[clamp(2.4rem,7vw,5.5rem)]">{D.title[lang]}</Pix>
          <p className="mx-auto mt-4 max-w-[34ch] text-[1.1rem] text-[#2A1F24]/70">{D.sub[lang]}</p>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[190px_minmax(0,1fr)_190px]">
          <div className="hidden flex-col gap-10 lg:flex">
            <Polaroid src={a.src} note={a.note[lang]} rotate={-6} />
            <Polaroid src={b.src} note={b.note[lang]} rotate={4} className="ml-6" />
          </div>
          <div className="min-w-0">
            <FilmCamera lang={lang} compact />
          </div>
          <div className="hidden flex-col gap-10 lg:flex">
            {mine ? (
              <Polaroid src={mine} note={D.you[lang]} rotate={5} className="animate-[pop_.7s_cubic-bezier(.2,.9,.3,1.3)_both] ring-4 ring-[#E8A9BC]" />
            ) : (
              <Polaroid src={c.src} note={c.note[lang]} rotate={5} />
            )}
            <Polaroid src={d.src} note={d.note[lang]} rotate={-4} className="mr-6" />
          </div>
        </div>

        {/* En el celu: tu foto aparece abajo del espejo */}
        {mine && (
          <div className="mx-auto mt-8 w-[60%] max-w-[240px] lg:hidden">
            <Polaroid src={mine} note={D.you[lang]} rotate={-3} className="animate-[pop_.7s_cubic-bezier(.2,.9,.3,1.3)_both]" />
          </div>
        )}
      </div>
    </section>
  );
}

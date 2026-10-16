"use client";

import type { Locale } from "@/lib/i18n";
import { bereal as B, extra as X } from "@/content/site";
import FilmCamera from "../FilmCamera";
import { Doodle, Sparkle, Sticky } from "../Stickers";

/** Lo más lindo del portfolio: que me dejen una foto. */
export default function Foto({ lang }: { lang: Locale }) {
  return (
    <section id="dejame" className="relative scroll-mt-16 px-3 py-6 sm:px-6" aria-labelledby="foto-title">
      <div
        className="slide relative mx-auto max-w-[1500px] overflow-hidden px-4 py-10 sm:px-10 sm:py-14"
        style={{ background: "radial-gradient(circle at 15% 10%, #ffe0f1 0, transparent 45%), radial-gradient(circle at 90% 85%, #fff1c2 0, transparent 40%), var(--cream)" }}
      >
        <div className="relative mx-auto mb-8 max-w-3xl text-center">
          <Sparkle className="absolute -left-2 -top-2 h-10 w-10 sm:left-4" />
          <Sparkle className="absolute -right-1 top-8 h-7 w-7 sm:right-8" color="var(--pink)" />
          <h2
            id="foto-title"
            className="pb-[0.06em] pr-[0.06em] text-[clamp(3.6rem,13vw,10rem)] font-black italic leading-[0.85] tracking-[-0.06em]"
            style={{ background: "linear-gradient(180deg,#e15cae 30%,#f4a3d0 75%,#ffe0f1)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
          >
            {X.photoTitle[lang]}
          </h2>
          <p className="mx-auto mt-3 max-w-[34ch] text-[clamp(1.1rem,2vw,1.4rem)] font-semibold leading-snug">{X.photoSub[lang]}</p>
          <div className="mt-4 flex justify-center">
            <Sticky color="#f8d66a" rotate={-3} className="!px-3 !pb-3 !pt-5 !text-[1.25rem]">
              {B.title[lang]} ✨
            </Sticky>
          </div>
        </div>
        <FilmCamera lang={lang} />
        <Doodle kind="curl" className="absolute right-8 top-10 hidden w-24 lg:block" />
        <Doodle kind="loop" className="absolute bottom-10 left-8 hidden w-24 lg:block" />
      </div>
    </section>
  );
}

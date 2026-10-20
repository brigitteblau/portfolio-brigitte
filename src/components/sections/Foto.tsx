"use client";

import type { Locale } from "@/lib/i18n";
import { bereal as B, extra as X } from "@/content/site";
import FilmCamera from "../FilmCamera";
import { Sparkle, Sticky } from "../Stickers";

/** Lo más lindo del portfolio: que me dejen una foto. Todo entra en una pantalla. */
export default function Foto({ lang }: { lang: Locale }) {
  return (
    <section id="dejame" className="relative scroll-mt-14 px-3 py-6 sm:px-6" aria-labelledby="foto-title">
      <div
        className="slide relative mx-auto flex max-w-[1500px] flex-col justify-center overflow-hidden px-4 py-6 sm:px-10 lg:min-h-[calc(100svh-5rem)] lg:py-8"
        style={{ background: "radial-gradient(circle at 15% 10%, #ffe0f1 0, transparent 45%), radial-gradient(circle at 90% 85%, #fff1c2 0, transparent 40%), var(--cream)" }}
      >
        <FilmCamera
          lang={lang}
          aside={
            <div className="relative text-center lg:text-left">
              <Sparkle className="absolute -left-1 -top-3 h-8 w-8" />
              <h2
                id="foto-title"
                className="inline-block pb-[0.06em] pr-[0.06em] text-[clamp(2.8rem,6.5vw,6rem)] font-black italic leading-[0.88] tracking-[-0.055em]"
                style={{ background: "linear-gradient(180deg,#e15cae 30%,#f4a3d0 80%,#ffe0f1)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
              >
                {X.photoTitle[lang]}
              </h2>
              <p className="mx-auto mt-3 max-w-[30ch] text-[clamp(1.05rem,1.6vw,1.3rem)] font-semibold leading-snug lg:mx-0">{X.photoSub[lang]}</p>
              <div className="mt-4 hidden lg:block">
                <Sticky color="#f8d66a" rotate={-3} className="inline-block !px-3 !pb-3 !pt-5 !text-[1.2rem]">
                  {B.title[lang]} ✨
                </Sticky>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}

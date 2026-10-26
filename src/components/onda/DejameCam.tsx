"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import FilmCamera from "../FilmCamera";
import { Polaroid } from "./Kit";

/** Diapositiva "Dejame una foto": una cámara de fotos de verdad y, al lado, mi polaroid y la tuya (que se completa cuando te sacás la foto). */
export default function DejameCam({ lang, title }: { lang: Locale; title: string }) {
  const es = lang === "es";
  const [mine, setMine] = useState<string | null>(null);
  useEffect(() => {
    const on = (e: Event) => setMine((e as CustomEvent<string>).detail);
    window.addEventListener("photo:taken", on);
    return () => window.removeEventListener("photo:taken", on);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center gap-10 px-5 pb-16 pt-24 sm:px-12 lg:flex-row lg:items-center lg:gap-14 lg:pb-12">
      <div className="lg:w-[34%]">
        <p className="font-hand text-[clamp(1.4rem,2.2vw,2rem)] opacity-70">{es ? "lo más lindo del portfolio" : "the best part of this site"}</p>
        <h2 className="mt-1 font-[Shrikhand] text-[clamp(2.6rem,5vw,4.4rem)] leading-[1]">{title}</h2>
        <p className="mt-4 max-w-[32ch] text-[1.1rem] leading-snug opacity-75">
          {es ? "Sacate una foto y dejámela. Quiero ver quién pasó por acá. Me llega solo a mí." : "Snap a photo and leave it for me. I want to see who stopped by. Only I get to see it."}
        </p>
        <div className="mt-8 flex items-end">
          <div className="w-[min(36vw,150px)]">
            <Polaroid src="/fotos/portada.webp" note={es ? "yo ♡" : "me ♡"} rotate={-6} />
          </div>
          <div className="-ml-4 w-[min(38vw,160px)]">
            {mine ? (
              <Polaroid src={mine} note={es ? "¡vos! ♡" : "you! ♡"} rotate={5} className="animate-[pop_.7s_cubic-bezier(.2,.9,.3,1.3)_both]" />
            ) : (
              <figure style={{ rotate: "5deg" }} className="relative bg-white p-2.5 pb-9 shadow-[0_14px_26px_-14px_rgba(0,0,0,.45)]">
                <span className="grid aspect-[4/5] w-full place-items-center border-2 border-dashed border-[#E8A9BC] bg-[#FDF4F6] text-center">
                  <span className="font-hand text-[1.4rem] leading-none text-[#9C4F68]">{es ? "¿y vos?" : "and you?"}</span>
                </span>
                <figcaption className="absolute bottom-1.5 left-3 font-hand text-[1.15rem] text-[#4A2C2A]/50">{es ? "tu foto va acá" : "your photo goes here"}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <FilmCamera lang={lang} compact skin="camera" maxH="min(100svh - 21rem, 470px)" />
      </div>
    </div>
  );
}

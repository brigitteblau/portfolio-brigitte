"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { hero as H } from "@/content/site";
import { NameStep } from "../NameTag";

gsap.registerPlugin(useGSAP);

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent("goto", { detail: id }));
};

/**
 * Portada: "Hola, soy backend DEVELOPER" en grande, con mi foto recortada en el medio
 * (tapa parte de las letras), qué hago en una línea y un solo botón principal.
 */
export default function Hero({ lang, cutout }: { lang: Locale; cutout?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-card]", { y: 30, opacity: 0, duration: 0.5 })
        .from("[data-l1]", { yPercent: 80, opacity: 0, stagger: 0.08, duration: 0.7 }, "-=0.2")
        .from("[data-l2]", { yPercent: 60, opacity: 0, duration: 0.8 }, "-=0.5")
        .from("[data-me]", { yPercent: 25, opacity: 0, duration: 1, ease: "expo.out" }, "-=0.6")
        .from("[data-foot]", { y: 16, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.5");
    },
    { scope: root },
  );

  const es = lang === "es";

  return (
    <section ref={root} className="relative px-3 pb-6 pt-12 sm:px-6 sm:pt-14" aria-labelledby="hero-title">
      <NameStep n={0} />
      <div data-card className="slide relative mx-auto h-[calc(100svh-5rem)] min-h-[560px] max-w-[1500px] overflow-hidden">
        {/* Las palabras grandes, ATRÁS de la foto */}
        <h1 id="hero-title" className="pointer-events-none absolute inset-x-0 top-[7%] z-0 select-none text-center md:top-[16%]">
          <span className="flex flex-wrap items-baseline justify-center gap-x-[0.3em] px-4 font-serif text-[clamp(2.4rem,7vw,7.5rem)] font-normal italic leading-[1] tracking-[-0.02em] md:flex-nowrap md:gap-x-[clamp(9rem,24vw,22rem)]">
            <span data-l1 className="inline-block">
              {H.big.left[lang]}
            </span>
            <span data-l1 className="inline-block">
              {H.big.right[lang]}
            </span>
          </span>
          <span data-l2 className="mt-1 block text-[clamp(3.6rem,15.5vw,15rem)] font-black leading-[0.85] tracking-[-0.05em] text-blue md:mt-[0.06em]">
            {H.big.word[lang]}
          </span>
        </h1>

        {/* Yo, recortada, ADELANTE de las letras */}
        {cutout && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            data-me
            src={cutout}
            alt={es ? "Brigitte" : "Brigitte"}
            className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-auto max-w-none -translate-x-1/2 object-contain object-bottom [filter:grayscale(1)_contrast(1.06)_brightness(1.03)] max-md:h-[68%] md:h-[80%]"
          />
        )}

        {/* Abajo: qué hago · el botón · la frase */}
        <div className="absolute inset-x-0 bottom-0 z-20 grid items-end gap-4 px-5 pb-6 sm:px-10 md:grid-cols-[1fr_auto_1fr] md:pb-9">
          <p data-foot className="hidden max-w-[30ch] text-[0.82rem] font-extrabold uppercase leading-snug tracking-[0.04em] md:block">
            <span className="mb-3 block h-[3px] w-14 bg-ink" aria-hidden />
            {H.side[lang]}
          </p>
          <div data-foot className="flex flex-col items-center gap-2">
            <a
              href="#charlemos"
              onClick={go("charlemos")}
              className="rounded-full bg-blue px-10 py-4 text-[1.05rem] font-extrabold uppercase tracking-[0.04em] text-cream shadow-[0_10px_30px_-10px_rgba(78,117,229,.9)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              {es ? "Charlemos ☎️" : "Let's talk ☎️"}
            </a>
            <a
              href="#dejame"
              onClick={(e) => {
                go("dejame")(e);
                setTimeout(() => window.dispatchEvent(new Event("camera:on")), 900);
              }}
              className="rounded-full bg-cream/90 px-3 py-1 text-[0.85rem] font-semibold text-ink underline decoration-pink decoration-2 underline-offset-4"
            >
              {es ? "o dejame una foto 📸" : "or leave me a photo 📸"}
            </a>
          </div>
          <p data-foot className="hidden justify-self-end text-right text-[1rem] font-medium leading-snug text-ink/55 md:block md:max-w-[26ch]">
            {H.statement[lang].map(([t]) => t).join("")}
          </p>
        </div>
      </div>
      {/* En celular, lo que hago va abajo de la tarjeta */}
      <p className="mx-auto mt-4 max-w-[34ch] px-2 text-center text-[0.95rem] font-bold uppercase leading-snug tracking-[0.03em] md:hidden">{H.side[lang]}</p>
    </section>
  );
}

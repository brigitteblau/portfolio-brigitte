"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { hero as H } from "@/content/site";
import { Burst, PersonIcon, RetroComputer, Sparkle, Sticky, Tag } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(useGSAP);

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent("goto", { detail: id }));
};

const TONE = { blue: "var(--blue)", pink: "var(--pink)", yellow: "var(--yellow)", "": undefined } as const;

/**
 * Portada: qué hago HOY, en una frase grande de colores, con mi foto en la compu
 * y dos botones claros (charlar o dejarme una foto). La historia viene más abajo.
 */
export default function Hero({ lang, photo }: { lang: Locale; photo?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });
      tl.from("[data-card]", { y: 40, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from("[data-hello]", { scale: 0.6, rotate: -8, opacity: 0, duration: 0.6 }, "-=0.2")
        .from("[data-w]", { yPercent: 60, opacity: 0, stagger: 0.04, duration: 0.6, ease: "power3.out" }, "-=0.3")
        .from("[data-sub]", { y: 14, opacity: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" }, "-=0.3")
        .from("[data-pc]", { y: 80, rotate: 4, opacity: 0, duration: 0.9, ease: "expo.out" }, "-=0.6")
        .from("[data-pop]", { scale: 0, rotate: () => gsap.utils.random(-30, 30), stagger: 0.07, duration: 0.5 }, "-=0.5");
    },
    { scope: root },
  );

  // La frase, palabra por palabra (para animarla)
  const words = H.statement[lang].flatMap(([text, color]) =>
    text
      .split(/(\s+)/)
      .filter((w) => w.trim())
      .map((w) => ({ w, color })),
  );

  return (
    <section ref={root} className="relative px-3 pb-6 pt-12 sm:px-6 sm:pt-14" aria-labelledby="hero-title">
      <NameStep n={0} />
      <div data-card className="slide relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1500px] flex-col overflow-hidden px-5 py-6 sm:px-10 sm:py-8">
        {/* Fila de arriba: el dato y los post-its */}
        <div className="relative z-20 flex flex-wrap items-start justify-between gap-4">
          <div className="hidden sm:block">
            <span data-pop className="flex items-center gap-1">
              <span className="block">
                <Sparkle className="h-8 w-8" />
              </span>
              <Tag>{H.funFact[lang]}</Tag>
            </span>
            <p data-pop className="ml-6 mt-2 max-w-[17ch] font-hand text-[1.45rem] leading-[1] text-ink/80">
              {H.funFactText[lang]}
            </p>
          </div>
          <nav className="flex flex-wrap items-start justify-center gap-3 max-sm:w-full" aria-label={lang === "es" ? "Accesos" : "Shortcuts"}>
            {(
              [
                ["#proyectos", "proyectos", H.stickies.projects, "#7cc4f0", 4],
                [`/${lang}/journal`, null, H.stickies.journal, "#f8d66a", -3],
                ["#dejame", "dejame", H.stickies.note, "#f4a3d0", 3],
              ] as const
            ).map(([href, id, label, color, rot]) => (
              <span key={href} data-pop className="block">
                <Link href={href} onClick={id ? go(id) : undefined} className="block transition-transform duration-300 hover:-translate-y-1 hover:rotate-1">
                  <Sticky color={color} rotate={rot} className="!px-3 !pb-3 !pt-5 !text-[1.25rem]">
                    {label[lang]}
                  </Sticky>
                </Link>
              </span>
            ))}
          </nav>
        </div>

        {/* Centro: la frase + la compu con mi foto */}
        <div className="relative z-10 my-auto grid items-center gap-8 py-6 md:grid-cols-[1.25fr_0.75fr] md:gap-10">
          <div>
            <p
              data-hello
              className="hello-grad inline-block pb-[0.05em] pr-[0.08em] text-[clamp(3rem,7vw,6.5rem)] font-black italic leading-[0.85] tracking-[-0.06em]"
              aria-hidden
            >
              {H.hello[lang]}
            </p>
            <h1 id="hero-title" className="mt-2 max-w-[17ch] text-[clamp(2.4rem,5.4vw,5.4rem)] font-black leading-[0.95] tracking-[-0.045em]">
              <span className="sr-only">{H.hello[lang]} </span>
              {words.map(({ w, color }, i) => (
                <span key={i} data-w className="mr-[0.22em] inline-block" style={{ color: TONE[color] }}>
                  {w}
                </span>
              ))}
            </h1>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={lang === "es" ? "Qué hago" : "What I do"}>
              {H.roles.map((r, i) => (
                <li key={i} data-sub className="rounded-full border-2 border-ink/80 bg-white px-3 py-1 text-[0.9rem] font-semibold sm:text-[0.95rem]">
                  {r[lang]}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                data-sub
                href="#charlemos"
                onClick={go("charlemos")}
                className="rounded-full bg-ink px-6 py-3.5 text-[1.05rem] font-bold text-cream shadow-[0_6px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#000]"
              >
                {H.cta.call[lang]}
              </a>
              <a
                data-sub
                href="#dejame"
                onClick={(e) => {
                  go("dejame")(e);
                  setTimeout(() => window.dispatchEvent(new Event("camera:on")), 900);
                }}
                className="rounded-full bg-pink px-6 py-3.5 text-[1.05rem] font-bold text-cream shadow-[0_6px_0_#b23f86] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#b23f86]"
              >
                {H.cta.photo[lang]}
              </a>
            </div>
          </div>

          {/* La compu retro: en la pantalla estoy yo */}
          <div data-pc className="relative mx-auto w-[min(78vw,360px)] md:w-full md:max-w-[400px]">
            <RetroComputer>
              <div className="absolute inset-[6%] overflow-hidden rounded-[6px] bg-ink">
                {photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt={lang === "es" ? "Yo" : "Me"} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-ink/85 px-2 py-1 font-mono text-[0.62rem] text-cream">
                  <span>{H.screenTitle}</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" /> {H.screenLabel[lang]}
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.08)_0,rgba(0,0,0,.08)_1px,transparent_1px,transparent_3px)]" aria-hidden />
              </div>
            </RetroComputer>
            <div data-pop className="absolute -left-5 -top-5 w-16 sm:w-20">
              <Burst>
                <PersonIcon className="h-1/2 w-1/2" />
              </Burst>
            </div>
            <span data-pop className="absolute -right-2 top-1/3 block">
              <Sparkle className="h-8 w-8" color="var(--pink)" />
            </span>
          </div>
        </div>

        <p className="floaty mx-auto font-hand text-[1.35rem] text-ink/55" aria-hidden>
          {H.scroll[lang]} ↓
        </p>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { hero as H, intro } from "@/content/site";
import {
  Burst,
  PersonIcon,
  Polaroid,
  RetroComputer,
  Sparkle,
  Sticky,
  Tag,
} from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(useGSAP);

const go = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent("goto", { detail: id }));
};

export default function Hero({
  lang,
  photo,
}: {
  lang: Locale;
  photo?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });
      tl.from("[data-card]", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          "[data-hello] span",
          {
            yPercent: 120,
            rotate: () => gsap.utils.random(-12, 12),
            stagger: 0.06,
            duration: 0.8,
          },
          "-=0.3",
        )
        .from(
          "[data-pc]",
          { y: 120, opacity: 0, duration: 0.9, ease: "expo.out" },
          "-=0.5",
        )
        .from(
          "[data-pop]",
          {
            scale: 0,
            rotate: () => gsap.utils.random(-40, 40),
            stagger: 0.09,
            duration: 0.6,
          },
          "-=0.5",
        );

    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative px-3 pb-6 pt-12 sm:px-6 sm:pt-14"
      aria-label={H.hello[lang]}
    >
      <NameStep n={0} />
      <div
        data-card
        className="slide relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1500px] flex-col items-center justify-center overflow-hidden px-4 py-10"
      >
        {/* Fila de arriba: el dato y los post-its (no tapan el título) */}
        <div className="relative z-20 mb-4 flex w-full flex-wrap items-start justify-between gap-6 md:mb-0 md:px-4">
          <div className="hidden sm:block">
            <span data-pop className="flex items-center gap-1">
              <span className="block">
                <Sparkle className="h-9 w-9" />
              </span>
              <Tag>{H.funFact[lang]}</Tag>
            </span>
            <p data-pop className="ml-6 mt-2 max-w-[15ch] font-hand text-[1.6rem] leading-[1] text-ink/80">
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
                <Link
                  href={href}
                  onClick={id ? go(id) : undefined}
                  className="block transition-transform duration-300 hover:-translate-y-1 hover:rotate-1"
                >
                  <Sticky color={color} rotate={rot} className="!px-3 !pb-3 !pt-5 !text-[1.3rem]">
                    {label[lang]}
                  </Sticky>
                </Link>
              </span>
            ))}
          </nav>
        </div>

        {/* Holaaa! */}
        <h1
          data-hello
          className="relative z-0 flex overflow-hidden px-[0.06em] pb-[0.08em] text-center text-[clamp(3.6rem,17vw,17rem)] font-black italic leading-[0.85] tracking-[-0.06em]"
          aria-label={H.hello[lang]}
        >
          {H.hello[lang].split("").map((c, i) => (
            <span
              key={i}
              aria-hidden
              className="hello-grad inline-block pr-[0.04em]"
            >
              {c}
            </span>
          ))}
        </h1>

        {/* La compu retro, encima del título */}
        <div
          data-pc
          className="relative z-10 mt-2 w-[min(64vw,330px)] md:-mt-[min(3vw,2.5rem)]"
        >
          <RetroComputer>
            <div className="absolute inset-[7%] flex flex-col overflow-hidden rounded-[6px] bg-cream shadow-[0_4px_0_rgba(0,0,0,.15)]">
              <div className="flex items-center justify-between bg-ink px-2 py-1 font-mono text-[0.6rem] text-cream">
                <span>{H.screenTitle}</span>
                <span aria-hidden>× </span>
              </div>
              <p className="flex-1 px-2.5 pt-2 text-[clamp(0.62rem,1.1vw,0.82rem)] font-semibold leading-snug text-ink">
                {intro.nameLine[lang]}
              </p>
              <div className="flex justify-end px-2 pb-2">
                <span className="rounded bg-ink px-2 py-0.5 font-mono text-[0.55rem] text-cream">
                  OK
                </span>
              </div>
            </div>
          </RetroComputer>
        </div>

        <p className="relative z-10 mt-6 max-w-[46ch] text-center text-[clamp(1rem,1.5vw,1.2rem)] font-medium leading-snug">
          {intro.does[lang]}
        </p>

        <div className="absolute bottom-[8%] left-[4%] z-20 hidden w-[min(18vw,200px)] lg:block"
        >
          <div data-pop>
            <Polaroid rotate={-8} holder="clip">
              <div className="aspect-square">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt={lang === "es" ? "Yo" : "Me"}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
            </Polaroid>
          </div>
          <div data-pop className="absolute -bottom-6 -left-6 w-16 sm:w-20">
            <Burst>
              <PersonIcon className="h-1/2 w-1/2" />
            </Burst>
          </div>
        </div>

        <span data-pop className="absolute block right-[24%] top-[12%]"><Sparkle className="h-8 w-8" /></span>
        <span data-pop className="absolute block bottom-[22%] left-[30%]"><Sparkle className="h-6 w-6"
          color="var(--pink)"
        /></span>
        <span data-pop className="absolute block right-[8%] bottom-[38%]"><Sparkle className="h-5 w-5"
          color="var(--blue)"
        /></span>

        <p
          className="absolute bottom-4 left-1/2 -translate-x-1/2 font-hand text-[1.4rem] text-ink/60 floaty"
          aria-hidden
        >
          {H.scroll[lang]} ↓
        </p>
      </div>
    </section>
  );
}

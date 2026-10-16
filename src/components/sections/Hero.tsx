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

      // Los stickers se mueven apenas con el mouse (profundidad)
      const items = gsap.utils.toArray<HTMLElement>("[data-depth]");
      const movers = items.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        d: Number(el.dataset.depth),
      }));
      const onMove = (e: PointerEvent) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(cx * m.d * 40);
          m.y(cy * m.d * 30);
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
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
        {/* Holaaa! */}
        <h1
          data-hello
          className="relative z-0 flex overflow-hidden px-[0.06em] pb-[0.08em] text-center text-[clamp(3.6rem,21vw,21rem)] font-black italic leading-[0.85] tracking-[-0.06em]"
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
          className="relative z-10 mt-2 w-[min(64vw,330px)] md:-mt-[min(7vw,6rem)]"
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

        {/* Stickers alrededor */}
        <div
          data-depth="1.2"
          className="absolute left-[4%] top-[8%] z-20 hidden sm:block"
        >
          <div data-pop className="flex items-center gap-1">
            <Sparkle className="h-9 w-9" />
            <Tag>{H.funFact[lang]}</Tag>
          </div>
          <p
            data-pop
            className="ml-6 mt-2 max-w-[13ch] font-hand text-[1.6rem] leading-[1] text-ink/80"
          >
            {H.funFactText[lang]}
          </p>
        </div>

        <div
          data-depth="0.8"
          className="absolute bottom-[10%] left-[5%] z-20 hidden w-[min(22vw,210px)] sm:block"
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

        <Sparkle data-pop className="absolute right-[24%] top-[12%] h-8 w-8" />
        <Sparkle
          data-pop
          className="absolute bottom-[22%] left-[30%] h-6 w-6"
          color="var(--pink)"
        />
        <Sparkle
          data-pop
          className="absolute right-[8%] bottom-[38%] h-5 w-5"
          color="var(--blue)"
        />

        {/* Post-its = accesos directos */}
        <nav
          data-depth="1.6"
          className="absolute right-[4%] top-[14%] z-20 flex flex-col items-end gap-3 max-sm:static max-sm:mt-8 max-sm:flex-row max-sm:flex-wrap max-sm:justify-center"
          aria-label={lang === "es" ? "Accesos" : "Shortcuts"}
        >
          <span data-pop className="block">
            <a
              href="#proyectos"
              onClick={go("proyectos")}
              className="block transition-transform hover:-rotate-2 hover:scale-105"
            >
              <Sticky color="#7cc4f0" rotate={5}>
                {H.stickies.projects[lang]}
              </Sticky>
            </a>
          </span>
          <span data-pop className="block">
            <Link
              href={`/${lang}/journal`}
              className="block transition-transform hover:rotate-2 hover:scale-105"
            >
              <Sticky color="#f8d66a" rotate={-4}>
                {H.stickies.journal[lang]}
              </Sticky>
            </Link>
          </span>
          <span data-pop className="block">
            <a
              href="#dejame"
              onClick={go("dejame")}
              className="block transition-transform hover:-rotate-2 hover:scale-105"
            >
              <Sticky color="#f4a3d0" rotate={3}>
                {H.stickies.note[lang]}
              </Sticky>
            </a>
          </span>
        </nav>

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

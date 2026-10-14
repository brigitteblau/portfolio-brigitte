"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { intro, notes, ui } from "@/content/site";
import { clamp01 } from "@/lib/track";
import { Burst, Flower, Heart, Star } from "../Stickers";
import Photo from "../Photo";
import Panel, { usePanel } from "../Panel";
import Note from "../Note";

gsap.registerPlugin(useGSAP);

const tilts = [-6, 4, -3, 7];
const tints = ["var(--green)", "var(--folder)", "var(--yellow)", "var(--pink)"];

function Hola({ lang }: { lang: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.6)" } });
      tl.from("[data-hello] span", { yPercent: 110, rotate: 8, stagger: 0.05, duration: 0.8, ease: "expo.out" })
        .from("[data-sticker]", { scale: 0, rotate: -40, stagger: 0.08, duration: 0.7 }, "-=0.5")
        .from("[data-nameline]", { opacity: 0, y: 12, duration: 0.6, ease: "power2.out" }, "-=0.4");
    },
    { scope: root },
  );
  // Al salir, los stickers se van volando a distintas velocidades
  usePanel(({ exit }) => {
    root.current?.querySelectorAll<HTMLElement>("[data-sticker]").forEach((el, i) => {
      el.style.translate = `${-exit * (120 + i * 140)}px ${-exit * (40 + i * 30)}px`;
    });
  });

  return (
    <div ref={root} className="relative flex h-full flex-col items-center justify-center px-6 text-center">
      <div data-sticker className="sticker absolute left-[6%] top-[18%] w-20 sm:w-32"><Flower look /></div>
      <div data-sticker className="sticker absolute right-[8%] top-[24%] w-16 sm:w-28"><Heart look /></div>
      <div data-sticker className="sticker absolute bottom-[22%] left-[12%] w-16 sm:w-24"><Burst look /></div>
      <div data-sticker className="sticker absolute bottom-[20%] right-[10%] w-20 sm:w-36"><Star look /></div>
      <h1
        data-hello
        className="flex overflow-hidden pb-[0.08em] pr-[0.12em] font-sans text-[clamp(5rem,22vw,20rem)] font-extrabold italic leading-[0.85] tracking-[-0.05em] text-cobalt [font-variation-settings:'wdth'_75]"
        aria-label={intro.hello[lang]}
      >
        {intro.hello[lang].split("").map((c, i) => (
          <span key={i} aria-hidden className="inline-block">
            {c}
          </span>
        ))}
      </h1>
      <p data-nameline className="mt-6 max-w-[30ch] text-[clamp(1.15rem,2.2vw,1.55rem)] leading-snug">
        {intro.nameLine[lang]}
      </p>
      <Note>{notes.hola[lang]}</Note>
    </div>
  );
}

function Etiquetas({ lang, avatars }: { lang: Locale; avatars: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  usePanel(({ enter, hold }) => {
    const r = root.current;
    if (!r) return;
    // aparecen las tarjetas mientras la diapositiva entra
    r.querySelectorAll<HTMLElement>("[data-label]").forEach((el, i) => {
      const p = clamp01(enter * 1.6 - i * 0.18);
      el.style.opacity = String(p);
      el.style.transform = `translateY(${(1 - p) * 60}px) rotate(${tilts[i] * (1 + (1 - p) * 3)}deg) scale(${0.6 + p * 0.4})`;
    });
    // se tachan durante la pausa
    r.querySelectorAll<SVGPathElement>("[data-scribble]").forEach((path, i) => {
      const p = clamp01(hold * 2.2 - i * 0.22);
      path.style.strokeDashoffset = String(1 - p);
    });
    const fade = clamp01((hold - 0.6) / 0.25);
    r.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => (c.style.opacity = String(1 - fade * 0.55)));
    const w = r.querySelector<HTMLElement>("[data-withtime]");
    if (w) {
      w.style.opacity = String(fade);
      w.style.transform = `translateY(${(1 - fade) * 30}px) rotate(-2deg)`;
    }
  });

  return (
    <div ref={root} className="relative flex h-full flex-col items-center justify-center gap-5 px-4 pb-24 pt-16 md:gap-8">
      <p className="max-w-[24ch] text-center font-serif text-[clamp(1.6rem,3.6vw,3rem)] italic leading-[1.1]">{intro.notFirst[lang]}…</p>
      <ul className="grid w-full max-w-5xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {intro.labels.map((label, i) => (
          <li key={i} data-label className="relative">
            <div data-card className="overflow-hidden rounded-lg bg-paper shadow-[3px_5px_0_rgba(22,32,74,.2)]">
              <div className="flex h-6 items-center gap-1.5 border-b border-navy/10 bg-[#eef0f6] px-2" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow" />
                <span className="h-2.5 w-2.5 rounded-full bg-green" />
              </div>
              <div className="aspect-[4/3] md:aspect-[4/5]">
                <Photo src={avatars[i]} alt={label[lang]} folder="avatar" hint={`${ui.photoMissing[lang]} ${i + 1}`} tint={tints[i]} />
              </div>
              <p className="px-3 py-2 text-center text-[1.05rem] font-semibold">{label[lang]}</p>
            </div>
            <svg viewBox="0 0 200 120" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
              <path
                data-scribble
                pathLength={1}
                d="M10 20 C60 30 120 10 190 25 M15 50 C80 40 140 70 185 55 M12 85 C70 95 130 70 190 100 M20 110 C90 100 150 115 180 108"
                fill="none"
                stroke="var(--red)"
                strokeWidth="9"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              />
            </svg>
          </li>
        ))}
      </ul>
      <p data-withtime className="absolute bottom-[24%] max-w-[18ch] rounded-lg bg-yellow px-5 py-3 text-center font-hand text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.02] opacity-0 shadow-[4px_6px_0_rgba(22,32,74,.2)]">
        {intro.withTime[lang]}
      </p>
      <Note>{notes.labels[lang]}</Note>
    </div>
  );
}

export default function Intro({ lang, avatars }: { lang: Locale; avatars: string[] }) {
  return (
    <>
      <Panel id="hola" era="hola" nameStep={0} className="bg-desk" label={intro.hello[lang]}>
        <Hola lang={lang} />
      </Panel>
      <Panel era="hola" hold={1.4} className="bg-desk" label={intro.notFirst[lang]}>
        <Etiquetas lang={lang} avatars={avatars} />
      </Panel>
    </>
  );
}

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { intro, notes, ui } from "@/content/site";
import { clamp01 } from "@/lib/track";
import { Asterisk } from "../Stickers";
import Photo from "../Photo";
import Panel, { usePanel } from "../Panel";
import Note from "../Note";

gsap.registerPlugin(useGSAP);

const tilts = [-2, 1.5, -1, 2.5];
const tints = ["#1b6b48", "#8ea2ff", "#c9cbd3", "#2b44ff"];

function Hola({ lang }: { lang: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const star = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline();
      tl.from("[data-hello] span", { yPercent: 110, stagger: 0.06, duration: 1, ease: "expo.out" })
        .from("[data-star]", { scale: 0, rotate: -180, duration: 1.2, ease: "expo.out" }, "-=0.8")
        .from("[data-nameline]", { opacity: 0, y: 16, duration: 0.7, ease: "power2.out" }, "-=0.7");
    },
    { scope: root },
  );
  // El asterisco gira mientras te vas
  usePanel(({ exit }) => {
    if (star.current) star.current.style.transform = `rotate(${exit * 180}deg) translateX(${-exit * 30}vw)`;
  });

  return (
    <div ref={root} className="relative flex h-full flex-col justify-end px-5 pb-28 pt-16 sm:px-10 sm:pb-32">
      <div ref={star} className="absolute right-[6vw] top-[14vh] w-[22vw] max-w-[260px] text-cobalt">
        <div data-star>
          <Asterisk className="w-full animate-[spin_24s_linear_infinite]" />
        </div>
      </div>
      <h1
        data-hello
        className="flex overflow-hidden pb-[0.06em] pr-[0.1em] font-serif text-[clamp(6rem,24vw,24rem)] italic leading-[0.86] tracking-[-0.045em]"
        aria-label={intro.hello[lang]}
      >
        {(intro.hello[lang] + ".").split("").map((c, i) => (
          <span key={i} aria-hidden className="inline-block">
            {c}
          </span>
        ))}
      </h1>
      <p data-nameline className="mt-6 max-w-[34ch] self-end text-[clamp(1.1rem,1.8vw,1.4rem)] leading-snug sm:mr-[4vw]">
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
      w.style.transform = `translateY(${(1 - fade) * 30}px)`;
    }
  });

  return (
    <div ref={root} className="relative flex h-full flex-col items-center justify-center gap-5 px-4 pb-24 pt-16 md:gap-8">
      <p className="max-w-[24ch] text-center font-serif text-[clamp(1.6rem,3.6vw,3rem)] italic leading-[1.1]">{intro.notFirst[lang]}…</p>
      <ul className="grid w-full max-w-5xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {intro.labels.map((label, i) => (
          <li key={i} data-label className="relative">
            <div data-card className="overflow-hidden rounded-md bg-paper shadow-[0_18px_40px_-18px_rgba(13,17,36,.45)]">
              <div className="flex h-6 items-center gap-1.5 border-b border-navy/10 bg-[#eef0f6] px-2" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-navy/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-navy/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-navy/20" />
              </div>
              <div className="aspect-[4/3] md:aspect-[4/5]">
                <Photo src={avatars[i]} alt={label[lang]} folder="avatar" hint={`${ui.photoMissing[lang]} ${i + 1}`} tint={tints[i]} />
              </div>
              <p className="px-3 py-2 font-mono text-[0.85rem]">{label[lang]}</p>
            </div>
            <svg viewBox="0 0 200 120" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
              <path
                data-scribble
                pathLength={1}
                d="M10 20 C60 30 120 10 190 25 M15 50 C80 40 140 70 185 55 M12 85 C70 95 130 70 190 100 M20 110 C90 100 150 115 180 108"
                fill="none"
                stroke="var(--red)"
                strokeWidth="6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              />
            </svg>
          </li>
        ))}
      </ul>
      <p data-withtime className="absolute bottom-[24%] max-w-[20ch] bg-cobalt px-6 py-4 text-center font-serif text-[clamp(1.8rem,4vw,3.2rem)] italic leading-[1.05] text-paper opacity-0">
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

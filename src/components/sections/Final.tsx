"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import type { Locale } from "@/lib/i18n";
import { conocerme as C, contacto as K, notes, NAME } from "@/content/site";
import { clamp01 } from "@/lib/track";
import Photo from "../Photo";
import Panel, { usePanel } from "../Panel";
import Note from "../Note";

function Conocerme({ lang }: { lang: Locale }) {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const arena = useRef<HTMLDivElement>(null);
  const [taunt, setTaunt] = useState<string | null>(null);
  const tries = useRef(0);

  usePanel(({ enter }) => {
    nameRef.current?.querySelectorAll<HTMLElement>("span").forEach((s, i) => {
      const p = clamp01(enter * 2.4 - 0.5 - i * 0.07);
      s.style.transform = `translateY(${(1 - p) * 110}%)`;
    });
  });

  // El "No" se escapa
  const flee = () => {
    const btn = noRef.current;
    const box = arena.current;
    if (!btn || !box) return;
    const b = box.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    const maxX = b.width - r.width;
    const maxY = b.height - r.height;
    const curX = r.left - b.left;
    const curY = r.top - b.top;
    let x = Math.random() * maxX;
    let y = Math.random() * maxY;
    if (Math.hypot(x - curX, y - curY) < 140) {
      x = (curX + maxX / 2) % maxX;
      y = (curY + maxY / 2) % maxY;
    }
    gsap.to(btn, { left: x, top: y, duration: 0.3, ease: "power3.out" });
    tries.current += 1;
    setTaunt(C.noTaunts[tries.current % C.noTaunts.length][lang]);
  };

  const yes = () => window.dispatchEvent(new CustomEvent("goto", { detail: "contacto" }));

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 pb-24 pt-14 text-navy">
      <p className="font-mono text-[0.85rem] opacity-70">{C.end[lang]}</p>
      <p
        ref={nameRef}
        aria-label={NAME}
        className="mt-2 flex overflow-hidden pb-[0.08em] pr-[0.1em] pt-[0.06em] font-serif text-[clamp(4.5rem,17vw,16rem)] italic leading-[0.86] tracking-[-0.045em]"
      >
        {NAME.split("").map((c, i) => (
          <span key={i} aria-hidden className="inline-block">
            {c}
          </span>
        ))}
      </p>
      <h2 className="mt-6 text-center text-[clamp(1.6rem,3.4vw,2.8rem)] font-semibold leading-none tracking-[-0.02em]">{C.question[lang]}</h2>
      <div ref={arena} className="relative mt-8 h-[20vh] min-h-[150px] w-full max-w-2xl">
        <button
          onClick={yes}
          className="absolute left-[28%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt px-12 py-4 text-[1.4rem] font-semibold text-paper transition-transform hover:scale-105 active:scale-95"
        >
          {C.yes[lang]}
        </button>
        <button
          ref={noRef}
          onPointerEnter={flee}
          onPointerDown={(e) => {
            e.preventDefault();
            flee();
          }}
          onFocus={flee}
          onClick={(e) => {
            e.preventDefault();
            flee();
          }}
          className="absolute rounded-full border border-navy/40 px-10 py-4 text-[1.4rem] font-semibold"
          style={{ left: "60%", top: "28%" }}
        >
          {C.no[lang]}
        </button>
        <p className="pointer-events-none absolute -bottom-8 left-0 right-0 text-center font-mono text-[0.85rem] text-navy/70" aria-live="polite">
          {taunt}
        </p>
      </div>
      <Note>{notes.conocerme[lang]}</Note>
    </div>
  );
}

function Contacto({ lang, photos }: { lang: Locale; photos: string[] }) {
  const photo = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  usePanel(({ enter }) => {
    if (photo.current) photo.current.style.transform = `translateY(${(1 - enter) * 25}vh) rotate(${(1 - enter) * -6}deg)`;
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(K.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${K.email}`;
    }
  };

  return (
    <div className="relative grid h-full content-center items-center gap-6 px-6 pb-24 pt-16 text-paper md:grid-cols-[1fr_1.15fr] md:gap-8 md:px-16">
      <div ref={photo} className="relative mx-auto w-[min(48vw,30vh,22rem)] md:w-[min(70vw,52vh,24rem)]">
        <div className="aspect-[4/5] overflow-hidden shadow-[0_30px_60px_-25px_rgba(0,0,0,.6)]">
          <Photo src={photos[0]} alt={lang === "es" ? "Yo, tirando un beso" : "Me, blowing a kiss"} folder="contacto" hint={lang === "es" ? "foto tirando un beso" : "blowing-a-kiss photo"} tint="#8ea2ff" />
        </div>
      </div>
      <div>
        <h2 className="font-serif text-[clamp(2.8rem,8vw,6.5rem)] italic leading-[0.95] tracking-[-0.02em]">{K.title[lang]}</h2>
        <p className="mt-4 max-w-[34ch] text-[1.2rem] leading-snug opacity-90">{K.body[lang]}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href={`mailto:${K.email}`} className="break-all text-[clamp(1.1rem,2.2vw,1.5rem)] font-semibold underline decoration-1 underline-offset-4">
            {K.email}
          </a>
          <button onClick={copy} className="rounded-full bg-paper px-4 py-2 text-[0.95rem] font-semibold text-cobalt hover:bg-yellow hover:text-navy">
            {copied ? K.copied[lang] : K.copy[lang]}
          </button>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {K.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-paper/60 px-4 py-1.5 font-semibold hover:bg-paper hover:text-cobalt">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Link href={`/${lang}/journal`} className="mt-6 inline-block font-serif text-[1.8rem] italic leading-none underline decoration-1 underline-offset-[6px] hover:text-yellow md:mt-8 md:text-[2.2rem]">
          {K.journalCta[lang]}
        </Link>
      </div>
    </div>
  );
}

export default function Final({ lang, photos }: { lang: Locale; photos: string[] }) {
  return (
    <>
      <Panel id="conocerme" era="fin" className="bg-desk" label={C.question[lang]}>
        <Conocerme lang={lang} />
      </Panel>
      <Panel id="contacto" era="fin" className="bg-cobalt" label={K.title[lang]}>
        <Contacto lang={lang} photos={photos} />
      </Panel>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Locale } from "@/lib/i18n";
import { conocerme as C, contacto as K, notes, NAME } from "@/content/site";
import { clamp01 } from "@/lib/track";
import { Heart, Star } from "../Stickers";
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
      s.style.transform = `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * (i % 2 ? 14 : -14)}deg)`;
    });
  });

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
    gsap.to(btn, { left: x, top: y, rotate: gsap.utils.random(-25, 25), duration: 0.35, ease: "back.out(2)" });
    tries.current += 1;
    setTaunt(C.noTaunts[tries.current % C.noTaunts.length][lang]);
  };

  const yes = () => {
    window.dispatchEvent(new CustomEvent("goto", { detail: "contacto" }));
    window.dispatchEvent(new CustomEvent("beso"));
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 pb-24 pt-14 text-navy">
      <p className="font-hand text-[clamp(1.8rem,3.4vw,2.6rem)]">{C.end[lang]}</p>
      <p
        ref={nameRef}
        aria-label={NAME}
        className="flex overflow-hidden pb-[0.1em] pr-[0.12em] pt-[0.1em] font-sans text-[clamp(4rem,15vw,14rem)] font-extrabold italic leading-[0.85] tracking-[-0.05em] text-cobalt [font-variation-settings:'wdth'_75]"
      >
        {NAME.split("").map((c, i) => (
          <span key={i} aria-hidden className="inline-block">
            {c}
          </span>
        ))}
      </p>
      <h2 className="mt-4 text-center font-serif text-[clamp(2rem,4.4vw,3.6rem)] italic leading-none">{C.question[lang]}</h2>
      <div ref={arena} className="relative mt-6 h-[22vh] min-h-[160px] w-full max-w-2xl rounded-3xl border-2 border-dashed border-navy/20">
        <button
          onClick={yes}
          className="absolute left-[24%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red px-10 py-4 text-[1.6rem] font-bold text-white shadow-[3px_5px_0_rgba(22,32,74,.3)] transition-transform hover:scale-110 active:scale-95"
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
          className="absolute rounded-full border-2 border-navy bg-paper px-8 py-3 text-[1.3rem] font-semibold"
          style={{ left: "62%", top: "32%" }}
        >
          {C.no[lang]}
        </button>
        <p className="pointer-events-none absolute -bottom-10 left-0 right-0 text-center font-hand text-[1.6rem] text-navy/70" aria-live="polite">
          {taunt}
        </p>
        <Heart className="sticker absolute -left-6 -top-8 w-16 rotate-[-12deg]" look />
        <Star className="sticker absolute -bottom-8 -right-4 w-20 rotate-12" look />
      </div>
      <Note>{notes.conocerme[lang]}</Note>
    </div>
  );
}

function Contacto({ lang, photos }: { lang: Locale; photos: string[] }) {
  const hearts = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  usePanel(({ enter }) => {
    if (photo.current) photo.current.style.transform = `rotate(${-4 - (1 - enter) * 20}deg) translateY(${(1 - enter) * 30}vh)`;
  });

  useEffect(() => {
    const burst = () => {
      if (!hearts.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const kids = Array.from(hearts.current.children) as HTMLElement[];
      gsap.fromTo(
        kids,
        { x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 },
        {
          x: () => gsap.utils.random(-260, 260),
          y: () => gsap.utils.random(-360, -80),
          rotate: () => gsap.utils.random(-50, 50),
          scale: () => gsap.utils.random(0.5, 1.2),
          opacity: 0,
          duration: 2.2,
          delay: 1,
          stagger: 0.04,
          ease: "power2.out",
        },
      );
    };
    window.addEventListener("beso", burst);
    return () => window.removeEventListener("beso", burst);
  }, []);

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
    <div className="relative grid h-full content-center items-center gap-6 px-6 pb-24 pt-16 text-navy md:gap-8 md:grid-cols-[1fr_1.15fr] md:px-16">
      <div className="relative mx-auto w-[min(48vw,30vh,22rem)] md:w-[min(70vw,48vh,22rem)]">
        <div ref={photo} className="bg-white p-3 pb-12 shadow-[6px_10px_0_rgba(22,32,74,.2)]">
          <div className="aspect-[4/5] overflow-hidden">
            <Photo src={photos[0]} alt={lang === "es" ? "Yo, tirando un beso" : "Me, blowing a kiss"} folder="contacto" hint={lang === "es" ? "foto tirando un beso" : "blowing-a-kiss photo"} tint="#f7a9c9" />
          </div>
          <p className="absolute bottom-2 left-0 right-0 text-center font-hand text-[1.8rem] leading-none">xx</p>
        </div>
        <div ref={hearts} className="pointer-events-none absolute left-1/2 top-1/3 z-10 h-0 w-0" aria-hidden>
          {Array.from({ length: 14 }, (_, i) => (
            <Heart key={i} className="absolute -left-5 -top-5 w-10 opacity-0" color={i % 3 === 0 ? "#fff" : "var(--red)"} />
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-serif text-[clamp(2.6rem,8vw,6.5rem)] italic leading-[0.95] tracking-[-0.02em]">{K.title[lang]}</h2>
        <p className="mt-4 max-w-[34ch] text-[1.2rem] leading-snug">{K.body[lang]}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href={`mailto:${K.email}`} className="break-all text-[clamp(1.1rem,2.2vw,1.5rem)] font-semibold underline decoration-2 underline-offset-4">
            {K.email}
          </a>
          <button onClick={copy} className="rounded-full bg-navy px-4 py-2 text-[0.95rem] font-semibold text-white hover:bg-cobalt">
            {copied ? K.copied[lang] : K.copy[lang]}
          </button>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {K.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" className="inline-block rounded-full border-2 border-navy px-4 py-1.5 font-semibold hover:bg-navy hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Link href={`/${lang}/journal`} className="mt-5 inline-block font-hand text-[2rem] md:mt-8 md:text-[2.2rem] leading-none underline decoration-2 underline-offset-[6px] hover:text-cobalt">
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
      <Panel id="contacto" era="fin" className="bg-pink" label={K.title[lang]}>
        <Contacto lang={lang} photos={photos} />
      </Panel>
    </>
  );
}

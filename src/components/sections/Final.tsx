"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import { conocerme as C, contacto as K, notes, NAME } from "@/content/site";
import { Blob, Burst, Polaroid, Sparkle, Sticky, Tag } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Conocerme({ lang }: { lang: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const arena = useRef<HTMLDivElement>(null);
  const [taunt, setTaunt] = useState<string | null>(null);
  const tries = useRef(0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-l]", {
        yPercent: 110,
        rotate: () => gsap.utils.random(-15, 15),
        stagger: 0.06,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

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
    gsap.to(btn, { left: x, top: y, rotate: gsap.utils.random(-20, 20), duration: 0.3, ease: "power3.out" });
    tries.current += 1;
    setTaunt(C.noTaunts[tries.current % C.noTaunts.length][lang]);
  };

  const yes = () => {
    window.dispatchEvent(new CustomEvent("goto", { detail: "charlemos" }));
    setTimeout(() => window.dispatchEvent(new Event("call:open")), 900);
  };

  return (
    <div ref={root} id="conocerme" className="slide relative flex min-h-[86svh] flex-col items-center justify-center overflow-hidden px-4 py-14">
      <NameStep n={NAME.length} />
      <p className="font-hand text-[1.6rem] text-ink/60">{C.end[lang]}</p>
      <p aria-label={NAME} className="mt-1 flex overflow-hidden pb-[0.08em] pr-[0.1em] text-[clamp(4.5rem,16vw,15rem)] font-black italic leading-[0.86] tracking-[-0.06em]">
        {NAME.split("").map((c, i) => (
          <span key={i} data-l aria-hidden className="hello-grad inline-block pr-[0.03em]">
            {c}
          </span>
        ))}
      </p>
      <h2 className="mt-6 text-center text-[clamp(1.8rem,3.8vw,3.2rem)] font-black leading-none tracking-[-0.03em]">{C.question[lang]}</h2>
      <div ref={arena} className="relative mt-8 h-[24vh] min-h-[170px] w-full max-w-2xl">
        <button
          onClick={yes}
          className="absolute left-[28%] top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue px-12 py-4 text-[1.5rem] font-black text-cream shadow-[0_8px_0_#2f4fb5] transition-transform hover:scale-105 active:translate-y-[calc(-50%+4px)]"
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
          className="absolute rounded-full border-2 border-ink/70 bg-cream px-10 py-4 text-[1.5rem] font-bold"
          style={{ left: "60%", top: "28%" }}
        >
          {C.no[lang]}
        </button>
        <p className="pointer-events-none absolute -bottom-8 left-0 right-0 text-center font-hand text-[1.5rem] text-pink" aria-live="polite">
          {taunt}
        </p>
      </div>
      <p className="absolute bottom-4 left-6 font-hand text-[1.3rem] text-ink/50">↳ {notes.conocerme[lang]}</p>
      <Blob color="var(--blue-soft)" face="o" className="absolute -left-6 top-10 hidden w-32 md:block" />
      <Sparkle className="absolute right-[12%] top-[14%] h-10 w-10" />
    </div>
  );
}

function Contacto({ lang, photos }: { lang: Locale; photos: string[] }) {
  const [copied, setCopied] = useState(false);
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
    <div id="contacto" className="slide relative grid scroll-mt-16 items-center gap-10 overflow-hidden px-5 py-12 sm:px-12 md:grid-cols-[0.8fr_1.2fr]">
      <div className="relative mx-auto w-[min(70vw,22rem)]">
        {photos[0] && (
          <Polaroid rotate={-5} holder="clip" caption={lang === "es" ? "muak!" : "mwah!"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0]} alt={lang === "es" ? "Yo, tirando un beso" : "Me, blowing a kiss"} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </Polaroid>
        )}
        <div className="absolute -right-6 -top-6 w-20">
          <Burst>
            <span className="text-[1.8rem]" aria-hidden>
              ♥
            </span>
          </Burst>
        </div>
      </div>
      <div>
        <h2 className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(3.4rem,8vw,7rem)] font-black italic leading-[0.88] tracking-[-0.05em]">{K.title[lang]}</h2>
        <p className="mt-4 max-w-[34ch] text-[1.25rem] font-medium leading-snug">{K.body[lang]}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href={`mailto:${K.email}`} className="break-all text-[clamp(1.1rem,2.2vw,1.6rem)] font-bold underline decoration-pink decoration-[3px] underline-offset-4 hover:text-blue">
            {K.email}
          </a>
          <button onClick={copy} className="rounded-full bg-ink px-4 py-2 text-[0.95rem] font-semibold text-cream hover:bg-blue">
            {copied ? K.copied[lang] : K.copy[lang]}
          </button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {K.links.map((l, i) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="inline-block">
              <Tag color={["var(--green)", "var(--blue)", "var(--pink)"][i % 3]} rotate={[-4, 3, -2][i % 3]}>
                {l.label} ↗
              </Tag>
            </a>
          ))}
          <Link href={`/${lang}/journal`} className="inline-block transition-transform hover:-rotate-2 hover:scale-105">
            <Sticky color="#f8d66a" rotate={3} className="!text-[1.35rem]">
              {K.journalCta[lang]}
            </Sticky>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Cierre: ¿Querés conocerme? → (Sí) → Charlemos → Contacto */
export default function Final({ lang, photos, children }: { lang: Locale; photos: string[]; children?: React.ReactNode }) {
  return (
    <>
      <section className="relative px-3 pt-6 sm:px-6" aria-label={C.question[lang]}>
        <div className="mx-auto max-w-[1500px]">
          <Conocerme lang={lang} />
        </div>
      </section>
      {children}
      <section className="relative px-3 pb-10 pt-6 sm:px-6" aria-label={K.title[lang]}>
        <div className="mx-auto max-w-[1500px]">
          <Contacto lang={lang} photos={photos} />
        </div>
      </section>
    </>
  );
}

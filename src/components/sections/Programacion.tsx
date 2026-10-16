"use client";

import { useRef } from "react";
import { filled, type Locale } from "@/lib/i18n";
import { programacion as P, notes, NAME_STEPS, ui } from "@/content/site";
import { clamp01 } from "@/lib/track";
import EraTab from "../EraTab";
import Photo from "../Photo";
import Soundtrack from "../Soundtrack";
import Panel, { usePanel, usePanelValue } from "../Panel";
import Note from "../Note";

function typed(p: number, wrong: string, right: string) {
  if (p < 0.3) return { text: wrong.slice(0, Math.round((p / 0.3) * wrong.length)), struck: false };
  if (p < 0.45) return { text: wrong, struck: p > 0.37 };
  if (p < 0.58) return { text: wrong.slice(0, Math.round((1 - (p - 0.45) / 0.13) * wrong.length)), struck: true };
  return { text: right.slice(0, Math.round(Math.min(1, (p - 0.58) / 0.32) * right.length)), struck: false };
}

/** Pared de carpetas: un solo patrón CSS (antes eran 140 SVG animados). */
function Folders() {
  return (
    <div
      className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_35%,#000_80%)]"
      style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='70' viewBox='0 0 88 70'><path d='M8 14 Q8 10 12 10 H28 L34 16 H64 Q68 16 68 20 V48 Q68 52 64 52 H12 Q8 52 8 48Z' fill='%23d6e4f5'/><path d='M8 22 H68 V48 Q68 52 64 52 H12 Q8 52 8 48Z' fill='%23e6eef9'/></svg>\")", backgroundSize: "88px 70px" }}
      aria-hidden
    />
  );
}

function Editor({ lang }: { lang: Locale }) {
  const p = usePanelValue((v) => Math.round(v.hold * 300) / 300, 0);
  const t = typed(p, P.typedWrong[lang], P.typedRight[lang]);
  const passion = p > 0.62;

  return (
    <div className="relative flex h-full flex-col pb-20 text-navy">
      <Folders />
      <div className="relative px-4 pt-14 sm:px-8 sm:pt-16">
        <EraTab n={3} label={P.era[lang]} color="var(--cobalt)" ink="#fff" font="font-mono font-semibold" />
      </div>
      <div className="relative mx-auto my-auto grid w-full max-w-6xl gap-8 px-4 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-[clamp(2rem,5.5vw,4.6rem)] font-medium leading-[1] tracking-[-0.03em]">{P.from[lang]}</p>
          <p
            className="mt-3 font-serif text-[clamp(3.2rem,9vw,7.5rem)] italic leading-[0.9] tracking-[-0.03em] text-cobalt transition-[transform,opacity] duration-700"
            style={{ opacity: passion ? 1 : 0.1, transform: passion ? "none" : "translateY(14px)" }}
          >
            {P.to[lang]}
          </p>
        </div>
        <div className="overflow-hidden rounded-xl bg-[#1b2040] text-[#e6e9f5] shadow-[6px_10px_0_rgba(22,32,74,.25)]">
          <div className="flex h-9 items-center gap-2 border-b border-white/10 px-3" aria-hidden>
            <span className="h-3 w-3 rounded-full bg-current opacity-25" />
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
            <span className="ml-3 font-mono text-[0.8rem] opacity-60">yo.ts</span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-mono text-[clamp(0.95rem,1.6vw,1.15rem)] leading-[1.8]">
            <code>
              <span className="text-[#8a93b8]">{"// "}{lang === "es" ? "lo que quiero" : "what I want"}</span>
              {"\n"}
              <span className="text-pink">const</span> <span className="text-folder">yo</span> = {"{"}
              {"\n  "}
              <span className="text-folder">quiero</span>:{" "}
              <span className={t.struck ? "text-red line-through" : "text-yellow"}>
                &quot;{t.text}
                <span className="inline-block w-[0.55em] animate-pulse bg-[#e6e9f5]/80 align-[-0.15em]">&nbsp;</span>&quot;
              </span>
              ,{"\n"}
              {"};"}
            </code>
          </pre>
        </div>
      </div>
      <Note>{notes.programacion[lang]}</Note>
    </div>
  );
}

function Libros({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter }) => {
    root.current?.querySelectorAll<HTMLElement>("[data-book]").forEach((el, i) => {
      const p = clamp01(enter * 1.8 - i * 0.2);
      el.style.transform = `translateY(${(1 - p) * 110}%)`;
    });
  });
  return (
    <div ref={root} className="relative grid h-full items-center gap-10 px-6 pb-24 pt-20 text-navy lg:grid-cols-[1fr_1.25fr] lg:px-16">
      <div>
        <Soundtrack data={P.soundtrack} lang={lang} className="mb-8" />
        <h2 className="font-mono text-[0.95rem] text-navy/70">{P.booksTitle[lang]}</h2>
        <div className="mt-4 flex h-[30vh] items-end gap-3 overflow-hidden" role="list">
          {P.books.filter((b) => filled(b.title)).map((b, i) => (
            <div
              key={i}
              data-book
              role="listitem"
              className="flex h-full w-20 items-center justify-center rounded-sm shadow-[3px_4px_0_rgba(22,32,74,.25)] sm:w-24"
              style={{ background: b.color, height: `${[100, 86][i % 2]}%` }}
            >
              <p className="whitespace-nowrap text-white [writing-mode:vertical-rl] rotate-180">
                <span className="font-serif text-[1.4rem] italic">{b.title}</span>
                <span className="ml-3 text-[0.85rem] opacity-80">{b.author}</span>
              </p>
            </div>
          ))}
          <div data-book className="h-[70%] w-12 rounded-sm bg-[#d5dbea]" aria-hidden />
          <div data-book className="h-[78%] w-9 rounded-sm bg-[#c4ccdf]" aria-hidden />
        </div>
        <div className="h-3 rounded-sm bg-[#b7a48b]" aria-hidden />
      </div>
      <figure className="hidden sm:block">
        <div className="overflow-hidden rounded-xl border border-navy/15 bg-paper shadow-[6px_10px_0_rgba(22,32,74,.18)]">
          <div className="flex items-center gap-3 border-b border-navy/10 bg-[#e3e7f2] px-3 py-2">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
            </span>
            <span className="flex-1 rounded-md bg-white px-3 py-1 font-mono text-[0.85rem]">{P.firstSite.url}</span>
          </div>
          <div className="aspect-[16/10] max-h-[48vh] w-full">
            {photos[0] ? (
              <Photo src={photos[0]} alt={P.firstSite.label[lang]} folder="programacion" hint={`${ui.photoMissing[lang]}: screenshot`} tint="#c9d4f7" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white font-serif text-[clamp(2rem,4vw,3.4rem)] italic tracking-[-0.02em]">{P.firstSite.url}</div>
            )}
          </div>
        </div>
        <figcaption className="mt-3 font-mono text-[0.95rem]">{P.firstSite.label[lang]}</figcaption>
      </figure>
      <Note>{notes.libros[lang]}</Note>
    </div>
  );
}

function Historia({ lang }: { lang: Locale }) {
  const root = useRef<HTMLParagraphElement>(null);
  usePanel(({ enter, exit }) => {
    if (root.current) root.current.style.transform = `translateX(${(1 - enter) * 30 - exit * 30}vw) rotate(-3deg)`;
  });
  return (
    <div className="relative flex h-full items-center justify-center px-6">
      <p ref={root} className="max-w-[16ch] text-center font-serif text-[clamp(3rem,8.5vw,8rem)] italic leading-[0.95] tracking-[-0.02em] text-paper">
        {P.firstSite.caption[lang]}
      </p>
      <Note className="text-white">{notes.historia[lang]}</Note>
    </div>
  );
}

export default function Programacion({ lang, photos }: { lang: Locale; photos: string[] }) {
  return (
    <>
      <Panel id="programacion" era="programacion" hold={1.6} className="bg-white" label={P.era[lang]}>
        <Editor lang={lang} />
      </Panel>
      <Panel era="programacion" nameStep={NAME_STEPS.programacion} className="bg-white" label={P.booksTitle[lang]}>
        <Libros lang={lang} photos={photos} />
      </Panel>
      <Panel era="programacion" className="bg-cobalt" label={P.firstSite.caption[lang]}>
        <Historia lang={lang} />
      </Panel>
    </>
  );
}

"use client";

import { useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { proyectos as PR, notes, NAME_STEPS } from "@/content/site";
import { projects, type Project } from "@/content/projects";
import EraTab from "../EraTab";
import Soundtrack from "../Soundtrack";
import Panel, { usePanel } from "../Panel";
import Note from "../Note";

const DARK = ["#0D1124", "#2B44FF", "#0E4D33", "#FF3D2E", "#5B6178"];

function Card({ p, lang, photo }: { p: Project; lang: Locale; photo?: string }) {
  const dark = DARK.includes(p.color);
  const inner = (
    <article className="group relative flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md" style={{ background: p.color }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <p aria-hidden className={`absolute inset-0 flex items-end p-4 font-sans text-[clamp(1.6rem,2.4vw,2.3rem)] font-extrabold leading-[0.9] tracking-[-0.03em] [font-variation-settings:'wdth'_80] ${dark ? "text-white" : "text-navy"}`}>
            {p.name}
          </p>
        )}
        <div className="absolute inset-0 flex flex-col justify-end bg-navy/88 p-4 text-white opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
          <h3 className="text-[1.05rem] font-semibold">{p.name}</h3>
          <p className="mt-1 text-[0.95rem] leading-snug">{p.what[lang]}</p>
          <p className="mt-3 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full bg-white/15 px-2 py-0.5 text-[0.75rem]">
                {t}
              </span>
            ))}
          </p>
        </div>
      </div>
      {photo && <p className="shrink-0 px-1 pt-1.5 text-[0.95rem] font-semibold leading-tight">{p.name}</p>}
    </article>
  );
  return p.href ? (
    <a href={p.href} target="_blank" rel="noreferrer" className="block h-full rounded-md" style={{ flex: p.h ?? 2 }}>
      {inner}
    </a>
  ) : (
    <div tabIndex={0} className="h-full rounded-md" style={{ flex: p.h ?? 2 }}>
      {inner}
    </div>
  );
}

function Board({ lang, photos }: { lang: Locale; photos: Record<string, string | undefined> }) {
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter, through, exit }) => {
    root.current?.querySelectorAll<HTMLElement>("[data-col]").forEach((col, i) => {
      const dir = i % 2 ? 1 : -1;
      const t = enter * 0.3 + through * 0.6 + exit * 0.1;
      col.style.transform = `translateY(${dir * (t - 0.5) * 14}vh)`;
    });
  });

  const cols: Project[][] = [];
  projects.forEach((p, i) => {
    const c = Math.floor(i / 2);
    (cols[c] ??= []).push(p);
  });

  return (
    <div ref={root} data-row className="relative flex h-full items-center gap-5 pb-16 pl-4 pr-[12vw] pt-14 sm:pl-8">
      <div className="flex w-[min(78vw,26rem)] shrink-0 flex-col justify-center gap-6 pr-6">
        <EraTab n={4} label={PR.era[lang]} color="var(--red)" ink="#fff" font="font-sans font-extrabold" />
        <p className="font-serif text-[clamp(2.6rem,5vw,4.4rem)] italic leading-[0.95]">{PR.title[lang]}</p>
        <Soundtrack data={PR.soundtrack} lang={lang} />
      </div>
      {cols.map((col, c) => (
        <div key={c} data-col className="flex h-[72vh] w-[min(64vw,17rem)] shrink-0 flex-col gap-5">
          {col.map((p) => (
            <Card key={p.id} p={p} lang={lang} photo={photos[p.id]} />
          ))}
        </div>
      ))}
      <Note>{notes.proyectos[lang]}</Note>
    </div>
  );
}

export default function Proyectos({ lang, photos }: { lang: Locale; photos: Record<string, string | undefined> }) {
  return (
    <Panel id="proyectos" era="proyectos" nameStep={NAME_STEPS.proyectos} wide="auto" className="bg-paper text-navy" label={PR.era[lang]}>
      <Board lang={lang} photos={photos} />
    </Panel>
  );
}

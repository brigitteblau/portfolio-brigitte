"use client";

import { useRef } from "react";
import { filled, filledL, type Locale } from "@/lib/i18n";
import { deportes, notes, NAME_STEPS, ui } from "@/content/site";
import { clamp01 } from "@/lib/track";
import EraTab from "../EraTab";
import Photo from "../Photo";
import Soundtrack from "../Soundtrack";
import Panel, { usePanel, usePanelVideo } from "../Panel";
import Note from "../Note";

function Cancha({ lang, photos }: { lang: Locale; photos: string[] }) {
  const hasNotes = deportes.sports.some((s) => filled(s.name[lang]) && filledL(s.note, lang));
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter }) => {
    const r = root.current;
    if (!r) return;
    r.querySelectorAll<HTMLElement>("[data-row]").forEach((el, i) => {
      const p = clamp01(enter * 2 - 0.6 - i * 0.15);
      el.style.opacity = String(p);
      el.style.transform = `translateX(${(1 - p) * -24}px)`;
    });
    r.querySelectorAll<HTMLElement>("[data-pic]").forEach((el, i) => {
      const p = clamp01(enter * 1.6 - i * 0.12);
      el.style.transform = `translateY(${(1 - p) * 70}px)`;
      el.style.opacity = String(0.2 + p * 0.8);
    });
  });

  return (
    <div ref={root} className="relative flex h-full flex-col px-4 pb-24 pt-14 text-white sm:px-8 sm:pt-16">
      <EraTab n={2} label={deportes.era[lang]} color="var(--yellow)" ink="var(--green)" font="font-sport uppercase tracking-wide" />
      <div className="my-auto grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="bg-paper p-5 text-green sm:p-7">
          <div className="flex items-baseline justify-between border-b-2 border-green pb-3">
            <p className="font-sport text-[2rem] uppercase leading-none sm:text-[2.6rem]">{lang === "es" ? "Tarjeta" : "Scorecard"}</p>
            <p className="font-mono text-[0.8rem] text-navy/60">{lang === "es" ? "jugadora: ●●●●●●●●" : "player: ●●●●●●●●"}</p>
          </div>
          <table className="mt-2 w-full border-collapse text-left">
            <thead>
              <tr className="font-mono text-[0.75rem] text-green/70">
                <th scope="col" className="w-14 py-2 font-normal">{lang === "es" ? "Hoyo" : "Hole"}</th>
                <th scope="col" className="py-2 font-normal">{lang === "es" ? "Deporte" : "Sport"}</th>
                {hasNotes && <th scope="col" className="py-2 font-normal">{lang === "es" ? "Nota" : "Note"}</th>}
              </tr>
            </thead>
            <tbody>
              {deportes.sports.filter((s) => filled(s.name[lang])).map((s, i) => (
                <tr key={i} data-row className="border-t border-green/20 align-top">
                  <td className="py-3 font-sport text-[1.8rem] leading-none">{i + 1}</td>
                  <td className="py-3 font-sport text-[1.5rem] uppercase leading-tight sm:text-[1.8rem]">{s.name[lang]}</td>
                  {hasNotes && <td className="py-3.5 text-[1rem] leading-snug text-navy">{filledL(s.note, lang)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hidden grid-cols-3 gap-3 sm:grid">
          {[0, 1, 2].map((i) => (
            <div key={i} data-pic className="h-[52vh] overflow-hidden" style={{ marginTop: `${[0, 6, 2][i]}vh` }}>
              <Photo src={photos[i + 1] ?? photos[i]} alt={`${deportes.era[lang]} ${i + 1}`} folder="deportes" hint={`${ui.photoMissing[lang]} ${i + 1}`} tint="#1b6b48" />
            </div>
          ))}
        </div>
      </div>
      <Note>{notes.deportes[lang]}</Note>
    </div>
  );
}

function Golf({ lang, photos, video }: { lang: Locale; photos: string[]; video?: string }) {
  const word = useRef<HTMLParagraphElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  usePanelVideo(vid);
  usePanel(({ enter, exit }) => {
    if (word.current) word.current.style.transform = `translateX(${(1 - enter) * 30 - exit * 20}vw)`;
  });
  return (
    <div className="relative grid h-full grid-cols-1 md:grid-cols-[1fr_auto]">
      <div className="relative flex flex-col justify-center overflow-hidden px-6 pb-24 pt-20 text-white md:px-12">
        <p
          ref={word}
          aria-hidden
          className="pointer-events-none whitespace-nowrap font-sport text-[clamp(8rem,30vw,30rem)] uppercase leading-[0.8] text-transparent [-webkit-text-stroke:2px_rgba(247,247,244,.9)]"
        >
          {deportes.golf.title[lang]}
        </p>
        <h2 className="sr-only">{deportes.golf.title[lang]}</h2>
        {filledL(deportes.golf.line, lang) && <p className="mt-6 max-w-[30ch] text-[clamp(1.15rem,2vw,1.5rem)] leading-snug">{deportes.golf.line[lang]}</p>}
        <Soundtrack data={deportes.soundtrack} lang={lang} tone="dark" className="mt-8" />
      </div>
      <div className="absolute inset-y-0 right-0 w-[46vw] opacity-40 md:relative md:w-[min(42vw,56vh)] md:opacity-100">
        {video ? (
          <video ref={vid} src={video} poster={video.replace(/\.\w+$/, ".jpg")} className="h-full w-full object-cover" muted loop playsInline preload="metadata" aria-label={lang === "es" ? "Mi swing" : "My swing"} />
        ) : (
          <Photo src={photos[0]} alt={deportes.golf.title[lang]} folder="deportes" hint={ui.photoMissing[lang]} tint="#1b6b48" />
        )}
      </div>
      <Note className="text-white">{notes.golf[lang]}</Note>
    </div>
  );
}

export default function Deportes({ lang, photos, video }: { lang: Locale; photos: string[]; video?: string }) {
  return (
    <>
      <Panel id="deportes" era="deportes" className="bg-green" label={deportes.era[lang]}>
        <Cancha lang={lang} photos={photos} />
      </Panel>
      <Panel era="deportes" nameStep={NAME_STEPS.deportes} className="bg-[#0a3a26]" label={deportes.golf.title[lang]}>
        <Golf lang={lang} photos={photos} video={video} />
      </Panel>
    </>
  );
}

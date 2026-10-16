"use client";

import { useRef } from "react";
import { filledL, type Locale } from "@/lib/i18n";
import { ahora as A, notes, NAME_STEPS, ui } from "@/content/site";
import { experience } from "@/content/projects";
import { clamp01 } from "@/lib/track";
import Photo from "../Photo";
import Soundtrack from "../Soundtrack";
import Panel, { usePanel, usePanelValue } from "../Panel";
import Note from "../Note";

const COLS = ["A", "B", "C", "D"];

function Pregunta({ lang }: { lang: Locale }) {
  const root = useRef<HTMLHeadingElement>(null);
  usePanel(({ enter }) => {
    root.current?.querySelectorAll<HTMLElement>("span").forEach((w, i) => {
      const p = clamp01(enter * 2.6 - 0.6 - i * 0.08);
      w.style.opacity = String(p);
      w.style.transform = `translateY(${(1 - p) * 40}px)`;
    });
  });
  return (
    <div className="relative flex h-full flex-col justify-center px-6 sm:px-16">
      <h2 ref={root} className="max-w-[15ch] font-serif text-[clamp(3rem,8vw,7.5rem)] italic leading-[0.95] tracking-[-0.02em]">
        {A.question[lang].split(" ").map((w, i) => (
          <span key={i} className="mr-[0.25em] inline-block">
            {w}
          </span>
        ))}
      </h2>
      <Soundtrack data={A.soundtrack} lang={lang} className="mt-10" />
    </div>
  );
}

function Planilla({ lang, photos }: { lang: Locale; photos: string[] }) {
  const last = experience.length - 1;
  const active = usePanelValue((p) => (p.enter < 0.9 ? -1 : Math.min(last, Math.floor(p.hold * (experience.length + 0.5)))), -1);
  const row = active >= 0 ? experience[active] : undefined;
  const isNow = active === last;
  const formula = isNow ? (lang === "es" ? "=AHORA()" : "=NOW()") : row ? row.what[lang] : "";
  const cols = [A.cols.what, A.cols.where, A.cols.role, A.cols.did];

  return (
    <div className="relative flex h-full items-center px-4 pb-20 pt-14 sm:px-10">
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="overflow-hidden rounded-xl border border-navy/15 bg-white shadow-[8px_12px_0_rgba(22,32,74,.18)]">
          <div className="flex items-center gap-3 bg-[#1e6b43] px-3 py-2 text-white">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
              <span className="h-3 w-3 rounded-full bg-current opacity-25" />
            </span>
            <span className="text-[0.85rem] font-semibold">{A.sheetName[lang]}.xlsx</span>
          </div>
          <div className="flex items-center gap-2 border-b border-[#d4d8e0] bg-[#f7f8fb] px-3 py-1.5 font-mono text-[0.9rem]">
            <span className="w-12 rounded border border-[#d4d8e0] bg-white px-1.5 text-center">{row ? `A${active + 2}` : "A1"}</span>
            <span className="italic text-navy/50">fx</span>
            <span className={isNow ? "font-semibold text-[#1e6b43]" : ""} aria-live="polite">
              {formula}
            </span>
          </div>
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left text-[0.98rem]">
              <thead>
                <tr className="bg-[#f0f2f6] text-[0.78rem] text-navy/60" aria-hidden>
                  <th className="w-10 border border-[#d4d8e0]" />
                  {COLS.map((c) => (
                    <th key={c} className="border border-[#d4d8e0] py-1 text-center font-normal">
                      {c}
                    </th>
                  ))}
                </tr>
                <tr>
                  <td className="border border-[#d4d8e0] bg-[#f0f2f6] text-center text-[0.78rem] text-navy/60">1</td>
                  {cols.map((c, i) => (
                    <th key={i} scope="col" className="border border-[#d4d8e0] px-3 py-2 font-semibold">
                      {c[lang]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {experience.map((e, i) => {
                  const shown = i <= active;
                  const sel = i === active;
                  const now = i === last;
                  return (
                    <tr key={i} className="transition-colors duration-300" style={{ background: now && shown ? "#f1ffc4" : undefined }}>
                      <td className={`border border-[#d4d8e0] text-center text-[0.78rem] ${sel ? "bg-[#cfe9da] text-[#1e6b43]" : "bg-[#f0f2f6] text-navy/60"}`}>{i + 2}</td>
                      {[e.what[lang], e.where, e.role[lang], filledL(e.did, lang) ?? ""].map((cell, c) => (
                        <td
                          key={c}
                          className={`border border-[#d4d8e0] px-3 py-2.5 align-top transition-opacity duration-300 ${c === 0 && sel ? "outline outline-[2.5px] -outline-offset-2 outline-[#1e6b43]" : ""} ${now && c === 0 ? "font-semibold" : ""} ${c === 3 ? "text-navy/80" : ""}`}
                          style={{ opacity: shown ? 1 : 0 }}
                        >
                          {c === 1 && e.href ? (
                            <a href={e.href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                              {cell}
                            </a>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {Array.from({ length: 2 }, (_, k) => (
                  <tr key={`e${k}`} aria-hidden>
                    <td className="border border-[#d4d8e0] bg-[#f0f2f6] text-center text-[0.78rem] text-navy/60">{experience.length + 2 + k}</td>
                    {COLS.map((c) => (
                      <td key={c} className="h-9 border border-[#d4d8e0]" />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Celular: cada fila como una celda grande, misma planilla */}
          <ol className="divide-y divide-[#d4d8e0] md:hidden">
            {experience.map((e, i) => {
              const shown = i <= active;
              const now = i === last;
              const did = filledL(e.did, lang);
              return (
                <li
                  key={i}
                  className="grid grid-cols-[2rem_1fr] transition-opacity duration-300"
                  style={{ opacity: shown ? 1 : 0.15, background: now && shown ? "#f1ffc4" : undefined }}
                >
                  <span className={`border-r border-[#d4d8e0] pt-3 text-center text-[0.75rem] ${i === active ? "bg-[#cfe9da] text-[#1e6b43]" : "bg-[#f0f2f6] text-navy/60"}`}>{i + 2}</span>
                  <div className="px-3 py-2.5">
                    <p className="font-semibold leading-tight">{e.what[lang]}</p>
                    <p className="mt-0.5 font-mono text-[0.78rem] text-navy/70">
                      {e.href ? (
                        <a href={e.href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                          {e.where}
                        </a>
                      ) : (
                        e.where
                      )}{" "}
                      · {e.role[lang]}
                    </p>
                    {did && <p className="mt-1 text-[0.92rem] leading-snug">{did}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="flex gap-1 border-t border-[#d4d8e0] bg-[#f0f2f6] px-3 pt-1 text-[0.8rem]">
            <span className="rounded-b bg-white px-3 py-1 font-semibold text-[#1e6b43] shadow-sm">{A.sheetName[lang]}</span>
            <span className="px-3 py-1 text-navy/50">+</span>
          </div>
        </div>

        <div
          className="absolute -bottom-8 -right-4 hidden w-52 transition-all duration-500 md:block"
          style={{ opacity: isNow ? 1 : 0, transform: isNow ? "translateY(0)" : "translateY(30px)" }}
          aria-hidden={!isNow}
        >
          <div className="aspect-[4/5] overflow-hidden rounded-md shadow-[0_24px_50px_-20px_rgba(13,17,36,.55)]">
            <Photo src={photos[0]} alt={lang === "es" ? "Yo, hoy" : "Me, today"} folder="ahora" hint={ui.photoMissing[lang]} tint="var(--yellow)" />
          </div>
        </div>
      </div>
      <Note>{notes.ahora[lang]}</Note>
    </div>
  );
}

export default function Ahora({ lang, photos }: { lang: Locale; photos: string[] }) {
  return (
    <>
      <Panel id="ahora" era="ahora" className="bg-desk" label={A.question[lang]}>
        <Pregunta lang={lang} />
      </Panel>
      <Panel era="ahora" hold={1.5} nameStep={NAME_STEPS.ahora} className="bg-desk" label={A.sheetName[lang]}>
        <Planilla lang={lang} photos={photos} />
      </Panel>
    </>
  );
}

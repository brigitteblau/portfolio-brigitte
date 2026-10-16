"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { filledL, type Locale } from "@/lib/i18n";
import { ahora as A, notes, NAME_STEPS } from "@/content/site";
import { experience } from "@/content/projects";
import { Polaroid, Sparkle, Tag } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COLS = ["A", "B", "C", "D"];
const SHEET = "#1e6b43";

export default function Ahora({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLElement>(null);
  const last = experience.length - 1;
  const [active, setActive] = useState(-1);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.from("[data-q] span", {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-q]", start: "top 80%" },
        });
      }
      // Las filas se van completando mientras bajás por la planilla
      ScrollTrigger.create({
        trigger: "[data-sheet]",
        start: "top 75%",
        end: "bottom 55%",
        onUpdate: (s) => setActive(reduce ? last : Math.min(last, Math.floor(s.progress * (experience.length + 0.4)))),
        onLeave: () => setActive(last),
      });
    },
    { scope: root },
  );

  const row = active >= 0 ? experience[active] : undefined;
  const isNow = active === last;
  const formula = isNow ? (lang === "es" ? "=AHORA()" : "=NOW()") : row ? row.what[lang] : "";
  const cols = [A.cols.what, A.cols.where, A.cols.role, A.cols.did];

  return (
    <section ref={root} id="ahora" className="relative px-3 py-6 sm:px-6" aria-labelledby="ahora-title">
      <NameStep n={NAME_STEPS.ahora} />
      <div className="slide relative mx-auto max-w-[1500px] overflow-hidden px-4 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h2 id="ahora-title" data-q className="max-w-[16ch] text-[clamp(2.6rem,6.5vw,6rem)] font-black leading-[0.92] tracking-[-0.045em]">
            {A.question[lang].split(" ").map((w, i, arr) => (
              <span key={i} className="mr-[0.22em] inline-block" style={{ color: i >= arr.length - 3 ? "var(--blue)" : undefined }}>
                {w}
              </span>
            ))}
          </h2>
          <div className="flex items-center gap-2">
            <Sparkle className="h-9 w-9" />
            <Tag color="var(--orange)">{notes.ahora[lang]}</Tag>
          </div>
        </div>

        <div className="relative mt-10" data-sheet>
          <div className="overflow-hidden rounded-[16px] border-2 border-ink/80 bg-white shadow-[8px_10px_0_rgba(31,33,40,.15)]">
            <div className="flex items-center gap-3 px-3 py-2 text-white" style={{ background: SHEET }}>
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-red" />
                <span className="h-3 w-3 rounded-full bg-yellow" />
                <span className="h-3 w-3 rounded-full bg-[#8bd17c]" />
              </span>
              <span className="text-[0.85rem] font-semibold">{A.sheetName[lang]}.xlsx</span>
            </div>
            <div className="flex items-center gap-2 border-b border-[#d4d8e0] bg-[#f7f8fb] px-3 py-1.5 font-mono text-[0.88rem]">
              <span className="w-12 rounded border border-[#d4d8e0] bg-white px-1.5 text-center">{row ? `A${active + 2}` : "A1"}</span>
              <span className="italic text-ink/50">fx</span>
              <span className={isNow ? "font-semibold" : ""} style={{ color: isNow ? SHEET : undefined }} aria-live="polite">
                {formula}
              </span>
            </div>
            <div className="hidden md:block">
              <table className="w-full border-collapse text-left text-[0.98rem]">
                <thead>
                  <tr className="bg-[#f0f2f6] text-[0.78rem] text-ink/60" aria-hidden>
                    <th className="w-10 border border-[#d4d8e0]" />
                    {COLS.map((c) => (
                      <th key={c} className="border border-[#d4d8e0] py-1 text-center font-normal">
                        {c}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-[#d4d8e0] bg-[#f0f2f6] text-center text-[0.78rem] text-ink/60">1</td>
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
                      <tr key={i} className="transition-colors duration-300" style={{ background: now && shown ? "#fff6c9" : undefined }}>
                        <td className="border border-[#d4d8e0] text-center text-[0.78rem]" style={{ background: sel ? "#cfe9da" : "#f0f2f6", color: sel ? SHEET : "rgba(31,33,40,.6)" }}>
                          {i + 2}
                        </td>
                        {[e.what[lang], e.where, e.role[lang], filledL(e.did, lang) ?? ""].map((cell, c) => (
                          <td
                            key={c}
                            className={`border border-[#d4d8e0] px-3 py-2.5 align-top transition-opacity duration-300 ${now && c === 0 ? "font-semibold" : ""} ${c === 3 ? "text-ink/80" : ""}`}
                            style={{ opacity: shown ? 1 : 0, outline: c === 0 && sel ? `2.5px solid ${SHEET}` : undefined, outlineOffset: -2 }}
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
                      <td className="border border-[#d4d8e0] bg-[#f0f2f6] text-center text-[0.78rem] text-ink/60">{experience.length + 2 + k}</td>
                      {COLS.map((c) => (
                        <td key={c} className="h-9 border border-[#d4d8e0]" />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Celular: cada fila como una celda grande */}
            <ol className="divide-y divide-[#d4d8e0] md:hidden">
              {experience.map((e, i) => {
                const shown = i <= active;
                const now = i === last;
                const did = filledL(e.did, lang);
                return (
                  <li key={i} className="grid grid-cols-[2rem_1fr] transition-opacity duration-300" style={{ opacity: shown ? 1 : 0.15, background: now && shown ? "#fff6c9" : undefined }}>
                    <span className="border-r border-[#d4d8e0] bg-[#f0f2f6] pt-3 text-center text-[0.75rem] text-ink/60">{i + 2}</span>
                    <div className="px-3 py-2.5">
                      <p className="font-semibold leading-tight">{e.what[lang]}</p>
                      <p className="mt-0.5 font-mono text-[0.78rem] text-ink/70">
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
              <span className="rounded-b bg-white px-3 py-1 font-semibold shadow-sm" style={{ color: SHEET }}>
                {A.sheetName[lang]}
              </span>
              <span className="px-3 py-1 text-ink/50">+</span>
            </div>
          </div>

          {photos[0] && (
            <div
              className="absolute -bottom-10 -right-2 hidden w-48 transition-all duration-500 md:block"
              style={{ opacity: isNow ? 1 : 0, transform: isNow ? "translateY(0)" : "translateY(30px)" }}
              aria-hidden={!isNow}
            >
              <Polaroid rotate={6} holder="clip" caption={lang === "es" ? "yo, hoy" : "me, today"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photos[0]} alt={lang === "es" ? "Yo, hoy" : "Me, today"} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </Polaroid>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { deportes, notes, NAME_STEPS, ui } from "@/content/site";
import { clamp01 } from "@/lib/track";
import EraTab from "../EraTab";
import Photo from "../Photo";
import Soundtrack from "../Soundtrack";
import Panel, { usePanel } from "../Panel";
import Note from "../Note";

const beadColors = ["#ff6a2b", "#f592bd", "#ffcc33", "#8ec5f0", "#fbfcff", "#f2363a"];

function Cancha({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter, exit }) => {
    const r = root.current;
    if (!r) return;
    // la pelotita rebota cruzando la pantalla
    const ball = r.querySelector<HTMLElement>("[data-ball]");
    if (ball) {
      const t = clamp01(enter * 0.7 + exit * 0.3);
      const bounce = Math.abs(Math.sin(t * Math.PI * 3)) * (1 - t) * 220;
      ball.style.transform = `translate(${t * 95}vw, ${-bounce}px)`;
    }
    r.querySelectorAll<HTMLElement>("[data-row]").forEach((el, i) => {
      const p = clamp01(enter * 2 - 0.6 - i * 0.15);
      el.style.opacity = String(p);
      el.style.transform = `translateX(${(1 - p) * -30}px)`;
    });
    r.querySelectorAll<HTMLElement>("[data-pic]").forEach((el, i) => {
      const p = clamp01(enter * 1.6 - i * 0.12);
      el.style.transform = `translateY(${(1 - p) * 80}px) rotate(${[3, -4, -2, 5][i] + (1 - p) * 20}deg)`;
    });
  });

  return (
    <div ref={root} className="relative h-full px-4 pb-24 pt-14 text-white sm:px-8 sm:pt-16">
      <div data-ball className="absolute bottom-[30%] left-0 z-10 h-7 w-7 rounded-full shadow-[inset_-4px_-4px_0_rgba(0,0,0,.12)] [background:radial-gradient(circle_at_30%_30%,#fff_0,#e1e5ea_75%)]" aria-hidden />
      <EraTab n={2} label={deportes.era[lang]} color="var(--yellow)" ink="var(--green)" font="font-sport" />
      <div className="mt-6 grid items-center gap-8 lg:mt-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="rotate-[-1.5deg] rounded-md bg-[#fbfcff] p-4 text-green shadow-[6px_8px_0_rgba(0,0,0,.2)] sm:p-6">
          <div className="flex items-baseline justify-between border-b-4 border-green pb-2">
            <p className="font-sport text-[1.6rem] leading-none sm:text-[2.2rem]">{lang === "es" ? "Tarjeta" : "Scorecard"}</p>
            <p className="font-hand text-[1.6rem] leading-none text-navy">{lang === "es" ? "jugadora: ???" : "player: ???"}</p>
          </div>
          <table className="mt-3 w-full border-collapse text-left">
            <thead>
              <tr className="text-[0.85rem] text-green/70">
                <th scope="col" className="w-14 py-2 font-semibold">{lang === "es" ? "Hoyo" : "Hole"}</th>
                <th scope="col" className="py-2 font-semibold">{lang === "es" ? "Deporte" : "Sport"}</th>
                <th scope="col" className="py-2 font-semibold">{lang === "es" ? "Nota" : "Note"}</th>
              </tr>
            </thead>
            <tbody>
              {deportes.sports.map((s, i) => (
                <tr key={i} data-row className="border-t border-green/20 align-top">
                  <td className="py-2.5 font-sport text-[1.7rem] leading-none">{i + 1}</td>
                  <td className="py-2.5 font-sport text-[1.25rem] leading-tight sm:text-[1.55rem]">{s.name[lang]}</td>
                  <td className="py-2.5 font-hand text-[1.45rem] leading-tight text-navy">{s.note[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hidden grid-cols-2 gap-5 sm:grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} data-pic className="overflow-hidden rounded-2xl border-[6px] border-white shadow-[4px_6px_0_rgba(0,0,0,.2)]" style={{ aspectRatio: i % 3 === 0 ? "4/5" : "1" }}>
              <Photo src={photos[i]} alt={`${deportes.era[lang]} ${i + 1}`} folder="deportes" hint={`${ui.photoMissing[lang]} ${i + 1}`} tint="#2e9461" />
            </div>
          ))}
        </div>
      </div>
      <Note>{notes.deportes[lang]}</Note>
    </div>
  );
}

function Pulseras({ lang, photos }: { lang: Locale; photos: string[] }) {
  const ring = useRef<HTMLDivElement>(null);
  usePanel(({ enter, exit }) => {
    if (ring.current) ring.current.style.transform = `rotate(${(enter + exit) * 160 - 80}deg)`;
  });
  const handle = deportes.business.handle.toUpperCase().split("");

  return (
    <div className="relative grid h-full items-center gap-8 px-6 pb-24 pt-20 text-white md:grid-cols-[auto_1fr] md:px-16">
      <div className="relative mx-auto aspect-square w-[min(72vw,46vh,380px)]">
        <div ref={ring} className="absolute inset-0">
          <div className="absolute inset-[8%] rounded-full border-2 border-white/40" aria-hidden />
          {handle.map((ch, i) => {
            const a = (i / handle.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <span
                key={i}
                className="absolute flex h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-sport text-[clamp(.7rem,1.4vw,1rem)] text-navy shadow-[inset_-3px_-3px_0_rgba(0,0,0,.12)]"
                style={{
                  left: `${50 + Math.cos(a) * 42}%`,
                  top: `${50 + Math.sin(a) * 42}%`,
                  background: beadColors[i % beadColors.length],
                  rotate: `${(a * 180) / Math.PI + 90}deg`,
                }}
                aria-hidden
              >
                {ch === "_" ? "·" : ch}
              </span>
            );
          })}
        </div>
        <div className="absolute inset-[24%] overflow-hidden rounded-full border-[6px] border-white">
          <Photo src={photos[4]} alt={deportes.business.title[lang]} folder="deportes" hint={`${ui.photoMissing[lang]} 5`} tint="#f592bd" />
        </div>
      </div>
      <div className="max-w-xl">
        <h2 className="font-sport text-[clamp(3rem,9vw,7rem)] leading-[0.88] text-yellow">{deportes.business.title[lang]}</h2>
        <p className="mt-2 font-mono text-[1.05rem] text-white/80">@{deportes.business.handle}</p>
        <p className="mt-5 max-w-[36ch] text-[1.15rem] leading-relaxed">{deportes.business.body[lang]}</p>
        <Soundtrack data={deportes.soundtrack} lang={lang} className="mt-7" />
      </div>
      <Note>{notes.pulseras[lang]}</Note>
    </div>
  );
}

export default function Deportes({ lang, photos }: { lang: Locale; photos: string[] }) {
  const grass = { backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 80px, transparent 80px 160px)" };
  return (
    <>
      <Panel id="deportes" era="deportes" className="bg-green" style={grass} label={deportes.era[lang]}>
        <Cancha lang={lang} photos={photos} />
      </Panel>
      <Panel era="deportes" nameStep={NAME_STEPS.deportes} className="bg-green" style={grass} label={deportes.business.title[lang]}>
        <Pulseras lang={lang} photos={photos} />
      </Panel>
    </>
  );
}

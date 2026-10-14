"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { nacer, notes, NAME_STEPS, ui } from "@/content/site";
import { clamp01 } from "@/lib/track";
import EraTab from "../EraTab";
import Photo from "../Photo";
import Soundtrack from "../Soundtrack";
import Panel, { usePanel, usePanelValue } from "../Panel";
import Note from "../Note";

const INK = "#4a2a1e";

function timecode(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const f = Math.floor((s % 1) * 30);
  return `0:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

function Camara({ lang, photos, video }: { lang: Locale; photos: string[]; video?: string }) {
  const vid = useRef<HTMLVideoElement>(null);
  const lines = nacer.transcript;
  const [vLine, setVLine] = useState(0);
  const [vTime, setVTime] = useState(0);
  const [muted, setMuted] = useState(true);
  const hold = usePanelValue((p) => Math.round(p.hold * 200) / 200, 0);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const onTime = () => {
      setVTime(v.currentTime);
      let idx = 0;
      lines.forEach((l, i) => {
        if (v.currentTime >= l.at) idx = i;
      });
      setVLine(idx);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [lines]);

  // Sin video, el transcript avanza con el scroll
  const line = video ? vLine : Math.min(lines.length - 1, Math.floor(hold * lines.length * 0.999));
  const time = video ? vTime : hold * 14 + 0.4;

  const toggleSound = () => {
    const v = vid.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) {
      v.currentTime = 0;
      void v.play();
    }
  };

  return (
    <div className="relative flex h-full flex-col px-4 pb-32 pt-14 sm:px-8 sm:pb-36 sm:pt-16" style={{ color: INK }}>
      <EraTab n={1} label={nacer.era[lang]} color="#fbe4c9" ink={INK} font="font-serif italic" />
      <div className="relative flex-1 overflow-hidden rounded-b-xl rounded-tr-xl bg-[#1d1410] shadow-[6px_10px_0_rgba(74,42,30,.25)]">
        {video ? (
          <video ref={vid} src={video} poster={video.replace(/\.\w+$/, ".jpg")} className="absolute inset-0 h-full w-full object-cover object-[50%_25%] [filter:sepia(.35)_saturate(1.2)_contrast(1.05)]" autoPlay muted loop playsInline />
        ) : (
          <div className="absolute inset-0 [filter:sepia(.35)_saturate(1.1)]">
            <Photo src={photos[3] ?? photos[0]} alt={nacer.era[lang]} folder="nacer" hint={nacer.videoHint[lang]} tint="#c98a6a" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.12)_0,rgba(0,0,0,.12)_1px,transparent_1px,transparent_3px)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-0 font-vhs text-[clamp(1.2rem,2.4vw,2.1rem)] leading-none text-white [text-shadow:2px_2px_0_rgba(0,0,0,.5)]">
          <span className="absolute left-4 top-4 sm:left-6 sm:top-5">▶ PLAY</span>
          <span className="absolute right-4 top-4 sm:right-6 sm:top-5">SP</span>
          <span className="absolute right-4 top-11 tabular-nums text-[#ffb347] sm:right-6 sm:top-12">{timecode(time)}</span>
        </div>
        {/* Transcript gigante, como subtítulo */}
        <p
          key={line}
          aria-live="polite"
          className="absolute inset-x-4 bottom-5 max-w-[16ch] animate-[sub_.5s_ease-out] font-serif text-[clamp(2.6rem,7.5vw,7rem)] italic leading-[0.92] tracking-[-0.02em] text-[#fff4e6] [text-shadow:0_3px_18px_rgba(0,0,0,.45)] sm:inset-x-8 sm:bottom-8"
        >
          {lines[line].text[lang]}
        </p>
        {video && (
          <button onClick={toggleSound} className="absolute left-4 top-12 rounded bg-black/60 sm:left-auto sm:right-6 sm:top-auto sm:bottom-8 px-3 py-1.5 font-vhs text-[1.3rem] text-white hover:bg-black/80">
            {muted ? (lang === "es" ? "🔈 con sonido" : "🔈 sound on") : lang === "es" ? "🔇 silenciar" : "🔇 mute"}
          </button>
        )}
      </div>
      <Note>{notes.nacer[lang]}</Note>
    </div>
  );
}

function Album({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter }) => {
    const r = root.current;
    if (!r) return;
    r.querySelectorAll<HTMLElement>("[data-polaroid]").forEach((el, i) => {
      const p = clamp01(enter * 1.5 - i * 0.2);
      el.style.opacity = String(p);
      el.style.translate = `${(1 - p) * 220}px ${(1 - p) * -60}px`;
    });
    r.querySelectorAll<HTMLElement>("[data-note]").forEach((el, i) => {
      const p = clamp01(enter * 1.8 - 0.3 - i * 0.15);
      el.style.opacity = String(p);
      el.style.translate = `${(1 - p) * 40}px 0`;
    });
  });

  return (
    <div ref={root} className="relative grid h-full items-center gap-6 px-6 pb-24 pt-20 md:grid-cols-[1fr_1.15fr] md:px-16" style={{ color: INK }}>
      <ul className="space-y-3 font-hand text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.95]">
        {nacer.margin.map((m, i) => (
          <li key={i} data-note style={{ marginLeft: `${(i % 3) * 1.2}em`, fontSize: i === 3 ? "0.8em" : undefined }}>
            {m[lang]}
          </li>
        ))}
        <li data-note className="pt-5">
          <Soundtrack data={nacer.soundtrack} lang={lang} />
        </li>
      </ul>
      <div className="relative h-[42vh] md:h-[70vh]">
        {[0, 1, 2].map((i) => (
          <figure
            key={i}
            data-polaroid
            className="absolute w-[46%] bg-[#fffaf0] p-2.5 pb-9 shadow-[3px_6px_0_rgba(74,42,30,.2)]"
            style={{ left: `${[2, 46, 22][i]}%`, top: `${[2, 12, 44][i]}%`, rotate: `${[-7, 5, -2][i]}deg` }}
          >
            <div className="aspect-square overflow-hidden [filter:sepia(.3)_saturate(1.15)]">
              <Photo src={photos[i]} alt={`${nacer.era[lang]} ${i + 1}`} folder="nacer" hint={`${ui.photoMissing[lang]} ${i + 1}`} tint="#e0a184" />
            </div>
          </figure>
        ))}
      </div>
      <Note>{notes.nacer2[lang]}</Note>
    </div>
  );
}

export default function Nacer({ lang, photos, video }: { lang: Locale; photos: string[]; video?: string }) {
  const bg = { background: "linear-gradient(90deg, #f4c7b0 0%, #eeb4a6 60%, #e7a7b9 100%)" };
  return (
    <>
      <Panel id="nacer" era="nacer" hold={1.2} className="grain" style={bg} label={nacer.era[lang]}>
        <Camara lang={lang} photos={photos} video={video} />
      </Panel>
      <Panel era="nacer" nameStep={NAME_STEPS.nacer} className="grain" style={{ background: "linear-gradient(90deg, #e7a7b9 0%, #f0b9a9 100%)" }}>
        <Album lang={lang} photos={photos} />
      </Panel>
    </>
  );
}

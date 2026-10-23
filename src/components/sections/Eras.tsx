"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { filled, filledL, type L, type Locale } from "@/lib/i18n";
import { nacer, deportes, programacion as P, statement as ST, notes, extra, NAME_STEPS } from "@/content/site";
import Track from "../Track";
import Panel, { usePanel, usePanelValue } from "../Panel";
import Video from "../Video";
import { Polaroid, Sparkle, Tag } from "../Stickers";

/** La tarjeta crema de cada diapositiva (en celular se apilan una abajo de la otra). */
function Card({ children, className, tone }: { children: React.ReactNode; className?: string; tone?: string }) {
  // Pantalla completa, como el video: sin bordes ni tarjeta, con aire alrededor del contenido
  return (
    <div className="h-full [.reel[data-flat]_&]:h-auto">
      <div
        className={clsx("relative h-full overflow-hidden bg-cream pt-16 [.reel[data-flat]_&]:min-h-[100svh]", className)}
        style={tone ? { background: tone } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

function Label({ n, children, color = "var(--blue)" }: { n: number; children: React.ReactNode; color?: string }) {
  return (
    <p className="flex items-center gap-2 text-[0.8rem] font-extrabold uppercase tracking-[0.12em]">
      <span className="grid h-7 w-7 place-items-center rounded-full text-cream" style={{ background: color }}>
        {n}
      </span>
      {children}
    </p>
  );
}

function Margin({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="absolute bottom-4 left-5 font-hand text-[1.35rem] leading-none text-ink/60 sm:left-8">↳ {children}</p>;
}

/* ───────── Nacer: el video de mi cumpleaños ───────── */
function timecode(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const f = Math.floor((s % 1) * 30);
  return `0:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

function Camara({ lang, video }: { lang: Locale; video?: string }) {
  const vid = useRef<HTMLVideoElement>(null);
  const lines = nacer.transcript.filter((l) => filled(l.text[lang]));
  const [line, setLine] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    const onTime = () => {
      setTime(v.currentTime);
      let idx = 0;
      lines.forEach((l, i) => {
        if (v.currentTime >= l.at) idx = i;
      });
      setLine(idx);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [lines]);

  // Pantalla completa: el video ES la diapositiva
  return (
    <div className="relative h-full overflow-hidden bg-ink [.reel[data-flat]_&]:h-[100svh]">
      {video ? (
        <Video
          ref={vid}
          src={video}
          poster={video.replace(/\.\w+$/, ".jpg")}
          lang={lang}
          label={nacer.era[lang]}
          soundFirst={extra.playWithSound[lang]}
          loop={false}
          className="absolute inset-0"
          videoClassName="object-[50%_25%] [filter:sepia(.2)_saturate(1.15)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.1)_0,rgba(0,0,0,.1)_1px,transparent_1px,transparent_3px)]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" aria-hidden />
          <div className="pointer-events-none absolute inset-0 font-vhs text-[clamp(1.2rem,2.2vw,2rem)] leading-none text-white [text-shadow:2px_2px_0_rgba(0,0,0,.5)]" aria-hidden>
            <span className="absolute left-5 top-16 sm:left-8 sm:top-20">● REC</span>
            <span className="absolute right-5 top-16 tabular-nums text-[#ffb347] sm:right-8 sm:top-20">{timecode(time)}</span>
          </div>
          <p
            key={line}
            aria-live="polite"
            className="pointer-events-none absolute inset-x-5 bottom-20 max-w-[14ch] animate-[sub_.5s_ease-out] font-serif text-[clamp(2.6rem,7vw,7rem)] italic leading-[0.92] tracking-[-0.02em] text-[#fff4e6] [text-shadow:0_3px_18px_rgba(0,0,0,.5)] sm:inset-x-10 sm:bottom-24"
          >
            {lines[line]?.text[lang]}
          </p>
          <ul className="pointer-events-none absolute bottom-24 right-6 hidden space-y-0.5 text-right font-hand text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[1] text-cream [text-shadow:0_2px_10px_rgba(0,0,0,.6)] md:block">
            {nacer.margin.map((m, i) => (
              <li key={i} style={{ color: i === 1 ? "#ffc1e3" : undefined }}>
                {m[lang]}
              </li>
            ))}
          </ul>
        </Video>
      ) : (
        <div className="absolute inset-0 bg-blue-soft" />
      )}
    </div>
  );
}

/* ───────── Deportes ───────── */
function Deportes({ lang, photos, video }: { lang: Locale; photos: string[]; video?: string }) {
  const list = deportes.sports.filter((s) => filled(s.name[lang]));
  return (
    <Card className="grid gap-8 px-6 pb-12 sm:px-16 md:grid-cols-[1fr_auto] md:items-center lg:px-24">
      <div>
        <Label n={2} color="var(--green)">{deportes.era[lang]}</Label>
        <h3
          className="mt-3 pb-[0.05em] pr-[0.08em] text-[clamp(4.5rem,13vw,12rem)] font-black italic leading-[0.85] tracking-[-0.06em]"
          style={{ background: "linear-gradient(180deg,#3b9a5e 35%,#9fd3ad 80%,#e3f3e7)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          {deportes.golf.title[lang]}
        </h3>
        {filledL(deportes.golf.line, lang) && <p className="mt-2 max-w-[30ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-snug">{deportes.golf.line[lang]}</p>}
        <ul className="mt-5 flex flex-wrap gap-3">
          {list.map((s, i) => (
            <li key={i}>
              <Tag color={["var(--green)", "var(--blue)", "var(--orange)"][i % 3]} rotate={[-4, 3, -2][i % 3]}>
                {s.name[lang]}
                {filledL(s.note, lang) ? ` · ${s.note[lang]}` : ""}
              </Tag>
            </li>
          ))}
        </ul>
        <div className="mt-6 hidden gap-3 sm:flex">
          {photos.slice(0, 3).map((src, i) => (
            <Polaroid key={src} rotate={[-4, 3, -2][i]} className="w-[min(9rem,22%)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${deportes.era[lang]} ${i + 1}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
            </Polaroid>
          ))}
        </div>
      </div>
      <div className="relative mx-auto aspect-[9/14] w-[min(78vw,46svh,22rem)] overflow-hidden rounded-[18px] shadow-[0_20px_40px_-20px_rgba(31,33,40,.6)]">
        {video ? (
          <Video src={video} poster={video.replace(/\.\w+$/, ".jpg")} lang={lang} label={lang === "es" ? "Mi swing de golf" : "My golf swing"} className="absolute inset-0" />
        ) : photos[3] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photos[3]} alt={deportes.golf.title[lang]} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <Margin>{notes.golf[lang]}</Margin>
    </Card>
  );
}

/* ───────── Programación ───────── */
const TONE = { blue: "var(--blue)", pink: "var(--pink)", yellow: "var(--yellow)", "": undefined } as const;

function typed(p: number, wrong: string, right: string) {
  if (p < 0.3) return { text: wrong.slice(0, Math.round((p / 0.3) * wrong.length)), struck: false };
  if (p < 0.45) return { text: wrong, struck: p > 0.37 };
  if (p < 0.58) return { text: wrong.slice(0, Math.round((1 - (p - 0.45) / 0.13) * wrong.length)), struck: true };
  return { text: right.slice(0, Math.round(Math.min(1, (p - 0.58) / 0.32) * right.length)), struck: false };
}

function Editor({ lang }: { lang: Locale }) {
  const p = usePanelValue((v) => Math.round(v.hold * 300) / 300, 0);
  const t = typed(p, P.typedWrong[lang], P.typedRight[lang]);
  const passion = p > 0.62;
  return (
    <Card className="grid content-center gap-10 px-6 pb-12 sm:px-16 lg:grid-cols-2 lg:items-center lg:px-24">
      <div>
        <Label n={3}>{P.era[lang]}</Label>
        <p className="mt-6 font-mono text-[clamp(1.8rem,4.5vw,4rem)] font-medium leading-[1] tracking-[-0.03em]">{P.from[lang]}</p>
        <p
          className="mt-2 font-serif text-[clamp(3rem,8vw,7rem)] italic leading-[0.9] tracking-[-0.03em] text-pink transition-[transform,opacity] duration-700"
          style={{ opacity: passion ? 1 : 0.12, transform: passion ? "none" : "translateY(14px)" }}
        >
          {P.to[lang]}
        </p>
      </div>
      <div className="overflow-hidden rounded-[16px] bg-ink text-[#e6e9f5] shadow-[0_20px_40px_-20px_rgba(31,33,40,.7)]">
        <div className="flex h-9 items-center gap-2 border-b border-white/10 px-3" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-red" />
          <span className="h-3 w-3 rounded-full bg-yellow" />
          <span className="h-3 w-3 rounded-full bg-green" />
          <span className="ml-3 font-mono text-[0.8rem] opacity-60">yo.ts</span>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-mono text-[clamp(0.95rem,1.5vw,1.15rem)] leading-[1.8]">
          <code>
            <span className="text-[#8a93b8]">{"// "}{lang === "es" ? "lo que quiero" : "what I want"}</span>
            {"\n"}
            <span className="text-pink">const</span> <span className="text-blue-soft">yo</span> = {"{"}
            {"\n  "}
            <span className="text-blue-soft">quiero</span>:{" "}
            <span className={t.struck ? "text-red line-through" : "text-yellow"}>
              &quot;{t.text}
              <span className="inline-block w-[0.55em] animate-pulse bg-[#e6e9f5]/80 align-[-0.15em]">&nbsp;</span>&quot;
            </span>
            ,{"\n"}
            {"};"}
          </code>
        </pre>
      </div>
      <p className="text-[clamp(1.6rem,3.6vw,3.4rem)] font-black leading-[1] tracking-[-0.04em] transition-opacity duration-700 lg:col-span-2" style={{ opacity: passion ? 1 : 0 }}>
        {ST.parts[lang].map(([text, color], i) => (
          <span key={i} style={{ color: TONE[color] }}>
            {text}
          </span>
        ))}
      </p>
    </Card>
  );
}

const tl = (t: string | L, lang: Locale) => (typeof t === "string" ? t : t[lang]);

function Libros({ lang, photos, covers }: { lang: Locale; photos: string[]; covers: Record<string, string | undefined> }) {
  const books = P.books.filter((b) => filled(tl(b.title, lang)));
  return (
    <Card className="flex flex-col justify-center gap-10 px-6 pb-12 sm:px-16 lg:px-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label n={4} color="var(--pink)">{P.booksTitle[lang]}</Label>
          <p className="mt-3 max-w-[22ch] font-serif text-[clamp(1.8rem,3.4vw,3rem)] italic leading-[1]">
            {lang === "es" ? "lo que leí mientras cambiaba" : "what I read while I was changing"}
          </p>
        </div>
        <figure className="flex items-center gap-3">
          <span className="rounded-full bg-sky px-3 py-1 font-mono text-[0.85rem]">{P.firstSite.url}</span>
          <figcaption className="font-hand text-[1.35rem] leading-none">← {P.firstSite.label[lang]}</figcaption>
        </figure>
      </div>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {books.map((b, i) => {
          const cover = covers[b.id];
          const why = filledL(b.why, lang);
          return (
            <li key={b.id} className="flex flex-col items-center text-center">
              <div
                className="relative aspect-[2/3] w-full max-w-[11rem] overflow-hidden rounded-r-[8px] rounded-l-[3px] shadow-[-5px_0_0_rgba(0,0,0,.18)_inset,0_18px_30px_-16px_rgba(31,33,40,.7)]"
                style={{ background: b.color, rotate: `${[-3, 2, -1.5, 3][i % 4]}deg` }}
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col justify-between p-3 text-left" style={{ color: b.color === "#f6c744" ? "var(--ink)" : "var(--cream)" }}>
                    <p className="font-serif text-[clamp(1.1rem,1.8vw,1.5rem)] italic leading-[1.02]">{tl(b.title, lang)}</p>
                    <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] opacity-85">{b.author}</p>
                  </div>
                )}
              </div>
              <p className="mt-3 text-[0.95rem] font-bold leading-tight">{tl(b.title, lang)}</p>
              <p className="text-[0.82rem] text-ink/60">{b.author}</p>
              {why && <p className="mt-1 font-hand text-[1.2rem] leading-none text-pink">{why}</p>}
            </li>
          );
        })}
      </ul>
      {photos[0] && <span className="sr-only">{P.firstSite.label[lang]}</span>}
    </Card>
  );
}

function Historia({ lang }: { lang: Locale }) {
  const root = useRef<HTMLParagraphElement>(null);
  usePanel(({ enter, exit }) => {
    if (root.current) root.current.style.transform = `translateX(${(1 - enter) * 25 - exit * 25}vw) rotate(-3deg)`;
  });
  return (
    <Card className="flex items-center justify-center px-6 pb-12" tone="var(--pink)">
      <p ref={root} className="max-w-[16ch] text-center font-serif text-[clamp(3rem,8vw,7.5rem)] italic leading-[0.95] tracking-[-0.02em] text-cream">
        {P.firstSite.caption[lang]}
      </p>
      <Sparkle className="absolute left-[10%] top-[16%] h-12 w-12" />
      <Sparkle className="absolute bottom-[18%] right-[12%] h-8 w-8" color="var(--pink)" />
    </Card>
  );
}

export default function Eras({
  lang,
  photos,
  video,
  golf,
  covers,
}: {
  lang: Locale;
  photos: { nacer: string[]; deportes: string[]; programacion: string[] };
  video?: string;
  golf?: string;
  covers: Record<string, string | undefined>;
}) {
  return (
    <Track lang={lang} id="historia">
      <Panel id="nacer" era="nacer" label={nacer.era[lang]} nameStep={NAME_STEPS.nacer}>
        <Camara lang={lang} video={video} />
      </Panel>
      <Panel id="deportes" era="deportes" nameStep={NAME_STEPS.deportes} label={deportes.era[lang]}>
        <Deportes lang={lang} photos={photos.deportes} video={golf} />
      </Panel>
      <Panel id="programacion" era="programacion" hold={1.1} label={P.era[lang]}>
        <Editor lang={lang} />
      </Panel>
      <Panel era="programacion" nameStep={NAME_STEPS.programacion} label={P.booksTitle[lang]}>
        <Libros lang={lang} photos={photos.programacion} covers={covers} />
      </Panel>
      <Panel era="programacion" label={P.firstSite.caption[lang]}>
        <Historia lang={lang} />
      </Panel>
    </Track>
  );
}

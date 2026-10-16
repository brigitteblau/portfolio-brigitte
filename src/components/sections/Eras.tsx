"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { filled, filledL, type Locale } from "@/lib/i18n";
import { nacer, deportes, programacion as P, statement as ST, notes, NAME_STEPS } from "@/content/site";
import { clamp01 } from "@/lib/track";
import Track from "../Track";
import Panel, { usePanel, usePanelValue } from "../Panel";
import Video from "../Video";
import { Doodle, Pin, Polaroid, Sparkle, Sticky, Tag } from "../Stickers";

/** La tarjeta crema de cada diapositiva (en celular se apilan una abajo de la otra). */
function Card({ children, className, tone }: { children: React.ReactNode; className?: string; tone?: string }) {
  return (
    <div className="h-full px-3 pb-12 pt-14 sm:px-5 sm:pt-16 [.reel[data-flat]_&]:h-auto [.reel[data-flat]_&]:py-0">
      <div className={clsx("slide relative h-full overflow-hidden", className)} style={tone ? { background: tone } : undefined}>
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

  return (
    <Card className="grid gap-5 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.42fr)] md:p-8">
      <div className="relative min-h-[52svh] overflow-hidden rounded-[18px] md:min-h-0">
        {video ? (
          <Video ref={vid} src={video} poster={video.replace(/\.\w+$/, ".jpg")} lang={lang} label={nacer.era[lang]} className="absolute inset-0" videoClassName="object-[50%_25%] [filter:sepia(.25)_saturate(1.15)]">
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.1)_0,rgba(0,0,0,.1)_1px,transparent_1px,transparent_3px)]" aria-hidden />
            <div className="pointer-events-none absolute inset-0 font-vhs text-[clamp(1.2rem,2.2vw,2rem)] leading-none text-white [text-shadow:2px_2px_0_rgba(0,0,0,.5)]" aria-hidden>
              <span className="absolute left-4 top-4">● REC</span>
              <span className="absolute right-4 top-4 tabular-nums text-[#ffb347]">{timecode(time)}</span>
            </div>
            <p
              key={line}
              aria-live="polite"
              className="pointer-events-none absolute inset-x-4 bottom-16 max-w-[16ch] animate-[sub_.5s_ease-out] font-serif text-[clamp(2.2rem,5.5vw,5.5rem)] italic leading-[0.92] tracking-[-0.02em] text-[#fff4e6] [text-shadow:0_3px_18px_rgba(0,0,0,.5)] sm:inset-x-6"
            >
              {lines[line]?.text[lang]}
            </p>
          </Video>
        ) : (
          <div className="absolute inset-0 bg-blue-soft" />
        )}
      </div>
      <div className="relative flex flex-col justify-between gap-6 pb-8">
        <div>
          <Label n={1} color="var(--pink)">{nacer.era[lang]}</Label>
          <ul className="mt-6 space-y-1 font-hand text-[clamp(2rem,3.2vw,3rem)] leading-[1]">
            {nacer.margin.map((m, i) => (
              <li key={i} style={{ marginLeft: `${(i % 3) * 0.6}em`, color: i === 1 ? "var(--pink)" : undefined }}>
                {m[lang]}
              </li>
            ))}
          </ul>
        </div>
        <Doodle kind="arrow" className="hidden w-24 -scale-x-100 md:block" />
        <Margin>{notes.nacer[lang]}</Margin>
      </div>
    </Card>
  );
}

function Album({ lang, photos }: { lang: Locale; photos: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter }) => {
    root.current?.querySelectorAll<HTMLElement>("[data-pol]").forEach((el, i) => {
      const p = clamp01(enter * 1.5 - i * 0.18);
      el.style.opacity = String(p);
      el.style.translate = `${(1 - p) * 200}px ${(1 - p) * -50}px`;
    });
  });
  const pics = photos.slice(0, 3);
  return (
    <Card className="flex flex-col p-5 sm:p-8">
      <div className="flex items-center justify-between">
        <Tag color="var(--yellow)" rotate={-4} className="!text-ink">
          {lang === "es" ? "el álbum" : "the album"}
        </Tag>
        <Sparkle className="h-8 w-8" color="var(--pink)" />
      </div>
      <div ref={root} className="relative mt-4 min-h-[420px] flex-1">
        {pics.map((src, i) => (
          <div key={src} data-pol className="absolute w-[min(44%,330px)]" style={{ left: `${[4, 34, 62][i]}%`, top: `${[6, 26, 4][i]}%` }}>
            <Polaroid rotate={[-6, 4, -3][i]} holder="pin">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${nacer.era[lang]} ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover [filter:sepia(.2)_saturate(1.1)]" />
            </Polaroid>
          </div>
        ))}
      </div>
      <Margin>{notes.nacer2[lang]}</Margin>
    </Card>
  );
}

/* ───────── Deportes ───────── */
function Cancha({ lang, photos }: { lang: Locale; photos: string[] }) {
  const list = deportes.sports.filter((s) => filled(s.name[lang]));
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter }) => {
    root.current?.querySelectorAll<HTMLElement>("[data-row]").forEach((el, i) => {
      const p = clamp01(enter * 2 - 0.6 - i * 0.15);
      el.style.opacity = String(p);
      el.style.transform = `translateX(${(1 - p) * -24}px)`;
    });
  });
  return (
    <Card className="grid gap-8 p-5 sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
      <div ref={root}>
        <Label n={2} color="var(--green)">{deportes.era[lang]}</Label>
        <h3 className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-black italic leading-[0.85] tracking-[-0.05em] text-green">
          {lang === "es" ? "a jugar." : "game on."}
        </h3>
        <ul className="mt-6 space-y-3">
          {list.map((s, i) => (
            <li key={i} data-row className="flex items-baseline gap-4 border-b-2 border-ink/80 pb-2">
              <span className="font-hand text-[1.6rem] leading-none text-green">{i + 1}.</span>
              <span className="text-[clamp(1.4rem,2.4vw,2rem)] font-bold leading-none">{s.name[lang]}</span>
              {filledL(s.note, lang) && <span className="text-[0.95rem] text-ink/70">{s.note[lang]}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative grid grid-cols-3 gap-3">
        {photos.slice(0, 3).map((src, i) => (
          <Polaroid key={src} rotate={[-4, 3, -2][i]} holder={i === 1 ? "clip" : "none"} className={i === 1 ? "mt-8" : ""}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${deportes.era[lang]} ${i + 1}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
          </Polaroid>
        ))}
      </div>
      <Margin>{notes.deportes[lang]}</Margin>
    </Card>
  );
}

function Golf({ lang, photos, video }: { lang: Locale; photos: string[]; video?: string }) {
  return (
    <Card className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
      <div className="relative">
        <p
          className="pb-[0.05em] pr-[0.08em] text-[clamp(6rem,18vw,17rem)] font-black italic leading-[0.85] tracking-[-0.06em]"
          style={{ background: "linear-gradient(180deg,#3b9a5e 35%,#9fd3ad 80%,#e3f3e7)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          {deportes.golf.title[lang]}
        </p>
        {filledL(deportes.golf.line, lang) && <p className="mt-6 max-w-[30ch] text-[clamp(1.1rem,1.8vw,1.4rem)] leading-snug">{deportes.golf.line[lang]}</p>}
        <div className="mt-6 flex items-center gap-3">
          <Tag>{lang === "es" ? "mi swing" : "my swing"}</Tag>
          <Doodle kind="arrow" className="w-20" />
        </div>
      </div>
      <div className="relative mx-auto aspect-[9/14] w-[min(78vw,44svh,24rem)] overflow-hidden rounded-[18px] shadow-[0_20px_40px_-20px_rgba(31,33,40,.6)]">
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
    <Card className="grid content-center gap-8 p-5 sm:p-10 lg:grid-cols-2 lg:items-center">
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
      <Margin>{notes.programacion[lang]}</Margin>
    </Card>
  );
}

const TONE = { blue: "var(--blue)", pink: "var(--pink)", yellow: "var(--yellow)", "": undefined } as const;

function Statement({ lang }: { lang: Locale }) {
  const root = useRef<HTMLParagraphElement>(null);
  usePanel(({ enter }) => {
    root.current?.querySelectorAll<HTMLElement>("[data-w]").forEach((w, i) => {
      const p = clamp01(enter * 2.4 - 0.6 - i * 0.06);
      w.style.opacity = String(0.08 + p * 0.92);
      w.style.transform = `translateY(${(1 - p) * 30}px)`;
    });
  });
  // Partimos cada tramo en palabras para animarlas una por una
  const words = ST.parts[lang].flatMap(([text, color]) =>
    text
      .split(/(\s+)/)
      .filter((w) => w.trim())
      .map((w) => ({ w, color })),
  );
  return (
    <Card className="flex flex-col justify-center p-6 sm:p-14">
      <div className="mb-6 flex items-center gap-2">
        <Sparkle className="h-9 w-9" />
        <Tag>{ST.tag[lang]}</Tag>
      </div>
      <p ref={root} className="max-w-[18ch] text-[clamp(2.6rem,7vw,7.5rem)] font-black leading-[0.95] tracking-[-0.045em]">
        {words.map(({ w, color }, i) => (
          <span key={i} data-w className="mr-[0.22em] inline-block" style={{ color: TONE[color] }}>
            {w}
          </span>
        ))}
      </p>
      <Doodle kind="wave" className="absolute bottom-10 right-10 hidden w-36 md:block" />
    </Card>
  );
}

function Libros({ lang, photos }: { lang: Locale; photos: string[] }) {
  const books = P.books.filter((b) => filled(b.title));
  return (
    <Card className="grid content-center gap-10 p-5 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="relative">
        <Sticky color="#f8d66a" rotate={-3} className="max-w-[18rem]">
          {P.booksTitle[lang]}
        </Sticky>
        <div className="mt-8 flex h-[34svh] min-h-[220px] items-end gap-3" role="list">
          {books.map((b, i) => (
            <div key={i} role="listitem" className="flex h-full w-20 items-center justify-center rounded-[6px] shadow-[4px_6px_0_rgba(31,33,40,.2)] sm:w-24" style={{ background: b.color }}>
              <p className="rotate-180 whitespace-nowrap text-cream [writing-mode:vertical-rl]">
                <span className="font-serif text-[1.4rem] italic">{b.title}</span>
                <span className="ml-3 text-[0.85rem] opacity-80">{b.author}</span>
              </p>
            </div>
          ))}
          <div className="h-[70%] w-10 rounded-[6px] bg-pink/70" aria-hidden />
          <div className="h-[82%] w-8 rounded-[6px] bg-yellow/80" aria-hidden />
          <div className="h-[60%] w-12 rounded-[6px] bg-blue-soft" aria-hidden />
        </div>
        <div className="h-3 rounded-full bg-beige" aria-hidden />
      </div>
      <figure className="relative">
        <Pin className="absolute -top-2 left-1/2 z-10 h-6 w-6 -translate-x-1/2" />
        <div className="overflow-hidden rounded-[16px] bg-white shadow-[0_20px_40px_-22px_rgba(31,33,40,.6)]">
          <div className="flex items-center gap-3 bg-sky px-3 py-2">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-red" />
              <span className="h-3 w-3 rounded-full bg-yellow" />
              <span className="h-3 w-3 rounded-full bg-green" />
            </span>
            <span className="flex-1 rounded-full bg-white px-3 py-1 font-mono text-[0.85rem]">{P.firstSite.url}</span>
          </div>
          <div className="aspect-[16/10] max-h-[44svh] w-full">
            {photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[0]} alt={P.firstSite.label[lang]} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cream font-serif text-[clamp(2rem,4vw,3.4rem)] italic tracking-[-0.02em]">{P.firstSite.url}</div>
            )}
          </div>
        </div>
        <figcaption className="mt-3 font-hand text-[1.6rem] leading-none">{P.firstSite.label[lang]} ↑</figcaption>
      </figure>
      <Margin>{notes.libros[lang]}</Margin>
    </Card>
  );
}

function Historia({ lang }: { lang: Locale }) {
  const root = useRef<HTMLParagraphElement>(null);
  usePanel(({ enter, exit }) => {
    if (root.current) root.current.style.transform = `translateX(${(1 - enter) * 25 - exit * 25}vw) rotate(-3deg)`;
  });
  return (
    <Card className="flex items-center justify-center p-6" tone="var(--blue)">
      <p ref={root} className="max-w-[16ch] text-center font-serif text-[clamp(3rem,8vw,7.5rem)] italic leading-[0.95] tracking-[-0.02em] text-cream">
        {P.firstSite.caption[lang]}
      </p>
      <Sparkle className="absolute left-[10%] top-[16%] h-12 w-12" />
      <Sparkle className="absolute bottom-[18%] right-[12%] h-8 w-8" color="var(--pink)" />
    </Card>
  );
}

export default function Eras({ lang, photos, video, golf }: { lang: Locale; photos: { nacer: string[]; deportes: string[]; programacion: string[] }; video?: string; golf?: string }) {
  return (
    <Track lang={lang} id="historia">
      <Panel id="nacer" era="nacer" label={nacer.era[lang]} nameStep={1}>
        <Camara lang={lang} video={video} />
      </Panel>
      <Panel era="nacer" nameStep={NAME_STEPS.nacer} label={notes.nacer2[lang]}>
        <Album lang={lang} photos={photos.nacer} />
      </Panel>
      <Panel id="deportes" era="deportes" label={deportes.era[lang]}>
        <Cancha lang={lang} photos={photos.deportes} />
      </Panel>
      <Panel era="deportes" nameStep={NAME_STEPS.deportes} label={deportes.golf.title[lang]}>
        <Golf lang={lang} photos={photos.deportes} video={golf} />
      </Panel>
      <Panel id="programacion" era="programacion" hold={1.2} label={P.era[lang]}>
        <Editor lang={lang} />
      </Panel>
      <Panel era="programacion" label={ST.tag[lang]}>
        <Statement lang={lang} />
      </Panel>
      <Panel era="programacion" nameStep={NAME_STEPS.programacion} label={P.booksTitle[lang]}>
        <Libros lang={lang} photos={photos.programacion} />
      </Panel>
      <Panel era="programacion" label={P.firstSite.caption[lang]}>
        <Historia lang={lang} />
      </Panel>
    </Track>
  );
}

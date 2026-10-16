"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { filledL, type Locale } from "@/lib/i18n";
import { proyectos as PR, NAME_STEPS } from "@/content/site";
import { featured, projects, statusLabel, type Featured, type Project, type Status } from "@/content/projects";
import { Doodle, Pin, Sparkle, Tag } from "../Stickers";
import { NameStep } from "../NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATUS_COLOR: Record<Status, string> = {
  dev: "var(--blue)",
  mvp: "var(--green)",
  prototype: "var(--orange)",
  idea: "var(--pink)",
  proposal: "var(--yellow)",
  exploring: "#8a6be0",
};

function StatusTag({ status, lang, rotate = -4 }: { status?: Status; lang: Locale; rotate?: number }) {
  if (!status) return null;
  return (
    <Tag color={STATUS_COLOR[status]} rotate={rotate} className={status === "proposal" ? "!text-ink !text-[1.25rem]" : "!text-[1.25rem]"}>
      {statusLabel[status][lang]}
    </Tag>
  );
}

function Caso({ f, lang, photo, i }: { f: Featured; lang: Locale; photo?: string; i: number }) {
  const L = PR.labels;
  const blocks = [
    { label: L.did, text: filledL(f.did, lang) },
    { label: L.challenge, text: filledL(f.challenge, lang) },
    { label: L.now, text: filledL(f.now, lang) },
  ].filter((b) => b.text);
  const flip = i % 2 === 1;

  return (
    <article data-case className="slide relative grid gap-8 overflow-hidden p-5 sm:p-10 md:grid-cols-2 md:gap-12">
      <div className={flip ? "md:order-2" : ""}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]" style={{ background: f.color }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden className="absolute inset-0 flex items-end p-6 text-[clamp(4rem,10vw,9rem)] font-black italic leading-[0.8] tracking-[-0.06em] text-cream/95">
              {f.name}
            </span>
          )}
          <span className="absolute left-4 top-4 font-hand text-[2.4rem] leading-none text-cream/90" aria-hidden>
            0{i + 1}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StatusTag status={f.status} lang={lang} />
          {filledL(f.context, lang) && <span className="text-[0.9rem] text-ink/70">{f.context![lang]}</span>}
        </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-[clamp(2.6rem,5.5vw,5rem)] font-black leading-[0.9] tracking-[-0.045em]">{f.name}</h3>
        <p className="mt-3 max-w-[42ch] text-[clamp(1.1rem,1.5vw,1.3rem)] font-medium leading-snug">{f.what[lang]}</p>
        <div className="mt-6 space-y-5">
          {blocks.map((b) => (
            <section key={b.label.es} className="border-t-2 border-ink/80 pt-2">
              <h4 className="text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-ink/70">{b.label[lang]}:</h4>
              <p className="mt-1.5 max-w-[60ch] text-[1rem] leading-relaxed">{b.text}</p>
            </section>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
            {f.stack.map((t) => (
              <li key={t} className="rounded-full bg-sky px-2.5 py-1 font-mono text-[0.75rem]">
                {t}
              </li>
            ))}
          </ul>
          {f.repo && (
            <a href={f.repo} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-4 py-2 text-[0.92rem] font-semibold text-cream hover:bg-blue">
              {L.code[lang]} ↗
            </a>
          )}
          {f.href && (
            <a href={f.href} target="_blank" rel="noreferrer" className="rounded-full bg-pink px-4 py-2 text-[0.92rem] font-semibold text-cream hover:bg-blue">
              {L.visit[lang]} ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

const DARK = ["#0D1124", "#2B44FF", "#0E4D33", "#FF3D2E", "#5B6178"];

function Card({ p, lang, photo, i }: { p: Project; lang: Locale; photo?: string; i: number }) {
  const dark = DARK.includes(p.color);
  const body = (
    <div className="relative bg-white p-2.5 pb-4 shadow-[0_14px_28px_-14px_rgba(31,33,40,.55)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0" style={{ rotate: `${[-2, 1.5, -1, 2.5, -2.5, 1][i % 6]}deg` }}>
      <Pin className="absolute -top-2 left-1/2 z-10 h-5 w-5 -translate-x-1/2" color={["var(--red)", "var(--blue)", "var(--green)", "var(--yellow)"][i % 4]} />
      <div className="relative overflow-hidden" style={{ background: p.color, aspectRatio: p.h === 3 ? "3/4" : p.h === 1 ? "4/3" : "1/1" }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <p aria-hidden className={`absolute inset-0 flex items-end p-4 text-[clamp(1.8rem,2.6vw,2.6rem)] font-black italic leading-[0.9] tracking-[-0.04em] ${dark ? "text-cream" : "text-ink"}`}>
            {p.name}
          </p>
        )}
      </div>
      <div className="px-1 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[1.15rem] font-bold leading-tight">{p.name}</h3>
          {p.status && (
            <span className="shrink-0 rounded-full px-2 py-0.5 text-[0.72rem] font-semibold text-cream" style={{ background: STATUS_COLOR[p.status], color: p.status === "proposal" ? "var(--ink)" : undefined }}>
              {statusLabel[p.status][lang]}
            </span>
          )}
        </div>
        <p className="mt-1 text-[0.95rem] leading-snug text-ink/80">{p.what[lang]}</p>
        <p className="mt-2 flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full bg-sky px-2 py-0.5 font-mono text-[0.7rem]">
              {t}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
  return (
    <li data-card className="group mb-7 inline-block w-full">
      {p.href ? (
        <a href={p.href} target="_blank" rel="noreferrer" className="block">
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

export default function Proyectos({ lang, photos }: { lang: Locale; photos: Record<string, string | undefined> }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-case]").forEach((el) => {
        gsap.from(el, { y: 60, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      });
      ScrollTrigger.batch("[data-card]", {
        start: "top 92%",
        onEnter: (els) => gsap.from(els, { y: 50, opacity: 0, scale: 0.9, stagger: 0.08, duration: 0.6, ease: "back.out(1.5)" }),
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="proyectos" className="relative px-3 py-6 sm:px-6" aria-labelledby="proyectos-title">
      <NameStep n={NAME_STEPS.proyectos} />
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="slide relative flex flex-wrap items-end justify-between gap-4 overflow-hidden px-5 py-8 sm:px-10">
          <div>
            <h2 id="proyectos-title" className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(4rem,11vw,9.5rem)] font-black italic leading-[0.85] tracking-[-0.06em]">
              {PR.era[lang]}
            </h2>
            <p className="mt-1 font-hand text-[1.8rem] leading-none text-pink">{PR.title[lang]}</p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkle className="h-10 w-10" />
            <Tag rotate={4}>{PR.featuredTitle[lang]}</Tag>
          </div>
        </header>

        {featured.map((f, i) => (
          <Caso key={f.id} f={f} lang={lang} photo={photos[f.id]} i={i} />
        ))}

        <div className="slide relative overflow-hidden px-5 py-10 sm:px-10">
          <div className="mb-10 flex items-center gap-4">
            <h3 className="text-[clamp(2.6rem,5vw,4.5rem)] font-black italic leading-none tracking-[-0.05em]">{PR.othersTitle[lang]}</h3>
            <Doodle kind="loop" className="w-20" />
          </div>
          <ul className="columns-1 gap-7 sm:columns-2 lg:columns-3 xl:columns-4">
            {projects.map((p, i) => (
              <Card key={p.id} p={p} lang={lang} photo={photos[p.id]} i={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

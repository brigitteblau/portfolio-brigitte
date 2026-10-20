"use client";

import { useCallback, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { filledL, type Locale } from "@/lib/i18n";
import { proyectos as PR, extra as X, NAME_STEPS } from "@/content/site";
import { featured, projects, statusLabel, type Featured, type Project, type Status } from "@/content/projects";
import { Pin, Sparkle } from "../Stickers";
import { NameStep } from "../NameTag";
import Modal from "../Modal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATUS_COLOR: Record<Status, string> = {
  dev: "var(--blue)",
  mvp: "var(--green)",
  prototype: "var(--orange)",
  idea: "var(--pink)",
  proposal: "var(--yellow)",
  exploring: "#8a6be0",
  dream: "#c0399a",
  live: "var(--green)",
};

const DARK = ["#0D1124", "#2B44FF", "#0E4D33", "#FF3D2E", "#5B6178"];

type Item = { kind: "featured"; p: Featured } | { kind: "project"; p: Project };

function Chip({ status, lang }: { status?: Status; lang: Locale }) {
  if (!status) return null;
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-[0.68rem] font-bold leading-tight"
      style={{ background: STATUS_COLOR[status], color: status === "proposal" ? "var(--ink)" : "var(--cream)" }}
    >
      {statusLabel[status][lang]}
    </span>
  );
}

/** La tarjetita: chiquita, una al lado de la otra */
function Mini({ item, lang, photo, i, onOpen }: { item: Item; lang: Locale; photo?: string; i: number; onOpen: () => void }) {
  const { p } = item;
  const dark = DARK.includes(p.color);
  return (
    <li data-card>
      <button onClick={onOpen} className="group block w-full text-left" aria-haspopup="dialog">
        <span
          className="relative block bg-white p-2 pb-3 shadow-[0_12px_24px_-14px_rgba(31,33,40,.6)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0"
          style={{ rotate: `${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg` }}
        >
          <Pin className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2" color={["var(--red)", "var(--blue)", "var(--green)", "var(--yellow)"][i % 4]} />
          <span className="relative block aspect-square overflow-hidden" style={{ background: p.color }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden className={`absolute inset-0 flex items-end p-2.5 text-[clamp(1.15rem,4.6vw,1.6rem)] font-black italic leading-[0.9] tracking-[-0.04em] ${dark ? "text-cream" : "text-ink"}`}>
                {p.name}
              </span>
            )}
          </span>
          <span className="mt-2 flex items-start justify-between gap-1 px-0.5">
            <span className="text-[0.95rem] font-bold leading-tight">{p.name}</span>
          </span>
          <span className="mt-1 block px-0.5">
            <Chip status={p.status} lang={lang} />
          </span>
        </span>
      </button>
    </li>
  );
}

/** La tarjeta grande: una empresa con todo lo que hago adentro (Grupo Mirrow) */
function Big({ item, lang, photo, onOpen }: { item: Item & { kind: "featured" }; lang: Locale; photo?: string; onOpen: () => void }) {
  const p = item.p;
  return (
    <li data-card className="col-span-2 md:row-span-2">
      <button onClick={onOpen} className="group block h-full w-full text-left" aria-haspopup="dialog">
        <span className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-ink p-4 text-cream shadow-[0_18px_34px_-18px_rgba(31,33,40,.7)] transition-transform duration-300 group-hover:-translate-y-1 sm:p-6">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-40" />
          )}
          <span className="relative flex items-center gap-2">
            <Chip status={p.status} lang={lang} />
            {p.role && <span className="rounded-full bg-pink px-2 py-0.5 text-[0.68rem] font-bold">{p.role[lang]}</span>}
          </span>
          <span className="relative mt-3 block text-[clamp(2.2rem,5vw,4rem)] font-black italic leading-[0.88] tracking-[-0.05em]">{p.name}</span>
          <span className="relative mt-2 block max-w-[46ch] text-[0.95rem] leading-snug text-cream/85">{p.what[lang]}</span>
          <span className="relative mt-auto flex flex-wrap gap-1.5 pt-5">
            {p.parts?.map((x) => (
              <span key={x.name} className="rounded-full bg-cream/15 px-2.5 py-1 text-[0.78rem] font-semibold backdrop-blur-[1px]">
                {x.name}
              </span>
            ))}
          </span>
          <span className="relative mt-4 font-hand text-[1.3rem] leading-none text-yellow">{lang === "es" ? "todo lo que hago ahí →" : "everything I do there →"}</span>
        </span>
      </button>
    </li>
  );
}

/** La ficha completa, en el pop-up */
function Ficha({ item, lang, photo }: { item: Item; lang: Locale; photo?: string }) {
  const L = PR.labels;
  const p = item.p;
  const blocks =
    item.kind === "featured"
      ? [
          { label: L.did, text: filledL(item.p.did, lang) },
          { label: L.challenge, text: filledL(item.p.challenge, lang) },
          { label: L.now, text: filledL(item.p.now, lang) },
        ].filter((b) => b.text)
      : [];
  const stack = item.kind === "featured" ? item.p.stack : item.p.tags;
  const repo = item.kind === "featured" ? item.p.repo : undefined;
  const context = item.kind === "featured" ? filledL(item.p.context, lang) : undefined;

  return (
    <article className="pr-8">
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="mb-5 aspect-[16/9] w-full rounded-[14px] object-cover" />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[clamp(2.2rem,6vw,3.4rem)] font-black leading-[0.9] tracking-[-0.045em]">{p.name}</h3>
        <Chip status={p.status} lang={lang} />
      </div>
      {context && <p className="mt-1 text-[0.9rem] text-ink/60">{context}</p>}
      {item.kind === "featured" && item.p.role && <p className="mt-2 inline-block rounded-full bg-pink px-3 py-1 text-[0.85rem] font-bold text-cream">{item.p.role[lang]}</p>}
      <p className="mt-3 text-[1.1rem] font-medium leading-snug">{p.what[lang]}</p>
      {item.kind === "featured" && item.p.parts && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {item.p.parts.map((x) => (
            <li key={x.name} className="rounded-[14px] border-2 border-ink/80 bg-white p-3">
              <p className="font-bold leading-tight">{x.name}</p>
              <p className="mt-1 text-[0.9rem] leading-snug text-ink/80">{x.what[lang]}</p>
              {(x.href || x.repo) && (
                <p className="mt-2 flex flex-wrap gap-2 text-[0.82rem] font-semibold">
                  {x.href && (
                    <a href={x.href} target="_blank" rel="noreferrer" className="text-pink underline underline-offset-2">
                      {L.visit[lang]} ↗
                    </a>
                  )}
                  {x.repo && (
                    <a href={x.repo} target="_blank" rel="noreferrer" className="text-blue underline underline-offset-2">
                      {L.code[lang]} ↗
                    </a>
                  )}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      {blocks.length > 0 && (
        <div className="mt-5 space-y-4">
          {blocks.map((b) => (
            <section key={b.label.es} className="border-t-2 border-ink/80 pt-2">
              <h4 className="text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink/60">{b.label[lang]}:</h4>
              <p className="mt-1 text-[0.98rem] leading-relaxed">{b.text}</p>
            </section>
          ))}
        </div>
      )}
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
        {stack.map((t) => (
          <li key={t} className="rounded-full bg-sky px-2.5 py-1 font-mono text-[0.75rem]">
            {t}
          </li>
        ))}
      </ul>
      {(repo || p.href) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {repo && (
            <a href={repo} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-4 py-2 text-[0.92rem] font-semibold text-cream hover:bg-blue">
              {L.code[lang]} ↗
            </a>
          )}
          {p.href && (
            <a href={p.href} target="_blank" rel="noreferrer" className="rounded-full bg-pink px-4 py-2 text-[0.92rem] font-semibold text-cream hover:bg-blue">
              {L.visit[lang]} ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function Proyectos({ lang, photos }: { lang: Locale; photos: Record<string, string | undefined> }) {
  const root = useRef<HTMLElement>(null);
  const items: Item[] = [...featured.map((p) => ({ kind: "featured" as const, p })), ...projects.map((p) => ({ kind: "project" as const, p }))];
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-card]", {
        y: 40,
        opacity: 0,
        scale: 0.9,
        stagger: 0.05,
        duration: 0.5,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root },
  );

  const current = open !== null ? items[open] : null;

  return (
    <section ref={root} id="proyectos" className="relative px-3 py-6 sm:px-6" aria-labelledby="proyectos-title">
      <NameStep n={NAME_STEPS.proyectos} />
      <div className="slide relative mx-auto max-w-[1500px] overflow-hidden px-4 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="proyectos-title" className="hello-grad pb-[0.06em] pr-[0.08em] text-[clamp(3.2rem,9vw,7.5rem)] font-black italic leading-[0.85] tracking-[-0.06em]">
              {PR.era[lang]}
            </h2>
            <p className="font-hand text-[1.5rem] leading-none text-pink">{PR.title[lang]}</p>
          </div>
          <p className="flex items-center gap-1 font-hand text-[1.4rem] leading-none text-ink/70">
            <Sparkle className="h-6 w-6" /> {X.projectsHint[lang]}
          </p>
        </div>

        {/* La empresa grande + los proyectos chiquitos al lado */}
        <ul className="mt-6 grid grid-cols-2 gap-4 pt-3 sm:gap-6 md:grid-cols-4">
          {items.map((it, i) =>
            it.kind === "featured" && it.p.parts ? (
              <Big key={it.p.id} item={it} lang={lang} photo={photos[it.p.id]} onOpen={() => setOpen(i)} />
            ) : (
              <Mini key={it.p.id} item={it} lang={lang} photo={photos[it.p.id]} i={i} onOpen={() => setOpen(i)} />
            ),
          )}
        </ul>
      </div>

      <Modal open={current !== null} onClose={close} label={current?.p.name ?? ""} closeLabel={X.close[lang]}>
        {current && <Ficha item={current} lang={lang} photo={photos[current.p.id]} />}
      </Modal>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { filledL, type Locale } from "@/lib/i18n";
import { proyectos as PR, NAME_STEPS } from "@/content/site";
import { featured, projects, statusLabel, type Featured, type Project, type Status } from "@/content/projects";
import EraTab from "../EraTab";
import Soundtrack from "../Soundtrack";
import Panel, { usePanel } from "../Panel";

const DARK = ["#0D1124", "#2B44FF", "#0E4D33", "#FF3D2E", "#5B6178"];

function StatusChip({ status, lang, dark }: { status?: Status; lang: Locale; dark?: boolean }) {
  if (!status) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.72rem] ${dark ? "border-white/40 text-white" : "border-navy/25 text-navy"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {statusLabel[status][lang]}
    </span>
  );
}

/** Un proyecto destacado contado como mini caso, en su propia diapositiva. */
function Caso({ f, lang, photo, i, first }: { f: Featured; lang: Locale; photo?: string; i: number; first: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  usePanel(({ enter }) => {
    root.current?.querySelectorAll<HTMLElement>("[data-block]").forEach((el, k) => {
      const p = Math.min(1, Math.max(0, enter * 2 - 0.6 - k * 0.12));
      el.style.opacity = String(0.15 + p * 0.85);
      el.style.transform = `translateY(${(1 - p) * 18}px)`;
    });
  });
  const L = PR.labels;
  const blocks = [
    { label: L.did, text: filledL(f.did, lang) },
    { label: L.challenge, text: filledL(f.challenge, lang) },
    { label: L.now, text: filledL(f.now, lang) },
  ].filter((b) => b.text);

  return (
    <div ref={root} className="relative grid h-full grid-cols-1 gap-8 overflow-y-auto px-5 pb-24 pt-16 sm:px-10 md:grid-cols-[0.95fr_1.2fr] md:gap-14 md:overflow-hidden md:pt-20" data-lenis-prevent>
      <div className="flex flex-col">
        {first ? (
          <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
            <EraTab n={4} label={PR.era[lang]} color="var(--red)" ink="#fff" font="font-sans font-extrabold" />
            <p className="pb-2 font-serif text-[1.4rem] italic">{PR.featuredTitle[lang]}</p>
          </div>
        ) : (
          <p className="font-mono text-[0.78rem] text-navy/60">{PR.featuredTitle[lang]}</p>
        )}
        <p className="mt-8 font-mono text-[0.8rem] text-navy/60" aria-hidden>
          {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
        </p>
        <h3 className="mt-2 font-sans text-[clamp(2.8rem,6vw,5.6rem)] font-extrabold leading-[0.88] tracking-[-0.04em] [font-variation-settings:'wdth'_80]">{f.name}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusChip status={f.status} lang={lang} />
          {filledL(f.context, lang) && <span className="font-mono text-[0.75rem] text-navy/60">{f.context![lang]}</span>}
        </div>
        <p className="mt-6 max-w-[40ch] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-snug">{f.what[lang]}</p>
        <div className="relative mt-8 hidden max-h-[36vh] min-h-[120px] flex-1 overflow-hidden rounded-md md:block" style={{ background: f.color }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span aria-hidden className="absolute bottom-2 right-5 font-serif text-[clamp(6rem,14vw,12rem)] italic leading-none text-white/90">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-7">
        {blocks.map((b) => (
          <section key={b.label.es} data-block className="border-t border-navy/15 pt-3">
            <h4 className="font-mono text-[0.78rem] text-navy/60">{b.label[lang]}</h4>
            <p className="mt-2 max-w-[60ch] text-[1.02rem] leading-relaxed">{b.text}</p>
          </section>
        ))}
        <div data-block className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-navy/15 pt-4">
          <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
            {f.stack.map((t) => (
              <li key={t} className="rounded-full bg-navy/[.06] px-2.5 py-1 font-mono text-[0.75rem]">
                {t}
              </li>
            ))}
          </ul>
          {f.repo && (
            <a href={f.repo} target="_blank" rel="noreferrer" className="font-semibold underline decoration-1 underline-offset-4 hover:text-cobalt">
              {L.code[lang]}
            </a>
          )}
          {f.href && (
            <a href={f.href} target="_blank" rel="noreferrer" className="font-semibold underline decoration-1 underline-offset-4 hover:text-cobalt">
              {L.visit[lang]}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

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
        <div className="absolute left-3 top-3">
          <StatusChip status={p.status} lang={lang} dark={dark} />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end bg-navy/90 p-4 text-white opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:bg-navy/75 [@media(hover:none)]:opacity-100">
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
      <div className="flex w-[min(78vw,24rem)] shrink-0 flex-col justify-center gap-4 pr-6">
        <h2 className="font-serif text-[clamp(2.6rem,5vw,4.4rem)] italic leading-[0.95]">{PR.othersTitle[lang]}</h2>
        <p className="font-serif text-[1.5rem] italic text-navy/60">{PR.title[lang]}</p>
        <Soundtrack data={PR.soundtrack} lang={lang} />
      </div>
      {cols.map((col, c) => (
        <div key={c} data-col className="flex h-[72vh] w-[min(64vw,17rem)] shrink-0 flex-col gap-5">
          {col.map((p) => (
            <Card key={p.id} p={p} lang={lang} photo={photos[p.id]} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Proyectos({ lang, photos }: { lang: Locale; photos: Record<string, string | undefined> }) {
  return (
    <>
      {featured.map((f, i) => (
        <Panel key={f.id} id={i === 0 ? "proyectos" : undefined} era="proyectos" nameStep={i === 0 ? NAME_STEPS.proyectos : undefined} className="bg-white text-navy" label={f.name}>
          <Caso f={f} lang={lang} photo={photos[f.id]} i={i} first={i === 0} />
        </Panel>
      ))}
      <Panel id="otros" era="proyectos" wide="auto" className="bg-white text-navy" label={PR.othersTitle[lang]}>
        <Board lang={lang} photos={photos} />
      </Panel>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import type { Folder } from "@/lib/photos";
import { carpetas as C } from "@/content/site";
import Video from "../Video";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TINT = ["#5aa7ef", "#f08ac6", "#f6c744", "#7ccf8f", "#a78bfa"];

/** Carpeta estilo Mac */
export function FolderIcon({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden>
      <path d="M6 18 Q6 10 14 10 H44 L54 20 H106 Q114 20 114 28 V82 Q114 90 106 90 H14 Q6 90 6 82Z" fill={color} />
      <path d="M6 32 Q6 26 12 26 H108 Q114 26 114 32 V82 Q114 90 106 90 H14 Q6 90 6 82Z" fill={color} style={{ filter: "brightness(1.12)" }} />
      <path d="M6 32 Q6 26 12 26 H108 Q114 26 114 32 V36 H6Z" fill="#fff" opacity=".25" />
    </svg>
  );
}

export function Finder({ folder, color, lang, onClose }: { folder: Folder; color: string; lang: Locale; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.__lenis?.stop();
    closeBtn.current?.focus();
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    if (box.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.from(box.current, { scale: 0.85, opacity: 0, y: 30, duration: 0.35, ease: "back.out(1.6)" });
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-3 sm:p-8" onClick={onClose}>
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-label={folder.name}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88svh] w-full max-w-5xl flex-col overflow-hidden rounded-[16px] bg-cream shadow-[0_40px_80px_-30px_rgba(0,0,0,.6)]"
      >
        <div className="flex items-center gap-3 border-b border-ink/10 bg-[#ece7d8] px-3 py-2.5">
          <span className="flex gap-1.5">
            <button ref={closeBtn} onClick={onClose} className="h-3.5 w-3.5 rounded-full bg-red" aria-label={C.close[lang]} />
            <span className="h-3.5 w-3.5 rounded-full bg-yellow" aria-hidden />
            <span className="h-3.5 w-3.5 rounded-full bg-green" aria-hidden />
          </span>
          <FolderIcon color={color} className="h-5 w-6" />
          <span className="font-semibold">{folder.name}</span>
          <span className="ml-auto text-[0.8rem] text-ink/60">
            {folder.items.length} {C.items[lang]}
          </span>
        </div>
        <div className="overflow-y-auto p-3 sm:p-5" data-lenis-prevent>
          <ul className="columns-2 gap-3 sm:columns-3">
            {folder.items.map((m, i) => (
              <li key={m.src} className="mb-3 inline-block w-full overflow-hidden rounded-[10px] bg-ink/5 align-top">
                {m.kind === "video" ? (
                  <Video src={m.src} poster={m.poster} lang={lang} className="relative aspect-[9/16] w-full" label={`${folder.name} ${i + 1}`} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.src} alt={`${folder.name} ${i + 1}`} loading="lazy" className="w-full" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Carpetas({ lang, folders, journal }: { lang: Locale; folders: Folder[]; journal?: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-folder]", {
        y: 60,
        scale: 0.6,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );


  return (
    <section ref={root} id="carpetas" className="relative px-3 py-6 sm:px-6" aria-labelledby="carpetas-title">
      <div className="slide relative mx-auto max-w-[1500px] overflow-hidden px-6 py-14 sm:px-16 sm:py-20">
        <div className="flex flex-wrap items-baseline gap-x-5">
          <h2 id="carpetas-title" className="font-serif text-[clamp(3.6rem,9vw,7.5rem)] font-bold italic leading-[0.85] tracking-[-0.03em] text-pink">
            {C.title[lang]}
          </h2>
          <p className="font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic leading-none">{C.sub[lang]}</p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Lo que escribo */}
          {journal && <div className="min-w-0">{journal}</div>}

          {/* Mis carpetas */}
          <div className="min-w-0">
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-ink/50">{lang === "es" ? "carpetas" : "folders"}</p>
            <ul className="mt-5 grid grid-cols-3 items-start gap-4">
              {folders.map((f, i) => (
                <li key={f.name} data-folder>
                  <button onClick={() => setOpen(i)} className="group flex w-full flex-col items-center gap-2 rounded-[14px] p-2 focus-visible:bg-pink/10">
                    <span className="relative isolate">
                      <FolderIcon color={TINT[i % TINT.length]} className="h-auto w-[clamp(5rem,10vw,8.5rem)] transition-transform duration-300 group-hover:-translate-y-1.5" />
                      {f.items[0]?.kind === "img" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.items[0].src}
                          alt=""
                          className="absolute left-1/2 top-[-4%] -z-10 h-[56%] w-[58%] -translate-x-1/2 rotate-[-5deg] rounded-[4px] border-2 border-white object-cover shadow transition-transform duration-300 group-hover:-translate-y-4"
                        />
                      )}
                    </span>
                    <span className="text-[0.95rem] font-semibold group-hover:text-pink">{f.name}</span>
                    <span className="text-[0.75rem] text-ink/45">
                      {f.items.length} {C.items[lang]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {open !== null && folders[open] && <Finder folder={folders[open]} color={TINT[open % TINT.length]} lang={lang} onClose={close} />}
    </section>
  );
}

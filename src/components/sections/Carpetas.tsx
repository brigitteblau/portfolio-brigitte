"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/lib/i18n";
import type { Folder } from "@/lib/photos";
import { carpetas as C } from "@/content/site";
import { Blob, Doodle, Sparkle } from "../Stickers";
import Video from "../Video";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TINT = ["#5aa7ef", "#f08ac6", "#f6c744", "#7ccf8f", "#a78bfa"];

/** Carpeta estilo Mac */
function FolderIcon({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden>
      <path d="M6 18 Q6 10 14 10 H44 L54 20 H106 Q114 20 114 28 V82 Q114 90 106 90 H14 Q6 90 6 82Z" fill={color} />
      <path d="M6 32 Q6 26 12 26 H108 Q114 26 114 32 V82 Q114 90 106 90 H14 Q6 90 6 82Z" fill={color} style={{ filter: "brightness(1.12)" }} />
      <path d="M6 32 Q6 26 12 26 H108 Q114 26 114 32 V36 H6Z" fill="#fff" opacity=".25" />
    </svg>
  );
}

function Finder({ folder, color, lang, onClose }: { folder: Folder; color: string; lang: Locale; onClose: () => void }) {
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

export default function Carpetas({ lang, folders }: { lang: Locale; folders: Folder[] }) {
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

  if (folders.length === 0) return null;

  return (
    <section ref={root} id="carpetas" className="relative px-3 py-6 sm:px-6" aria-labelledby="carpetas-title">
      <div className="slide relative mx-auto max-w-[1500px] overflow-hidden px-5 py-12 sm:px-12">
        <div className="relative flex flex-wrap items-end gap-x-6">
          <h2 id="carpetas-title" className="font-serif text-[clamp(4.5rem,13vw,11rem)] font-bold italic leading-[0.85] tracking-[-0.03em] text-blue">
            {C.title[lang]}
          </h2>
          <p className="pb-3 font-serif text-[clamp(2rem,4.5vw,4rem)] italic leading-none">{C.sub[lang]}</p>
          <Sparkle className="absolute -top-2 left-[min(40vw,30rem)] h-10 w-10" />
        </div>
        <p className="mt-3 font-hand text-[1.6rem] text-ink/60">{C.hint[lang]} ↓</p>

        <ul className="relative mt-8 grid grid-cols-3 items-start gap-2 pb-4 sm:flex sm:flex-wrap sm:gap-x-20 sm:gap-y-8 sm:pb-10 md:pl-[6%]">
          {folders.map((f, i) => (
            <li key={f.name} data-folder className="sm:[margin-top:var(--mt)]" style={{ ["--mt" as string]: `${[0, 40, 10, 50, 20][i % 5]}px` }}>
              <button onClick={() => setOpen(i)} className="group flex flex-col items-center gap-2 rounded-[14px] p-2 focus-visible:bg-blue/10">
                <span className="relative isolate">
                  <FolderIcon color={TINT[i % TINT.length]} className="h-auto w-[clamp(5.5rem,16vw,13rem)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:-rotate-3" />
                  {f.items[0]?.kind === "img" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.items[0].src}
                      alt=""
                      className="absolute left-1/2 top-[-4%] -z-10 h-[56%] w-[58%] -translate-x-1/2 rotate-[-5deg] rounded-[4px] border-2 border-white object-cover shadow transition-transform duration-300 group-hover:-translate-y-6"
                    />
                  )}
                </span>
                <span className="rounded-[6px] bg-blue px-2.5 py-0.5 text-[1rem] font-semibold text-cream group-hover:bg-pink">{f.name}</span>
                <span className="text-[0.78rem] text-ink/50">
                  {f.items.length} {C.items[lang]}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <Blob color="var(--yellow)" face="smile" className="absolute bottom-8 right-[6%] hidden w-28 floaty md:block" />
        <Blob color="var(--pink)" face="wink" className="absolute bottom-24 right-[20%] hidden w-20 md:block" />
        <Doodle kind="zigzag" className="absolute right-[10%] top-14 hidden w-16 md:block" />
      </div>

      {open !== null && folders[open] && <Finder folder={folders[open]} color={TINT[open % TINT.length]} lang={lang} onClose={close} />}
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Locale } from "@/lib/i18n";
import { NAME, ui } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

/* ── store mínimo: cuántas letras del nombre ya se ven ── */
let step = 0;
const subs = new Set<() => void>();
export function setNameStep(n: number) {
  if (n === step) return;
  step = n;
  subs.forEach((f) => f());
}
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

/** Engancha una sección: al entrar, revela `to` letras; al volver arriba, vuelve a `from`. */
export function useNameStep(ref: React.RefObject<HTMLElement | null>, from: number, to: number) {
  useEffect(() => {
    if (!ref.current) return;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "bottom 70%",
      onEnter: () => setNameStep(to),
      onLeaveBack: () => setNameStep(from),
    });
    return () => st.kill();
  }, [ref, from, to]);
}

export default function NameTag({ lang }: { lang: Locale }) {
  const n = useSyncExternalStore(subscribe, () => step, () => 0);
  const letters = NAME.split("");
  const [justRevealed, setJust] = useState<number | null>(null);
  const prev = useRef(0);

  useEffect(() => {
    if (n > prev.current) {
      setJust(n - 1);
      const id = setTimeout(() => setJust(null), 900);
      prev.current = n;
      return () => clearTimeout(id);
    }
    prev.current = n;
  }, [n]);

  return (
    <div
      className="pointer-events-none fixed right-3 top-12 z-40 flex select-none items-center gap-2.5 rounded-full bg-paper/80 py-1.5 pl-3.5 pr-2 backdrop-blur-md sm:right-6 sm:top-14"
      aria-live="polite"
      aria-label={`${ui.nameTag[lang]} ${letters.slice(0, n).join("")}`}
    >
      <span className="font-mono text-[0.7rem] opacity-60">{ui.nameTag[lang]}</span>
      <span className="flex items-center gap-[2px] font-serif text-[1.25rem] italic leading-none sm:text-[1.45rem]">
        {letters.map((ch, i) =>
          i < n ? (
            <span
              key={i}
              className="inline-block transition-[color,transform] duration-500"
              style={{ color: i === justRevealed ? "var(--cobalt)" : undefined, transform: i === justRevealed ? "translateY(-2px)" : "none" }}
            >
              {ch}
            </span>
          ) : (
            <span key={i} className="inline-block h-[0.85em] w-[0.5em] rounded-[2px] bg-navy" />
          ),
        )}
      </span>
    </div>
  );
}

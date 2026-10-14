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
      className="pointer-events-none fixed right-3 top-11 z-40 w-[7.6rem] -rotate-3 select-none overflow-hidden rounded-xl bg-red text-center shadow-[2px_4px_0_rgba(22,32,74,.25)] ring-4 ring-white sm:right-6 sm:top-14 sm:w-[11rem]"
      aria-live="polite"
      aria-label={`${ui.nameTag[lang]} ${letters.slice(0, n).join("")}`}
    >
      <p className="px-2 pt-1.5 pb-1 text-[0.8rem] font-semibold leading-none text-white sm:text-[0.9rem]">
        {ui.nameTag[lang]}
      </p>
      <p className="flex h-8 items-center justify-center gap-[2px] bg-white px-2 font-hand text-[1.45rem] leading-none text-navy sm:h-11 sm:text-[2.1rem]">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="inline-block w-[0.62em] text-center transition-all duration-500"
            style={{
              opacity: i < n ? 1 : 0.25,
              transform: i === justRevealed ? "translateY(-4px) scale(1.25)" : "none",
              color: i === justRevealed ? "var(--red)" : undefined,
            }}
          >
            {i < n ? ch : "_"}
          </span>
        ))}
      </p>
      <div className="h-2 bg-red" />
    </div>
  );
}

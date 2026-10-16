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
      className="pointer-events-none fixed right-3 top-[3.6rem] z-40 flex select-none items-center gap-2 rounded-[10px] bg-cream py-1.5 pl-3 pr-2.5 shadow-[0_10px_24px_-14px_rgba(31,33,40,.6)] sm:right-6 sm:top-16"
      aria-live="polite"
      aria-label={`${ui.nameTag[lang]} ${letters.slice(0, n).join("")}`}
    >
      <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.08em] text-ink/70">{ui.nameTag[lang]}</span>
      <span className="flex items-center gap-[2px] text-[1.15rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.3rem]">
        {letters.map((ch, i) =>
          i < n ? (
            <span
              key={i}
              className="inline-block transition-[color,transform] duration-500"
              style={{ color: i === justRevealed ? "var(--pink)" : undefined, transform: i === justRevealed ? "translateY(-3px) scale(1.15)" : "none" }}
            >
              {ch}
            </span>
          ) : (
            <span key={i} className="inline-block h-[0.85em] w-[0.5em] rounded-[2px] bg-ink" />
          ),
        )}
      </span>
    </div>
  );
}

/** Pone el nombre en `n` letras cuando esta parte de la página está en pantalla. */
export function NameStep({ n }: { n: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setNameStep(n)),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n]);
  return <span ref={ref} hidden />;
}

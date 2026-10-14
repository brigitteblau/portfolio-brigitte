"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { track } from "@/lib/track";
import { hud } from "@/content/site";
import NameTag, { setNameStep } from "./NameTag";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stop = { x: number; era: string; name: number };

const scrollFactor = () => (typeof window !== "undefined" && window.innerWidth < 768 ? 1.8 : 1);

/**
 * El carrete: scrolleás para abajo y todo se mueve para el costado,
 * como una presentación. También anda con flechas, espacio y los botones.
 */
export default function Track({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const pin = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const stops = useRef<Stop[]>([]);
  const [flat, setFlat] = useState(false);
  const [idx, setIdx] = useState(0);
  const [era, setEra] = useState("hola");
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(1);
  const [eraMarks, setEraMarks] = useState<{ era: string; at: number }[]>([]);

  const measure = () => {
    const r = reel.current;
    if (!r) return;
    const V = window.innerWidth;
    const out: Stop[] = [];
    let lastEra = "hola";
    let lastName = 0;
    r.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => {
      const L = p.offsetLeft;
      const W = p.offsetWidth;
      lastEra = p.dataset.era || lastEra;
      if (p.dataset.name) lastName = Number(p.dataset.name);
      out.push({ x: L, era: lastEra, name: lastName });
      // paneles largos: una parada extra al final
      if (W > V * 1.05) out.push({ x: L + W - V, era: lastEra, name: lastName });
    });
    stops.current = out;
    setTotal(out.length || 1);
    const total = Math.max(1, r.scrollWidth - V);
    const marks: { era: string; at: number }[] = [];
    out.forEach((s) => {
      if (!marks.length || marks[marks.length - 1].era !== s.era) marks.push({ era: s.era, at: s.x / total });
    });
    setEraMarks(marks);
  };

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setFlat(true);
        track.setFlat(true);
        setNameStep(8);
        return;
      }
      const r = reel.current!;
      const dist = () => r.scrollWidth - window.innerWidth;
      // en celular hace falta más recorrido de dedo por pantalla
      const k = () => scrollFactor();

      const tween = gsap.to(r, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: () => `+=${dist() * k()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: measure,
        },
        onUpdate: () => {
          const x = -(gsap.getProperty(r, "x") as number);
          const V = window.innerWidth;
          track.set(x, V);
          const list = stops.current;
          let i = 0;
          for (let k = 0; k < list.length; k++) if (list[k].x <= x + V * 0.5) i = k;
          setIdx(i);
          if (list[i]) {
            setEra(list[i].era);
            setNameStep(list[i].name);
          }
          setProgress(x / Math.max(1, dist()));
        },
      });
      st.current = tween.scrollTrigger ?? null;
      measure();
      track.set(0, window.innerWidth);

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(r);
      return () => ro.disconnect();
    },
    { scope: pin },
  );

  const goTo = (x: number) => {
    const s = st.current;
    if (!s) return;
    const y = s.start + x * scrollFactor();
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const step = (dir: 1 | -1) => {
    const list = stops.current;
    const x = track.x;
    if (dir === 1) {
      const next = list.find((s) => s.x > x + 4);
      if (next) goTo(next.x);
    } else {
      const prev = [...list].reverse().find((s) => s.x < x - 4);
      goTo(prev ? prev.x : 0);
    }
  };

  // Teclado + "ir a" desde otros componentes (ej. el botón "Sí")
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (flat) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") {
        if (e.key === " ") return;
      }
      if (["ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        step(-1);
      }
    };
    const onGoto = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const node = document.getElementById(id);
      if (!node) return;
      if (flat) node.scrollIntoView({ behavior: "smooth" });
      else goTo(node.offsetLeft);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("goto", onGoto);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("goto", onGoto);
    };
  });

  const eraLabel = hud.eras[era as keyof typeof hud.eras]?.[lang] ?? "";

  return (
    <>
      <NameTag lang={lang} />
      <div ref={pin} className={clsx("relative", flat ? "" : "h-[100svh] overflow-hidden")}>
        <div ref={reel} className={clsx("reel relative", flat ? "flex flex-col" : "flex h-full w-max will-change-transform")} data-flat={flat || undefined}>
          {children}
        </div>
      </div>

      {/* HUD de presentación */}
      {!flat && (
        <nav
          aria-label={lang === "es" ? "Diapositivas" : "Slides"}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between gap-3 px-3 pb-3 sm:px-5 sm:pb-4"
        >
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-paper/85 p-1 shadow-[2px_3px_0_rgba(22,32,74,.18)] backdrop-blur">
            <button onClick={() => step(-1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-navy/10" aria-label={hud.prev[lang]}>
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="min-w-[4.5rem] px-1 text-center text-[0.85rem] font-semibold tabular-nums">
              {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button onClick={() => step(1)} className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white hover:bg-cobalt" aria-label={hud.next[lang]}>
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden><path d="m7.5 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          <div className="pointer-events-auto hidden max-w-xl flex-1 flex-col gap-1.5 rounded-2xl bg-paper/85 px-4 py-2 shadow-[2px_3px_0_rgba(22,32,74,.18)] backdrop-blur md:flex">
            <div className="relative h-1.5 rounded-full bg-navy/15">
              <div className="absolute inset-y-0 left-0 rounded-full bg-navy" style={{ width: `${progress * 100}%` }} />
            </div>
            <ol className="flex justify-between text-[0.75rem]">
              {eraMarks.map((m) => (
                <li key={m.era}>
                  <button
                    onClick={() => goTo(stops.current.find((s) => s.era === m.era)?.x ?? 0)}
                    className={clsx("whitespace-nowrap rounded px-1 hover:bg-navy/10", m.era === era ? "font-semibold" : "opacity-60")}
                    aria-current={m.era === era ? "step" : undefined}
                  >
                    {hud.eras[m.era as keyof typeof hud.eras]?.[lang]}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <p className="pointer-events-auto rounded-full bg-paper/85 px-4 py-2 text-[0.85rem] font-semibold shadow-[2px_3px_0_rgba(22,32,74,.18)] backdrop-blur md:hidden" aria-live="polite">
            {eraLabel}
          </p>
        </nav>
      )}
    </>
  );
}
